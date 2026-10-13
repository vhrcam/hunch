import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import Logo from "./Logo";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata = {
  title: "Hunch: your PayPal scam detective",
  description: "Check a seller before you pay. If a purchase goes wrong, Hunch builds and files your PayPal dispute.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} antialiased`}>
      <body className="min-h-screen font-sans flex flex-col">
        <header className="sticky top-0 z-10 border-b border-line bg-ink/80 backdrop-blur">
          <nav className="max-w-5xl mx-auto px-5 h-14 flex items-center gap-6 text-sm">
            <Link href="/" className="flex items-center gap-2 mr-auto text-paper font-semibold tracking-tight">
              <Logo size={26} />
              Hunch
            </Link>
            <Link href="/vet" className="text-muted hover:text-paper transition-colors">Vet a seller</Link>
            <Link href="/dispute" className="text-muted hover:text-paper transition-colors">File a dispute</Link>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-5 py-12">{children}</main>
        <footer className="border-t border-line">
          <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between label">
            <span>Hunch · PayPal AI Hackathon</span>
            <span className="hidden sm:inline">Sandbox · no real money moves</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
