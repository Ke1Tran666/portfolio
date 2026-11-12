(() => {
  const THEME_STORAGE_KEY = "portfolio-theme";
  let activeThemeTransition = null;
  let themeTransitionTimer = null;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function getStoredTheme() {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

      return savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : null;
    } catch (error) {
      return null;
    }
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function setRootTheme(theme) {
    const validTheme = theme === "light" ? "light" : "dark";

    document.documentElement.dataset.theme = validTheme;
    document.documentElement.style.colorScheme = validTheme;

    return validTheme;
  }

  function applyTheme(theme, persist = false) {
    const validTheme = setRootTheme(theme);

    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, validTheme);
      } catch (error) {}
    }

    const isLightTheme = validTheme === "light";

    document.querySelectorAll('[data-theme-icon="sun"]').forEach((icon) => {
      icon.classList.toggle("hidden", isLightTheme);
    });

    document.querySelectorAll('[data-theme-icon="moon"]').forEach((icon) => {
      icon.classList.toggle("hidden", !isLightTheme);
    });

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const nextTheme = isLightTheme ? "dark" : "light";

      const nextThemeLabel = isLightTheme ? "tối" : "sáng";

      button.setAttribute(
        "aria-label",
        `Chuyển sang giao diện ${nextThemeLabel}`,
      );

      button.setAttribute("title", `Chuyển sang giao diện ${nextThemeLabel}`);

      button.setAttribute("aria-pressed", String(isLightTheme));

      button.dataset.nextTheme = nextTheme;
    });
  }

  function switchTheme(nextTheme, persist = false) {
    const root = document.documentElement;
    const validNextTheme = nextTheme === "light" ? "light" : "dark";

    if (root.dataset.theme === validNextTheme) {
      applyTheme(validNextTheme, persist);
      return;
    }

    if (prefersReducedMotion()) {
      applyTheme(validNextTheme, persist);
      return;
    }

    if (typeof document.startViewTransition === "function") {
      if (activeThemeTransition) {
        try {
          activeThemeTransition.skipTransition();
        } catch (error) {}
      }

      root.classList.remove("theme-transitioning");

      let transition;

      try {
        transition = document.startViewTransition(() => {
          root.classList.add("theme-vt-lock");
          applyTheme(validNextTheme, persist);
        });
      } catch (error) {
        root.classList.remove("theme-vt-lock");
        applyTheme(validNextTheme, persist);
        return;
      }

      activeThemeTransition = transition;

      transition.finished
        .catch(() => {})
        .finally(() => {
          root.classList.remove("theme-vt-lock");

          if (activeThemeTransition === transition) {
            activeThemeTransition = null;
          }
        });

      return;
    }

    clearTimeout(themeTransitionTimer);
    root.classList.add("theme-transitioning");
    void root.offsetHeight;
    applyTheme(validNextTheme, persist);

    themeTransitionTimer = setTimeout(() => {
      root.classList.remove("theme-transitioning");
    }, 380);
  }

  function initTheme() {
    const currentTheme =
      document.documentElement.dataset.theme ||
      getStoredTheme() ||
      getSystemTheme();

    applyTheme(currentTheme);

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const activeTheme = document.documentElement.dataset.theme;

        const nextTheme = activeTheme === "light" ? "dark" : "light";

        switchTheme(nextTheme, true);
      });
    });

    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: light)");

    systemThemeQuery.addEventListener("change", (event) => {
      if (getStoredTheme()) return;

      switchTheme(event.matches ? "light" : "dark");
    });
  }

  setRootTheme(getStoredTheme() || getSystemTheme());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
})();
