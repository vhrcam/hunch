import Link from "next/link";
import { Inter, Special_Elite } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const specialElite = Special_Elite({ variable: "--font-special-elite", weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Hunch",
  description: "Your PayPal scam detective. Vet a seller before you pay, build your dispute if it goes wrong.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${specialElite.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <header className="border-b border-line">
          <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-6">
            <Link href="/" className="font-type text-2xl text-paper mr-auto">Hunch</Link>
            <Link href="/vet" className="text-muted hover:text-amber">Vet a seller</Link>
            <Link href="/dispute" className="text-muted hover:text-amber">File a dispute</Link>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
