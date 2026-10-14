import Seal from "../Seal";
import { money } from "./format";

export default function CaseClosed({ c, currency, won }) {
  return (
    <div className={`card text-center py-14! flex flex-col items-center gap-5 ${won ? "border-safe/50!" : "border-danger/50!"}`}>
      <Seal level={won ? "safe" : "danger"} ring="HUNCH CASE CLOSED" label={won ? "Case closed" : "Seller won"} size={156} />
      <p className={`headline text-3xl sm:text-4xl ${won ? "text-safe!" : "text-danger!"}`}>
        {won ? `${money(c.refunded || c.amount, currency)} refunded` : "PayPal sided with the seller"}
      </p>
      <p className="text-muted max-w-sm">
        {won ? "PayPal ruled in your favor. The money goes back to your account." : "You can still appeal. Check the next steps for how."}
      </p>
      <p className="label pt-2">Case {c.disputeId}</p>
    </div>
  );
}
