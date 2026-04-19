'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RecipePreviewEditor from '../../components/RecipePreviewEditor';
import UploadEntryCard from '../../components/UploadEntryCard';
import { useRecipes } from '../../hooks/useRecipes';
import { parseRecipeFromImage } from '../../lib/parseRecipeFromImage';
import { consumePendingUploadFile } from '../../lib/pendingUploadStore';

export default function AddRecipePage() {
  const router = useRouter();
  const { addRecipe } = useRecipes();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [draft, setDraft] = useState(null);

  const parseFromFile = async (file) => {
    if (!file) return;
    setStatus('loading');
    setError('');

    try {
      const parsed = await parseRecipeFromImage(file);
      setDraft(parsed);
      setStatus('preview');
    } catch (e) {
      setStatus('error');
      setError(e.message || 'Could not parse this image.');
    }
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
    const recipe = addRecipe({
      ...draft,
      steps: draft.steps.map((step, index) => ({ order: index + 1, text: step.text })),
    });
    router.push(`/recipes/${recipe.id}`);
  };

  return (
    <main className="page">
      <header className="section__header">
        <h1>Add recipe</h1>
      </header>

      {status === 'idle' && (
        <UploadEntryCard
          title="Upload recipe photo"
          subtitle="Take a photo or upload from your gallery."
          onFileSelected={parseFromFile}
        />
      )}

      {status === 'loading' && (
        <div className="panel">
          <h2>Parsing recipe...</h2>
          <p>This is a simulated AI parsing step.</p>
        </div>
      )}

      {status === 'preview' && draft && (
        <RecipePreviewEditor draft={draft} onChange={setDraft} onSave={save} onReset={reset} />
      )}

      {status === 'error' && (
        <div className="panel panel--error">
          <h2>Couldn&apos;t parse that recipe</h2>
          <p>{error}</p>
          <button className="btn" onClick={reset}>Try another image</button>
        </div>
      )}
    </main>
  );
}
