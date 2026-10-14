"use client";

import { useState } from "react";

export default function ManualEntry({ onSubmit }) {
  const [f, setF] = useState({ id: "", amount: "", paidTo: "", date: "", note: "" });
  const set = (key) => (e) => setF({ ...f, [key]: e.target.value });
  const validId = /^[A-Z0-9]{17}$/i.test(f.id.trim());

  function submit(e) {
    e.preventDefault();
    const paidTo = f.paidTo.trim();
    onSubmit({
      id: f.id.trim().toUpperCase(),
      date: f.date,
      amount: Number(f.amount).toFixed(2),
      currency: "USD",
      counterparty: paidTo || "Unknown seller",
      email: paidTo.includes("@") ? paidTo : "",
      note: f.note.trim(),
    });
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm text-muted">Transaction ID</span>
          <input className="input font-mono uppercase" value={f.id} onChange={set("id")} maxLength={17} placeholder="9VX12345AB6789012" />
          <span className={`block text-xs ${f.id && !validId ? "text-danger" : "text-faint"}`}>
            17 letters and numbers. It&apos;s on your PayPal receipt email and in Activity.
          </span>
        </label>
        <label className="space-y-1">
          <span className="text-sm text-muted">Amount (USD)</span>
          <input className="input" type="number" min="0.01" step="0.01" value={f.amount} onChange={set("amount")} placeholder="20.00" />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-muted">Paid to</span>
          <input className="input" value={f.paidTo} onChange={set("paidTo")} placeholder="Seller name or email" />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-muted">Date <span className="text-faint">(optional)</span></span>
          <input className={`input ${f.date ? "" : "text-faint!"}`} type="date" value={f.date} onChange={set("date")} />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-muted">What it was for <span className="text-faint">(optional)</span></span>
          <input className="input" value={f.note} onChange={set("note")} placeholder="Clothes" />
        </label>
      </div>
      <button className="btn" disabled={!validId || !(Number(f.amount) > 0)}>Use this payment</button>
    </form>
  );
}
