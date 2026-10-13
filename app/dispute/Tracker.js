import { money, day } from "./format";

const statuses = {
  OPEN: "Case open",
  WAITING_FOR_SELLER_RESPONSE: "Waiting on seller",
  WAITING_FOR_BUYER_RESPONSE: "Your move",
  UNDER_REVIEW: "Under review",
  RESOLVED: "Case closed",
};
const stages = { INQUIRY: "Inquiry stage", CHARGEBACK: "Claim stage" };

export default function Tracker({ c, currency, onResolve, busy }) {
  const won = ["RESOLVED_BUYER_FAVOUR", "ACCEPTED"].includes(c.outcome);
  const lost = ["RESOLVED_SELLER_FAVOUR", "DENIED"].includes(c.outcome);

  return (
    <div className="space-y-6">
      {won ? (
        <div className="card border-safe! text-center py-12! space-y-8">
          <p className="font-type text-muted">Case #{c.disputeId}</p>
          <div className="stamp text-safe px-6 py-4 leading-tight space-y-2 transition duration-700 ease-out starting:scale-150 starting:opacity-0">
            <p className="text-2xl sm:text-4xl">Case closed</p>
            <p className="text-3xl sm:text-5xl text-paper">{money(c.amount, currency)} refunded</p>
          </div>
          <p className="text-muted">PayPal ruled in your favor. The money goes back to your account.</p>
        </div>
      ) : (
        <div className="card space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-type text-muted text-sm">Case #{c.disputeId}</p>
              <p className="font-type text-4xl text-paper">{money(c.amount, currency)}</p>
              <p className="text-muted text-sm">{stages[c.stage] || c.stage}</p>
            </div>
            <span className={`stamp text-lg sm:text-xl ${lost ? "text-danger" : "text-amber"}`}>
              {lost ? "Seller won" : statuses[c.status] || c.status}
            </span>
          </div>
          {c.dueDate && !c.outcome && <p className="text-paper">Next deadline: <span className="text-amber">{day(c.dueDate)}</span></p>}
        </div>
      )}

      {c.coach.length > 0 && (
        <div className="space-y-3">
          <p className="font-type text-amber">What to do next</p>
          {c.coach.map((tip) => (
            <div key={tip.text} className={`card ${tip.urgent ? "border-amber!" : ""}`}>
              {tip.urgent && <p className="font-type text-amber text-sm mb-1">Urgent</p>}
              <p>{tip.text}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card space-y-4">
        <p className="font-type text-amber">Timeline</p>
        <ol className="border-l border-line ml-1 space-y-5">
          {c.timeline.map((t) => (
            <li key={t.date + t.event} className="relative pl-6">
              <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber" />
              <p className="text-muted text-sm">{day(t.date)}</p>
              <p>{t.event}</p>
            </li>
          ))}
        </ol>
      </div>

      {!c.outcome && (
        <div className="border border-dashed border-line rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted text-sm">Sandbox only: PayPal takes days to rule on a real case.</p>
          <button onClick={onResolve} disabled={busy} className="text-sm text-amber border border-amber rounded-full px-4 py-1.5 disabled:opacity-50">
            {busy ? "Waiting on PayPal..." : "Demo: simulate PayPal's decision"}
          </button>
        </div>
      )}
    </div>
  );
}
