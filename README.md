# 🍽️ Naše Recepty

Rodinná zbierka receptov — PWA aplikácia s 40 receptami.

## Funkcie
- 🔍 Vyhľadávanie podľa názvu aj ingrediencií
- 📂 Filtrovanie podľa kategórií (Raňajky, Hlavné jedlá, Prílohy, Omáčky, Dezerty)
- ❤️ Obľúbené recepty (ukladajú sa lokálne)
- 🎲 Náhodný výber — "Čo dnes?"
- 📱 PWA — inštalovateľná na mobil
- ⚖️ Prepočet porcií

## Spustenie

```bash
npm install
npm run dev
```

## Deploy na Vercel

1. Pushni na GitHub
2. Pripoj repozitár vo Vercel dashboarde
3. Vercel automaticky detekuje Next.js a deployne

## Pridanie receptov

Recepty sú v `src/data/recipes.js`. Formát:

```js
{
  id: 41,
  t: "Názov receptu",
  cat: "ranajky", // ranajky | predjedla | hlavne | prilohy | omacky | dezerty
  bp: 1,          // base portions (default 1, chefparade recepty majú 10)
  ing: [["Ingrediencia", množstvo, "jednotka"], ...],
  s: ["Krok 1", "Krok 2", ...]
}
```

## Tech stack
- Next.js 14 (App Router)
- React 18
- PWA (manifest + service worker)
- Vercel hosting
