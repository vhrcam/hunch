import { findLink, domainAge, readPage, patterns } from "./checks";

const prompt = (input, link, page, clues) => `You are Hunch, a scam detective helping someone decide whether to pay a seller with PayPal.
Use Google Search to check this seller. Look for: a real registered business or real presence (reviews, social accounts, news, business listings), scam reports or complaints, and the typical market price of the item.

What the user pasted:
"""${input}"""

Link: ${link?.url || "none"}
${page ? `Page title: ${page.title}\nPage text: ${page.text.slice(0, 2500)}` : "The page could not be loaded."}

Clues found so far:
${clues.map((c) => `- ${c.label}: ${c.detail}`).join("\n")}

Reply with JSON in this shape:
{
  "business": "found" | "not_found" | "unknown",
  "businessNote": "one sentence on what you found about the business or seller",
  "scamReports": true | false,
  "scamNote": "one sentence, or empty",
  "item": "the item for sale, or empty",
  "askingPrice": number or null,
  "marketPrice": number or null,
  "verdict": "2-3 plain sentences to the buyer. Be direct, like a detective. Name the strongest clues. Say plainly if something important couldn't be checked. End with a clear call: pay, be careful, or don't pay."
}`;

export async function POST(request) {
  const { input } = await request.json();
  const link = findLink(input);
  const clues = [];
  const unchecked = [];
  let page = null;

  if (link?.handle) {
    clues.push({ label: "PayPal.me link", detail: `Paying @${link.handle} directly. PayPal doesn't publish account age, so we judged the deal itself.`, impact: 0 });
    unchecked.push("PayPal account age");
  } else if (link?.platform) {
    clues.push({ label: "Marketplace listing", detail: `Hosted on ${link.domain}, so the site's age says nothing about this seller.`, impact: 0 });
    unchecked.push("Seller account age");
  } else if (link) {
    const [age, p] = await Promise.all([domainAge(link.domain), readPage(link.url)]);
    page = p;
    if (age === null) {
      unchecked.push("Domain age");
    } else {
      const years = (age / 365).toFixed(1);
      const impact = age < 30 ? -30 : age < 180 ? -15 : age > 730 ? 10 : 0;
      clues.push({ label: "Domain age", detail: age < 365 ? `${link.domain} was registered ${age} days ago.` : `${link.domain} has been around ${years} years.`, impact });
    }
    if (page?.blocked) {
      page = null;
      unchecked.push("Website contents (the site blocks automated visits)");
    } else if (!page) {
      clues.push({ label: "Website", detail: "The site wouldn't load.", impact: -10 });
    } else {
      if (!page.https) clues.push({ label: "No HTTPS", detail: "The site doesn't use a secure connection.", impact: -10 });
      const contact = [page.email && "email", page.phone && "phone", page.address && "street address"].filter(Boolean);
      clues.push(contact.length
        ? { label: "Contact info", detail: `The site lists a ${contact.join(", ")}.`, impact: 5 }
        : { label: "No contact info", detail: "No email, phone or address on the page.", impact: -5 });
      if (page.socials.length) clues.push({ label: "Social links", detail: `Links to ${page.socials.join(", ")}.`, impact: 5 });
    }
  } else {
    unchecked.push("Website and domain age (no link pasted)");
  }

  const found = patterns(input);
  if (found.pressure.length) clues.push({ label: "Pressure tactics", detail: `They're rushing you: "${found.pressure.join('", "')}".`, impact: -15 });
  if (found.payFlags.length) clues.push({ label: "Risky payment ask", detail: `They want "${found.payFlags.join('", "')}", which leaves you little or no buyer protection.`, impact: -25 });

  let verdict = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      const { askJSON } = await import("@/lib/ai");
      const ai = await askJSON(prompt(input, link, page, clues), { search: true });
      if (ai.business === "found") clues.push({ label: "Real presence", detail: ai.businessNote, impact: 10 });
      if (ai.business === "not_found") clues.push({ label: "No web presence", detail: ai.businessNote, impact: -15 });
      if (ai.business === "unknown") unchecked.push("Business registration");
      if (ai.scamReports) clues.push({ label: "Scam reports", detail: ai.scamNote, impact: -25 });
      if (ai.askingPrice && ai.marketPrice) {
        const ratio = ai.askingPrice / ai.marketPrice;
        clues.push({ label: "Price check", detail: `$${ai.askingPrice} for ${ai.item || "this"}, which usually sells for about $${ai.marketPrice}.`, impact: ratio < 0.5 ? -25 : ratio < 0.75 ? -10 : 0 });
      }
      verdict = ai.verdict;
    } catch {
      unchecked.push("AI web search (try again in a minute)");
    }
  } else {
    unchecked.push("AI web search (no Gemini key yet)", "Business registration", "Market price");
  }

  const score = Math.max(0, Math.min(100, 60 + clues.reduce((sum, c) => sum + c.impact, 0)));
  const level = score >= 70 ? "safe" : score >= 40 ? "caution" : "danger";
  if (!verdict && !clues.length) verdict = "Not enough to go on. Paste the seller's link or the message they sent you.";
  if (!verdict) {
    const worst = clues.filter((c) => c.impact < 0).sort((a, b) => a.impact - b.impact).slice(0, 2).map((c) => c.detail);
    verdict = [...worst, level === "danger" ? "Don't pay." : level === "caution" ? "Be careful." : "Nothing alarming turned up."].join(" ");
  }

  return Response.json({ score, level, verdict, clues, unchecked, link });
}
