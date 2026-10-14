"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AskDetective from "../AskDetective";
import Checklist from "../dispute/Checklist";
import Tracker, { StatusPill } from "../dispute/Tracker";
import { money } from "../dispute/format";

const filedOn = (date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const loadSteps = ["Pulling the case from PayPal", "Reading the timeline", "Working out your next move"];

const offline = "That didn't go through. Try again in a moment.";

async function api(path, body) {
  const res = await fetch(`/api/dispute/${path}`, body ? { method: "POST", body: JSON.stringify(body) } : {});
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || offline);
  return data;
}

function Row({ c, onOpen }) {
  return (
    <button onClick={() => onOpen(c)} className="card w-full text-left grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 transition-colors hover:border-line-strong!">
      <p className="font-medium text-paper truncate">{c.seller}</p>
      <p className="font-mono text-lg text-paper text-right">{money(c.amount, c.currency)}</p>
      <p className="text-muted text-sm col-span-2 sm:col-span-1">{c.reason} · Filed {filedOn(c.filed)}</p>
      <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 sm:justify-self-end">
        <StatusPill status={c.status} outcome={c.outcome} since={c.since} />
      </div>
    </button>
  );
}

export default function Cases() {
  const [cases, setCases] = useState(null);
  const [open, setOpen] = useState(null);
  const [status, setStatus] = useState(null);
  const [asked, setAsked] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("cases").then((d) => setCases(d.cases)).catch(() => setCases([]));
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

  const view = (c) => {
    setOpen(c);
    setStatus(null);
    setAsked(false);
    run("load", async () => setStatus(await api(`status?id=${c.id}`)));
  };

  const back = () => {
    setOpen(null);
    setError("");
  };

  const resolve = () => run("resolve", async () => {
    setStatus(await api("resolve", { disputeId: open.id }));
    setAsked(true);
  });

  const refresh = () => run("refresh", async () => setStatus(await api(`status?id=${open.id}`)));

  const active = cases?.filter((c) => c.status !== "RESOLVED") || [];
  const closed = cases?.filter((c) => c.status === "RESOLVED") || [];

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <p className="label">Your disputes</p>
        <h1 className="headline text-4xl sm:text-5xl">Your cases</h1>
        <p className="text-muted text-lg max-w-2xl">Every dispute on your PayPal account, pulled live. Pick one to see where it stands and what to do next.</p>
      </div>

      {open ? (
        <div className="space-y-4">
          <button onClick={back} className="text-sm text-muted transition-colors hover:text-paper">← All cases</button>
          <p className="text-muted text-sm">
            {open.seller} · {open.reason} · Filed {filedOn(open.filed)}
          </p>
          {loading === "load" && <Checklist steps={loadSteps} />}
          {status && (
            <Tracker c={status} currency={open.currency} asked={asked} onResolve={resolve} onRefresh={refresh} busy={loading}>
              <AskDetective
                kind="dispute"
                context={{ case: { seller: open.seller, reason: open.reason, filed: open.filed }, status }}
                suggestions={["What happens next?", "What if the seller doesn't respond?", "When will I get my money back?"]}
              />
            </Tracker>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {!cases && <p className="text-muted text-sm animate-pulse">Pulling your cases from PayPal...</p>}

          {cases?.length === 0 && (
            <div className="card space-y-4">
              <p className="text-paper font-medium">No disputes yet.</p>
              <p className="text-muted text-sm">If a purchase went wrong, Hunch can build and file your case.</p>
              <Link href="/dispute" className="btn inline-block">File a dispute</Link>
            </div>
          )}

          {active.length > 0 && (
            <section className="space-y-3">
              <p className="label">Open · {active.length}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{active.map((c) => <Row key={c.id} c={c} onOpen={view} />)}</div>
            </section>
          )}

          {closed.length > 0 && (
            <section className="space-y-3">
              <p className="label">Closed · {closed.length}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{closed.map((c) => <Row key={c.id} c={c} onOpen={view} />)}</div>
            </section>
          )}
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}
