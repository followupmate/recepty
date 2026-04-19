function parseAmountString(rawAmount = '') {
  if (typeof rawAmount === 'number') return { amount: rawAmount, unit: '' };

  const value = String(rawAmount).trim();
  if (!value) return { amount: null, unit: '' };

  const match = value.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!match) return { amount: null, unit: value };

  return {
    amount: Number(match[1].replace(',', '.')),
    unit: (match[2] || '').trim(),
  };
}

function normalizeIngredient(ingredient) {
  const parsed = parseAmountString(ingredient.amount);
  return {
    name: ingredient.name?.trim() || 'Ingrediencia',
    amount: typeof ingredient.amount === 'number' ? ingredient.amount : parsed.amount,
    unit: ingredient.unit?.trim?.() ?? parsed.unit,
    optional: Boolean(ingredient.optional),
  };
}

export function normalizeRecipe(recipeInput) {
  const ingredients = (recipeInput.ingredients || []).map(normalizeIngredient);
  const steps = (recipeInput.steps || [])
    .filter((step) => step?.text?.trim())
    .map((step, index) => ({ order: index + 1, text: step.text.trim() }));

  return {
    ...recipeInput,
    title: recipeInput.title?.trim() || 'Nový recept',
    defaultServings: Number(recipeInput.defaultServings) > 0 ? Number(recipeInput.defaultServings) : 1,
    ingredients,
    steps,
    tags: Array.isArray(recipeInput.tags) ? recipeInput.tags : [],
  };
}

export function createEmptyRecipeDraft() {
  return {
    title: '',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
    defaultServings: 2,
    ingredients: [{ name: '', amount: null, unit: '', optional: false }],
    steps: [{ order: 1, text: '' }],
    tags: [],
    time: '',
    difficulty: '',
  };
}
