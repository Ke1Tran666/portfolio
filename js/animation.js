// ===== HELPERS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

document.addEventListener("DOMContentLoaded", () => {
    initTheme();

    lucide.createIcons();

    initMenu();
    initTyping();
    initFadeIn();
    initCounters();
    initProjects();
    initFilter();
    initForm();
    initBackToTop();
    initActiveNav();
});

// THEME
const THEME_STORAGE_KEY = "portfolio-theme";

function getStoredTheme() {
    try {
        const savedTheme = localStorage.getItem(
            THEME_STORAGE_KEY
        );

        return savedTheme === "light" ||
            savedTheme === "dark"
            ? savedTheme
            : null;
    } catch (error) {
        return null;
    }
}

function getSystemTheme() {
    return window.matchMedia(
        "(prefers-color-scheme: light)"
    ).matches
        ? "light"
        : "dark";
}

function applyTheme(theme, persist = false) {
    const validTheme =
        theme === "light" ? "light" : "dark";

    document.documentElement.dataset.theme = validTheme;
    document.documentElement.style.colorScheme = validTheme;

    if (persist) {
        try {
            localStorage.setItem(
                THEME_STORAGE_KEY,
                validTheme
            );
        } catch (error) {
            // Trình duyệt chặn localStorage
        }
    }

    const isLightTheme = validTheme === "light";

    $$('[data-theme-icon="sun"]').forEach((icon) => {
        icon.classList.toggle("hidden", isLightTheme);
    });

    $$('[data-theme-icon="moon"]').forEach((icon) => {
        icon.classList.toggle("hidden", !isLightTheme);
    });

    $$("[data-theme-toggle]").forEach((button) => {
        const nextTheme = isLightTheme
            ? "dark"
            : "light";

        const nextThemeLabel = isLightTheme
            ? "tối"
            : "sáng";

        button.setAttribute(
            "aria-label",
            `Chuyển sang giao diện ${nextThemeLabel}`
        );

        button.setAttribute(
            "title",
            `Chuyển sang giao diện ${nextThemeLabel}`
        );

        button.setAttribute(
            "aria-pressed",
            String(isLightTheme)
        );

        button.dataset.nextTheme = nextTheme;
    });
}

function initTheme() {
    const currentTheme =
        document.documentElement.dataset.theme ||
        getStoredTheme() ||
        getSystemTheme();

    applyTheme(currentTheme);

    $$("[data-theme-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
            const activeTheme =
                document.documentElement.dataset.theme;

            const nextTheme =
                activeTheme === "light"
                    ? "dark"
                    : "light";

            applyTheme(nextTheme, true);
        });
    });

    const systemThemeQuery = window.matchMedia(
        "(prefers-color-scheme: light)"
    );

    systemThemeQuery.addEventListener(
        "change",
        (event) => {
            /*
             * Chỉ theo theme hệ thống nếu người dùng
             * chưa tự chọn theme.
             */
            if (getStoredTheme()) return;

            applyTheme(
                event.matches ? "light" : "dark"
            );
        }
    );

    requestAnimationFrame(() => {
        document.documentElement.classList.add(
            "theme-ready"
        );
    });
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

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        mobileMenu.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );
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
        const menuIsOpen =
            mobileMenu.classList.contains("open");

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

// TYPING EFFECT
function initTyping() {
    const phrases = [
        "Full-stack Developer với React & Java Spring Boot.",
        "Tôi xây frontend với ReactJS & Tailwind CSS.",
        "Tôi phát triển REST API với Java & Spring Boot.",
        "Tôi làm việc với Spring Security & SQL Server.",
        "Tôi xây dựng ứng dụng từ frontend đến backend.",
    ];

    const el = $("#typed-text");

    if (!el) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
        const text = phrases[phraseIndex];

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
            phraseIndex = (phraseIndex + 1) % phrases.length;
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

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (!entry.isIntersecting) return;

                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, index * 50);

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.1,
        }
    );

    elements.forEach((element) => observer.observe(element));
}

// COUNTERS
function initCounters() {
    const projectElement = $("#stat-projects");

    if (!projectElement) return;

    const animate = (element, target, suffix = "") => {
        if (!element) return;

        let count = 0;
        const step = Math.max(1, Math.ceil(target / 35));

        const interval = setInterval(() => {
            count += step;

            if (count >= target) {
                count = target;
                clearInterval(interval);
            }

            element.textContent = `${count}${suffix}`;
        }, 40);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                // Các project được nhóm theo sản phẩm thay vì số repo
                animate($("#stat-projects"), projects.length, "+");

                // Các technology chính đang sử dụng
                animate($("#stat-tech"), 15, "+");

                // Repo public hiện có trên GitHub
                animate($("#stat-repos"), 13, "+");

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.5,
        }
    );

    observer.observe(projectElement);
}

