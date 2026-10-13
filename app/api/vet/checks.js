const platforms = ["facebook.com", "instagram.com", "ebay.com", "craigslist.org", "offerup.com", "etsy.com", "mercari.com", "poshmark.com", "tiktok.com", "x.com", "twitter.com", "reddit.com"];

const socialNames = { facebook: "Facebook", instagram: "Instagram", twitter: "X", tiktok: "TikTok", linkedin: "LinkedIn", youtube: "YouTube" };

const pressure = /act (now|fast)|today only|only \d+ left|last one|hurry|before it'?s gone|first come|deposit to hold|other buyers|limited time|urgent/gi;
const payFlags = /friends (and|&) family|gift ?cards?|bitcoin|crypto|zelle|wire transfer|cash ?app|western union|no refunds?/gi;

export function findLink(text) {
  const m = text.match(/https?:\/\/[^\s"'<>]+|(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s"'<>]*)?/i);
  if (!m) return null;
  const url = new URL(m[0].startsWith("http") ? m[0] : `https://${m[0]}`);
  const host = url.hostname.replace(/^www\./, "");
  const parts = host.split(".");
  const domain = parts.length > 2 && parts.at(-1).length === 2 && parts.at(-2).length <= 3 ? parts.slice(-3).join(".") : parts.slice(-2).join(".");
  const handle = host === "paypal.me" ? url.pathname.split("/")[1] : url.pathname.match(/^\/paypalme\/([^/]+)/)?.[1];
  return { url: url.href, domain, handle, platform: platforms.includes(domain) };
}

export async function domainAge(domain) {
  try {
    const res = await fetch(`https://rdap.org/domain/${domain}`, { signal: AbortSignal.timeout(8000), headers: { "user-agent": "Hunch/1.0" } });
    const data = await res.json();
    const reg = data.events?.find((e) => e.eventAction === "registration")?.eventDate;
    return reg ? Math.floor((Date.now() - new Date(reg)) / 86400000) : null;
  } catch {
    return null;
  }
}

export async function readPage(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { "user-agent": "Mozilla/5.0 Hunch" } });
    const html = await res.text();
    if (/just a moment|attention required|access denied/i.test(html.slice(0, 2000))) return { blocked: true };
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return {
      https: res.url.startsWith("https"),
      title: html.match(/<title[^>]*>([^<]*)/i)?.[1]?.trim() || "",
      text: text.slice(0, 4000),
      email: /[\w.+-]+@[\w-]+\.[\w.]+/.test(text),
      phone: /\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.test(text),
      address: /\d+ [\w ]+ (st|street|ave|avenue|rd|road|blvd|dr|drive|ln|lane|suite)\b/i.test(text),
      socials: [...new Set((html.match(/(facebook|instagram|twitter|tiktok|linkedin|youtube)\.com\/[\w.-]+/gi) || []).map((s) => socialNames[s.split(".")[0].toLowerCase()]))],
    };
  } catch {
    return null;
  }
}

export function patterns(text) {
  return {
    pressure: [...new Set((text.match(pressure) || []).map((s) => s.toLowerCase()))],
    payFlags: [...new Set((text.match(payFlags) || []).map((s) => s.toLowerCase()))],
  };
}
