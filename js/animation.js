// ===== HELPERS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

document.addEventListener("DOMContentLoaded", () => {
    window.lucide?.createIcons();

    initMenu();
    initTyping();
    initFadeIn();
    initProjects();
    initFilter();
    initCopyEmail();
    initScrollEffects();
});

function prefersReducedMotion() {
    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
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

        menuToggle.setAttribute("aria-expanded",String(isOpen));

        mobileMenu.setAttribute("aria-hidden",String(!isOpen));
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
        }
    );

    elements.forEach((element) => observer.observe(element));
}

// PROJECT RENDER
const DEFAULT_PROJECT_VISUAL = {
    key: "default",
    icon: "code-2",
    label: "Development Project",
};

function initProjects() {
    const { projects = [] } = window.PORTFOLIO_DATA || {};
    renderProjects(projects);
}


function renderProjects(list) {
    const grid = $("#project-grid");

    if (!grid) return;

    const { projectVisuals = {} } = window.PORTFOLIO_DATA || {};

    grid.innerHTML = list
        .map((project) => {
            const visual =
                projectVisuals[project.category] ||
                projectVisuals.default ||
                DEFAULT_PROJECT_VISUAL;

            const hasProjectImage =
                typeof project.img === "string" &&
                project.img.trim().length > 0;

            const fallbackOpacity = hasProjectImage
                ? "opacity-0"
                : "opacity-100";

            const projectImageHTML = hasProjectImage
                ? `
                    <img
                        src="${project.img}"
                        alt="Ảnh xem trước dự án ${project.title}"
                        loading="lazy"
                        class="
                            proj-img
                            absolute inset-0
                            z-10
                            w-full h-full
                            object-cover
                            opacity-70
                            group-hover:opacity-90
                            group-hover:scale-[1.03]
                            transition-all
                            duration-700
                        "
                        onerror="
                            const fallback =
                                this.parentElement.querySelector(
                                    '[data-project-fallback]'
                                );

                            fallback?.classList.remove('opacity-0');
                            fallback?.classList.add('opacity-100');

                            this.remove();
                        "
                    >
                `
                : "";
            const techHTML = project.tech
                .map(
                    (tech) => `
                        <span
                            class="
                                px-2 py-1
                                text-[10px]
                                bg-black/60
                                backdrop-blur-md
                                border border-white/10
                                rounded-full
                                text-neutral-300
                            "
                        >
                            ${tech}
                        </span>
                    `
                )
                .join("");

            const repoHTML = project.repositories
                .map(
                    (repo) => `
                        <a
                            href="${repo.url}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="
                                inline-flex items-center gap-1.5
                                text-xs text-neutral-500
                                hover:text-white
                                transition-colors
                            "
                        >
                            <i
                                data-lucide="github"
                                class="w-3.5 h-3.5"
                            ></i>

                            ${repo.name}
                        </a>
                    `
                )
                .join("");

            const detailHTML = project.detail
                ? `
                    <a
                        href="${project.detail}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="
                            inline-flex items-center gap-1.5
                            text-xs text-blue-500
                            hover:text-blue-400
                            transition-colors
                            group/link
                        "
                    >
                        Live Demo

                        <i
                            data-lucide="external-link"
                            class="
                                w-3.5 h-3.5
                                group-hover/link:translate-x-0.5
                                group-hover/link:-translate-y-0.5
                                transition-transform
                            "
                        ></i>
                    </a>
                `
                : "";

            const featuredBadge = project.featured
                ? `
                    <span
                        class="
                            absolute z-30 top-4 left-4
                            px-3 py-1
                            text-[10px]
                            uppercase tracking-wider
                            bg-blue-500/20
                            text-blue-300
                            border border-blue-500/30
                            backdrop-blur-md
                            rounded-full
                        "
                    >
                        Featured
                    </span>
                `
                : "";

            const vibeBadge = project.vibe
                ? `
                    <span
                        class="
                            inline-flex items-center gap-1
                            px-2.5 py-1
                            rounded-full
                            bg-purple-500/10
                            border border-purple-500/20
                            text-[10px]
                            uppercase tracking-wider
                            text-purple-400
                            mb-3
                        "
                    >
                        <i
                            data-lucide="sparkles"
                            class="w-3 h-3"
                        ></i>

                        AI-Assisted
                    </span>
                `
                : "";

            const statusHTML = project.status
                ? `
                    <span
                        class="
                            inline-flex items-center gap-1.5
                            text-[11px]
                            text-green-400
                            mb-3
                        "
                    >
                        <span
                            class="
                                w-1.5 h-1.5
                                bg-green-400
                                rounded-full
                                animate-pulse
                            "
                        ></span>

                        ${project.status}
                    </span>
                `
                : "";

            return `
                <article
                    class="
                        project-card
                        bg-neutral-900/50
                        border border-white/5
                        rounded-2xl
                        overflow-hidden
                        group
                        hover:border-white/10
                    "
                    data-category="${project.category}"
                >

                    <!-- Project visual -->
                    <div
                        class="
                            project-radiant
                            project-radiant--${visual.key}
                            relative
                            aspect-video
                            overflow-hidden
                            bg-neutral-900
                        "
                    >
                        ${projectImageHTML}

                        <!-- Gradient fallback content -->
                        <div
                            data-project-fallback
                            aria-hidden="true"
                            class="
                                absolute inset-0
                                z-[5]
                                flex flex-col
                                items-center
                                justify-center
                                px-6
                                text-center
                                ${fallbackOpacity}
                                transition-opacity
                                duration-500
                            "
                        >
                            <div
                                class="
                                    project-radiant-icon
                                    w-14 h-14
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    mb-4
                                "
                            >
                                <i
                                    data-lucide="${visual.icon}"
                                    class="w-6 h-6"
                                ></i>
                            </div>

                            <div
                                class="
                                    text-[10px]
                                    uppercase
                                    tracking-[0.2em]
                                    text-white/40
                                    mb-2
                                "
                            >
                                ${visual.label}
                            </div>

                            <div
                                class="
                                    max-w-[80%]
                                    text-lg
                                    font-medium
                                    tracking-tight
                                    text-white/90
                                "
                            >
                                ${project.title}
                            </div>
                        </div>

                        ${featuredBadge}

                        <!-- Technology badges -->
                        <div
                            class="
                                absolute
                                z-30
                                top-4 right-4
                                flex flex-wrap
                                justify-end
                                gap-2
                                max-w-[70%]
                            "
                        >
                            ${techHTML}
                        </div>
                    </div>


                    <!-- Content -->
                    <div class="p-6">

                        ${vibeBadge}

                        ${statusHTML}

                        <div
                            class="
                                text-[11px]
                                uppercase
                                tracking-wider
                                text-neutral-600
                                mb-2
                            "
                        >
                            ${project.subtitle}
                        </div>

                        <h3
                            class="
                                text-xl
                                font-medium
                                mb-3
                                group-hover:text-blue-400
                                transition-colors
                                duration-300
                            "
                        >
                            ${project.title}
                        </h3>

                        <p
                            class="
                                text-sm
                                text-neutral-500
                                font-light
                                leading-relaxed
                                mb-6
                            "
                        >
                            ${project.desc.trim()}
                        </p>


                        <!-- Actions -->
                        <div
                            class="
                                flex
                                flex-wrap
                                items-center
                                gap-x-5
                                gap-y-3
                            "
                        >

                            ${detailHTML}

                            ${repoHTML}

                        </div>

                    </div>

                </article>
            `;
        })
        .join("");

    // Lucide icons được thêm bằng innerHTML
    window.lucide?.createIcons();
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
                    "active"
                );

                item.classList.add(
                    "bg-white/5",
                    "text-neutral-400",
                    "border",
                    "border-white/5"
                );
            });

            button.classList.remove(
                "bg-white/5",
                "text-neutral-400",
                "border-white/5"
            );

            button.classList.add(
                "bg-white",
                "text-black",
                "border-transparent",
                "active"
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
                    "error"
                );
                return;
            }

            const copyIcon = button.querySelector(
                '[data-copy-icon="copy"]'
            );
            const checkIcon = button.querySelector(
                '[data-copy-icon="check"]'
            );
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
    icon.dataset.lucide =
        type === "error" ? "alert-circle" : "check-circle-2";
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
function initScrollEffects() {
    const backToTopButton = $("#back-to-top");
    const sections = Array.from($$("section[id]"));
    const navLinks = Array.from($$('nav a[href^="#"]'));

    let isTopVisible = null;
    let activeSectionId = null;
    let ticking = false;

    const updateOnScroll = () => {
        ticking = false;
        const scrollY = window.scrollY;

        if (backToTopButton) {
            const shouldShow = scrollY > 500;

            if (shouldShow !== isTopVisible) {
                isTopVisible = shouldShow;
                backToTopButton.style.opacity = shouldShow ? "1" : "0";
                backToTopButton.style.transform = shouldShow
                    ? "translateY(0)"
                    : "translateY(1rem)";
                backToTopButton.style.pointerEvents = shouldShow
                    ? "auto"
                    : "none";
            }
        }

        if (sections.length && navLinks.length) {
            let current = "";
            const offset = scrollY + 120;

            for (const section of sections) {
                if (offset >= section.offsetTop) {
                    current = section.id;
                }
            }

            if (current !== activeSectionId) {
                activeSectionId = current;

                navLinks.forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${current}`;
                    link.classList.toggle("text-white", isActive);
                });
            }
        }
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
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
    });
}