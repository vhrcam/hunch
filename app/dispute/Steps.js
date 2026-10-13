const labels = ["Payment", "Your story", "The case", "Filed & tracking"];

export default function Steps({ current }) {
  return (
    <ol className="grid grid-cols-4 gap-2">
      {labels.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "now" : "next";
        return (
          <li key={label} className="space-y-2.5">
            <div className={`h-0.5 rounded-full ${state === "now" ? "bg-paper" : state === "done" ? "bg-muted" : "bg-line"}`} />
            <p className={`font-mono text-[0.68rem] uppercase tracking-wider ${state === "now" ? "text-paper" : state === "done" ? "text-muted" : "text-faint"}`}>
              {state === "done" ? "✓" : `0${n}`} {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
