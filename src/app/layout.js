import './globals.css';

export const metadata = {
  title: 'Naše Recepty',
  description: 'Rodinná zbierka receptov',
  manifest: '/manifest.json',
  themeColor: '#9d4500',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Naše Recepty" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
