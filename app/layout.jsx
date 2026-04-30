import './globals.css';

export const metadata = {
  title: 'Ruthless Ledger | AI Financial Reality Check',
  description: 'Ms. Ledger, an AI-powered Lead Auditor, roasts your spending habits and creates a realistic budget plan.',
  icons: {
    icon: '/logo.webp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
