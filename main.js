// =========================
// Full UI Script — Stable & Corrected with Smooth Active Nav
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // helpers
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* =========================
     Smooth scroll + nav click
  ========================= */
  $$('.nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        // force update active immediately
        $$('.nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });

  /* =========================
     Dark / Light toggle (persisted)
  ========================= */
  const modeBtn = $('#modeToggle');
  const savedMode = localStorage.getItem('mode'); // 'light' or 'dark'
  if (savedMode === 'light') {
    document.body.classList.add('light-mode');
    if (modeBtn) modeBtn.innerHTML = '<i class="fa fa-sun"></i>';
  } else {
    if (modeBtn) modeBtn.innerHTML = '<i class="fa fa-moon"></i>';
  }

  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      localStorage.setItem('mode', isLight ? 'light' : 'dark');
      modeBtn.innerHTML = isLight ? '<i class="fa fa-sun"></i>' : '<i class="fa fa-moon"></i>';
    });
  }

  /* =========================
     Theme color / swatch switcher
  ========================= */
  const swatches = $$('.swatch');
  const THEME_CLASSES = ['theme-petroli', 'theme-phosphory', 'theme-azure'];

  function clearThemeClasses() {
    THEME_CLASSES.forEach(c => document.body.classList.remove(c));
  }

  function applyThemeClass(themeName) {
    clearThemeClasses();
    if (themeName && themeName !== 'default') {
      document.body.classList.add(`theme-${themeName}`);
      localStorage.setItem('theme', themeName);
      localStorage.removeItem('skin');
    } else {
      localStorage.removeItem('theme');
    }
  }

  function applySkinColor(colorValue) {
    if (!colorValue) return;
    clearThemeClasses();
    document.documentElement.style.setProperty('--skin-color', colorValue);
    localStorage.setItem('skin', colorValue);
    localStorage.removeItem('theme');
  }

  function updateActiveSwatch(selected) {
    swatches.forEach(s => {
      s.classList.remove('selected');
      s.style.borderColor = '';
    });

    if (!selected) return;
    selected.classList.add('selected');

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--skin-color')
      .trim();
    const fallback = getComputedStyle(selected).backgroundColor;
    const borderColor = accent || fallback || '#fff';
    selected.style.borderColor = borderColor;
  }

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const skin = swatch.getAttribute('data-skin');
      const theme = swatch.getAttribute('data-theme');
      if (skin) {
        applySkinColor(skin);
      } else if (theme) {
        applyThemeClass(theme);
      } else {
        const bg = getComputedStyle(swatch).backgroundColor;
        applySkinColor(bg);
      }
      updateActiveSwatch(swatch);
    });

    swatch.addEventListener('keypress', e => {
      if (e.key === 'Enter') swatch.click();
    });
  });

  (function restoreTheme() {
    const savedTheme = localStorage.getItem('theme');
    const savedSkin = localStorage.getItem('skin');

    if (savedTheme) {
      applyThemeClass(savedTheme);
      const match = swatches.find(s => s.dataset.theme === savedTheme);
      if (match) updateActiveSwatch(match);
      return;
    }

    if (savedSkin) {
      applySkinColor(savedSkin);
      const match = swatches.find(s => s.dataset.skin === savedSkin);
      if (match) updateActiveSwatch(match);
      return;
    }

    if (swatches.length) updateActiveSwatch(swatches[0]);
  })();

  /* =========================
     Typewriter effect
  ========================= */
  function typeWriter(el, text, delay = 100) {
    let i = 0;
    el.textContent = '';
    function type() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(type, delay);
      }
    }
    type();
  }
  const typeEl = document.querySelector('.typewriter');
  if (typeEl) typeWriter(typeEl, typeEl.textContent.trim(), 90);

  /* =========================
     Animate skills when visible
  ========================= */
  const skillSpans = $$('section.skills .skill-progress span');
  function animateSkills() {
    skillSpans.forEach(s => {
      const parent = s.parentElement;
      const level = s.dataset.level;
      const rect = parent.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) s.style.width = level;
    });
  }
  window.addEventListener('scroll', animateSkills);
  window.addEventListener('load', animateSkills);

  /* =========================
     Copy email (inline feedback)
  ========================= */
  const copyEmailBtn = $('#copyEmail');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const emailElem = $('#emailLink');
      const email = emailElem ? emailElem.textContent.trim() : copyEmailBtn.dataset.copy || '';
      navigator.clipboard.writeText(email).then(() => {
        const original = copyEmailBtn.textContent;
        copyEmailBtn.textContent = '✔ Copied';
        copyEmailBtn.disabled = true;
        setTimeout(() => {
          copyEmailBtn.textContent = original;
          copyEmailBtn.disabled = false;
        }, 1800);
      }).catch(() => {
        copyEmailBtn.textContent = 'Failed';
        setTimeout(() => copyEmailBtn.textContent = 'Copy', 1200);
      });
    });
  }

  /* =========================
     Scroll reveal
  ========================= */
  function revealOnScroll() {
    $$('section').forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) sec.classList.add('active');
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);

  /* =========================
     ScrollSpy — Correct Active Nav
  ========================= */
  function setActiveNav() {
    const offset = 120;
    const scrollPos = window.scrollY + offset;

    let currentSection = null;
    $$('section').forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        currentSection = sec;
      }
    });

    $$('.nav a').forEach(a => a.classList.remove('active'));
    if (currentSection) {
      const id = currentSection.id;
      const link = document.querySelector(`.nav a[href="#${id}"]`);
      if (link) link.classList.add('active');
    }
  }
  window.addEventListener('scroll', setActiveNav);
  window.addEventListener('load', setActiveNav);

}); // DOMContentLoaded
