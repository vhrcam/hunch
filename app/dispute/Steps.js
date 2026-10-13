const labels = ["Payment", "Your story", "The case", "Filed & tracking"];

export default function Steps({ current }) {
  return (
    <ol className="grid grid-cols-4 gap-2">
      {labels.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "now" : "next";
        return (
          <li key={label} className="space-y-2">
            <div className={`h-1 rounded-full ${state === "next" ? "bg-line" : "bg-amber"}`} />
            <p className={`font-type text-xs sm:text-sm ${state === "now" ? "text-amber" : state === "done" ? "text-paper" : "text-muted opacity-50"}`}>
              {state === "done" ? "✓" : n} {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
