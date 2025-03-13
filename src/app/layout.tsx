import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from './components/Footer';

// Remove unused fonts
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Araç Talep Sistemi',
  description: 'Darülaceze Araç Talep Sistemi',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
