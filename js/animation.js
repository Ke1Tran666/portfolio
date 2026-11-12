// ===== HELPERS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

document.addEventListener("DOMContentLoaded", () => {
  window.lucide?.createIcons();

  initMenu();
  initTyping();
  initFadeIn();
  initFilter();
  initCopyEmail();
  initScrollEffects();
});

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// MENU
function initMenu() {
  const menuToggle = $("#menu-toggle");
  const menuClose = $("#menu-close");
  const mobileMenu = $("#mobile-menu");

  if (!menuToggle || !mobileMenu) return;

  function setMenuState(isOpen) {
    mobileMenu.classList.toggle("open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  }

  menuToggle.addEventListener("click", () => {
    setMenuState(true);
  });

  menuClose?.addEventListener("click", () => {
    setMenuState(false);
    menuToggle.focus();
  });

  $$(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    const menuIsOpen = mobileMenu.classList.contains("open");

    if (event.key === "Escape" && menuIsOpen) {
      setMenuState(false);
      menuToggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      setMenuState(false);
    }
  });
}

function initTyping() {
  const { typingPhrases = [] } = window.PORTFOLIO_DATA || {};
  const el = $("#typed-text");

  if (!el || !typingPhrases.length) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const text = typingPhrases[phraseIndex];

    if (deleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    el.textContent = text.substring(0, charIndex);

    let speed = deleting ? 25 : 50;

    if (!deleting && charIndex === text.length) {
      deleting = true;
      speed = 2000;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

// FADE IN
function initFadeIn() {
  const elements = $$(".fade-in");

  if (!elements.length) return;

  if (prefersReducedMotion()) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      let visibleIndex = 0;

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const delay = Math.min(visibleIndex, 5) * 45;
        visibleIndex += 1;

        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.06,
      rootMargin: "0px 0px -32px 0px",
    },
  );

  elements.forEach((element) => observer.observe(element));
}

// FILTER
function initFilter() {
  const buttons = $$(".filter-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => {
        item.classList.remove(
          "bg-white",
          "text-black",
          "border-transparent",
          "active",
        );

        item.classList.add(
          "bg-white/5",
          "text-neutral-400",
          "border",
          "border-white/5",
          "hover:text-white",
        );
      });

      button.classList.remove(
        "bg-white/5",
        "text-neutral-400",
        "border-white/5",
        "hover:text-white",
      );

      button.classList.add(
        "bg-white",
        "text-black",
        "border-transparent",
        "active",
      );

      filterProjects(button.dataset.filter);
    });
  });
}

function filterProjects(filter) {
  const cards = $$(".project-card");

  cards.forEach((card) => {
    const category = card.dataset.category;
    const show = filter === "all" || category === filter;

    clearTimeout(card._hideTimer);

    if (show) {
      const wasHidden = card.style.display === "none";

      card.style.display = "";

      if (wasHidden) {
        card.style.opacity = "0";
        card.style.transform = "translateY(14px)";
        void card.offsetWidth;
      }

      requestAnimationFrame(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      });
    } else {
      card.style.opacity = "0";
      card.style.transform = "translateY(14px)";

      card._hideTimer = setTimeout(() => {
        card.style.display = "none";
      }, 320);
    }
  });
}

// COPY EMAIL
async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback cho môi trường không hỗ trợ Clipboard API
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  } finally {
    textarea.remove();
  }

  return copied;
}

function initCopyEmail() {
  const buttons = $$("[data-copy-email]");

  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail;

      if (!email) return;

      const copied = await copyTextToClipboard(email);

      if (!copied) {
        showToast(
          "Không thể sao chép tự động, vui lòng copy thủ công.",
          "error",
        );
        return;
      }

      const copyIcon = button.querySelector('[data-copy-icon="copy"]');
      const checkIcon = button.querySelector('[data-copy-icon="check"]');
      const label = button.querySelector("[data-copy-label]");

      button.classList.add("is-copied");
      copyIcon?.classList.add("hidden");
      checkIcon?.classList.remove("hidden");

      if (label) {
        label.textContent = "Đã copy";
      }

      clearTimeout(button._copyTimeout);
      button._copyTimeout = setTimeout(() => {
        button.classList.remove("is-copied");
        copyIcon?.classList.remove("hidden");
        checkIcon?.classList.add("hidden");

        if (label) {
          label.textContent = "Copy";
        }
      }, 2000);

      showToast(`Đã sao chép ${email}`, "success");
    });
  });
}

