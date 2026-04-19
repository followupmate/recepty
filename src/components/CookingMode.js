'use client';

import { useMemo, useState } from 'react';
import { SK } from '../lib/strings/sk';

export default function CookingMode({ recipe, onExit }) {
  const [index, setIndex] = useState(0);
  const currentStep = recipe.steps[index];
  const progress = useMemo(() => `${index + 1} / ${recipe.steps.length}`, [index, recipe.steps.length]);

  return (
    <div className="cook-mode">
      <button className="btn btn--ghost" onClick={onExit}>{SK.cookMode.exit}</button>
      <p className="cook-mode__progress">{SK.cookMode.step} {progress}</p>
      <h1>{recipe.title}</h1>
      <p className="cook-mode__step">{currentStep?.text}</p>
      <div className="actions-row">
        <button
          className="btn btn--ghost"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          {SK.cookMode.previous}
        </button>
        <button
          className="btn"
          onClick={() => setIndex((i) => Math.min(recipe.steps.length - 1, i + 1))}
          disabled={index === recipe.steps.length - 1}
        >
          {SK.cookMode.next}
        </button>
      </div>
    </div>
  );
}
