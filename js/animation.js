// ===== INIT =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

document.addEventListener('DOMContentLoaded', () => {
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


// ===== MENU =====
function initMenu() {
    const menuToggle = $('#menu-toggle');
    const menuClose = $('#menu-close');
    const mobileMenu = $('#mobile-menu');

    menuToggle?.addEventListener('click', () => mobileMenu.classList.add('open'));
    menuClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));

    $$('.mobile-link').forEach(link =>
        link.addEventListener('click', () => mobileMenu.classList.remove('open'))
    );
}


// ===== TYPING EFFECT =====
function initTyping() {
    const phrases = [
        'Tôi xây giao diện với ReactJS.',
        'Tôi code backend với Java & Spring Boot.',
        'Tôi sử dụng HTML, CSS, SASS, Tailwind.',
        'Tôi làm việc với MySQL & SQL Server.',
        'Mới ra trường — nhưng không ngừng học.'
    ];

    const el = $('#typed-text');
    if (!el) return;

    let p = 0, c = 0, deleting = false;

    function type() {
        const text = phrases[p];
        el.textContent = deleting
            ? text.substring(0, --c)
            : text.substring(0, ++c);

        let speed = deleting ? 25 : 50;

        if (!deleting && c === text.length) {
            speed = 2000;
            deleting = true;
        } else if (deleting && c === 0) {
            deleting = false;
            p = (p + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}


// ===== FADE IN =====
function initFadeIn() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 50);
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    $$('.fade-in').forEach(el => observer.observe(el));
}


// ===== COUNTER =====
function initCounters() {
    const animate = (el, target, suffix = '') => {
        let c = 0;
        const step = Math.ceil(target / 35);

        const iv = setInterval(() => {
            c += step;
            if (c >= target) {
                c = target;
                clearInterval(iv);
            }
            el.textContent = c + suffix;
        }, 40);
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                animate($('#stat-projects'), 10, '+');
                animate($('#stat-tech'), 10, '+');
                animate($('#stat-repos'), 15, '+');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe($('#stat-projects'));
}


// ===== PROJECT DATA =====
const projects = [
    {
        title: "Portfolio",
        desc: "Trang portfolio cá nhân.",
        img: "./assets/images/imgProjects/ke1tran666.github.io_portfolio_.png",
        category: "html",
        tech: ["HTML", "CSS", "JS"],
        detail: "https://ke1tran666.github.io/portfolio/",
        github: "https://github.com/Ke1Tran666/portfolio"
    },
    {
        title: "Garment design landingPage",
        desc: "Trang landing page về thiết kế may mặc.",
        img: "./assets/images/imgProjects/ke1tran666.github.io_Garment-design-landingPage_.png",
        category: "html",
        tech: ["HTML", "CSS", "JS"],
        detail: "https://ke1tran666.github.io/Garment-design-landingPage/",
        github: "https://github.com/Ke1Tran666/Garment-design-landingPage"
    },
];


// ===== PROJECT RENDER =====
function initProjects() {
    const grid = $('#project-grid');
    if (!grid) return;

    renderProjects(projects);
}

function renderProjects(list) {
    const grid = $('#project-grid');

    grid.innerHTML = list.map(p => `
        <div class="project-card bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden group"
            data-category="${p.category}">

            <div class="relative aspect-video overflow-hidden">
                <img src="${p.img}" class="proj-img w-full h-full object-cover opacity-70">
                <div class="absolute top-4 right-4 flex gap-2">
                    ${p.tech.map(t => `
                        <span class="px-2 py-1 text-[10px] bg-black/50 border border-white/10 rounded-full">${t}</span>
                    `).join('')}
                </div>
            </div>

            <div class="p-6">
                <h3 class="text-lg font-medium mb-2 group-hover:text-red-400 transition-colors duration-300">${p.title}</h3>
                <p class="text-sm text-neutral-500 font-light leading-relaxed mb-4">${p.desc}</p>
                <div class="flex items-center gap-4">
                            <a href="${p.detail}" class="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 transition-colors group/link">Chi
                                tiết <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="external-link" aria-hidden="true" class="lucide lucide-external-link w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg></a>
                            <a href="${p.github}" class="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors"><i data-lucide="github" class="w-3.5 h-3.5"></i>Source</a>
                </div>
            </div>
        </div>
    `).join('');
}


// ===== FILTER =====
function initFilter() {
    const buttons = $$('.filter-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI active
            buttons.forEach(b => {
                b.classList.remove('bg-white', 'text-black', 'active');
                b.classList.add('bg-white/5', 'text-neutral-400', 'border', 'border-white/5');
            });

            btn.classList.add('bg-white', 'text-black', 'active');

            const filter = btn.dataset.filter;
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    const cards = $$('.project-card');

    cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;

        if (show) {
            card.style.display = '';
            requestAnimationFrame(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => card.style.display = 'none', 300);
        }
    });
}


// ===== FORM =====
function initForm() {
    const form = $('#contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const btn = $('#submit-btn');
        btn.innerHTML = 'Đang gửi...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = 'Gửi tin nhắn';
            btn.disabled = false;
            form.reset();
            showToast('Gửi thành công!', 'success');
        }, 1500);
    });
}


// ===== TOAST =====
function showToast(msg, type = 'success') {
    const container = $('#toast-container');

    const toast = document.createElement('div');
    toast.className = 'toast-in px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl';

    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}


// ===== BACK TO TOP =====
function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.style.opacity = window.scrollY > 500 ? '1' : '0';
    });

    btn.addEventListener('click', () =>
        window.scrollTo({ top: 0, behavior: 'smooth' })
    );
}


// ===== NAV ACTIVE =====
function initActiveNav() {
    const sections = $$('section[id]');
    const links = $$('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 100) {
                current = sec.id;
            }
        });

        links.forEach(link => {
            link.classList.remove('text-white');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-white');
            }
        });
    });
}