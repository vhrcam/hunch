"use client";

import { useState } from "react";
import Checklist from "../dispute/Checklist";

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
  const [error, setError] = useState("");

  async function investigate(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/vet", { method: "POST", body: JSON.stringify({ input }) });
      setResult(await res.json());
    } catch {
      setError("The investigation hit a snag. Try again.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <p className="label">Before you pay</p>
        <h1 className="headline text-4xl sm:text-5xl">Vet a seller</h1>
        <p className="text-muted text-lg max-w-2xl">Paste a PayPal.me link, a seller&apos;s website or the message they sent you. Hunch investigates. You make the call.</p>
      </div>

      <form onSubmit={investigate} className="card space-y-4">
        <textarea className="input h-32" value={input} onChange={(e) => setInput(e.target.value)} placeholder="paypal.me/seller, https://shop.example, or the seller's message" />
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn mr-auto" disabled={loading || !input.trim()}>{loading ? "Investigating..." : "Investigate"}</button>
          <div className="flex items-center gap-2">
            <span className="text-faint text-sm">Try one:</span>
            {examples.map((ex) => (
              <button key={ex.label} type="button" onClick={() => setInput(ex.text)} className="text-sm text-muted border border-line rounded-full px-3 py-1 transition-colors hover:text-paper hover:border-line-strong">
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </form>

      {loading && <Checklist steps={steps} note="Usually a few seconds. Up to half a minute when the AI is busy." />}

      {error && <p className="text-danger">{error}</p>}

      {result && (
        <div className="space-y-4">
          <div className="card space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="label">Trust score</p>
                <p className={`headline text-7xl ${color[result.level]}`}>
                  {result.score}<span className="text-2xl text-faint font-medium tracking-normal">/100</span>
                </p>
              </div>
              <span className={`stamp text-base sm:text-xl mb-2 ${color[result.level]}`}>{stamp[result.level]}</span>
            </div>
            <div className="h-1.5 rounded-full bg-raised overflow-hidden">
              <div className={`h-full rounded-full ${bar[result.level]}`} style={{ width: `${result.score}%` }} />
            </div>
            <p className="text-lg text-paper leading-relaxed">{result.verdict}</p>
          </div>

          <div className="card space-y-4">
            <p className="label">Clues</p>
            {result.clues.map((c) => (
              <div key={c.label} className="flex gap-4 border-t border-line pt-4">
                <span className={`font-mono text-sm w-10 shrink-0 ${c.impact < 0 ? "text-danger" : c.impact > 0 ? "text-safe" : "text-faint"}`}>
                  {c.impact > 0 ? `+${c.impact}` : c.impact || "0"}
                </span>
                <div className="space-y-0.5">
                  <p className="text-paper font-medium">{c.label}</p>
                  <p className="text-muted text-sm">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {result.unchecked.length > 0 && (
            <div className="card space-y-3">
              <p className="label">Couldn&apos;t check</p>
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
