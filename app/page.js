import Link from "next/link";
import Detective from "./Detective";
import HomeChat from "./HomeChat";

const before = [
  ["Domain age", "How long the store's website has existed"],
  ["The seller's page", "Contact details, socials, business info"],
  ["Scam patterns", "Too-good prices, pressure, Friends and Family requests"],
  ["Trust score", "0 to 100, with a straight answer"],
];

const after = [
  ["Find the payment", "From your PayPal activity or its transaction ID"],
  ["Build the case", "Right category, clear description, evidence list"],
  ["File it", "Straight to PayPal through the Disputes API"],
  ["Track and coach", "What to do next, until the case closes"],
];

function Steps({ items }) {
  return (
    <ol className="mt-6 space-y-4">
      {items.map(([title, detail], i) => (
        <li key={title} className="flex gap-4">
          <span className="font-mono text-xs text-faint pt-0.5 w-5 shrink-0">0{i + 1}</span>
          <div>
            <p className="text-paper text-sm font-medium">{title}</p>
            <p className="text-muted text-sm">{detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="flex flex-col-reverse md:flex-row md:items-center gap-10 pt-6">
        <div className="flex-1 space-y-6">
          <p className="label">Your PayPal scam detective</p>
          <h1 className="headline text-5xl sm:text-6xl">Got a hunch about a seller?</h1>
          <p className="text-muted text-lg max-w-xl">
            Hunch investigates before you pay, and builds your PayPal dispute if a purchase already went wrong.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/vet" className="btn">Vet a seller</Link>
            <Link href="/dispute" className="btn-ghost">File a dispute</Link>
          </div>
        </div>
        <Detective size={260} searching className="text-paper shrink-0 self-center" />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <Link href="/vet" className="card hover:border-line-strong">
          <p className="label">Before you pay</p>
          <h2 className="headline text-2xl mt-2">Vet a seller</h2>
          <Steps items={before} />
        </Link>
        <Link href="/dispute" className="card hover:border-line-strong">
          <p className="label">After it goes wrong</p>
          <h2 className="headline text-2xl mt-2">File a dispute</h2>
          <Steps items={after} />
        </Link>
      </section>

      <section id="how" className="border-t border-line pt-12 grid md:grid-cols-3 gap-8 scroll-mt-20">
        <div className="md:col-span-1">
          <p className="label">How it works</p>
          <h2 className="headline text-3xl mt-2">A tool, not an agent.</h2>
        </div>
        <p className="md:col-span-2 text-muted text-lg leading-relaxed">
          Hunch does the detective work: it checks the clues, explains what it found, and drafts your case. But nothing is
          paid, filed, or sent until you press the button. You make the call.
        </p>
      </section>

      <HomeChat />
    </div>
  );
}
