import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voia - Kişisel Sesli Asistan',
  description: 'Kişisel Sesli Asistanınız',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}