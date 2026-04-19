// TODO: Replace with real AI OCR + extraction service integration.
export async function parseRecipeFromImage(file) {
  if (!file) {
    throw new Error('No file provided for parsing.');
  }

  await new Promise((resolve) => setTimeout(resolve, 1400));

  return {
    title: file.name?.replace(/\.[^/.]+$/, '') || 'Chicken Pasta',
    image: URL.createObjectURL(file),
    ingredients: [
      { name: 'Chicken breast', amount: '250 g' },
      { name: 'Pasta', amount: '200 g' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Olive oil', amount: '1 tbsp' },
      { name: 'Parmesan', amount: 'to serve' },
    ],
    steps: [
      { order: 1, text: 'Boil the pasta in salted water until al dente.' },
      { order: 2, text: 'Cook sliced chicken with olive oil and garlic in a pan.' },
      { order: 3, text: 'Mix pasta with chicken and finish with parmesan.' },
    ],
    tags: ['quick'],
    time: '25 min',
    difficulty: 'Easy',
  };
}
