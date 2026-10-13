import { paypal } from "@/lib/paypal";
import { caseStatus } from "../case";

export async function GET(request) {
  const id = new URL(request.url).searchParams.get("id");
  return Response.json(await caseStatus(await paypal(`/v1/customer/disputes/${id}`)));
}