// PROJECT DATA
const projects = [
    {
        title: "Garment Design System",

        subtitle: "Full-stack Garment Manufacturing Service Platform",

        desc: `
            Hệ thống full-stack phục vụ lĩnh vực may mặc,
            cho phép quản lý người dùng, dịch vụ, đơn hàng,
            file sản phẩm, đánh giá, dashboard và các quy trình khách hàng.
        `,

        img: "./assets/images/imgProjects/ke1tran666.github.io_Garment-design-landingPage_.png",

        category: "fullstack",

        tech: [
            "React",
            "Spring Boot",
            "Spring Security",
            "SQL Server",
        ],

        featured: true,

        status: "Active Development",

        detail: "https://ke1tran666.github.io/Garment-design-landingPage/",

        repositories: [
            {
                name: "Backend",
                url: "https://github.com/Ke1Tran666/garmentDesign",
            },
            {
                name: "Frontend",
                url: "https://github.com/Ke1Tran666/garmentDesign_client",
            },
            {
                name: "Landing Page",
                url: "https://github.com/Ke1Tran666/Garment-design-landingPage",
            },
        ],
    },
    {
        title: "CodemeIO",

        subtitle: "Full-stack Web Development Project",

        desc: `
            Một trong những dự án full-stack đầu tiên của tôi,
            được xây dựng để thực hành CRUD, REST API,
            tích hợp frontend/backend và tổ chức project theo nhiều layer.
        `,

        img: "",

        category: "fullstack",

        tech: [
            "Java",
            "REST API",
            "JavaScript",
            "Database",
        ],

        featured: true,

        repositories: [
            {
                name: "Backend / Original",
                url: "https://github.com/Ke1Tran666/codemeIO",
            },
            {
                name: "Frontend Remake",
                url: "https://github.com/Ke1Tran666/codemeIO-Client_remake",
            },
        ],
    },
    {
        title: "Personal Portfolio",

        subtitle: "Developer Portfolio",

        desc: `
            Portfolio cá nhân dùng để giới thiệu kỹ năng,
            dự án, công nghệ đang sử dụng và hành trình
            phát triển của tôi với vai trò Full-stack Developer.
        `,

        img: "./assets/images/imgProjects/ke1tran666.github.io_portfolio_.png",

        category: "frontend",

        tech: [
            "HTML",
            "Tailwind",
            "JavaScript",
        ],

        detail: "https://ke1tran666.github.io/portfolio/",

        repositories: [
            {
                name: "Source",
                url: "https://github.com/Ke1Tran666/portfolio",
            },
        ],
    },
    {
        title: "Learn-Skill",

        subtitle: "Learning & Technical Notes",

        desc: `
            Repository dành cho việc học và luyện tập các kỹ năng
            kỹ thuật như Git, GitHub, programming concepts,
            workflow và các ghi chú phát triển phần mềm.
        `,

        img: "",

        category: "learning",

        tech: [
            "Git",
            "GitHub",
            "Programming",
        ],

        repositories: [
            {
                name: "Repository",
                url: "https://github.com/Ke1Tran666/Learn-Skill",
            },
        ],
    },
    {
        title: "World Cup 2026 App",

        subtitle: "AI-Assisted Project",

        desc: `
            Ứng dụng thử nghiệm xoay quanh FIFA World Cup 2026,
            được phát triển theo workflow AI-assisted / vibe coding
            để thử nghiệm ý tưởng và xây dựng prototype nhanh.
        `,

        img: "./assets/images/imgProjects/ke1tran666.github.io_world-cup-2026_.png",

        category: "ai",

        tech: [
            "AI Assisted",
            "Web App",
        ],

        vibe: true,

        repositories: [
            {
                name: "Repository",
                url: "https://github.com/Ke1Tran666/world-cup-2026-app",
            },
        ],
    },

    {
        title: "ToDooList",

        subtitle: "AI-Assisted Task Management",

        desc: `
            Ứng dụng quản lý công việc được tạo như một thử nghiệm
            về rapid application development và cách sử dụng AI
            để hỗ trợ quá trình xây dựng sản phẩm.
        `,

        img: "./assets/images/imgProjects/ke1tran666.github.io_todolist_.png",

        category: "ai",

        tech: [
            "AI Assisted",
            "Task Management",
        ],

        vibe: true,

        repositories: [
            {
                name: "Repository",
                url: "https://github.com/Ke1Tran666/toDooList",
            },
        ],
    },

    {
        title: "Adobee",

        subtitle: "AI-Assisted Experiment",

        desc: `
            Project thử nghiệm được phát triển với workflow
            AI-assisted nhằm nghiên cứu rapid prototyping,
            UI implementation và cách kết hợp AI vào quá trình code.
        `,

        img: "",

        category: "ai",

        tech: [
            "AI Assisted",
            "Prototype",
        ],

        vibe: true,

        repositories: [
            {
                name: "Repository",
                url: "https://github.com/Ke1Tran666/Adobee",
            },
        ],
    },

    {
        title: "Gold & Silver Tracker",

        subtitle: "AI-Assisted Tracking Application",

        desc: `
            Ứng dụng thử nghiệm theo dõi thông tin liên quan
            đến vàng và bạc, được xây dựng bằng workflow
            AI-assisted để thử nghiệm ý tưởng sản phẩm.
        `,

        img: "./assets/images/imgProjects/ke1tran666.github.io_gold-silver-tracker_.png",

        category: "ai",

        tech: [
            "AI Assisted",
            "Tracking",
        ],

        vibe: true,

        repositories: [
            {
                name: "Repository",
                url: "https://github.com/Ke1Tran666/gold-silver-tracker",
            },
        ],
    },
];

