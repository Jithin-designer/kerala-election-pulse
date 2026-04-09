"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Monitor } from "lucide-react";

const THEMES = [
  {
    id: "auto",
    label: "System Default",
    colors: [] as string[], // special: no color dots, shows monitor icon
  },
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
  {
    id: "aurora",
    label: "Aurora",
    colors: ["#050510", "#00e5ff", "#7c4dff"],
  },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

/** Resolve "auto" to a concrete theme based on system preference. */
function resolveAuto(): Exclude<ThemeId, "auto"> {
  if (typeof window === "undefined") return "fluent";
  const isDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return isDark ? "emerald" : "fluent";
}

function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "auto";
  const stored = localStorage.getItem("theme");
  // Migrate retired themes → auto
  if (stored === "swiss" || stored === "brutal" || stored === "editorial") {
    localStorage.removeItem("theme");
    return "auto";
  }
  if (!stored) return "auto";
  // Validate
  const valid = new Set(THEMES.map((t) => t.id));
  return valid.has(stored as ThemeId) ? (stored as ThemeId) : "auto";
}

function applyTheme(id: ThemeId) {
  const resolved = id === "auto" ? resolveAuto() : id;
  document.documentElement.setAttribute("data-theme", resolved);
}

interface Props {
  compact?: boolean;
}

export default function ThemeSwitcher({ compact = false }: Props) {
  const [theme, setTheme] = useState<ThemeId>("auto");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Initialise from storage
  useEffect(() => {
    const saved = getStoredTheme();
    setTheme(saved);
    applyTheme(saved);
  }, []);

  // Listen for system theme changes (only matters when in "auto" mode)
  useEffect(() => {
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange() {
      applyTheme("auto");
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

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
    applyTheme(id);
    if (id === "auto") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", id);
    }
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
            className={`absolute ${compact ? "top-11 right-0" : "bottom-16 right-0"} w-52 p-1.5 shadow-2xl overflow-hidden z-[100]`}
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
                {t.id === "auto" ? (
                  <Monitor className="w-4 h-4" />
                ) : (
                  <div className="flex gap-0.5">
                    {t.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-black/10"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                )}
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
                background: "var(--theme-fill, var(--theme-border))",
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
