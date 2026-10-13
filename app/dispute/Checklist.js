"use client";

import { useEffect, useState } from "react";

export default function Checklist({ steps, note }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 1500);
    return () => clearInterval(id);
  }, [steps]);

  return (
    <div className="card space-y-3">
      {steps.map((s, i) => (
        <p key={s} className={`font-type flex gap-3 ${i < step ? "text-muted" : i === step ? "text-amber animate-pulse" : "text-muted opacity-30"}`}>
          <span className="w-4">{i < step ? "✓" : i === step ? "›" : "·"}</span>
          {s}{i === step && "..."}
        </p>
      ))}
      {note && <p className="text-muted text-sm pt-2">{note}</p>}
    </div>
  );
}
