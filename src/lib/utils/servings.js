export function scaleIngredientAmount(amount, fromServings, toServings) {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return null;
  if (!fromServings || !toServings) return Number(amount);
  return (Number(amount) / Number(fromServings)) * Number(toServings);
}

export function formatAmount(amount) {
  if (amount === null || amount === undefined) return '';
  const rounded = Math.round(amount * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/\.00$/, '');
}

export function scaleIngredients(ingredients, fromServings, toServings) {
  return ingredients.map((ingredient) => ({
    ...ingredient,
    scaledAmount: scaleIngredientAmount(ingredient.amount, fromServings, toServings),
  }));
}
