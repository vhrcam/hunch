"use client";

import { useEffect, useId, useRef, useState } from "react";

const ease = { transition: "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)" };

export default function Detective({ size = 120, searching = false, className = "" }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef(null);
  const [look, setLook] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let idle;
    const wander = () => {
      setLook({ x: Math.random() * 2 - 1, y: Math.random() * 1.4 - 0.6 });
      idle = setTimeout(wander, 1600 + Math.random() * 2000);
    };
    const follow = (e) => {
      clearTimeout(idle);
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.max(Math.hypot(dx, dy), 1);
      const pull = Math.min(d / 260, 1);
      setLook({ x: (dx / d) * pull, y: (dy / d) * pull });
      idle = setTimeout(wander, 4000);
    };
    idle = setTimeout(wander, 1000);
    window.addEventListener("pointermove", follow);
    return () => {
      clearTimeout(idle);
      window.removeEventListener("pointermove", follow);
    };
  }, []);

  const move = (x, y) => ({ ...ease, transform: `translate(${look.x * x}px, ${look.y * y}px)` });

  return (
    <svg ref={ref} viewBox="0 0 200 200" width={size} height={size} className={className} role="img" aria-label="Hunch, the detective">
      <defs>
        <radialGradient id={`${id}head`} cx="36%" cy="30%" r="78%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#eeeef0" />
          <stop offset="0.82" stopColor="#c4c5cb" />
          <stop offset="1" stopColor="#9fa1a8" />
        </radialGradient>
        <linearGradient id={`${id}felt`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a5c64" />
          <stop offset="1" stopColor="#1d1e22" />
        </linearGradient>
        <linearGradient id={`${id}brim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4c53" />
          <stop offset="1" stopColor="#1a1b1e" />
        </linearGradient>
        <linearGradient id={`${id}pipe`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5a5c64" />
          <stop offset="1" stopColor="#1d1e22" />
        </linearGradient>
        <linearGradient id={`${id}suit`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2b30" />
          <stop offset="1" stopColor="#101113" />
        </linearGradient>
        <radialGradient id={`${id}shade`} cx="35%" cy="28%" r="85%">
          <stop offset="0" stopColor="#4a4c54" />
          <stop offset="0.6" stopColor="#17181b" />
          <stop offset="1" stopColor="#070708" />
        </radialGradient>
        <radialGradient id={`${id}glass`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#d9dbe0" stopOpacity="0.15" />
        </radialGradient>
        <clipPath id={`${id}clip`}>
          <circle cx="100" cy="100" r="56" />
        </clipPath>
      </defs>

      <path d="M34 200c2-30 28-48 66-48s64 18 66 48Z" fill={`url(#${id}suit)`} />
      <path d="M84 152l16 30 16-30Z" fill="#ececed" />
      <path d="M95 157h10l3 21-8 11-8-11Z" fill="#0b0c0e" />
      <path d="M95 157h10l-1.5 6h-7Z" fill="#2c2d32" />
      <path d="M82 151l-14 9 30 38ZM118 151l14 9-30 38Z" fill="#1c1d21" />
      <path d="M70 161l26 34M130 161l-26 34" stroke="#fff" strokeWidth="1.2" opacity="0.12" />

      <circle cx="100" cy="100" r="56" fill={`url(#${id}head)`} />

      <g clipPath={`url(#${id}clip)`}>
        <g style={move(6, 4)}>
          <path d="M72 79l13 2M128 79l-13 2" fill="none" stroke="#16171a" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M66.5 96 51 93M133.5 96l15.5-3" stroke="#0b0c0e" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="82" cy="98" rx="16" ry="15" fill={`url(#${id}shade)`} stroke="#0b0c0e" strokeWidth="3.5" />
          <ellipse cx="118" cy="98" rx="16" ry="15" fill={`url(#${id}shade)`} stroke="#0b0c0e" strokeWidth="3.5" />
          <path d="M98 96q2-2.5 4 0" fill="none" stroke="#0b0c0e" strokeWidth="3" strokeLinecap="round" />
          <g style={move(-2, -1.5)} stroke="#fff" strokeLinecap="round" fill="none">
            <path d="M72 95a10 10 0 0 1 7-8M108 95a10 10 0 0 1 7-8" strokeWidth="2.5" opacity="0.75" />
            <path d="M75 103l10-10M111 103l10-10" strokeWidth="2" opacity="0.16" />
          </g>
          <path d="M87 131.5q6 1.5 12 0" fill="none" stroke="#16171a" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      <g style={move(6, 4)}>
        <path d="M101 130.5 131 132.5v6.5l-30-5.5Z" fill={`url(#${id}pipe)`} />
        <circle cx="101" cy="132" r="2.6" fill="#0b0c0e" />
        <path d="M129 123h17v11a8.5 8.5 0 0 1-17 0Z" fill={`url(#${id}felt)`} />
        <ellipse cx="137.5" cy="123" rx="8.5" ry="2.6" fill="#6b6e75" />
        <ellipse cx="137.5" cy="123" rx="5.8" ry="1.5" fill="#0b0c0e" />
        <path d="M132.5 126.5v8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.18" />
        <path className="smoke" d="M139 117c-2-6 6-9 4-15s6-9 4-15" fill="none" stroke="#8e9097" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
      </g>

      <g style={move(2.5, 1.5)}>
        <ellipse cx="100" cy="60" rx="72" ry="13" fill={`url(#${id}brim)`} />
        <path d="M34 56c26-6 106-6 132 0" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.14" />
        <path d="M64 58C62 38 70 20 84 15c7-2 12 4 16 4s9-6 16-4c14 5 22 23 20 43Z" fill={`url(#${id}felt)`} />
        <path d="M100 21c-1.5 9-1.5 18 0 26" fill="none" stroke="#0f1012" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        <path d="M75 26c-5 10-6 19-6 28" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.14" />
        <path d="M65 47c23 6 47 6 70 0l1 10c-24 6-48 6-72 0Z" fill="#0d0e10" />
        <path d="M28 60c12 10 42 14 72 14s60-4 72-14c-22 6-47 7-72 7s-50-1-72-7Z" fill="#3e4047" />
      </g>

      {searching && (
        <g className="search">
          <path d="M36 168 22 183" stroke="#b9bbc1" strokeWidth="7" strokeLinecap="round" />
          <circle cx="48" cy="155" r="16" fill={`url(#${id}glass)`} stroke="#d4d5da" strokeWidth="4" />
          <path d="M40 149a10 10 0 0 1 5-5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
