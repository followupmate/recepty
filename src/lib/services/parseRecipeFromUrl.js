// TODO: Napojiť na backend scraper/parser pre URL receptu.
export async function parseRecipeFromUrl(url) {
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error('Zadaj platnú URL adresu receptu.');
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    title: 'Cestoviny s paradajkovou omáčkou',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
    defaultServings: 2,
    ingredients: [
      { name: 'Cestoviny', amount: 250, unit: 'g' },
      { name: 'Paradajkové pyré', amount: 300, unit: 'ml' },
      { name: 'Cesnak', amount: 2, unit: 'strúčiky' },
      { name: 'Bazalka', amount: null, unit: '', optional: true },
    ],
    steps: [
      { order: 1, text: 'Uvar cestoviny podľa návodu.' },
      { order: 2, text: 'Na panvici zohrej omáčku s cesnakom.' },
      { order: 3, text: 'Zmiešaj cestoviny s omáčkou a posyp bazalkou.' },
    ],
    tags: ['main'],
    time: '20 min',
    difficulty: 'Jednoduché',
  };
}
