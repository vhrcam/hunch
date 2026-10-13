import Detective from "../Detective";
import { money, day } from "./format";

const statuses = {
  OPEN: "Case open",
  WAITING_FOR_SELLER_RESPONSE: "Waiting on seller",
  WAITING_FOR_BUYER_RESPONSE: "Your move",
  UNDER_REVIEW: "Under review",
  RESOLVED: "Case closed",
};
const stages = { INQUIRY: "Inquiry stage", CHARGEBACK: "Claim stage" };
const deadlines = { WAITING_FOR_SELLER_RESPONSE: "Seller must respond by", WAITING_FOR_BUYER_RESPONSE: "You must respond by" };

export default function Tracker({ c, currency, asked, onResolve, onRefresh, busy }) {
  const won = ["RESOLVED_BUYER_FAVOUR", "ACCEPTED"].includes(c.outcome);
  const lost = ["RESOLVED_SELLER_FAVOUR", "DENIED"].includes(c.outcome);
  const yourMove = c.status === "WAITING_FOR_BUYER_RESPONSE";

  return (
    <div className="space-y-4">
      {won ? (
        <div className="card border-safe! text-center py-14! flex flex-col items-center gap-6">
          <Detective size={96} className="text-paper" />
          <p className="label">Case {c.disputeId}</p>
          <div className="stamp text-safe px-6 py-4 leading-tight space-y-2 transition duration-700 ease-out starting:scale-150 starting:opacity-0">
            <p className="text-xl sm:text-3xl">Case closed</p>
            <p className="text-2xl sm:text-4xl text-paper">{money(c.refunded || c.amount, currency)} refunded</p>
          </div>
          <p className="text-muted max-w-sm">PayPal ruled in your favor. The money goes back to your account.</p>
        </div>
      ) : (
        <div className="card space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="label">Case {c.disputeId}</p>
              <p className="headline text-5xl">{money(c.amount, currency)}</p>
              <p className="text-muted text-sm">{stages[c.stage] || c.stage}</p>
            </div>
            <span className={`stamp text-sm sm:text-base ${lost ? "text-danger" : yourMove ? "text-amber" : "text-muted"}`}>
              {lost ? "Seller won" : statuses[c.status] || c.status}
            </span>
          </div>
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
    </div>
  );
}
