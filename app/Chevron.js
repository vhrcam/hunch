export default function Chevron({ back = false }) {
  return (
    <svg viewBox="0 0 8 14" width="7" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={back ? "M7 1 1 7l6 6" : "M1 1l6 6-6 6"} />
    </svg>
  );
}
