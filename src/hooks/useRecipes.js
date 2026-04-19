'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { seedRecipes } from '../lib/recipeMapper';
import { normalizeRecipe } from '../lib/utils/recipeNormalizer';

const STORAGE_KEY = 'cookbook-user-recipes-v1';
const HISTORY_KEY = 'cookbook-cooked-history-v1';

export function useRecipes() {
  const [userRecipes, setUserRecipes] = useState([]);
  const [history, setHistory] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const cookedHistory = localStorage.getItem(HISTORY_KEY);
      setUserRecipes(saved ? JSON.parse(saved) : []);
      setHistory(cookedHistory ? JSON.parse(cookedHistory) : []);
    } catch {
      setUserRecipes([]);
      setHistory([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  const recipes = useMemo(
    () => [...userRecipes, ...seedRecipes],
    [userRecipes],
  );

  const addRecipe = useCallback((recipeInput) => {
    const recipe = {
      ...normalizeRecipe(recipeInput),
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      source: 'user',
    };

    setUserRecipes((current) => {
      const next = [recipe, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });

    return recipe;
  }, []);

  const trackCooked = useCallback((recipeId) => {
    setHistory((current) => {
      const next = [recipeId, ...current.filter((id) => id !== recipeId)].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const findRecipeById = useCallback(
    (id) => recipes.find((recipe) => recipe.id === id),
    [recipes],
  );

  return {
    hydrated,
    recipes,
    userRecipes,
    history,
    addRecipe,
    trackCooked,
    trackOpened: trackCooked,
    findRecipeById,
  };
}
