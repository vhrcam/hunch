import Link from "next/link";
import Detective from "../Detective";

export const metadata = { title: "How it works · Hunch" };

const vet = [
  ["Read the clue", "Hunch pulls the link, PayPal.me handle or price out of whatever you paste."],
  ["Check the records", "It looks up how long the website's domain has existed, using public RDAP records."],
  ["Visit the scene", "It reads the seller's page for HTTPS, contact details, social links and business info."],
  ["Spot the patterns", "It flags too-good prices, pressure tactics and risky payment requests like Friends and Family, gift cards or crypto."],
  ["Give a verdict", "Gemini weighs the clues and writes a plain-language verdict, including what it couldn't check."],
];

const dispute = [
  ["Find the payment", "From your PayPal activity through the Transaction Search API, or by its transaction ID."],
  ["Hear your side", "Describe what happened in your own words. No forms, no jargon."],
  ["Build the case", "Gemini picks the right PayPal dispute category, writes a calm, factual description and lists the evidence to attach."],
  ["You review it", "Edit anything. Nothing is filed until you press the button."],
  ["File with PayPal", "Hunch opens the dispute through PayPal's Disputes API, from your account."],
  ["Track and coach", "It follows the case status and tells you what to do next, until it closes."],
];

const scores = [
  ["70–100", "Looks legit", "bg-safe"],
  ["40–69", "Be careful", "bg-amber"],
  ["0–39", "Don't pay", "bg-danger"],
];

const apis = [
  ["Disputes API", "POST /v1/customer/disputes", "Files the dispute and tracks its status"],
  ["Transaction Search API", "GET /v1/reporting/transactions", "Finds the payment to dispute"],
  ["Gemini", "generateContent", "Verdicts, case writing and coaching"],
  ["RDAP", "rdap.org/domain", "How old a seller's website is"],
];

function Steps({ items }) {
  return (
    <ol className="mt-8 grid gap-px bg-line border border-line rounded-[10px] overflow-hidden">
      {items.map(([title, detail], i) => (
        <li key={title} className="bg-panel p-5 flex gap-5">
          <span className="font-mono text-xs text-faint pt-1 w-5 shrink-0">0{i + 1}</span>
          <div>
            <p className="text-paper font-medium">{title}</p>
            <p className="text-muted text-sm mt-1">{detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function How() {
  return (
    <div className="space-y-24">
      <section className="flex flex-col-reverse md:flex-row md:items-center gap-10">
        <div className="flex-1 space-y-5">
          <p className="label">How it works</p>
          <h1 className="headline text-5xl sm:text-6xl">Detective work, done in seconds.</h1>
          <p className="text-muted text-lg max-w-xl">
            Hunch checks the clues before you pay, and builds your case if a purchase goes wrong. Here&apos;s exactly what
            happens behind each button.
          </p>
        </div>
        <Detective size={180} className="shrink-0 self-center" />
      </section>

      <section>
        <p className="label">Before you pay</p>
        <h2 className="headline text-3xl mt-2">Vet a seller</h2>
        <Steps items={vet} />
        <div className="mt-6 card">
          <p className="text-paper font-medium">The trust score</p>
          <p className="text-muted text-sm mt-1">
            Every seller starts at 60. Each clue adds or takes away points, and you see every one of them.
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            {scores.map(([range, verdict, color]) => (
              <div key={range} className="flex items-center gap-3 rounded-lg border border-line px-4 py-3">
                <span className={`size-2 rounded-full ${color}`} />
                <span className="font-mono text-sm text-paper">{range}</span>
                <span className="text-muted text-sm">{verdict}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <p className="label">After it goes wrong</p>
        <h2 className="headline text-3xl mt-2">File a dispute</h2>
        <Steps items={dispute} />
      </section>

      <section>
        <p className="label">Under the hood</p>
        <h2 className="headline text-3xl mt-2">Built on PayPal</h2>
        <div className="mt-8 border border-line rounded-[10px] divide-y divide-line">
          {apis.map(([name, endpoint, use]) => (
            <div key={name} className="grid sm:grid-cols-3 gap-1 sm:gap-6 px-5 py-4">
              <p className="text-paper font-medium">{name}</p>
              <p className="font-mono text-xs text-muted sm:pt-1">{endpoint}</p>
              <p className="text-muted text-sm">{use}</p>
            </div>
          ))}
        </div>
        <p className="text-faint text-sm mt-4">Everything runs in PayPal&apos;s sandbox, so no real money moves.</p>
      </section>

      <section className="border-t border-line pt-12 grid md:grid-cols-3 gap-8">
        <div>
          <p className="label">The rule</p>
          <h2 className="headline text-3xl mt-2">You make the call.</h2>
        </div>
        <div className="md:col-span-2 space-y-6">
          <p className="text-muted text-lg leading-relaxed">
            Hunch is a tool, not an agent. It investigates, explains and drafts, but it never pays, files or sends anything
            on its own. When it can&apos;t verify something, it says so instead of guessing.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/vet" className="btn">Vet a seller</Link>
            <Link href="/dispute" className="btn-ghost">File a dispute</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
