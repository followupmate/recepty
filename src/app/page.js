'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import RecipeSection from '../components/RecipeSection';
import { useRecipes } from '../hooks/useRecipes';

export default function HomePage() {
  const { recipes, history, hydrated } = useRecipes();

  const sections = useMemo(() => {
    const allRecipes = [...recipes];
    const recent = [...allRecipes]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 6);

    const cookAgain = history
      .map((id) => allRecipes.find((recipe) => recipe.id === id))
      .filter(Boolean)
      .slice(0, 4);

    const quickMeals = allRecipes
      .filter((recipe) =>
        (recipe.tags || []).includes('quick') || recipe.steps.length <= 3,
      )
      .slice(0, 6);

    return { cookAgain, recent, quickMeals, allRecipes };
  }, [recipes, history]);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Your personal AI-assisted cookbook</p>
        <h1>Cook smarter, eat better.</h1>
        <p>Capture a recipe photo, review the parsed result, and save it in your personal cookbook.</p>
        <Link href="/add" className="btn">Add recipe from photo</Link>
      </header>

      {!hydrated ? (
        <p>Loading your cookbook...</p>
      ) : (
        <>
          <RecipeSection title="Cook again" recipes={sections.cookAgain} />
          <RecipeSection title="Recently added" recipes={sections.recent} />
          <RecipeSection title="Quick meals" recipes={sections.quickMeals} />
          <RecipeSection title="All recipes" recipes={sections.allRecipes} />
        </>
      )}
    </main>
  );
}
