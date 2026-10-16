"use client";

import AskDetective from "../AskDetective";
import Seal from "../Seal";
import { Suspense, use, useEffect, useEffectEvent, useState } from "react";
import Checklist from "../dispute/Checklist";

const kinds = [
  ["PayPal.me link", <path key="i" d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />],
  ["Store website", <><circle key="c" cx="12" cy="12" r="9" /><path key="p" d="M3 12h18M12 3c2.5 2.7 3.5 5.7 3.5 9s-1 6.3-3.5 9c-2.5-2.7-3.5-5.7-3.5-9s1-6.3 3.5-9Z" /></>],
  ["Seller's message", <path key="i" d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />],
];

const examples = [
  { label: "Too-good PS5", text: "PS5 brand new sealed, $80 today only! Pay with friends and family to paypal.me/dealzking2026" },
  { label: "Real store", text: "https://www.adafruit.com" },
];

const steps = ["Pulling domain records", "Reading the seller's site", "Checking for pressure tactics", "Comparing the price", "Weighing the clues"];

const stamp = { safe: "Looks legit", caution: "Be careful", danger: "Don't pay" };
const ring = { safe: "HUNCH VERIFIED", caution: "HUNCH CAUTION", danger: "HUNCH FLAGGED" };
const color = { safe: "text-safe", caution: "text-amber", danger: "text-danger" };
const bar = { safe: "bg-safe", caution: "bg-amber", danger: "bg-danger" };

function Start({ searchParams, onStart }) {
  const text = use(searchParams).input;
  const fire = useEffectEvent(onStart);

  useEffect(() => {
    if (text) fire(text);
  }, [text]);

  return null;
}

export default function Vet({ searchParams }) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function lookup(text) {
    fetch("/api/vet", { method: "POST", body: JSON.stringify({ input: text }) })
      .then((res) => res.json())
      .then(setResult, () => setError("The investigation hit a snag. Try again."))
      .finally(() => setLoading(false));
  }

  function begin(text) {
    setLoading(true);
    setResult(null);
    setError("");
    lookup(text);
  }

  function investigate(e) {
    e.preventDefault();
    begin(input);
  }

  function start(text) {
    setInput(text);
    begin(text);
  }

  return (
    <div className="space-y-10">
      <Suspense>
        <Start searchParams={searchParams} onStart={start} />
      </Suspense>
      <div className="space-y-4">
        <p className="label">Before you pay</p>
        <h1 className="headline text-4xl sm:text-5xl">Vet a seller</h1>
        <p className="text-muted text-lg max-w-2xl">Paste a PayPal.me link, a seller&apos;s website or the message they sent you. Hunch investigates. You make the call.</p>
      </div>

      <form onSubmit={investigate} className="card space-y-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="label">You can paste</span>
          {kinds.map(([name, icon]) => (
            <span key={name} className="inline-flex items-center gap-1.5 text-sm text-muted">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
              {name}
            </span>
          ))}
        </div>
        <textarea className="input h-32 resize-none" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste a link or the seller's message here…" />
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
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-4 items-start">
          <div className="space-y-4 lg:sticky lg:top-20">
            <div className="card space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <p className="label">Trust score</p>
                  <p className={`headline text-7xl ${color[result.level]}!`}>
                    {result.score}<span className="text-2xl text-faint font-medium tracking-normal">/100</span>
                  </p>
                </div>
                <Seal level={result.level} ring={ring[result.level]} label={stamp[result.level]} />
              </div>
              <div className="h-1.5 rounded-full bg-raised overflow-hidden">
                <div className={`h-full rounded-full ${bar[result.level]}`} style={{ width: `${result.score}%` }} />
              </div>
              <p className="text-lg text-paper leading-relaxed">{result.verdict}</p>
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

          <div className="space-y-4">
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

            <AskDetective
              kind="vet"
              context={{ pasted: input, result }}
              suggestions={["Why this score?", "What should I ask the seller?", "Is there a safer way to pay?"]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
