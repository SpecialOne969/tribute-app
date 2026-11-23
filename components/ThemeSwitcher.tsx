"use client";

import { useState, useEffect } from "react";

const THEMES = [
  { key: "gold",   label: "Gold (Dark)",   swatch: "#D4AF37" },
  { key: "light",  label: "Light Gold",    swatch: "#F5E088" },
  { key: "blue",   label: "Sky Blue",      swatch: "#38BDF8" },
  { key: "rose",   label: "Rose",          swatch: "#F472B6" },
  { key: "purple", label: "Purple",        swatch: "#A78BFA" },
];

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("gold");

  useEffect(() => {
    const saved = localStorage.getItem("tribute-theme") || "gold";
    applyTheme(saved, false);
    setCurrent(saved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyTheme(key: string, close = true) {
    if (key === "gold") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", key);
    }
    localStorage.setItem("tribute-theme", key);
    setCurrent(key);
    if (close) setOpen(false);
  }

  const active = THEMES.find((t) => t.key === current)!;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
      {/* Popover panel */}
      {open && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-3 shadow-2xl flex flex-col gap-1 min-w-[160px]">
          <p className="text-neutral-500 text-xs font-semibold uppercase tracking-widest px-2 py-1">
            Color Theme
          </p>
          {THEMES.map((t) => (
            <button
              key={t.key}
              onClick={() => applyTheme(t.key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
                current === t.key
                  ? "bg-neutral-800"
                  : "hover:bg-neutral-800/60"
              }`}
            >
              <span
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: t.swatch,
                  boxShadow: current === t.key
                    ? `0 0 0 2px #171717, 0 0 0 4px ${t.swatch}`
                    : "none",
                }}
              />
              <span className="text-white text-sm font-medium flex-1">{t.label}</span>
              {current === t.key && (
                <svg className="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 hover:border-neutral-500 shadow-xl flex items-center justify-center transition-all hover:scale-105 group"
        aria-label="Change color theme"
        title="Change color theme"
      >
        {/* Four-quadrant colour circle */}
        <div className="w-6 h-6 rounded-full overflow-hidden grid grid-cols-2 grid-rows-2">
          <div style={{ background: "#D4AF37" }} />
          <div style={{ background: "#38BDF8" }} />
          <div style={{ background: "#F472B6" }} />
          <div style={{ background: "#A78BFA" }} />
        </div>
      </button>

      {/* Active colour dot indicator */}
      <div
        className="w-2.5 h-2.5 rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-neutral-900"
        style={{ backgroundColor: active.swatch }}
      />
    </div>
  );
}
