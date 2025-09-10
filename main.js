// =========================
// Final UI Script — Intersection Observer ScrollSpy
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* Smooth scroll */
  $$('.nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* Dark/Light Mode */
  const modeBtn = $('#modeToggle');
  if (localStorage.getItem('mode') === 'light') {
    document.body.classList.add('light-mode');
    if (modeBtn) modeBtn.innerHTML = '<i class="fa fa-sun"></i>';
  } else if (modeBtn) {
    modeBtn.innerHTML = '<i class="fa fa-moon"></i>';
  }
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      localStorage.setItem('mode', isLight ? 'light' : 'dark');
      modeBtn.innerHTML = isLight ? '<i class="fa fa-sun"></i>' : '<i class="fa fa-moon"></i>';
    });
  }

  /* Theme Swatches */
  const swatches = $$('.swatch');
  swatches.forEach(s => {
    s.addEventListener('click', () => {
      const skin = s.dataset.skin;
      if (skin) document.documentElement.style.setProperty('--skin-color', skin);
      swatches.forEach(w => w.classList.remove('selected'));
      s.classList.add('selected');
      localStorage.setItem('skin', skin);
    });
  });
  if (localStorage.getItem('skin')) {
    document.documentElement.style.setProperty('--skin-color', localStorage.getItem('skin'));
    const match = swatches.find(s => s.dataset.skin === localStorage.getItem('skin'));
    if (match) match.classList.add('selected');
  }

  /* Typewriter */
  const typeEl = $('.typewriter');
  if (typeEl) {
    let i = 0;
    const txt = typeEl.textContent.trim();
    typeEl.textContent = '';
    function type() {
      if (i < txt.length) {
        typeEl.textContent += txt[i++];
        setTimeout(type, 90);
      }
    }
    type();
  }

  /* Animate Skills */
  const skillSpans = $$('section.skills .skill-progress span');
  function animateSkills() {
    skillSpans.forEach(s => {
      const parent = s.parentElement;
      const rect = parent.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) s.style.width = s.dataset.level;
    });
  }
  window.addEventListener('scroll', animateSkills);
  window.addEventListener('load', animateSkills);

  /* Copy Email */
  const copyBtn = $('#copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = $('#emailLink').textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = '✔ Copied';
        copyBtn.disabled = true;
        setTimeout(() => { copyBtn.textContent = original; copyBtn.disabled = false; }, 1800);
      });
    });
  }

  /* Scroll Reveal */
  const sections = $$('section');
  function revealOnScroll() {
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) sec.classList.add('active');
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);

  /* Intersection Observer for ScrollSpy */
  const navLinks = $$('.nav a');
  const observerOptions = { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = $(`.nav a[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
});
