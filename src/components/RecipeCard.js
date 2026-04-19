import Link from 'next/link';

const sweetPattern = /(choco|čoko|karamel|med|dessert|dezert|lotus|oreo|kinder|kit.?kat|snickers|milky|merci|raffaello|maxi king|sweet)/i;
const oatPattern = /(ovsen|kaša|porridge|oat)/i;

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
        <p>{recipe.time || 'Flexible'} · {recipe.difficulty || 'Easy'}</p>
        <p className="recipe-card__meta-detail">{recipe.ingredients.length} ingredients · {recipe.steps.length} steps</p>
        {!!badges.length && (
          <div className="badge-row">
            {badges.map((badge) => (
              <span key={badge} className="badge">{badge}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