// TOAST
function showToast(message, type = "success") {
  const container = $("#toast-container");

  if (!container) return;

  const toast = document.createElement("div");

  toast.className = `
        toast-in
        pointer-events-auto
        flex items-center gap-2.5
        px-4 py-3
        bg-neutral-900
        border border-white/10
        rounded-xl
        shadow-xl
        text-sm
    `;

  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  const icon = document.createElement("i");
  icon.dataset.lucide = type === "error" ? "alert-circle" : "check-circle-2";
  icon.className = `w-4 h-4 flex-shrink-0 ${
    type === "error" ? "text-red-500" : "text-green-500"
  }`;

  const text = document.createElement("span");
  text.textContent = message;

  toast.append(icon, text);
  container.appendChild(toast);

  if (window.lucide?.createIcons) {
    lucide.createIcons();
  }

  setTimeout(() => {
    toast.classList.remove("toast-in");
    toast.classList.add("toast-out");

    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 2600);
}

// SCROLL EFFECTS (BACK TO TOP + ACTIVE NAV)
function easeInOutCubic(progress) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function createSmoothScroller() {
  let activeFrameId = null;
  let cleanupActiveScroll = null;

  const cancel = () => {
    if (activeFrameId !== null) {
      cancelAnimationFrame(activeFrameId);
      activeFrameId = null;
    }

    if (typeof cleanupActiveScroll === "function") {
      const cleanup = cleanupActiveScroll;
      cleanupActiveScroll = null;
      cleanup(false);
    }
  };

  const scrollTo = (targetY, options = {}) => {
    const {
      duration,
      onComplete,
      onCancel,
    } = options;

    cancel();

    const startY = window.scrollY || window.pageYOffset || 0;
    const docHeight = Math.max(
      document.body?.scrollHeight || 0,
      document.documentElement?.scrollHeight || 0,
    );
    const maxScrollY = Math.max(0, docHeight - (window.innerHeight || 0));
    const clampedTargetY = Math.min(maxScrollY, Math.max(0, Math.round(targetY)));
    const distance = Math.abs(clampedTargetY - startY);

    if (distance <= 1) {
      window.scrollTo(0, clampedTargetY);
      onComplete?.();
      return;
    }

    const totalDuration =
      typeof duration === "number"
        ? duration
        : prefersReducedMotion()
          ? 360
          : Math.min(950, Math.max(380, Math.round(320 + distance * 0.16)));

    const root = document.documentElement;
    const prevScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const interruptKeys = new Set([
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
    ]);

    const handleWheelOrTouch = () => cancel();
    const handleKeydown = (event) => {
      if (interruptKeys.has(event.key)) {
        cancel();
      }
    };

    window.addEventListener("wheel", handleWheelOrTouch, { passive: true });
    window.addEventListener("touchstart", handleWheelOrTouch, { passive: true });
    window.addEventListener("keydown", handleKeydown);

    cleanupActiveScroll = (completed) => {
      root.style.scrollBehavior = prevScrollBehavior;
      window.removeEventListener("wheel", handleWheelOrTouch);
      window.removeEventListener("touchstart", handleWheelOrTouch);
      window.removeEventListener("keydown", handleKeydown);

      if (completed) {
        onComplete?.();
      } else {
        onCancel?.();
      }
    };

    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDuration);
      const eased = easeInOutCubic(progress);
      const nextY = startY + (clampedTargetY - startY) * eased;

      window.scrollTo(0, nextY);

      if (progress < 1) {
        activeFrameId = requestAnimationFrame(step);
      } else {
        activeFrameId = null;
        window.scrollTo(0, clampedTargetY);

        const cleanup = cleanupActiveScroll;
        cleanupActiveScroll = null;
        cleanup?.(true);
      }
    };

    activeFrameId = requestAnimationFrame(step);
  };

  return { scrollTo, cancel };
}

