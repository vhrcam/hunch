export default function Logo({ size = 24, className = "" }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
      <path d="M18 28c0-12 5-19 10-20q4 3 8 0c5 1 10 8 10 20Z" />
      <path d="M5 30q27-9 54 0q-27 7-54 0Z" />
      <g fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
        <circle cx="23.5" cy="42" r="7" />
        <circle cx="40.5" cy="42" r="7" />
        <path d="M30.5 41q1.5-2 3 0" />
        <path d="M37 53q6 3.5 12 1.5" />
      </g>
      <path d="M47.5 47h9v5.5a4.5 4.5 0 0 1-9 0Z" />
    </svg>
  );
}
