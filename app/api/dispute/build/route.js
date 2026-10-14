import { askJSON } from "@/lib/ai";
import { reasons } from "../reasons";

const schema = {
  type: "object",
  properties: {
    reason: { type: "string", enum: Object.keys(reasons) },
    title: { type: "string" },
    description: { type: "string" },
    evidence: {
      type: "array",
      items: {
        type: "object",
        properties: { item: { type: "string" }, why: { type: "string" } },
        required: ["item", "why"],
      },
    },
    tips: { type: "array", items: { type: "string" } },
    strength: { type: "string", enum: ["strong", "fair", "weak"] },
    strengthWhy: { type: "string" },
  },
  required: ["reason", "title", "description", "evidence", "tips", "strength", "strengthWhy"],
};

export async function POST(request) {
  const { transaction, story } = await request.json();
  const date = transaction.date
    ? new Date(`${transaction.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
    : "unknown";
  const amount = transaction.currency === "USD" ? `$${transaction.amount}` : `${transaction.amount} ${transaction.currency}`;

  const prompt = `You help a PayPal buyer file a dispute. Build their case from the payment and their story.

Payment:
- Paid to: ${[transaction.counterparty, transaction.email].filter(Boolean).join(", ") || "unknown"}
- Amount: ${amount}
- Date: ${date}
- Note on the payment: ${transaction.note || "none"}

What the buyer says happened:
"${story}"

Return:
- reason: the PayPal dispute reason that best fits.
- title: a short case title, like "PS5 paid for, never shipped".
- description: the dispute description PayPal will read, 80-150 words. First person from the buyer, calm and factual, with the timeline, the amount, what was promised, what happened, any contact attempts, and what the buyer wants (a full refund unless the story says otherwise). Don't invent facts the buyer didn't give. Write "[add date]" style placeholders where a detail is missing.
- evidence: 3-5 specific files the buyer can actually attach (screenshots, receipts, messages, photos), each with why it helps. Never list something missing as evidence.
- tips: 2-4 short next steps, like "Don't accept a partial refund unless you're happy with it" or "Answer seller messages within 10 days".
- strength: how strong the case is right now, and strengthWhy in one sentence.`;

  const c = await askJSON(prompt, { schema });
  return Response.json({ ...c, reasonLabel: reasons[c.reason], amount: transaction.amount });
}
