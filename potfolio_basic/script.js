document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Typewriter effect on hero role line
  --------------------------------------------------------- */
  const roles = [
    'building design systems that scale.',
    'obsessing over 60fps interactions.',
    'turning Figma files into production code.',
    'making accessible interfaces the default.'
  ];

  const typewriterEl = document.getElementById('typewriter');

  if (typewriterEl) {
    if (prefersReducedMotion) {
      typewriterEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const TYPE_SPEED = 45;
      const DELETE_SPEED = 28;
      const HOLD_TIME = 1600;

      function tick() {
        const currentRole = roles[roleIndex];

        if (!deleting) {
          charIndex++;
          typewriterEl.textContent = currentRole.slice(0, charIndex);

          if (charIndex === currentRole.length) {
            deleting = true;
            setTimeout(tick, HOLD_TIME);
            return;
          }
          setTimeout(tick, TYPE_SPEED);
        } else {
          charIndex--;
          typewriterEl.textContent = currentRole.slice(0, charIndex);

          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(tick, 300);
            return;
          }
          setTimeout(tick, DELETE_SPEED);
        }
      }

      setTimeout(tick, 900); // sync with hero load sequence
    }
  }

  /* ---------------------------------------------------------
     3D cube: mouse-driven tilt (desktop) — cursor "steers" it
     while the base CSS animation keeps it slowly spinning
  --------------------------------------------------------- */
  const cubeWrap = document.getElementById('cubeWrap');
  const cube = document.getElementById('cube');

  if (cubeWrap && cube && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    let rafId = null;

    cubeWrap.addEventListener('mousemove', (e) => {
      const rect = cubeWrap.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 .. 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rotY = relX * 40;
        const rotX = relY * -40;
        cube.style.animationPlayState = 'paused';
        cube.style.transform = `rotateX(${-18 + rotX}deg) rotateY(${35 + rotY}deg)`;
      });
    });

    cubeWrap.addEventListener('mouseleave', () => {
      cube.style.animationPlayState = 'running';
      cube.style.transform = '';
    });
  }

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const rail = document.getElementById('rail');
  const scrim = document.getElementById('scrim');

  function closeNav() {
    rail.classList.remove('is-open');
    scrim.classList.remove('is-visible');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function openNav() {
    rail.classList.add('is-open');
    scrim.classList.add('is-visible');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  if (navToggle && rail && scrim) {
    navToggle.addEventListener('click', () => {
      const isOpen = rail.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });

    scrim.addEventListener('click', closeNav);

    document.querySelectorAll('.rail__link').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------------------------------------------------------
     Active section highlighting in the nav rail
     (functional wayfinding, tied to real scroll position)
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const railLinks = document.querySelectorAll('.rail__link');

  if (sections.length && railLinks.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          railLinks.forEach(link => {
            link.classList.toggle('is-active', link.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  /* ---------------------------------------------------------
     Contact form — front-end only demo handling
  --------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const sendBtn = document.getElementById('sendBtn');

  if (form && status && sendBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = 'error: missing required field(s).';
        status.style.color = '#E5675B';
        return;
      }

      const originalLabel = sendBtn.textContent;
      sendBtn.textContent = 'Sending...';
      sendBtn.disabled = true;
      status.textContent = '';

      setTimeout(() => {
        status.style.color = '#7FBE6B';
        status.textContent = 'message sent — I\'ll reply within a day or two.';
        sendBtn.textContent = originalLabel;
        sendBtn.disabled = false;
        form.reset();
      }, 900);
    });
  }

});