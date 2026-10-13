import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <p className="font-type text-amber">Case file #001</p>
        <h1 className="font-type text-5xl text-paper">Got a bad feeling about a seller?</h1>
        <p className="text-muted text-lg">Hunch investigates before you pay, and builds your PayPal dispute if things go wrong.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/vet" className="card hover:border-amber space-y-2">
          <p className="font-type text-amber">Before you pay</p>
          <h2 className="text-xl font-semibold">Vet a seller</h2>
          <p className="text-muted">Paste a link or payment request. Get a trust score and a straight answer.</p>
        </Link>
        <Link href="/dispute" className="card hover:border-amber space-y-2">
          <p className="font-type text-amber">After it goes wrong</p>
          <h2 className="text-xl font-semibold">File a dispute</h2>
          <p className="text-muted">Tell us what happened. We find the payment, build your case and file it.</p>
        </Link>
      </div>
    </div>
  );
}
