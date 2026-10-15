# Hunch

**Your PayPal scam detective.** Check a seller before you pay, and if a purchase goes wrong, Hunch builds and files your PayPal dispute so you can get your money back.

Built for the PayPal AI Hackathon.

**Try it live: [hunch-b3dy.onrender.com](https://hunch-b3dy.onrender.com)**
(It runs on a free server that sleeps when idle, so the first load can take up to a minute.)

![Hunch home page](docs/screenshots/home.png)

## Two modes, one mission

### 🔍 Before you pay: Vet a seller
Paste a seller link, a PayPal.me link, or the payment request itself. Hunch investigates:

- **Domain age** from public RDAP records (a store that's 4 days old is a red flag)
- **The seller's page**: HTTPS, contact details, social links, business info
- **Scam patterns**: too-good-to-be-true prices, pressure tactics, and risky payment requests like Friends and Family, gift cards, or crypto
- **An AI read** on whether the business is known and what the item normally costs

You get a 0–100 trust score, a stamped verdict, and a plain-language explanation of every clue, plus a list of anything Hunch couldn't check.

![Vet Mode flagging a too-good-to-be-true PS5 deal](docs/screenshots/vet.png)

### 🛡️ After it goes wrong: File a dispute
Describe what happened in your own words. Hunch:

1. Finds the payment in your PayPal activity, or takes the transaction ID
2. Picks the right PayPal dispute category
3. Writes a calm, factual case description you can edit
4. Lists exactly what evidence to attach and why it helps
5. Files the dispute through PayPal's Disputes API
6. Tracks the case and coaches you on what to do next, until it's closed

| Your case, ready to file | Tracked until it's closed |
|---|---|
| ![Hunch's case for an item that never arrived](docs/screenshots/dispute-case.png) | ![A dispute closed in the buyer's favor with a $200 refund](docs/screenshots/dispute-tracker.png) |

## It's a tool, not an agent

Hunch investigates and drafts, but you make the call. Nothing is filed or sent without you pressing the button.

## How it works

| Piece | What it does |
|---|---|
| **Next.js** (App Router) + **Tailwind CSS** | The app and its API routes |
| **Google Gemini** | Scam verdicts, dispute case writing, and next-step coaching |
| **PayPal Disputes API** | Files disputes, reads case status, and tracks outcomes |
| **PayPal Transaction Search API** | Lists recent payments to dispute |
| **RDAP** | Looks up how long a website's domain has existed |

Everything runs against the **PayPal sandbox**, so no real money moves.

## Run it locally

You need Node.js 20+, a free [Gemini API key](https://aistudio.google.com), and a [PayPal developer](https://developer.paypal.com) account.

```bash
git clone https://github.com/vhrcam/hunch.git
cd hunch
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where it comes from |
|---|---|
| `GEMINI_API_KEY` | Google AI Studio → Get API key |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | A sandbox REST app for the buyer's account, with **Transaction search** enabled |
| `SELLER_PAYPAL_CLIENT_ID` / `SELLER_PAYPAL_CLIENT_SECRET` | A second sandbox app for the seller's account, used only by the demo's "simulate PayPal's decision" button |
| `SELLER_PAYPAL_EMAIL` | Optional. The seller account's sandbox email. The payment list then only shows payments to that seller, since only its cases can be simulated |
| `ARCHIVE_BEFORE` | Optional. A date like `2026-10-15T03:10:00Z`. Cases filed before it start out in Archived on Your cases |

Then start it:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Trying a dispute in the sandbox

1. On [sandbox.paypal.com](https://www.sandbox.paypal.com), log in as the buyer's sandbox account and send a payment to the seller's sandbox account as **paying for an item or service**.
2. In Hunch, go to **File a dispute**, pick the payment (or enter its transaction ID), and describe what happened.
3. Review the case and file it.
4. After a few minutes, use **Demo: simulate PayPal's decision** to play out the seller's side. PayPal's sandbox takes a few minutes per step, so use **Refresh** until the case closes.

Each payment can only be disputed once.

## License

[MIT](LICENSE)
