import { paypal } from "@/lib/paypal";
import { caseStatus } from "../case";

export async function POST(request) {
  const { disputeId } = await request.json();
  const path = `/v1/customer/disputes/${disputeId}`;
  const seller = await paypal(path, { seller: true });
  const can = (rel) => seller.links?.some((l) => l.rel === rel);

  if (can("adjudicate")) {
    await paypal(`${path}/adjudicate`, { method: "POST", seller: true, body: { adjudication_outcome: "BUYER_FAVOR" } });
  } else if (can("accept_claim")) {
    await paypal(`${path}/accept-claim`, { method: "POST", seller: true, body: { note: "Refunding the buyer in full.", accept_claim_type: "REFUND" } });
  } else if (can("escalate")) {
    await paypal(`${path}/escalate`, { method: "POST", seller: true, body: { note: "Escalating to a claim for PayPal review." } });
  }

  const d = await paypal(path);
  if (!d.dispute_id) return Response.json({ error: "PayPal couldn't find that case." }, { status: 404 });
  return Response.json(await caseStatus(d));
}
