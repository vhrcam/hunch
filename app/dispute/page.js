"use client";

import Link from "next/link";
import AskDetective from "../AskDetective";
import Seal from "../Seal";
import { useEffect, useState } from "react";
import Steps from "./Steps";
import Checklist from "./Checklist";
import Tracker from "./Tracker";
import ManualEntry from "./ManualEntry";
import { money, day } from "./format";

const stories = [
  "Seller never shipped it, it's been 3 weeks, they stopped answering",
  "It arrived broken / not as described",
  "I didn't make this payment",
];

const buildSteps = ["Pulling the payment record", "Reading your story", "Matching PayPal's dispute rules", "Drafting your case", "Listing the evidence"];
const fileSteps = ["Opening the case with PayPal", "Attaching your statement", "Checking the case status"];

const strengthLevel = { strong: "safe", fair: "caution", weak: "danger" };

const offline = "That didn't go through. Try again in a moment.";

async function api(path, body) {
  const res = await fetch(`/api/dispute/${path}`, body ? { method: "POST", body: JSON.stringify(body) } : {});
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || offline);
  return data;
}

export default function Dispute() {
  const [step, setStep] = useState(1);
  const [transactions, setTransactions] = useState(null);
  const [picked, setPicked] = useState(null);
  const [manual, setManual] = useState(false);
  const [story, setStory] = useState("");
  const [built, setBuilt] = useState(null);
  const [description, setDescription] = useState("");
  const [checked, setChecked] = useState([]);
  const [status, setStatus] = useState(null);
  const [asked, setAsked] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("transactions").then((d) => setTransactions(d.transactions)).catch(() => setTransactions([]));
  }, []);

  async function run(kind, work) {
    setLoading(kind);
    setError("");
    try {
      await work();
    } catch (e) {
      setError(e instanceof TypeError ? offline : e.message);
    }
    setLoading(null);
  }

  const go = (n) => {
    setStep(n);
    setError("");
  };

  const build = (e) => {
    e.preventDefault();
    run("build", async () => {
      const c = await api("build", { transaction: picked, story });
      setBuilt(c);
      setDescription(c.description);
      setChecked([]);
      setStep(3);
    });
  };

  const file = () => run("file", async () => {
    const { disputeId } = await api("file", { transactionId: picked.id, reason: built.reason, amount: built.amount, description });
    setStatus(await api(`status?id=${disputeId}`));
    setStep(4);
  });

  const resolve = () => run("resolve", async () => {
    setStatus(await api("resolve", { disputeId: status.disputeId }));
    setAsked(true);
  });

  const refresh = () => run("refresh", async () => setStatus(await api(`status?id=${status.disputeId}`)));

  const usePayment = (t) => {
    setPicked(t);
    go(2);
  };

  const noList = transactions?.length === 0;

  const toggle = (item) => setChecked((c) => (c.includes(item) ? c.filter((i) => i !== item) : [...c, item]));

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <p className="label">After it goes wrong</p>
        <h1 className="headline text-4xl sm:text-5xl">File a dispute</h1>
        <p className="text-muted text-lg max-w-2xl">Hunch finds the payment, builds your case and files it with PayPal. You review every word before it goes out.</p>
      </div>

      <Steps current={step} />

      <div hidden={step !== 1} className="space-y-4">
        <h2 className="headline text-2xl">Which payment went wrong?</h2>
        {!transactions && <p className="text-muted text-sm animate-pulse">Pulling your recent payments...</p>}
        {noList && <p className="text-muted">No recent payments showed up from PayPal yet. Enter the payment yourself and Hunch takes it from there.</p>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {transactions?.map((t) => (
            <button
              key={t.id}
              onClick={() => setPicked(t)}
              className={`card w-full text-left flex items-start justify-between gap-4 hover:border-line-strong! ${picked?.id === t.id ? "border-paper! ring-1 ring-paper" : ""}`}
            >
              <div className="space-y-1 min-w-0">
                <p className="font-medium text-paper">{t.counterparty}</p>
                <p className="text-muted text-sm truncate">{[t.date && day(t.date), t.email].filter(Boolean).join(" · ")}</p>
                {t.note && <p className="text-muted text-sm italic">&ldquo;{t.note}&rdquo;</p>}
              </div>
              <p className="font-mono text-lg text-paper shrink-0">{money(t.amount, t.currency)}</p>
            </button>
          ))}
        </div>
        {transactions?.length > 0 && <button className="btn" disabled={!picked} onClick={() => go(2)}>Continue</button>}
        {transactions?.length > 0 && (
          <button onClick={() => setManual(!manual)} className="block text-sm text-muted transition-colors hover:text-paper pt-2">
            Don&apos;t see it? Enter it yourself {manual ? "▴" : "▾"}
          </button>
        )}
        {(manual || noList) && <ManualEntry onSubmit={usePayment} />}
      </div>

      {step === 2 && (
        <form onSubmit={build} className="space-y-4">
          <h2 className="headline text-2xl">Tell us what happened in your own words.</h2>
          <p className="text-muted text-sm">
            Your payment: {picked.counterparty}, {money(picked.amount, picked.currency)}{picked.date && ` on ${day(picked.date)}`}
          </p>
          {loading === "build" ? (
            <Checklist steps={buildSteps} note="Hunch is writing your case. This takes a few seconds." />
          ) : (
            <div className="card space-y-4">
              <textarea className="input h-36" value={story} onChange={(e) => setStory(e.target.value)} placeholder="What did you pay for, what went wrong, and what has the seller said?" />
              <div className="flex flex-wrap gap-2">
                {stories.map((s) => (
                  <button key={s} type="button" onClick={() => setStory(s)} className="text-sm text-muted border border-line rounded-full px-3 py-1 text-left transition-colors hover:text-paper hover:border-line-strong">
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button className="btn" disabled={!story.trim()}>Build my case</button>
                <button type="button" onClick={() => go(1)} className="text-muted text-sm transition-colors hover:text-paper">Back</button>
              </div>
            </div>
          )}
        </form>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-4 items-start">
            <div className="space-y-4">
              <div className="card space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="label">Dispute category</p>
                    <p className="headline text-3xl">{built.reasonLabel}</p>
                    <p className="text-muted text-sm">Claiming {money(built.amount, picked.currency)} from {picked.counterparty}</p>
                  </div>
                  <Seal level={strengthLevel[built.strength]} ring={`HUNCH ${built.strength.toUpperCase()} CASE`} label={`${built.strength} case`} size={112} />
                </div>
                <p className="text-muted text-sm border-t border-line pt-3">{built.strengthWhy}</p>
              </div>

              <div className="card space-y-3">
                <p className="label">Your statement to PayPal</p>
                <p className="font-medium text-paper">{built.title}</p>
                <textarea className="input h-48 leading-relaxed" value={description} onChange={(e) => setDescription(e.target.value)} />
                <p className="text-muted text-sm">Edit anything that isn&apos;t exactly right. This is what PayPal reads.</p>
              </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-20">
              <div className="card space-y-3">
                <div className="flex justify-between gap-4">
                  <p className="label">Evidence to gather</p>
                  <p className="font-mono text-xs text-faint">{checked.length}/{built.evidence.length} ready</p>
                </div>
                {built.evidence.map((ev) => (
                  <label key={ev.item} className="flex gap-3 border-t border-line pt-3 cursor-pointer">
                    <input type="checkbox" checked={checked.includes(ev.item)} onChange={() => toggle(ev.item)} className="mt-1 accent-paper w-4 h-4 shrink-0" />
                    <span>
                      <span className={`block font-medium ${checked.includes(ev.item) ? "text-faint line-through" : "text-paper"}`}>{ev.item}</span>
                      <span className="block text-muted text-sm">{ev.why}</span>
                    </span>
                  </label>
                ))}
              </div>

              {built.tips.length > 0 && (
                <div className="card space-y-2">
                  <p className="label">Detective&apos;s tips</p>
                  <ul className="list-disc pl-5 space-y-1 text-muted">
                    {built.tips.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {loading === "file" ? (
            <Checklist steps={fileSteps} />
          ) : (
            <div className="flex items-center gap-4">
              <button className="btn" disabled={!description.trim()} onClick={file}>File dispute with PayPal</button>
              <button onClick={() => go(2)} className="text-muted text-sm transition-colors hover:text-paper">Back</button>
            </div>
          )}
        </div>
      )}

      {step === 4 && status && (
        <Tracker c={status} currency={picked.currency} asked={asked} onResolve={resolve} onRefresh={refresh} busy={loading}>
          <AskDetective
            kind="dispute"
            context={{ payment: picked, case: built && { reason: built.reasonLabel, description, evidence: built.evidence }, status }}
            suggestions={["What happens next?", "What if the seller doesn't respond?", "When will I get my money back?"]}
          />
          <Link href="/cases" className="inline-block text-sm text-muted transition-colors hover:text-paper">See all your cases →</Link>
        </Tracker>
      )}

      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}
