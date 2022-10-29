import '../styles/globals.css';
import { Inter } from '@next/font/google'
const inter = Inter()

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={inter.className}>
      <head>
        <title>Vou misturar</title>
      </head>
      <body>{children}</body>
    </html>
  );
}