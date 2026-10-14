import { paypal } from "@/lib/paypal";
import { reasons } from "../reasons";

export async function GET() {
  const { items = [] } = await paypal("/v1/customer/disputes?page_size=20");
  const cases = await Promise.all(
    items.map(async (d) => {
      const full = await paypal(`/v1/customer/disputes/${d.dispute_id}`);
      const seller = full.disputed_transactions?.[0]?.seller;
      return {
        id: d.dispute_id,
        filed: d.create_time,
        status: d.status,
        since: d.update_time,
        outcome: full.dispute_outcome?.outcome_code || null,
        amount: d.dispute_amount.value,
        currency: d.dispute_amount.currency_code,
        reason: reasons[d.reason] || "Dispute",
        seller: seller?.name || seller?.email || "Unknown seller",
        dueDate: full.buyer_response_due_date || full.seller_response_due_date || null,
      };
    })
  );
  return Response.json({ cases });
}
