import { paypal } from "@/lib/paypal";

export async function POST(request) {
  const { transactionId, reason, amount, description } = await request.json();
  const extensions = { merchant_contacted: true, merchant_contacted_outcome: "NO_RESPONSE" };
  if (reason.startsWith("MERCHANDISE")) extensions.merchandize_dispute_properties = { issue_type: "PRODUCT" };

  const res = await paypal("/v1/customer/disputes", {
    method: "POST",
    body: {
      disputed_transactions: [{ buyer_transaction_id: transactionId }],
      reason,
      dispute_amount: { currency_code: "USD", value: amount },
      extensions,
      evidences: [{ evidence_type: "OTHER", notes: description }],
    },
  });
  const disputeId = res.links?.find((l) => l.rel === "self")?.href.split("/").pop();
  if (!disputeId) return Response.json({ error: res.message || res.error_description || "PayPal didn't accept the dispute", details: res.details }, { status: 400 });
  return Response.json({ disputeId });
}
