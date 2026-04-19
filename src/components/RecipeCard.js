import Link from 'next/link';
import { SK } from '../lib/strings/sk';

const sweetPattern = /(choco|čoko|karamel|med|dessert|dezert|lotus|oreo|kinder|kit.?kat|snickers|milky|merci|raffaello|maxi king|sweet)/i;
const oatPattern = /(ovsen|kaša|porridge|oat)/i;

function translateTag(tag) {
  return SK.tags[tag] || tag;
}

export default function RecipeCard({ recipe, href }) {
  const derivedTags = [];
  const title = recipe.title || '';

  if (oatPattern.test(title) && !(recipe.tags || []).includes('oat')) derivedTags.push('oat');
  if (sweetPattern.test(title) && !(recipe.tags || []).includes('sweet')) derivedTags.push('sweet');

  const badges = [...new Set([...(recipe.tags || []), ...derivedTags])].slice(0, 3);

  return (
    <Link href={href} className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-card__image" />
      <div className="recipe-card__content">
        <h3>{recipe.title}</h3>
        <p>{recipe.time || SK.detail.flexibleTime} · {recipe.difficulty || SK.detail.easy}</p>
        <p className="recipe-card__meta-detail">{recipe.ingredients.length} {SK.detail.ingredientsCount} · {recipe.steps.length} {SK.detail.stepsCount}</p>
        {!!badges.length && (
          <div className="badge-row">
            {badges.map((badge) => (
              <span key={badge} className="badge">{translateTag(badge)}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
