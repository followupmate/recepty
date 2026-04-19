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
      <h2>Review parsed recipe</h2>
      <label className="field">
        <span>Title</span>
        <input
          value={draft.title}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
        />
      </label>

      <div className="editor-group">
        <h3>Ingredients</h3>
        {draft.ingredients.map((ingredient, index) => (
          <div key={`ing-${index}`} className="split-field">
            <input
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, 'name', e.target.value)}
              placeholder="Ingredient"
            />
            <input
              value={ingredient.amount || ''}
              onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
              placeholder="Amount"
            />
          </div>
        ))}
      </div>

      <div className="editor-group">
        <h3>Steps</h3>
        {draft.steps.map((step, index) => (
          <label key={`step-${index}`} className="field">
            <span>Step {index + 1}</span>
            <textarea
              rows={2}
              value={step.text}
              onChange={(e) => updateStep(index, e.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="actions-row">
        <button className="btn btn--ghost" onClick={onReset}>Start over</button>
        <button className="btn" onClick={onSave}>Save recipe</button>
      </div>
    </div>
  );
}
