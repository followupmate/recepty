import RecipeCard from './RecipeCard';

export default function RecipeSection({ title, recipes }) {
  if (!recipes.length) return null;

  return (
    <section className="section">
      <div className="section__header">
        <h2 className="section__title">{title}</h2>
      </div>
      <div className="cards-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} href={`/recipes/${recipe.id}`} />
        ))}
      </div>
    </section>
  );
}
