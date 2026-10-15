import { paypal } from "@/lib/paypal";

const month = 30 * 24 * 60 * 60 * 1000;

function stamp(date) {
  return date.toISOString().slice(0, 19) + "-0000";
}

// Transaction Search allows 31 days per request, so ask for the last 3 months one at a time.
function search(monthsAgo) {
  const end = new Date(Date.now() - monthsAgo * month);
  const start = new Date(end - month);
  return paypal(`/v1/reporting/transactions?start_date=${stamp(start)}&end_date=${stamp(end)}&fields=all&page_size=50`);
}

export async function GET() {
  const [disputes, ...months] = await Promise.all([paypal("/v1/customer/disputes?page_size=50"), search(0), search(1), search(2)]);
  const disputed = new Set((disputes.items || []).flatMap((d) => d.disputed_transactions?.map((t) => t.buyer_transaction_id) || []));
  const transactions = months
    .flatMap((m) => m.transaction_details || [])
    .filter((t) => Number(t.transaction_info.transaction_amount.value) < 0 && t.payer_info?.email_address)
    .map((t) => ({
      id: t.transaction_info.transaction_id,
      date: t.transaction_info.transaction_initiation_date.slice(0, 10),
      amount: t.transaction_info.transaction_amount.value.replace("-", ""),
      currency: t.transaction_info.transaction_amount.currency_code,
      counterparty: t.payer_info?.payer_name?.alternate_full_name || t.payer_info?.email_address,
      email: t.payer_info?.email_address,
      note: t.transaction_info.transaction_note || t.transaction_info.transaction_subject || "",
      disputed: disputed.has(t.transaction_info.transaction_id),
    }))
    .sort((a, b) => a.disputed - b.disputed || b.date.localeCompare(a.date));
  return Response.json({ transactions });
}
