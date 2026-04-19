import { SK } from '../lib/strings/sk';

export default function RecipePreviewEditor({ draft, onChange, onSave, onReset }) {
  const updateIngredient = (index, key, value) => {
    const next = [...draft.ingredients];
    next[index] = { ...next[index], [key]: value };
    onChange({ ...draft, ingredients: next });
  };

  const updateStep = (index, text) => {
    const next = draft.steps.map((step, i) =>
      i === index ? { ...step, text } : step,
    );
    onChange({ ...draft, steps: next });
  };

  return (
    <div className="panel">
      <h2 className="panel__title">{SK.preview.title}</h2>
      <label className="field">
        <span className="field__label">{SK.preview.recipeTitle}</span>
        <input
          value={draft.title}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
        />
      </label>

      <label className="field">
        <span className="field__label">{SK.preview.servings}</span>
        <input
          type="number"
          min={1}
          value={draft.defaultServings || 1}
          onChange={(e) => onChange({ ...draft, defaultServings: Number(e.target.value) || 1 })}
        />
      </label>

      <div className="editor-group">
        <h3>{SK.preview.ingredients}</h3>
        {draft.ingredients.map((ingredient, index) => (
          <div key={`ing-${index}`} className="split-field split-field--ingredients">
            <input
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, 'name', e.target.value)}
              placeholder={SK.preview.ingredientName}
            />
            <input
              value={ingredient.amount ?? ''}
              onChange={(e) => updateIngredient(index, 'amount', e.target.value === '' ? null : Number(e.target.value))}
              placeholder={SK.preview.amount}
              type="number"
              step="0.1"
            />
            <input
              value={ingredient.unit || ''}
              onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
              placeholder={SK.preview.unit}
            />
          </div>
        ))}
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => onChange({
            ...draft,
            ingredients: [...draft.ingredients, { name: '', amount: null, unit: '', optional: false }],
          })}
        >
          {SK.preview.addIngredient}
        </button>
      </div>

      <div className="editor-group">
        <h3>{SK.preview.steps}</h3>
        {draft.steps.map((step, index) => (
          <label key={`step-${index}`} className="field">
            <span className="field__label">{SK.preview.step} {index + 1}</span>
            <textarea
              rows={2}
              value={step.text}
              onChange={(e) => updateStep(index, e.target.value)}
            />
          </label>
        ))}
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => onChange({
            ...draft,
            steps: [...draft.steps, { order: draft.steps.length + 1, text: '' }],
          })}
        >
          {SK.preview.addStep}
        </button>
      </div>

      <div className="actions-row">
        <button type="button" className="btn btn--ghost" onClick={onReset}>{SK.common.reset}</button>
        <button type="button" className="btn" onClick={onSave}>{SK.common.save}</button>
      </div>
    </div>
  );
}
