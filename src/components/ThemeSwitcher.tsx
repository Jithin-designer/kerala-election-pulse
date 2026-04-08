"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";

const THEMES = [
  {
    id: "emerald",
    label: "Emerald Night",
    colors: ["#060e09", "#f5c547", "#147a52"],
  },
  {
    id: "emerald-day",
    label: "Emerald Day",
    colors: ["#faf6ec", "#a07c2e", "#0a2818"],
  },
  {
    id: "fluent",
    label: "Fluent UI",
    colors: ["#f5f5f5", "#4e51a0", "#c8c6c4"],
  },
  {
    id: "saas",
    label: "SaaS Mobile",
    colors: ["#fafafa", "#0052ff", "#4d7cff"],
  },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "fluent";
  const stored = localStorage.getItem("theme");
  // Migrate retired themes to fluent (the closest light option)
  if (stored === "swiss" || stored === "brutal" || stored === "editorial") {
    return "fluent";
  }
  if (
    stored === "emerald" ||
    stored === "emerald-day" ||
    stored === "fluent" ||
    stored === "saas"
  ) {
    return stored;
  }
  return "fluent";
}

interface Props {
  /** Compact mode for header placement */
  compact?: boolean;
}

export default function ThemeSwitcher({ compact = false }: Props) {
  const [theme, setTheme] = useState<ThemeId>("fluent");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = getStoredTheme();
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchTheme(id: ThemeId) {
    setTheme(id);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("theme", id);
    setOpen(false);
  }

  const buttonSize = compact ? "w-9 h-9" : "w-12 h-12";
  const iconSize = compact ? "w-4 h-4" : "w-5 h-5";

  return (
    <div ref={ref} className={compact ? "relative" : "fixed bottom-6 right-6 z-[100]"}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: compact ? -8 : 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: compact ? -8 : 10, scale: 0.9 }}
            className={`absolute ${compact ? "top-11 right-0" : "bottom-16 right-0"} w-48 p-1.5 shadow-2xl overflow-hidden z-[100]`}
            style={{
              background: "var(--theme-surface)",
              border: "var(--theme-card-border)",
              borderRadius: "var(--theme-card-radius, 12px)",
              boxShadow: "var(--theme-card-shadow)",
            }}
          >
            <p
              className="text-[9px] font-bold uppercase tracking-widest px-2 pt-1 pb-1.5"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Theme
            </p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTheme(t.id)}
                className="w-full flex items-center gap-2.5 px-2 py-2 transition-colors cursor-pointer"
                style={{
                  background: theme === t.id ? "var(--theme-accent)" : "transparent",
                  color: theme === t.id ? "var(--theme-accent-contrast)" : "var(--theme-text)",
                  borderRadius: "var(--theme-card-radius, 6px)",
                }}
              >
                <div className="flex gap-0.5">
                  {t.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full border border-black/10"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className={`${buttonSize} rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95`}
        style={
          compact
            ? {
                background: "var(--theme-border)",
                color: "var(--theme-text-secondary)",
              }
            : {
                background: "var(--theme-accent)",
                color: "var(--theme-accent-contrast)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }
        }
        title="Switch theme"
      >
        <Palette className={iconSize} />
      </button>
    </div>
  );
}
