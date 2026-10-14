import Seal from "../Seal";
import { money } from "./format";
import { result } from "./outcome";

const looks = {
  won: { level: "safe", label: "Case closed", border: "border-safe/50!", tone: "text-safe!", body: "PayPal ruled in your favor. The money goes back to your account." },
  lost: { level: "danger", label: "Refund denied", border: "border-danger/50!", tone: "text-danger!", headline: "PayPal sided with the seller", body: "You may still be able to appeal. Check the next steps for how." },
  withdrawn: { level: "neutral", label: "Withdrawn", border: "", tone: "", headline: "You closed this case", body: "The dispute was withdrawn, so PayPal didn't issue a refund." },
  closed: { level: "neutral", label: "Case closed", border: "", tone: "", headline: "This case is closed", body: "PayPal has closed the case. Check the timeline for what happened." },
};

export default function CaseClosed({ c, currency }) {
  const kind = result(c.outcome);
  const look = looks[kind];

  return (
    <div className={`card text-center py-14! flex flex-col items-center gap-5 ${look.border}`}>
      <Seal level={look.level} ring="HUNCH CASE CLOSED" label={look.label} size={156} />
      <p className={`headline text-3xl sm:text-4xl ${look.tone}`}>
        {kind === "won" ? `${money(c.refunded || c.amount, currency)} refunded` : look.headline}
      </p>
      <p className="text-muted max-w-sm">{look.body}</p>
      <p className="label pt-2">Case {c.disputeId}</p>
    </div>
  );
}
