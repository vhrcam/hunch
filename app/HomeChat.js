"use client";

import { useState } from "react";
import AskDetective from "./AskDetective";
import Logo from "./Logo";

export default function HomeChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-20 flex flex-col items-end">
      {open ? (
        <AskDetective
          kind="general"
          context={{}}
          onClose={() => setOpen(false)}
          suggestions={["Is Friends and Family safe for buying?", "How do PayPal disputes work?", "What are signs of a scam?"]}
          className="w-[min(380px,calc(100vw-2.5rem))] shadow-2xl shadow-black/70 transition-all duration-200 starting:opacity-0 starting:translate-y-3"
        />
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-paper text-ink font-medium text-sm pl-3 pr-4 py-2.5 shadow-lg shadow-black/50 hover:opacity-90 transition-opacity"
        >
          <Logo size={20} />
          Ask the Detective
        </button>
      )}
    </div>
  );
}
