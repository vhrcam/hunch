const base = "https://api-m.sandbox.paypal.com";

export async function paypalToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  return (await res.json()).access_token;
}

export async function paypal(path, { method = "GET", body, headers = {} } = {}) {
  const token = await paypalToken();
  const res = await fetch(base + path, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...headers },
    body: body && JSON.stringify(body),
  });
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
