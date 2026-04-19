'use client';

import { useRouter } from 'next/navigation';
import CookingMode from '../../../../components/CookingMode';
import { useRecipes } from '../../../../hooks/useRecipes';
import { SK } from '../../../../lib/strings/sk';

export default function CookingPage({ params }) {
  const router = useRouter();
  const { findRecipeById, hydrated } = useRecipes();
  const recipe = findRecipeById(params.id);

  if (!hydrated) return null;
  if (!recipe) return <main className="page"><p>{SK.common.recipeNotFound}</p></main>;

  return <CookingMode recipe={recipe} onExit={() => router.push(`/recipes/${recipe.id}`)} />;
}
