import './globals.css';

export const metadata = {
  title: 'Ruthless Ledger | AI Financial Auditor',
  description: 'Saya tidak menghakimi. Saya menghitung. Dan angka Anda tidak pernah berbohong. Audit finansial berbasis AI oleh Ms. Ledger.',
  icons: {
    icon: '/logo.webp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
