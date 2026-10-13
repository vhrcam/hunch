import { paypal } from "@/lib/paypal";
import { caseStatus } from "../case";

export async function GET(request) {
  const id = new URL(request.url).searchParams.get("id");
  const d = await paypal(`/v1/customer/disputes/${id}`);
  if (!d.dispute_id) return Response.json({ error: "PayPal couldn't find that case." }, { status: 404 });
  return Response.json(await caseStatus(d));
}
