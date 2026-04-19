// TODO: Napojiť na reálne OCR + AI extrakciu receptov.
export async function parseRecipeFromImage(file) {
  if (!file) {
    throw new Error('Chýba obrázok receptu.');
  }

  await new Promise((resolve) => setTimeout(resolve, 1400));

  return {
    title: file.name?.replace(/\.[^/.]+$/, '') || 'Kuracie cestoviny',
    image: URL.createObjectURL(file),
    defaultServings: 2,
    ingredients: [
      { name: 'Kuracie prsia', amount: 250, unit: 'g' },
      { name: 'Cestoviny', amount: 200, unit: 'g' },
      { name: 'Cesnak', amount: 2, unit: 'strúčiky' },
      { name: 'Olivový olej', amount: 1, unit: 'PL' },
      { name: 'Parmezán', amount: null, unit: '', optional: true },
    ],
    steps: [
      { order: 1, text: 'Uvar cestoviny v osolenej vode al dente.' },
      { order: 2, text: 'Kuracie mäso opeč s cesnakom na oleji.' },
      { order: 3, text: 'Premiešaj cestoviny s mäsom a podávaj s parmezánom.' },
    ],
    tags: ['quick'],
    time: '25 min',
    difficulty: 'Jednoduché',
  };
}
