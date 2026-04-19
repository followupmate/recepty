'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRecipes } from '../../../hooks/useRecipes';

export default function RecipeDetailPage({ params }) {
  const router = useRouter();
  const { findRecipeById, hydrated, trackCooked, trackOpened } = useRecipes();
  const recipe = findRecipeById(params.id);

  useEffect(() => {
    if (recipe) trackOpened(recipe.id);
  }, [recipe, trackOpened]);

  if (!hydrated) return <main className="page"><p>Loading recipe...</p></main>;
  if (!recipe) return <main className="page"><p>Recipe not found.</p><Link href="/">Back home</Link></main>;

  const startCooking = () => {
    trackCooked(recipe.id);
    router.push(`/recipes/${recipe.id}/cook`);
  };

  return (
    <main className="detail-page">
      <img src={recipe.image} alt={recipe.title} className="detail-hero" />
      <div className="detail-content">
        <p className="eyebrow">Recipe</p>
        <h1>{recipe.title}</h1>
        <p className="meta-row">
          <span>{recipe.time || 'Flexible time'}</span>
          <span>{recipe.difficulty || 'Easy'}</span>
        </p>

        <button className="btn" onClick={startCooking}>Start Cooking</button>

        <section className="section">
          <h2>Ingredients</h2>
          <ul className="ingredient-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={`${ingredient.name}-${index}`}>
                <span>{ingredient.name}</span>
                <strong>{ingredient.amount || '-'}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2>Steps</h2>
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