const projectVisuals = {
    fullstack: {
        key: "fullstack",
        icon: "layers-3",
        label: "Full-stack Project",
    },

    frontend: {
        key: "frontend",
        icon: "monitor",
        label: "Frontend Project",
    },

    learning: {
        key: "learning",
        icon: "book-open",
        label: "Learning Project",
    },

    ai: {
        key: "ai",
        icon: "sparkles",
        label: "AI-Assisted Project",
    },

    default: {
        key: "default",
        icon: "code-2",
        label: "Development Project",
    },
};

// PROJECT RENDER
function initProjects() {
    renderProjects(projects);
}


function renderProjects(list) {
    const grid = $("#project-grid");

    if (!grid) return;

    grid.innerHTML = list
        .map((project) => {
            const visual =
                projectVisuals[project.category] ||
                projectVisuals.default;

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
                        transition-all
                        duration-500
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
    lucide.createIcons();
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
                "text-neutral-400"
            );

            button.classList.add(
                "bg-white",
                "text-black",
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

        const show =
            filter === "all" ||
            category === filter;

        if (show) {
            card.style.display = "";

            requestAnimationFrame(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            });
        } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";

            setTimeout(() => {
                card.style.display = "none";
            }, 300);
        }
    });
}

// CONTACT FORM
function initForm() {
    const form = $("#contact-form");

    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const button = $("#submit-btn");

        if (!button) return;

        button.innerHTML = "Đang gửi...";
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = "Gửi tin nhắn";
            button.disabled = false;

            form.reset();

            showToast(
                "Tin nhắn đã được ghi nhận!",
                "success"
            );
        }, 1200);
    });
}

// TOAST
function showToast(message, type = "success") {
    const container = $("#toast-container");

    if (!container) return;

    const toast = document.createElement("div");

    toast.className = `
        toast-in
        px-4 py-3
        bg-neutral-900
        border border-white/10
        rounded-xl
        shadow-xl
        text-sm
    `;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// BACK TO TOP
function initBackToTop() {
    const button = $("#back-to-top");

    if (!button) return;

    window.addEventListener("scroll", () => {
        const visible = window.scrollY > 500;

        button.style.opacity = visible ? "1" : "0";
        button.style.transform = visible
            ? "translateY(0)"
            : "translateY(1rem)";

        button.style.pointerEvents = visible
            ? "auto"
            : "none";
    });

    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}

// ACTIVE NAVIGATION
function initActiveNav() {
    const sections = $$("section[id]");
    const links = $$('nav a[href^="#"]');

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach((section) => {
            if (
                window.scrollY >=
                section.offsetTop - 120
            ) {
                current = section.id;
            }
        });

        links.forEach((link) => {
            link.classList.remove("text-white");

            if (
                link.getAttribute("href") ===
                `#${current}`
            ) {
                link.classList.add("text-white");
            }
        });
    });
}