import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { RootDarkModeProvider } from '@/components/RootDarkModeProvider';

export const metadata: Metadata = {
  title: 'Century 21 Vasco Group | Property Management',
  description: 'Complete your property management questionnaire with Century 21 Vasco Group. Fast, secure, and professional.',
  keywords: 'Century 21, Vasco Group, Fairfield, real estate, property management, questionnaire',
  openGraph: {
    title: 'Century 21 Vasco Group | Property Management',
    description: 'Secure online property management questionnaires',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/c21-icon.svg" type="image/svg+xml" />
      </head>
      <body>
        <RootDarkModeProvider>
          <Navbar />
          <LayoutWrapper>{children}</LayoutWrapper>
        </RootDarkModeProvider>
      </body>
    </html>
  );
}
