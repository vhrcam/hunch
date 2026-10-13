"use client";

import { useEffect, useState } from "react";
import Detective from "../Detective";

export default function Checklist({ steps, note }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 1500);
    return () => clearInterval(id);
  }, [steps]);

  return (
    <div className="card flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
      <Detective size={96} searching className="text-paper shrink-0 self-center" />
      <div className="flex-1 space-y-2.5">
        {steps.map((s, i) => (
          <p key={s} className={`flex gap-3 text-sm ${i < step ? "text-muted" : i === step ? "text-paper" : "text-faint"}`}>
            <span className="font-mono w-4 shrink-0">{i < step ? "✓" : i === step ? "›" : "·"}</span>
            <span className={i === step ? "animate-pulse" : ""}>{s}{i === step && "..."}</span>
          </p>
        ))}
        {note && <p className="text-faint text-xs pt-2">{note}</p>}
      </div>
    </div>
  );
}
