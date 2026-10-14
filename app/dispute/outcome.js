const results = {
  RESOLVED_BUYER_FAVOUR: "won",
  ACCEPTED: "won",
  RESOLVED_WITH_PAYOUT: "won",
  RESOLVED_SELLER_FAVOUR: "lost",
  DENIED: "lost",
  CANCELED_BY_BUYER: "withdrawn",
};

export const result = (outcome) => (outcome ? results[outcome] || "closed" : null);
