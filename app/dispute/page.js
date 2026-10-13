"use client";

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

const strengthColor = { strong: "text-safe", fair: "text-amber", weak: "text-danger" };

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

  const resolve = () => run("resolve", async () => setStatus(await api("resolve", { disputeId: status.disputeId })));

  const usePayment = (t) => {
    setPicked(t);
    setStep(2);
  };

  const noList = transactions?.length === 0;

  const toggle = (item) => setChecked((c) => (c.includes(item) ? c.filter((i) => i !== item) : [...c, item]));

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="font-type text-amber">After it goes wrong</p>
        <h1 className="font-type text-4xl text-paper">File a dispute</h1>
        <p className="text-muted">Hunch finds the payment, builds your case and files it with PayPal. You review every word before it goes out.</p>
      </div>

      <Steps current={step} />

      {step === 1 && (
        <div className="space-y-4">
          <p className="font-type text-paper text-xl">Which payment went wrong?</p>
          {!transactions && <p className="font-type text-muted animate-pulse">Pulling your recent payments...</p>}
          {noList && <p className="text-muted">No recent payments showed up from PayPal yet. Enter the payment yourself and Hunch takes it from there.</p>}
          {transactions?.map((t) => (
            <button
              key={t.id}
              onClick={() => setPicked(t)}
              className={`card w-full text-left flex items-start justify-between gap-4 hover:border-amber! ${picked?.id === t.id ? "border-amber! ring-1 ring-amber" : ""}`}
            >
              <div className="space-y-1 min-w-0">
                <p className="font-semibold text-paper">{t.counterparty}</p>
                <p className="text-muted text-sm truncate">{[t.date && day(t.date), t.email].filter(Boolean).join(" · ")}</p>
                {t.note && <p className="text-muted text-sm italic">&ldquo;{t.note}&rdquo;</p>}
              </div>
              <p className="font-type text-2xl text-paper shrink-0">{money(t.amount, t.currency)}</p>
            </button>
          ))}
          {transactions?.length > 0 && <button className="btn" disabled={!picked} onClick={() => setStep(2)}>Continue</button>}
          {transactions?.length > 0 && (
            <button onClick={() => setManual(!manual)} className="block text-sm text-muted hover:text-amber pt-2">
              Don&apos;t see it? Enter it yourself {manual ? "▴" : "▾"}
            </button>
          )}
          {(manual || noList) && <ManualEntry onSubmit={usePayment} />}
        </div>
      )}

      {step === 2 && (
        <form onSubmit={build} className="space-y-4">
          <p className="font-type text-paper text-xl">Tell us what happened in your own words.</p>
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
                  <button key={s} type="button" onClick={() => setStory(s)} className="text-sm text-muted border border-line rounded-full px-3 py-1 text-left hover:text-amber hover:border-amber">
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <button className="btn" disabled={!story.trim()}>Build my case</button>
                <button type="button" onClick={() => setStep(1)} className="text-muted text-sm hover:text-amber">Back</button>
              </div>
            </div>
          )}
        </form>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="card space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-type text-muted text-sm">Dispute category</p>
                <p className="font-type text-2xl text-paper">{built.reasonLabel}</p>
                <p className="text-muted text-sm">Claiming {money(built.amount, picked.currency)} from {picked.counterparty}</p>
              </div>
              <span className={`stamp ${strengthColor[built.strength]}`}>{built.strength} case</span>
            </div>
            <p className="text-muted text-sm border-t border-line pt-3">{built.strengthWhy}</p>
          </div>

          <div className="card space-y-3">
            <p className="font-type text-amber">Your statement to PayPal</p>
            <p className="font-semibold text-paper">{built.title}</p>
            <textarea className="input h-48 leading-relaxed" value={description} onChange={(e) => setDescription(e.target.value)} />
            <p className="text-muted text-sm">Edit anything that isn&apos;t exactly right. This is what PayPal reads.</p>
          </div>

          <div className="card space-y-3">
            <div className="flex justify-between gap-4">
              <p className="font-type text-amber">Evidence to gather</p>
              <p className="font-type text-muted text-sm">{checked.length}/{built.evidence.length} ready</p>
            </div>
            {built.evidence.map((ev) => (
              <label key={ev.item} className="flex gap-3 border-t border-line pt-3 cursor-pointer">
                <input type="checkbox" checked={checked.includes(ev.item)} onChange={() => toggle(ev.item)} className="mt-1 accent-amber w-4 h-4 shrink-0" />
                <span>
                  <span className={`block font-semibold ${checked.includes(ev.item) ? "text-muted line-through" : ""}`}>{ev.item}</span>
                  <span className="block text-muted text-sm">{ev.why}</span>
                </span>
              </label>
            ))}
          </div>

          {built.tips.length > 0 && (
            <div className="card space-y-2">
              <p className="font-type text-amber">Detective&apos;s tips</p>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                {built.tips.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          )}

          {loading === "file" ? (
            <Checklist steps={fileSteps} />
          ) : (
            <div className="flex items-center gap-4">
              <button className="btn" disabled={!description.trim()} onClick={file}>File dispute with PayPal</button>
              <button onClick={() => setStep(2)} className="text-muted text-sm hover:text-amber">Back</button>
            </div>
          )}
        </div>
      )}

      {step === 4 && status && <Tracker c={status} currency={picked.currency} onResolve={resolve} busy={loading === "resolve"} />}

      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}
