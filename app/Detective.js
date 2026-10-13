export default function Detective({ size = 120, searching = false, className = "" }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Hunch, the detective"
    >
      <circle cx="60" cy="68" r="32" fill="var(--color-ink)" />
      <path d="M40 46c0-12 3-22 10-24q10 5 20 0c7 2 10 12 10 24Z" fill="var(--color-ink)" />
      <path d="M41 40h38" strokeWidth="5" />
      <path d="M20 48c14-7 66-7 80 0" fill="var(--color-ink)" strokeWidth="3.5" />
      <circle cx="49" cy="66" r="8.5" />
      <circle cx="71" cy="66" r="8.5" />
      <path d="M57.5 65.5q2.5-2.5 5 0" />
      <circle cx="49" cy="67" r="2.6" fill="currentColor" stroke="none" />
      <circle cx="71" cy="67" r="2.6" fill="currentColor" stroke="none" />
      <ellipse cx="39" cy="78" rx="4" ry="2.4" fill="currentColor" stroke="none" opacity="0.18" />
      <path d="M52 82q4 3.5 8 0" />
      <path d="M60 83q11 6 22 4" />
      <path d="M82 80h11v7a5.5 5.5 0 0 1-11 0Z" fill="var(--color-ink)" />
      <path className="smoke" d="M88 75c-3-4 3-7 0-11s3-7 0-11" strokeWidth="2" opacity="0.7" />
      {searching && (
        <g className="search">
          <circle cx="28" cy="92" r="10" fill="var(--color-ink)" />
          <circle cx="28" cy="92" r="5" strokeWidth="1.5" opacity="0.35" />
          <path d="M20.5 99.5 12 108" strokeWidth="4" />
        </g>
      )}
    </svg>
  );
}
