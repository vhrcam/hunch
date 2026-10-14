import { askJSON } from "@/lib/ai";
import { result } from "../../dispute/outcome";

const closings = {
  won: "Case closed in your favor",
  lost: "Case closed in the seller's favor",
  withdrawn: "You withdrew the dispute",
  closed: "PayPal closed the case",
};

const coachSchema = {
  type: "object",
  properties: {
    coach: {
      type: "array",
      items: {
        type: "object",
        properties: { text: { type: "string" }, urgent: { type: "boolean" } },
        required: ["text", "urgent"],
      },
    },
  },
  required: ["coach"],
};

function day(date) {
  return date && new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export async function caseStatus(d) {
  const outcome = d.dispute_outcome?.outcome_code || null;
  const dueDate = d.buyer_response_due_date || d.seller_response_due_date || null;
  const timeline = [{ date: d.create_time, event: "Dispute filed with PayPal" }];
  for (const m of d.messages || []) timeline.push({ date: m.time_posted, event: `${m.posted_by === "BUYER" ? "You" : "Seller"}: ${m.content}` });
  if (d.seller_response_due_date) timeline.push({ date: d.seller_response_due_date, event: "Seller's deadline to respond" });
  for (const a of d.adjudications || []) timeline.push({ date: a.adjudication_time, event: `PayPal reviewed the case (${a.type.toLowerCase().replaceAll("_", " ")})` });
  if (outcome) timeline.push({ date: d.update_time, event: closings[result(outcome)] });
  timeline.sort((a, b) => new Date(a.date) - new Date(b.date));

  const { coach } = await askJSON(
    `You coach a PayPal buyer through their dispute. Give 2-3 short, specific next steps for right now. Mark a step urgent only if it has a deadline or the case could be lost without it.

Dispute status: ${d.status}
Stage: ${d.dispute_life_cycle_stage}
Reason: ${d.reason}
Amount: ${d.dispute_amount?.value} ${d.dispute_amount?.currency_code}
Buyer's deadline: ${day(d.buyer_response_due_date) || "none"}
Seller's deadline: ${day(d.seller_response_due_date) || "none"}
Outcome: ${outcome || "not decided yet"}

What the statuses mean:
- OPEN or WAITING_FOR_SELLER_RESPONSE: it's the seller's turn. The buyer should keep evidence ready and not accept a partial refund they don't want. If the seller doesn't fix it, the buyer can escalate to a claim within 20 days of opening.
- WAITING_FOR_BUYER_RESPONSE: PayPal or the seller needs something from the buyer. This is urgent; missing the deadline can close the case.
- UNDER_REVIEW: PayPal is reviewing the case. The buyer doesn't need to do anything unless PayPal asks, but should answer any request quickly.
- RESOLVED: the case is closed. If the buyer won, say the refund goes back to their PayPal balance or original payment method, and give one tip for avoiding this next time (for example, never pay strangers with Friends and Family). If they lost, explain the appeal option calmly.`,
    { schema: coachSchema }
  );

  return {
    disputeId: d.dispute_id,
    status: d.status,
    stage: d.dispute_life_cycle_stage,
    outcome,
    since: d.update_time,
    amount: d.dispute_amount?.value,
    refunded: d.dispute_outcome?.amount_refunded?.value || null,
    dueDate,
    timeline: timeline.map((t) => ({ ...t, date: day(t.date) })),
    coach,
  };
}
