lucide.createIcons();

const menuToggle = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
menuClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => mobileMenu.classList.remove('open')));

// Typing
const phrases = [
    'Tôi xây giao diện với ReactJS.',
    'Tôi code backend với Java & Spring Boot.',
    'Tôi sử dụng HTML, CSS, SASS, Tailwind.',
    'Tôi làm việc với MySQL & SQL Server.',
    'Mới ra trường — nhưng không ngừng học.'
];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-text');
function typeEffect() {
    const cur = phrases[pIdx];
    typedEl.textContent = deleting ? cur.substring(0, --cIdx) : cur.substring(0, ++cIdx);
    let spd = deleting ? 25 : 50;
    if (!deleting && cIdx === cur.length) { spd = 2000; deleting = true; }
    else if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; spd = 400; }
    setTimeout(typeEffect, spd);
}
typeEffect();

// Fade in
const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 50); obs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

// Counters
function animateNum(el, target, s = '') { let c = 0; const step = Math.ceil(target / 35); const iv = setInterval(() => { c += step; if (c >= target) { c = target; clearInterval(iv); } el.textContent = c + s; }, 40); }
const sObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateNum(document.getElementById('stat-projects'), 10, '+'); animateNum(document.getElementById('stat-tech'), 10, '+'); animateNum(document.getElementById('stat-repos'), 15, '+'); sObs.unobserve(e.target); } });
}, { threshold: 0.5 });
sObs.observe(document.getElementById('stat-projects'));

// Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => { b.classList.remove('bg-white', 'text-black', 'active'); b.classList.add('bg-white/5', 'text-neutral-400', 'border', 'border-white/5'); });
        btn.classList.add('bg-white', 'text-black', 'active'); btn.classList.remove('bg-white/5', 'text-neutral-400', 'border', 'border-white/5');
        const f = btn.dataset.filter;
        projectCards.forEach(card => {
            if (f === 'all' || card.dataset.category === f) {
                card.style.display = ''; card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => { card.style.transition = 'opacity 0.5s, transform 0.5s'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; });
            } else { card.style.opacity = '0'; card.style.transform = 'translateY(20px)'; setTimeout(() => card.style.display = 'none', 300); }
        });
    });
});

// Form
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.innerHTML = '<span class="animate-pulse">Đang gửi...</span>'; btn.disabled = true;
    setTimeout(() => { btn.innerHTML = '<span>Gửi tin nhắn</span><i data-lucide="send" class="w-4 h-4"></i>'; btn.disabled = false; lucide.createIcons(); this.reset(); showToast('Cảm ơn bạn! Mình sẽ phản hồi sớm nhất.', 'success'); }, 1500);
});

// Toast
function showToast(msg, type = 'success') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = 'toast-in flex items-center gap-3 px-5 py-3.5 rounded-xl bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-lg max-w-sm';
    t.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-5 h-5 ${type === 'success' ? 'text-green-500' : 'text-red-500'} flex-shrink-0"></i><span class="text-sm text-neutral-300">${msg}</span>`;
    c.appendChild(t); lucide.createIcons();
    setTimeout(() => { t.classList.remove('toast-in'); t.classList.add('toast-out'); setTimeout(() => t.remove(), 400); }, 3500);
}

// Back to top
const btt = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) { btt.style.opacity = '1'; btt.style.transform = 'translateY(0)'; btt.style.pointerEvents = 'auto'; }
    else { btt.style.opacity = '0'; btt.style.transform = 'translateY(16px)'; btt.style.pointerEvents = 'none'; }
});
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Nav active
const secs = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');
window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    navLinks.forEach(l => { l.classList.remove('text-white'); if (l.getAttribute('href') === `#${cur}`) l.classList.add('text-white'); });
});