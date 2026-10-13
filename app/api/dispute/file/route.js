import { paypal } from "@/lib/paypal";

const friendly = {
  TRANSACTION_NOT_ELIGIBLE: "PayPal says this payment can't be disputed. Check the transaction ID, and that it was a goods-and-services payment without an open case.",
  INVALID_BUYER_TRANSACTION_ID: "PayPal couldn't find that transaction ID. Copy it again from the payment's details.",
  MISSING_OR_INVALID_REQUEST_BODY: "PayPal couldn't match that transaction to your account. Check the transaction ID.",
};

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
  if (!disputeId) {
    const issue = res.details?.[0]?.issue;
    return Response.json({ error: friendly[issue] || res.details?.[0]?.description || "PayPal didn't accept the dispute. Try again in a moment." }, { status: 400 });
  }
  return Response.json({ disputeId });
}
