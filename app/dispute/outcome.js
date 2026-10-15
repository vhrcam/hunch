const results = {
  RESOLVED_BUYER_FAVOUR: "won",
  ACCEPTED: "won",
  RESOLVED_WITH_PAYOUT: "won",
  RESOLVED_SELLER_FAVOUR: "lost",
  DENIED: "lost",
  CANCELED_BY_BUYER: "withdrawn",
};

export const result = (outcome) => (outcome ? results[outcome] || "closed" : null);

const questions = {
  won: ["When will the refund show up?", "Where does the money go?", "How do I avoid this next time?"],
  lost: ["Can I appeal this?", "Can my bank or card help?", "How do I avoid this next time?"],
  withdrawn: ["Can I reopen this case?", "Will the seller still refund me?", "How do I avoid this next time?"],
  closed: ["What happened with my case?", "Can I appeal this?", "How do I avoid this next time?"],
  WAITING_FOR_BUYER_RESPONSE: ["What should I send PayPal?", "How long do I have to reply?", "What if I don't reply?"],
  UNDER_REVIEW: ["How long does PayPal's review take?", "Can I add more evidence?", "What if PayPal sides with the seller?"],
  open: ["What happens next?", "What if the seller doesn't respond?", "When will I get my money back?"],
};

export const suggest = (c) => questions[result(c.outcome)] || questions[c.status] || questions.open;
