import { paypal } from "@/lib/paypal";

function stamp(date) {
  return date.toISOString().slice(0, 19) + "-0000";
}

export async function GET() {
  const end = new Date();
  const start = new Date(end - 30 * 24 * 60 * 60 * 1000);
  const data = await paypal(`/v1/reporting/transactions?start_date=${stamp(start)}&end_date=${stamp(end)}&fields=all&page_size=50`);
  const transactions = (data.transaction_details || [])
    .filter((t) => Number(t.transaction_info.transaction_amount.value) < 0 && t.payer_info?.email_address)
    .map((t) => ({
      id: t.transaction_info.transaction_id,
      date: t.transaction_info.transaction_initiation_date.slice(0, 10),
      amount: t.transaction_info.transaction_amount.value.replace("-", ""),
      currency: t.transaction_info.transaction_amount.currency_code,
      counterparty: t.payer_info?.payer_name?.alternate_full_name || t.payer_info?.email_address,
      email: t.payer_info?.email_address,
      note: t.transaction_info.transaction_note || t.transaction_info.transaction_subject || "",
    }));
  return Response.json({ transactions });
}
