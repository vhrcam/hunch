"use client";

import { useEffect, useState } from "react";

const examples = [
  "PS5 brand new sealed, $80 today only! Pay with friends and family to paypal.me/dealzking2026",
  "https://www.adafruit.com",
];

const steps = ["Pulling domain records...", "Reading the seller's site...", "Checking for pressure tactics...", "Comparing the price...", "Weighing the clues..."];

const stamp = { safe: "Looks legit", caution: "Be careful", danger: "Don't pay" };
const color = { safe: "text-safe", caution: "text-amber", danger: "text-danger" };

export default function Vet() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 4000);
    return () => clearInterval(id);
  }, [loading]);

  async function investigate(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");
    setStep(0);
    try {
      const res = await fetch("/api/vet", { method: "POST", body: JSON.stringify({ input }) });
      setResult(await res.json());
    } catch {
      setError("The investigation hit a snag. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="font-type text-amber">Before you pay</p>
        <h1 className="font-type text-4xl text-paper">Vet a seller</h1>
        <p className="text-muted">Paste a PayPal.me link, a seller&apos;s website or the message they sent you. Hunch investigates. You make the call.</p>
      </div>

      <form onSubmit={investigate} className="card space-y-4">
        <textarea className="input h-32" value={input} onChange={(e) => setInput(e.target.value)} placeholder="paypal.me/seller, https://shop.example, or the seller's message" />
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn" disabled={loading || !input.trim()}>{loading ? "Investigating..." : "Investigate"}</button>
          <span className="text-muted text-sm">Try:</span>
          {examples.map((ex, i) => (
            <button key={ex} type="button" onClick={() => setInput(ex)} className="text-sm text-muted hover:text-amber underline">
              {i ? "Real store" : "Too-good PS5"}
            </button>
          ))}
        </div>
      </form>

      {loading && (
        <div className="card space-y-2">
          <p className="font-type text-amber animate-pulse">{steps[step]}</p>
          <p className="text-muted text-sm">This can take up to a minute when the AI is busy.</p>
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}

      {result && (
        <div className="space-y-6">
          <div className="card flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="text-center shrink-0">
              <p className="font-type text-muted text-sm">Trust score</p>
              <p className={`font-type text-6xl ${color[result.level]}`}>{result.score}</p>
            </div>
            <div className="space-y-3">
              <span className={`stamp ${color[result.level]}`}>{stamp[result.level]}</span>
              <p className="text-lg text-paper">{result.verdict}</p>
            </div>
          </div>

          <div className="card space-y-4">
            <p className="font-type text-amber">Clues</p>
            {result.clues.map((c) => (
              <div key={c.label} className="flex gap-4 border-t border-line pt-3">
                <span className={`font-type w-12 shrink-0 ${c.impact < 0 ? "text-danger" : c.impact > 0 ? "text-safe" : "text-muted"}`}>
                  {c.impact > 0 ? `+${c.impact}` : c.impact || "·"}
                </span>
                <div>
                  <p className="font-semibold">{c.label}</p>
                  <p className="text-muted text-sm">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {result.unchecked.length > 0 && (
            <div className="card space-y-2">
              <p className="font-type text-amber">Couldn&apos;t check</p>
              <ul className="text-muted text-sm list-disc pl-5">
                {result.unchecked.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
