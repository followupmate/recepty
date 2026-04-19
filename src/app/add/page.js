'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RecipePreviewEditor from '../../components/RecipePreviewEditor';
import UploadEntryCard from '../../components/UploadEntryCard';
import { useRecipes } from '../../hooks/useRecipes';
import { parseRecipeFromImage } from '../../lib/services/parseRecipeFromImage';
import { parseRecipeFromUrl } from '../../lib/services/parseRecipeFromUrl';
import { SK } from '../../lib/strings/sk';
import { consumePendingUploadFile } from '../../lib/pendingUploadStore';
import { createEmptyRecipeDraft, normalizeRecipe } from '../../lib/utils/recipeNormalizer';

const MODE = {
  PHOTO: 'photo',
  URL: 'url',
  MANUAL: 'manual',
};

export default function AddRecipePage() {
  const router = useRouter();
  const { addRecipe } = useRecipes();
  const [mode, setMode] = useState(MODE.PHOTO);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(null);
  const [urlInput, setUrlInput] = useState('');

  const runParser = async (parser, payload) => {
    setStatus('loading');
    setError('');

    try {
      const parsed = await parser(payload);
      setDraft(normalizeRecipe(parsed));
      setStatus('preview');
    } catch (e) {
      setStatus('error');
      setError(e.message || SK.add.parseErrorTitle);
    }
  };

  const parseFromFile = async (file) => {
    if (!file) return;
    setMode(MODE.PHOTO);
    runParser(parseRecipeFromImage, file);
  };

  const parseFromUrl = async () => {
    setMode(MODE.URL);
    runParser(parseRecipeFromUrl, urlInput.trim());
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('source') !== 'home') return;
    const pending = consumePendingUploadFile();
    if (pending) parseFromFile(pending);
  }, []);

  const reset = () => {
    setStatus('idle');
    setDraft(null);
    setError('');
  };

  const save = () => {
    const recipe = addRecipe(normalizeRecipe(draft));
    router.push(`/recipes/${recipe.id}`);
  };

  const startManual = () => {
    setMode(MODE.MANUAL);
    setDraft(createEmptyRecipeDraft());
    setStatus('preview');
    setError('');
  };

  return (
    <main className="page">
      <header className="section__header">
        <h1 className="page-title">{SK.add.title}</h1>
      </header>

      <div className="mode-switch">
        <button type="button" className={`chip ${mode === MODE.PHOTO ? 'chip--active' : ''}`} onClick={() => { setMode(MODE.PHOTO); reset(); }}>
          {SK.add.modes.photo}
        </button>
        <button type="button" className={`chip ${mode === MODE.URL ? 'chip--active' : ''}`} onClick={() => { setMode(MODE.URL); reset(); }}>
          {SK.add.modes.url}
        </button>
        <button type="button" className={`chip ${mode === MODE.MANUAL ? 'chip--active' : ''}`} onClick={startManual}>
          {SK.add.modes.manual}
        </button>
      </div>

      {status === 'idle' && mode === MODE.PHOTO && (
        <UploadEntryCard
          title={SK.add.uploadTitle}
          subtitle={SK.add.uploadHint}
          onFileSelected={parseFromFile}
        />
      )}

      {status === 'idle' && mode === MODE.URL && (
        <div className="panel">
          <label className="field">
            <span className="field__label">{SK.add.urlLabel}</span>
            <input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder={SK.add.urlPlaceholder} />
          </label>
          <button type="button" className="btn" onClick={parseFromUrl}>{SK.add.urlButton}</button>
        </div>
      )}

      {status === 'idle' && mode === MODE.MANUAL && (
        <div className="panel">
          <button type="button" className="btn" onClick={startManual}>{SK.add.manualButton}</button>
        </div>
      )}

      {status === 'loading' && (
        <div className="panel">
          <h2 className="panel__title">{mode === MODE.URL ? SK.add.parsingUrl : SK.add.parsingImage}</h2>
          <p className="text-muted">{SK.add.parsingHint}</p>
        </div>
      )}

      {status === 'preview' && draft && (
        <RecipePreviewEditor draft={draft} onChange={setDraft} onSave={save} onReset={reset} />
      )}

      {status === 'error' && (
        <div className="panel panel--error">
          <h2 className="panel__title">{SK.add.parseErrorTitle}</h2>
          <p>{error}</p>
          <button type="button" className="btn" onClick={reset}>{SK.common.retry}</button>
        </div>
      )}
    </main>
  );
}
