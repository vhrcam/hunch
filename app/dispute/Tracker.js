import Detective from "../Detective";
import CaseClosed from "./CaseClosed";
import { result } from "./outcome";
import { money, day } from "./format";

export const statuses = {
  OPEN: "Case open",
  WAITING_FOR_SELLER_RESPONSE: "Waiting on seller",
  WAITING_FOR_BUYER_RESPONSE: "Your move",
  UNDER_REVIEW: "Under review",
  RESOLVED: "Case closed",
};
const stages = { INQUIRY: "Inquiry stage", CHARGEBACK: "Claim stage" };
const deadlines = { WAITING_FOR_SELLER_RESPONSE: "Seller must respond by", WAITING_FOR_BUYER_RESPONSE: "You must respond by" };

function ago(date) {
  const m = Math.max(1, Math.round((Date.now() - new Date(date)) / 60000));
  return m < 60 ? `${m}m` : m < 1440 ? `${Math.round(m / 60)}h` : `${Math.round(m / 1440)}d`;
}

export function StatusPill({ status, outcome, since }) {
  const kind = result(outcome);
  const won = kind === "won";
  const lost = kind === "lost";
  const yourMove = status === "WAITING_FOR_BUYER_RESPONSE";
  const label = won ? "Won" : lost ? "Refund denied" : kind === "withdrawn" ? "Withdrawn" : kind ? "Closed" : statuses[status] || status;
  const tone = won ? "text-safe" : lost ? "text-danger" : kind ? "text-muted" : yourMove ? "text-amber" : "text-text";
  const dot = won ? "bg-safe" : lost ? "bg-danger" : kind ? "bg-muted" : yourMove ? "bg-amber animate-pulse" : "bg-paper animate-pulse";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-line-strong bg-raised px-3 py-1 text-xs whitespace-nowrap ${tone}`}>
      <span className={`size-1.5 rounded-full ${dot}`} />
      {label}
      {since && !outcome && <span className="font-mono text-faint">· {ago(since)}</span>}
    </span>
  );
}

function Progress({ c, yourMove }) {
  const at = c.status === "RESOLVED" ? 3 : c.status === "UNDER_REVIEW" ? 2 : 1;
  const steps = ["Filed", yourMove ? "Your turn" : "Seller's turn", "PayPal review", "Closed"];
  const now = yourMove ? { dot: "border-amber ring-amber/15", text: "text-amber" } : { dot: "border-paper ring-paper/15", text: "text-paper" };

  return (
    <ol className="flex pt-2">
      {steps.map((step, i) => (
        <li key={step} className="flex-1 last:flex-none">
          <div className="flex items-center">
            <span
              className={`size-3 shrink-0 rounded-full border-2 ${
                i < at ? "bg-paper border-paper" : i === at ? `bg-ink ring-4 ${now.dot}` : "bg-ink border-line-strong"
              }`}
            />
            {i < steps.length - 1 && <span className={`h-0.5 flex-1 ${i < at ? "bg-paper" : "bg-line"}`} />}
          </div>
          <p className={`mt-2.5 pr-2 font-mono text-[0.68rem] uppercase tracking-wider ${i < at ? "text-muted" : i === at ? now.text : "text-faint"}`}>{step}</p>
        </li>
      ))}
    </ol>
  );
}

export default function Tracker({ c, currency, asked, onResolve, onRefresh, busy, children }) {
  const yourMove = c.status === "WAITING_FOR_BUYER_RESPONSE";

  return (
    <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-4 items-start">
      <div className="space-y-4">
        {c.outcome ? (
          <CaseClosed c={c} currency={currency} />
        ) : (
          <div className="card space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="label">Case {c.disputeId}</p>
                <p className="headline text-5xl">{money(c.amount, currency)}</p>
                <p className="text-muted text-sm">{stages[c.stage] || c.stage}</p>
              </div>
              <StatusPill status={c.status} outcome={c.outcome} since={c.since} />
            </div>
            <Progress c={c} yourMove={yourMove} />
            {c.dueDate && !c.outcome && (
              <p className="text-muted text-sm border-t border-line pt-4">
                {deadlines[c.status] || "Next deadline:"} <span className={yourMove ? "text-amber" : "text-paper"}>{day(c.dueDate)}</span>
              </p>
            )}
          </div>
        )}

        {c.coach.length > 0 && (
          <div className="card space-y-4">
            <p className="label">What to do next</p>
            {c.coach.map((tip, i) => (
              <div key={tip.text} className="flex gap-4 border-t border-line pt-4">
                <span className="font-mono text-xs text-faint pt-1 w-5 shrink-0">0{i + 1}</span>
                <div className="space-y-1">
                  {tip.urgent && <p className="label text-amber!">Urgent</p>}
                  <p className={tip.urgent ? "text-paper" : "text-text"}>{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card space-y-5">
          <p className="label">Timeline</p>
          <ol className="border-l border-line ml-1 space-y-5">
            {c.timeline.map((t) => (
              <li key={t.date + t.event} className="relative pl-6">
                <span className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-muted ring-4 ring-panel" />
                <p className="font-mono text-xs text-faint">{day(t.date)}</p>
                <p className="text-sm mt-0.5">{t.event}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-20">
        {!c.outcome && !asked && (
          <div className="border border-dashed border-line-strong rounded-[10px] p-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-faint text-sm">Sandbox only: PayPal takes days to rule on a real case.</p>
            <button onClick={onResolve} disabled={busy} className="btn-ghost text-sm! py-1.5! disabled:opacity-40">
              {busy === "resolve" ? "Waiting on PayPal..." : "Demo: simulate PayPal's decision"}
            </button>
          </div>
        )}

        {!c.outcome && asked && (
          <div className="card flex flex-wrap items-center gap-4">
            <Detective size={56} searching className="text-paper shrink-0" />
            <div className="flex-1 min-w-48">
              <p className="text-paper font-medium animate-pulse">PayPal is reviewing...</p>
              <p className="text-muted text-sm">The sandbox takes a few minutes between steps. Check back for the ruling.</p>
            </div>
            <button onClick={onRefresh} disabled={busy} className="btn-ghost text-sm! py-1.5! disabled:opacity-40">
              {busy === "refresh" ? "Checking..." : "Refresh"}
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