function initScrollEffects() {
  const backToTopButton = $("#back-to-top");
  const sections = Array.from($$("section[id]"));
  const navLinks = Array.from($$("nav [data-nav-link]"));
  const anchorLinks = Array.from($$('a[href^="#"]'));
  const scroller = createSmoothScroller();

  let isTopVisible = null;
  let activeSectionId = null;
  let lockedSectionId = null;
  let activeScrollToken = 0;
  let ticking = false;

  const setActiveNavLink = (sectionId) => {
    navLinks.forEach((link) => {
      const isActive =
        Boolean(sectionId) && link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-active", isActive);
      link.classList.toggle("text-white", isActive);
      link.classList.toggle("text-neutral-400", !isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const setScrollingNavLink = (sectionId) => {
    navLinks.forEach((link) => {
      const isTarget =
        Boolean(sectionId) && link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("is-scrolling", isTarget);
    });
  };

  const updateOnScroll = () => {
    ticking = false;
    const scrollY = window.scrollY;
    const docHeight = Math.max(
      document.body?.scrollHeight || 0,
      document.documentElement?.scrollHeight || 0,
    );
    const maxScrollY = Math.max(0, docHeight - (window.innerHeight || 0));

    if (backToTopButton) {
      const shouldShow = scrollY > 500;

      if (shouldShow !== isTopVisible) {
        isTopVisible = shouldShow;
        backToTopButton.classList.toggle("is-visible", shouldShow);

        if (!shouldShow && document.activeElement === backToTopButton) {
          backToTopButton.blur();
        }

        backToTopButton.setAttribute("aria-hidden", String(!shouldShow));
        backToTopButton.tabIndex = shouldShow ? 0 : -1;
      }
    }

    if (sections.length && navLinks.length && lockedSectionId === null) {
      let current = "";
      const offset = scrollY + 120;

      for (const section of sections) {
        if (offset >= section.offsetTop) {
          current = section.id;
        }
      }

      if (maxScrollY > 100 && scrollY >= maxScrollY - 2) {
        current = sections[sections.length - 1].id;
      }

      if (current !== activeSectionId) {
        activeSectionId = current;
        setActiveNavLink(current);
      }
    }
  };

  const startProgrammaticScroll = (targetY, options = {}) => {
    const {
      targetId = null,
      hash = null,
      onEnd = null,
    } = options;
    const token = ++activeScrollToken;

    if (targetId !== null) {
      lockedSectionId = targetId;
      activeSectionId = targetId;
      setActiveNavLink(targetId);
      setScrollingNavLink(targetId);
    } else {
      lockedSectionId = null;
      setScrollingNavLink(null);
    }

    const handleEnd = (completed) => {
      if (token === activeScrollToken) {
        setScrollingNavLink(null);
        lockedSectionId = null;
        activeSectionId = null;

        if (completed && hash) {
          try {
            history.replaceState(null, "", hash);
          } catch (error) {}
        }

        updateOnScroll();
      }

      onEnd?.(completed);
    };

    scroller.scrollTo(targetY, {
      onComplete: () => handleEnd(true),
      onCancel: () => handleEnd(false),
    });
  };

  const requestTick = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateOnScroll);
    }
  };

  window.addEventListener("scroll", requestTick, {
    passive: true,
  });
  updateOnScroll();

  backToTopButton?.addEventListener("click", () => {
    backToTopButton.classList.add("is-scrolling");

    startProgrammaticScroll(0, {
      targetId: "",
      onEnd: () => {
        backToTopButton.classList.remove("is-scrolling");
      },
    });
  });

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href) return;

      if (href === "#") {
        event.preventDefault();
        startProgrammaticScroll(0, { targetId: "" });
        return;
      }

      const targetId = href.slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      event.preventDefault();

      const marginTop =
        parseFloat(getComputedStyle(targetEl).scrollMarginTop) || 0;
      const targetTop = Math.max(
        0,
        targetEl.getBoundingClientRect().top + window.scrollY - marginTop,
      );

      startProgrammaticScroll(targetTop, {
        targetId,
        hash: href,
      });
    });
  });
}
