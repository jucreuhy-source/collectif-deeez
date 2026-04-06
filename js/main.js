/* ================================================
   COLLECTIF DESIGN — JS v2
   ================================================ */

/* ─── Typewriter ────────────────────────────────
   Adapté du composant React Typewriter (framer-motion)
   vers du vanilla JS pur — même logique d'état :
   typing → wait → deleting → next word → loop
   ─────────────────────────────────────────────── */
function initTypewriter({
  words       = [],
  speed       = 60,
  deleteSpeed = 35,
  waitTime    = 1800,
  initialDelay = 400,
  wordEl,
  cursorEl,
}) {
  if (!wordEl || !words.length) return;

  let wordIndex   = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let displayText = "";

  function tick() {
    const current = words[wordIndex];

    if (isDeleting) {
      // ── Deleting ──
      displayText = current.slice(0, charIndex - 1);
      charIndex--;
      cursorEl && cursorEl.classList.add('typing');
      wordEl.textContent = displayText;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
        cursorEl && cursorEl.classList.remove('typing');
        setTimeout(tick, 300);       // tiny pause before next word
      } else {
        setTimeout(tick, deleteSpeed);
      }

    } else {
      // ── Typing ──
      displayText = current.slice(0, charIndex + 1);
      charIndex++;
      cursorEl && cursorEl.classList.add('typing');
      wordEl.textContent = displayText;

      if (charIndex === current.length) {
        // Word complete — wait, then delete
        cursorEl && cursorEl.classList.remove('typing');
        setTimeout(() => { isDeleting = true; tick(); }, waitTime);
      } else {
        setTimeout(tick, speed);
      }
    }
  }

  setTimeout(tick, initialDelay);
}

document.addEventListener('DOMContentLoaded', () => {

  // ─── Typewriter hero ────────────────────────
  initTypewriter({
    wordEl  : document.getElementById('typewriter-word'),
    cursorEl: document.getElementById('typewriter-cursor'),
    words: [
      'réinventé.',
      'sublimé.',
      'perfectionné.',
      'transformé.',
      'repensé.',
      'magnifié.',
      'révolutionné.',
      'métamorphosé.',
      'transcendé.',
      'redéfini.',
      'façonné.',
      'réincarné.',
    ],
    speed       : 65,
    deleteSpeed : 32,
    waitTime    : 1700,
    initialDelay: 800,
  });

  // ─── Loader ─────────────────────────────────
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('out'), 500);
  });


  // ─── Nav scroll ─────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  // ─── Burger menu ────────────────────────────
  const burger  = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
  });

  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
    })
  );


  // ─── Scroll reveal (général) ─────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


  // ─── Services — animation en cascade ─────────
  // Chaque carte entre 110ms après la précédente.
  // À l'intérieur : icône (pop), titre (slide), texte (fade) en séquence.
  const STAGGER    = 110;  // ms entre chaque carte
  const BASE_ICON  = 260;  // ms après la carte pour l'icône
  const BASE_TITLE = 360;  // ms après la carte pour le titre
  const BASE_TEXT  = 440;  // ms après la carte pour le texte

  const svcCards = document.querySelectorAll('.svc-anim');

  const svcObserver = new IntersectionObserver((entries) => {
    // On déclenche dès qu'UNE carte de la grille est visible
    // puis on enchaîne toutes les cartes non-encore animées
    const anyVisible = entries.some(e => e.isIntersecting);
    if (!anyVisible) return;

    svcObserver.disconnect(); // une seule passe

    svcCards.forEach((card, i) => {
      const cardDelay = i * STAGGER;

      // 1. La carte elle-même
      setTimeout(() => card.classList.add('svc-visible'), cardDelay);

      // 2. Icône — délai relatif à la carte + override inline
      const icon = card.querySelector('.svc__icon');
      if (icon) {
        icon.style.transitionDelay = `${BASE_ICON}ms`;
      }

      // 3. Titre
      const h3 = card.querySelector('h3');
      if (h3) h3.style.transitionDelay = `${BASE_TITLE}ms`;

      // 4. Texte
      const p = card.querySelector('p');
      if (p) p.style.transitionDelay = `${BASE_TEXT}ms`;

      // Remettre les delays à 0 une fois visible
      // pour que le hover/unhover CSS reste fluide
      setTimeout(() => {
        if (icon) icon.style.transitionDelay  = '0ms';
        if (h3)   h3.style.transitionDelay    = '0ms';
        if (p)    p.style.transitionDelay     = '0ms';
      }, cardDelay + BASE_TEXT + 450);
    });

  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Observer seulement la première carte — suffit à déclencher la cascade
  if (svcCards.length) svcObserver.observe(svcCards[0]);


  // ─── Smooth anchor scroll (offset nav) ──────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      ) || 72;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });


  // ─── Contact form ────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
        style="width:1rem;height:1rem;animation:spin .8s linear infinite">
        <circle cx="12" cy="12" r="10" opacity=".2"/>
        <path d="M12 2a10 10 0 0110 10" stroke-linecap="round"/>
      </svg> Envoi en cours…`;

      setTimeout(() => {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          style="width:1rem;height:1rem"><polyline points="20 6 9 17 4 12"/></svg> Message envoyé !`;
        btn.style.background = '#1a8a4a';
        btn.style.borderColor = '#1a8a4a';

        setTimeout(() => {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.disabled = false;
          form.reset();
        }, 3500);
      }, 1800);
    });
  }

  // Spin keyframe
  const s = document.createElement('style');
  s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);

});
