import Link from 'next/link';

export default function RecipeCard({ recipe, href }) {
  return (
    <Link href={href} className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-card__image" />
      <div className="recipe-card__content">
        <h3>{recipe.title}</h3>
        <p>
          {recipe.time || 'Flexible'} · {recipe.difficulty || 'Easy'}
        </p>
      </div>
    </Link>
  );
}
