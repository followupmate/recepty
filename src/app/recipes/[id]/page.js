'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useRecipes } from '../../../hooks/useRecipes';
import { SK } from '../../../lib/strings/sk';
import { formatAmount, scaleIngredients } from '../../../lib/utils/servings';

export default function RecipeDetailPage({ params }) {
  const router = useRouter();
  const { findRecipeById, hydrated, trackCooked, trackOpened } = useRecipes();
  const recipe = findRecipeById(params.id);
  const [servings, setServings] = useState(1);

  useEffect(() => {
    if (!recipe) return;
    trackOpened(recipe.id);
    setServings(recipe.defaultServings || 1);
  }, [recipe, trackOpened]);

  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];
    return scaleIngredients(recipe.ingredients, recipe.defaultServings || 1, servings);
  }, [recipe, servings]);

  if (!hydrated) return <main className="page"><p className="text-muted">{SK.common.loadingRecipe}</p></main>;
  if (!recipe) return <main className="page"><p>{SK.common.recipeNotFound}</p><Link href="/">{SK.common.backHome}</Link></main>;

  const startCooking = () => {
    trackCooked(recipe.id);
    router.push(`/recipes/${recipe.id}/cook`);
  };

  return (
    <main className="detail-page">
      <img src={recipe.image} alt={recipe.title} className="detail-hero" />
      <div className="detail-content">
        <p className="eyebrow">{SK.detail.recipe}</p>
        <h1>{recipe.title}</h1>
        <p className="meta-row">
          <span>{recipe.time || SK.detail.flexibleTime}</span>
          <span>{recipe.difficulty || SK.detail.easy}</span>
        </p>

        <button type="button" className="btn" onClick={startCooking}>{SK.detail.startCooking}</button>

        <section className="section panel servings-panel">
          <h2>{SK.detail.servings}</h2>
          <div className="servings-control">
            <button type="button" className="btn btn--ghost" onClick={() => setServings((s) => Math.max(1, s - 1))}>-</button>
            <strong>{servings}</strong>
            <button type="button" className="btn btn--ghost" onClick={() => setServings((s) => s + 1)}>+</button>
          </div>
        </section>

        <section className="section">
          <h2>{SK.detail.ingredients}</h2>
          <ul className="ingredient-list">
            {scaledIngredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`}>
                <span>{ingredient.name}</span>
                <strong>
                  {ingredient.scaledAmount !== null
                    ? `${formatAmount(ingredient.scaledAmount)} ${ingredient.unit || ''}`.trim()
                    : ingredient.unit || '-'}
                </strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2>{SK.detail.steps}</h2>
          <ol className="steps-list">
            {recipe.steps.map((step) => (
              <li key={step.order}>{step.text}</li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
