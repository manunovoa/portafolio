// ---------- Año en footer ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Menú móvil ----------
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Reveal on scroll ----------
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ---------- Contadores animados (hero stats) ----------
const counters = document.querySelectorAll('.counter');

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10) || 0;
  if (prefersReducedMotion) {
    el.textContent = target;
    return;
  }
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counters.forEach(el => counterObserver.observe(el));

// ---------- Product cards: SKU code stagger (visual polish) ----------
document.querySelectorAll('.product-card').forEach((card, i) => {
  card.style.transitionDelay = prefersReducedMotion ? '0ms' : `${i * 35}ms`;
});

// ---------- Confetti al confirmar contacto ----------
const confettiColors = ['#FF3D8A', '#C77DFF', '#FFC94D', '#6EE7C0', '#E0197D'];
const contactBtn = document.querySelector('.section-checkout .btn-primary');

function burstConfetti(x, y) {
  if (prefersReducedMotion) return;
  const pieceCount = 26;
  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const size = 6 + Math.random() * 6;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 0.6}px`;
    piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style.left = `${x + (Math.random() * 200 - 100)}px`;
    piece.style.top = `${y}px`;
    piece.style.animationDuration = `${1.2 + Math.random() * 1.2}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2600);
  }
}

if (contactBtn) {
  contactBtn.addEventListener('click', (e) => {
    burstConfetti(e.clientX, e.clientY);
  });
}
