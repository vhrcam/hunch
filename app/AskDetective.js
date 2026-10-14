"use client";

import { useState } from "react";
import Logo from "./Logo";

const subtitle = {
  vet: "Questions about this seller.",
  dispute: "Questions about this case.",
  general: "Questions about scams and PayPal disputes.",
};

export default function AskDetective({ kind, context, suggestions = [], onClose, className = "" }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(text) {
    const q = text.trim();
    if (!q || busy) return;
    setQuestion("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, kind, context, history: messages.slice(-6) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "hunch", text: data.answer || data.error }]);
    } catch {
      setMessages((m) => [...m, { role: "hunch", text: "The detective is busy. Try again in a moment." }]);
    }
    setBusy(false);
  }

  return (
    <section className={`card space-y-5 ${className}`}>
      <div className="flex items-center gap-3">
        <Logo size={34} className="text-paper shrink-0" />
        <div className="mr-auto">
          <p className="text-paper font-medium">Ask the Detective</p>
          <p className="text-faint text-sm">{subtitle[kind]} Hunch answers, you decide.</p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-paper text-xl leading-none px-1">
            ×
          </button>
        )}
      </div>

      {messages.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
              <p
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-paper text-ink px-4 py-2.5 text-sm"
                    : "max-w-[85%] rounded-2xl rounded-bl-md bg-raised border border-line text-text px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line"
                }
              >
                {m.text}
              </p>
            </div>
          ))}
          {busy && <p className="text-faint text-sm font-mono animate-pulse">Hunch is thinking…</p>}
        </div>
      )}

      {messages.length === 0 && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => send(s)} className="text-sm text-muted border border-line rounded-full px-3 py-1 transition-colors hover:text-paper hover:border-line-strong">
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(question);
        }}
        className="flex gap-2"
      >
        <input className="input" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question…" />
        <button className="btn shrink-0" disabled={busy || !question.trim()}>Ask</button>
      </form>
    </section>
  );
}
