import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SoulLink — Find Your Cosmic Connection',
  description:
    'Create your Soul Profile, generate a unique game link, and discover your compatibility with someone special. No AI — pure soul science.',
  openGraph: {
    title: 'SoulLink — Find Your Cosmic Connection',
    description: 'How well does someone really know you? Play the SoulLink quiz to find out.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080810] text-white antialiased">{children}</body>
    </html>
  );
}
