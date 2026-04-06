"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";

const THEMES = [
  {
    id: "emerald",
    label: "Emerald Night",
    icon: "🌿",
    colors: ["#060e09", "#d4a843", "#147a52"],
  },
  {
    id: "swiss",
    label: "Swiss Modern",
    icon: "🇨🇭",
    colors: ["#F5F5F5", "#DC2626", "#000000"],
  },
  {
    id: "brutal",
    label: "Neubrutalism",
    icon: "⚡",
    colors: ["#FEF9C3", "#FF5252", "#000000"],
  },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "emerald";
  return (localStorage.getItem("theme") as ThemeId) || "emerald";
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>("emerald");
  const [open, setOpen] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const saved = getStoredTheme();
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  function switchTheme(id: ThemeId) {
    setTheme(id);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("theme", id);
    setOpen(false);
  }

  function cycleTheme() {
    const currentIndex = THEMES.findIndex((t) => t.id === theme);
    const next = THEMES[(currentIndex + 1) % THEMES.length];
    switchTheme(next.id);
  }

  const current = THEMES.find((t) => t.id === theme)!;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 w-52 p-2 rounded-xl shadow-2xl overflow-hidden"
            style={{
              background: "var(--theme-surface)",
              border: "var(--theme-card-border)",
              borderRadius: "var(--theme-card-radius, 12px)",
              boxShadow: "var(--theme-card-shadow)",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest px-2 pt-1 pb-2"
              style={{ color: "var(--theme-text-muted)" }}
            >
              Switch Theme
            </p>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTheme(t.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer"
                style={{
                  background: theme === t.id ? "var(--theme-accent)" : "transparent",
                  color: theme === t.id ? (t.id === "emerald" ? "#060e09" : "#FFFFFF") : "var(--theme-text)",
                  borderRadius: "var(--theme-card-radius, 8px)",
                }}
              >
                {/* Color dots preview */}
                <div className="flex gap-1">
                  {t.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-3 h-3 rounded-full border border-black/10"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{t.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <button
        onClick={() => setOpen(!open)}
        onDoubleClick={cycleTheme}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95"
        style={{
          background: "var(--theme-accent)",
          color: theme === "emerald" ? "#060e09" : "#FFFFFF",
          borderRadius: theme === "brutal" ? "0px" : "9999px",
          boxShadow: theme === "brutal" ? "3px 3px 0px #000" : "0 4px 20px rgba(0,0,0,0.3)",
        }}
        title="Switch theme (double-click to cycle)"
      >
        <Palette className="w-5 h-5" />
      </button>
    </div>
  );
}
