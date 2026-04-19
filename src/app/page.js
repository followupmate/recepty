'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import RecipeSection from '../components/RecipeSection';
import UploadEntryCard from '../components/UploadEntryCard';
import { useRecipes } from '../hooks/useRecipes';
import { SK } from '../lib/strings/sk';
import { setPendingUploadFile } from '../lib/pendingUploadStore';

function EmptyState() {
  return (
    <section className="empty-state">
      <h2>{SK.home.emptyTitle}</h2>
      <ol>
        {SK.home.emptySteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}

const sweetPattern = /(choco|čoko|karamel|med|dessert|dezert|lotus|oreo|kinder|kit.?kat|snickers|milky|merci|raffaello|maxi king|sweet)/i;
const breakfastPattern = /(ovsen|kaša|porridge|breakfast|ranajk|pancake|lievance)/i;

function inferGroup(recipe) {
  const tags = recipe.tags || [];
  const title = recipe.title || '';

  if (tags.includes('dessert') || tags.includes('sweet') || sweetPattern.test(title)) return 'dessert';
  if (tags.includes('breakfast') || tags.includes('oat') || breakfastPattern.test(title)) return 'breakfast';
  if (tags.includes('main') || tags.includes('side') || tags.includes('sauce')) return 'savory';
  return 'other';
}

function interleaveByGroup(recipes, limit = recipes.length) {
  const groups = recipes.reduce((acc, recipe) => {
    const key = inferGroup(recipe);
    if (!acc[key]) acc[key] = [];
    acc[key].push(recipe);
    return acc;
  }, {});

  const order = ['breakfast', 'savory', 'dessert', 'other'];
  const result = [];

  while (result.length < limit) {
    let pushedInRound = false;

    for (const key of order) {
      if (groups[key]?.length) {
        result.push(groups[key].shift());
        pushedInRound = true;
        if (result.length >= limit) break;
      }
    }

    if (!pushedInRound) break;
  }

  return result;
}

export default function HomePage() {
  const router = useRouter();
  const { recipes, userRecipes, history, hydrated } = useRecipes();

  const sections = useMemo(() => {
    const allRecipes = [...recipes];
    const recentlyCaptured = interleaveByGroup(
      [...allRecipes].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
      9,
    );

    const cookAgain = history
      .map((id) => allRecipes.find((recipe) => recipe.id === id))
      .filter(Boolean)
      .slice(0, 6);

    const grouped = allRecipes.reduce((acc, recipe) => {
      const key = inferGroup(recipe);
      if (!acc[key]) acc[key] = [];
      acc[key].push(recipe);
      return acc;
    }, { breakfast: [], savory: [], dessert: [], other: [] });

    return {
      cookAgain,
      recentlyCaptured,
      breakfast: interleaveByGroup(grouped.breakfast, 6),
      savory: interleaveByGroup(grouped.savory, 6),
      dessert: interleaveByGroup(grouped.dessert, 6),
    };
  }, [recipes, history]);

  const goToAddWithFile = (file) => {
    setPendingUploadFile(file);
    router.push('/add?source=home');
  };

  return (
    <main className="page">
      <UploadEntryCard
        title={SK.home.addFromPhoto}
        subtitle={SK.home.addFromPhotoHint}
        onFileSelected={goToAddWithFile}
      />

      {!hydrated ? (
        <p className="text-muted">{SK.common.loadingCookbook}</p>
      ) : (
        <>
          {userRecipes.length === 0 && <EmptyState />}
          <RecipeSection title={SK.home.cookAgain} recipes={sections.cookAgain} />
          <RecipeSection title={SK.home.latest} recipes={sections.recentlyCaptured} />
          <RecipeSection title={SK.home.breakfast} recipes={sections.breakfast} />
          <RecipeSection title={SK.home.savory} recipes={sections.savory} />
          <RecipeSection title={SK.home.sweet} recipes={sections.dessert} />
        </>
      )}
    </main>
  );
}
