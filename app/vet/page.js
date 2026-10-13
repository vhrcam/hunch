"use client";

import { useEffect, useState } from "react";

const examples = [
  { label: "Too-good PS5", text: "PS5 brand new sealed, $80 today only! Pay with friends and family to paypal.me/dealzking2026" },
  { label: "Real store", text: "https://www.adafruit.com" },
];

const steps = ["Pulling domain records", "Reading the seller's site", "Checking for pressure tactics", "Comparing the price", "Weighing the clues"];

const stamp = { safe: "Looks legit", caution: "Be careful", danger: "Don't pay" };
const color = { safe: "text-safe", caution: "text-amber", danger: "text-danger" };
const bar = { safe: "bg-safe", caution: "bg-amber", danger: "bg-danger" };

export default function Vet() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 1500);
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
          <button className="btn mr-auto" disabled={loading || !input.trim()}>{loading ? "Investigating..." : "Investigate"}</button>
          <div className="flex items-center gap-2">
            <span className="text-muted text-sm">Try one:</span>
            {examples.map((ex) => (
              <button key={ex.label} type="button" onClick={() => setInput(ex.text)} className="text-sm text-muted border border-line rounded-full px-3 py-1 hover:text-amber hover:border-amber">
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </form>

      {loading && (
        <div className="card space-y-3">
          {steps.map((s, i) => (
            <p key={s} className={`font-type flex gap-3 ${i < step ? "text-muted" : i === step ? "text-amber animate-pulse" : "text-muted opacity-30"}`}>
              <span className="w-4">{i < step ? "✓" : i === step ? "›" : "·"}</span>
              {s}{i === step && "..."}
            </p>
          ))}
          <p className="text-muted text-sm pt-2">Usually a few seconds. Up to half a minute when the AI is busy.</p>
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}

      {result && (
        <div className="space-y-6">
          <div className="card space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-type text-muted text-sm">Trust score</p>
                <p className={`font-type text-6xl leading-none ${color[result.level]}`}>
                  {result.score}<span className="text-2xl text-muted">/100</span>
                </p>
              </div>
              <span className={`stamp text-lg sm:text-2xl mb-1 ${color[result.level]}`}>{stamp[result.level]}</span>
            </div>
            <div className="h-2 rounded-full bg-ink overflow-hidden">
              <div className={`h-full rounded-full ${bar[result.level]}`} style={{ width: `${result.score}%` }} />
            </div>
            <p className="text-lg text-paper leading-relaxed">{result.verdict}</p>
          </div>

          <div className="card space-y-4">
            <p className="font-type text-amber">Clues</p>
            {result.clues.map((c) => (
              <div key={c.label} className="flex gap-4 border-t border-line pt-3">
                <span className={`font-type w-10 shrink-0 ${c.impact < 0 ? "text-danger" : c.impact > 0 ? "text-safe" : "text-muted"}`}>
                  {c.impact > 0 ? `+${c.impact}` : c.impact || "0"}
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
              <ul className="text-muted text-sm list-disc pl-5 space-y-1">
                {result.unchecked.map((u) => <li key={u}>{u}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
