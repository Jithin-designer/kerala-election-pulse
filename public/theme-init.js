/**
 * Theme bootstrap — runs synchronously before React hydrates.
 * Reads the saved theme from localStorage and applies it to <html>
 * BEFORE the first paint, preventing dark-mode → light-mode flash.
 *
 * Default theme is "fluent" (light) for new visitors.
 */
(function () {
  try {
    var stored = localStorage.getItem("theme");
    if (stored === "swiss" || stored === "brutal" || stored === "editorial") {
      stored = "fluent";
    }
    if (
      stored !== "emerald" &&
      stored !== "emerald-day" &&
      stored !== "fluent" &&
      stored !== "saas"
    ) {
      stored = "fluent";
    }
    document.documentElement.setAttribute("data-theme", stored);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "fluent");
  }
})();
