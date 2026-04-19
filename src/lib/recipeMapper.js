import { recipes as legacyRecipes } from '../data/recipes';

const categoryTags = {
  ranajky: ['breakfast', 'quick'],
  predjedla: ['starter'],
  hlavne: ['main'],
  prilohy: ['side'],
  omacky: ['sauce'],
  dezerty: ['dessert'],
};

const categoryImages = {
  ranajky: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=1200&q=80',
  predjedla: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  hlavne: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
  prilohy: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
  omacky: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80',
  dezerty: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
};

function normalizeAmount(value, unit) {
  if (!value && !unit) return '';
  if (!value && unit) return unit;
  return `${value}${unit ? ` ${unit}` : ''}`.trim();
}

export function mapLegacyRecipe(legacyRecipe) {
  return {
    id: String(legacyRecipe.id),
    title: legacyRecipe.t,
    image: categoryImages[legacyRecipe.cat] || categoryImages.ranajky,
    ingredients: (legacyRecipe.ing || []).map(([name, amount, unit]) => ({
      name,
      amount: normalizeAmount(amount, unit),
    })),
    steps: (legacyRecipe.s || []).map((text, index) => ({
      order: index + 1,
      text,
    })),
    tags: categoryTags[legacyRecipe.cat] || [],
    time: legacyRecipe.s?.length ? `${legacyRecipe.s.length * 7} min` : undefined,
    difficulty: legacyRecipe.s?.length > 4 ? 'Medium' : 'Easy',
    createdAt: `2025-01-${String((legacyRecipe.id % 27) + 1).padStart(2, '0')}T10:00:00.000Z`,
    source: 'seed',
  };
}

export const seedRecipes = legacyRecipes.map(mapLegacyRecipe);
