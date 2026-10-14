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
          <nav className="max-w-5xl mx-auto px-5 h-14 flex items-center gap-5 sm:gap-6 text-sm">
            <Link href="/" className="flex items-center gap-2 text-paper font-semibold tracking-tight">
              <Logo size={26} />
              Hunch
            </Link>
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted mr-auto">
              <span className="size-1.5 rounded-full bg-safe" />
              Sandbox mode
            </span>
            <span className="md:hidden mr-auto" />
            <Link href="/how" className="hidden sm:inline text-muted hover:text-paper transition-colors">How it works</Link>
            <Link href="/vet" className="text-muted hover:text-paper transition-colors"><span className="sm:hidden">Vet</span><span className="hidden sm:inline">Vet a seller</span></Link>
            <Link href="/dispute" className="text-muted hover:text-paper transition-colors"><span className="sm:hidden">Dispute</span><span className="hidden sm:inline">File a dispute</span></Link>
            <Link href="/cases" className="text-muted hover:text-paper transition-colors"><span className="sm:hidden">Cases</span><span className="hidden sm:inline">Your cases</span></Link>
            <a href="https://github.com/vhrcam/hunch" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted hover:text-paper transition-colors">
              <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
            </a>
          </nav>
        </header>
        <main className="flex-1 w-full max-w-5xl mx-auto px-5 py-12">{children}</main>
        <footer className="border-t border-line">
          <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between label">
            <span>Hunch · Built on PayPal</span>
            <span className="hidden sm:inline">Sandbox · no real money moves</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
