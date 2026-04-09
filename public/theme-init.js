/**
 * Theme bootstrap — runs synchronously before React hydrates.
 *
 * 1. If user saved a specific theme → apply it.
 * 2. If no saved theme (new visitor or "auto") → follow system preference:
 *      macOS/iOS dark mode  → "emerald" (dark theme)
 *      macOS/iOS light mode → "fluent"  (light theme)
 */
(function () {
  var VALID = { emerald: 1, "emerald-day": 1, fluent: 1, saas: 1, aurora: 1 };
  try {
    var stored = localStorage.getItem("theme");
    // Migrate retired themes
    if (stored === "swiss" || stored === "brutal" || stored === "editorial") {
      stored = null;
      localStorage.removeItem("theme");
    }
    if (stored === "auto" || !stored || !VALID[stored]) {
      // Follow system preference
      var isDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      stored = isDark ? "emerald" : "fluent";
      // Don't save — keep auto-detecting on each load
    }
    document.documentElement.setAttribute("data-theme", stored);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "fluent");
  }
})();
