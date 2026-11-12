(() => {
    const DEFAULT_PROJECT_VISUAL = {
        key: "default",
        icon: "code-2",
        label: "Development Project",
    };

    function renderProjectImage(project) {
        const hasProjectImage =
            typeof project.img === "string" &&
            project.img.trim().length > 0;

        if (!hasProjectImage) return "";

        return `
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
                    const cardHeader = this.parentElement;
                    const fallback =
                        cardHeader.querySelector(
                            '[data-project-fallback]'
                        );

                    fallback?.classList.remove('opacity-0');
                    fallback?.classList.add('opacity-100');
                    cardHeader.querySelector('[data-project-scrim]')?.remove();

                    this.remove();
                "
            >
            <div
                data-project-scrim
                aria-hidden="true"
                class="
                    project-scrim
                    pointer-events-none
                    absolute inset-x-0 top-0
                    z-20
                    h-24
                "
            ></div>
        `;
    }

    function renderTechBadges(techList = []) {
        return techList
            .map(
                (tech) => `
                    <span
                        class="
                            project-tech-chip
                            px-2.5 py-1
                            text-[10px]
                            font-medium
                            rounded-full
                        "
                    >
                        ${tech}
                    </span>
                `
            )
            .join("");
    }

    function renderRepositories(repositories = []) {
        return repositories
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
    }

    function renderLiveDemoLink(detailUrl) {
        if (!detailUrl) return "";

        return `
            <a
                href="${detailUrl}"
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
        `;
    }

    function renderFeaturedBadge(isFeatured) {
        if (!isFeatured) return "";

        return `
            <span
                class="
                    project-featured-badge
                    absolute z-30 top-4 left-4
                    px-3 py-1
                    text-[10px]
                    font-medium
                    uppercase tracking-wider
                    rounded-full
                "
            >
                Featured
            </span>
        `;
    }

    function renderVibeBadge(isVibe) {
        if (!isVibe) return "";

        return `
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
        `;
    }

    function renderStatusBadge(status) {
        if (!status) return "";

        return `
            <span
                class="
                    project-status
                    inline-flex items-center gap-1.5
                    text-[11px]
                    text-green-400
                    mb-3
                "
            >
                <span
                    class="
                        project-status-dot
                        w-1.5 h-1.5
                        bg-green-400
                        rounded-full
                        animate-pulse
                    "
                ></span>

                ${status}
            </span>
        `;
    }

    function renderProjectCard(project, projectVisuals = {}) {
        const visual =
            projectVisuals[project.category] ||
            projectVisuals.default ||
            DEFAULT_PROJECT_VISUAL;

        const projectImageHTML = renderProjectImage(project);
        const fallbackOpacity = projectImageHTML ? "opacity-0" : "opacity-100";
        const techHTML = renderTechBadges(project.tech);
        const repoHTML = renderRepositories(project.repositories);
        const detailHTML = renderLiveDemoLink(project.detail);
        const featuredBadge = renderFeaturedBadge(project.featured);
        const vibeBadge = renderVibeBadge(project.vibe);
        const statusHTML = renderStatusBadge(project.status);

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
                        ${(project.desc || "").trim()}
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
    }

    function renderProjects(list = []) {
        const grid = document.querySelector("#project-grid");

        if (!grid) return;

        const { projectVisuals = {} } = window.PORTFOLIO_DATA || {};

        grid.innerHTML = list
            .map((project) => renderProjectCard(project, projectVisuals))
            .join("");

        // Lucide icons được thêm bằng innerHTML
        window.lucide?.createIcons();
    }

    function initProjects() {
        const { projects = [] } = window.PORTFOLIO_DATA || {};
        renderProjects(projects);
    }

    window.PORTFOLIO_RENDER = {
        initProjects,
        renderProjects,
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initProjects);
    } else {
        initProjects();
    }
})();
