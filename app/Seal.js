"use client";

import { useEffect, useId, useState } from "react";

const tones = { safe: "text-safe", caution: "text-amber", danger: "text-danger", neutral: "text-muted" };

export default function Seal({ level, ring, label, size = 136 }) {
  const id = useId().replace(/:/g, "");
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(label.length + 1);
      return;
    }
    let n = 0;
    let timer = setTimeout(function type() {
      setTyped(++n);
      if (n <= label.length) timer = setTimeout(type, n > label.length - 1 ? 900 : 55);
    }, 450);
    return () => clearTimeout(timer);
  }, [label]);

  return (
    <div className={`flex flex-col items-center gap-3 ${tones[level]}`}>
      <svg className="seal" viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`${ring}: ${label}`}>
        <defs>
          <path id={`${id}ring`} d="M50 13a37 37 0 1 1 0 74a37 37 0 1 1 0-74" />
          <filter id={`${id}ink`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.7" result="rough" />
            <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="8" result="blot" />
            <feColorMatrix in="blot" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.75" result="wear" />
            <feComposite in="rough" in2="wear" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${id}ink)`} fill="currentColor">
          <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.6" />
          <circle cx="50" cy="50" r="29" opacity="0.1" />
          <circle cx="50" cy="50" r="29" fill="none" stroke="currentColor" strokeWidth="2" />
          <g transform="translate(29 28) scale(0.656)" opacity="0.35">
            <path d="M18 28c0-12 5-19 10-20q4 3 8 0c5 1 10 8 10 20Z" />
            <path d="M5 30q27-9 54 0q-27 7-54 0Z" />
            <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
              <circle cx="23.5" cy="42" r="7" />
              <circle cx="40.5" cy="42" r="7" />
              <path d="M30.5 41q1.5-2 3 0" />
              <path d="M37 53q6 3.5 12 1.5" />
            </g>
            <path d="M47.5 47h9v5.5a4.5 4.5 0 0 1-9 0Z" />
          </g>
          <text className="font-mono" fontWeight="700" fontSize="8" dy="2.8">
            <textPath href={`#${id}ring`} textLength="229" lengthAdjust="spacing">
              {`${ring} • ${ring} •`}
            </textPath>
          </text>
        </g>
      </svg>
      <p className="font-mono font-bold uppercase tracking-[0.18em] text-sm h-5 whitespace-nowrap" aria-hidden="true">
        {label.slice(0, typed)}
        {typed > 0 && typed <= label.length && <span className="cursor" />}
      </p>
    </div>
  );
}
