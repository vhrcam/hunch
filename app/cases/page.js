"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AskDetective from "../AskDetective";
import Checklist from "../dispute/Checklist";
import Tracker, { StatusPill } from "../dispute/Tracker";
import { money } from "../dispute/format";
import { suggest } from "../dispute/outcome";

const filedOn = (date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const loadSteps = ["Pulling the case from PayPal", "Reading the timeline", "Working out your next move"];

const offline = "That didn't go through. Try again in a moment.";

async function api(path, body) {
  const res = await fetch(`/api/dispute/${path}`, body ? { method: "POST", body: JSON.stringify(body) } : {});
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || offline);
  return data;
}

function Row({ c, onOpen, onArchive }) {
  return (
    <div className="card relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 transition-colors hover:border-line-strong!">
      <button onClick={() => onOpen(c)} className="font-medium text-paper truncate text-left after:absolute after:inset-0">{c.seller}</button>
      <p className="font-mono text-lg text-paper text-right">{money(c.amount, c.currency)}</p>
      <p className="text-muted text-sm col-span-2 sm:col-span-1">{c.reason} · Filed {filedOn(c.filed)}</p>
      <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 flex items-center justify-between sm:justify-end gap-4">
        <StatusPill status={c.status} outcome={c.outcome} since={c.since} />
        <button onClick={() => onArchive(c)} className="relative z-10 text-xs text-muted transition-colors hover:text-paper">
          {c.archived ? "Unarchive" : "Archive"}
        </button>
      </div>
    </div>
  );
}

function Fold({ title, cases, onOpen, onArchive }) {
  if (!cases.length) return null;
  return (
    <details className="group space-y-3">
      <summary className="label cursor-pointer list-none transition-colors hover:text-paper">
        {title} · {cases.length} <span className="inline-block transition-transform group-open:rotate-90">›</span>
      </summary>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 opacity-60">{cases.map((c) => <Row key={c.id} c={c} onOpen={onOpen} onArchive={onArchive} />)}</div>
    </details>
  );
}

export default function Cases() {
  const [cases, setCases] = useState(null);
  const [open, setOpen] = useState(null);
  const [status, setStatus] = useState(null);
  const [asked, setAsked] = useState(false);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [moved, setMoved] = useState({});
  const [mine, setMine] = useState([]);

  useEffect(() => {
    api("cases").then((d) => setCases(d.cases)).catch(() => setCases([]));
    try {
      setMoved(JSON.parse(localStorage.getItem("hunch-archive")) || {});
      setMine(JSON.parse(localStorage.getItem("hunch-filed")) || []);
    } catch {}
  }, []);

  const archive = (c) => {
    const next = { ...moved, [c.id]: !c.archived };
    setMoved(next);
    try {
      localStorage.setItem("hunch-archive", JSON.stringify(next));
    } catch {}
  };

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

  const all = cases?.map((c) => ({ ...c, archived: moved[c.id] ?? c.archived })) || [];
  const current = all.filter((c) => !c.archived && mine.includes(c.id));
  const others = all.filter((c) => !c.archived && !mine.includes(c.id));
  const active = current.filter((c) => c.status !== "RESOLVED");
  const closed = current.filter((c) => c.status === "RESOLVED");
  const archived = all.filter((c) => c.archived);

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
                suggestions={suggest(status)}
              />
            </Tracker>
          )}
        </div>
      ) : (
        <div className="space-y-10">
          {!cases && <p className="text-muted text-sm animate-pulse">Pulling your cases from PayPal...</p>}

          {cases && current.length === 0 && (
            <div className="card space-y-4">
              <p className="text-paper font-medium">You haven&apos;t filed a dispute yet.</p>
              <p className="text-muted text-sm">If a purchase went wrong, Hunch can build and file your case.</p>
              <Link href="/dispute" className="btn inline-block">File a dispute</Link>
            </div>
          )}

          {active.length > 0 && (
            <section className="space-y-3">
              <p className="label">Open · {active.length}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{active.map((c) => <Row key={c.id} c={c} onOpen={view} onArchive={archive} />)}</div>
            </section>
          )}

          {closed.length > 0 && (
            <section className="space-y-3">
              <p className="label">Closed · {closed.length}</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">{closed.map((c) => <Row key={c.id} c={c} onOpen={view} onArchive={archive} />)}</div>
            </section>
          )}

          <Fold title="Other cases on this account" cases={others} onOpen={view} onArchive={archive} />
          <Fold title="Archived" cases={archived} onOpen={view} onArchive={archive} />
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}
