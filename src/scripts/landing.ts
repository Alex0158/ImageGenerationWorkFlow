const SCROLL_MARGIN_FALLBACK = 84;
const REVEAL_THRESHOLD = 0.12;
const CAROUSEL_INTERVAL_MS = 4800;

const revealItems = document.querySelectorAll('[data-reveal]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const correctHashScroll = (behavior: ScrollBehavior = 'auto') => {
  const rawHash = window.location.hash.slice(1);
  if (!rawHash) return;

  const id = decodeURIComponent(rawHash);
  const target = document.getElementById(id);
  if (!target) return;

  const marginTop =
    Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || SCROLL_MARGIN_FALLBACK;
  const top = target.getBoundingClientRect().top + window.scrollY - marginTop;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion ? 'auto' : behavior,
  });
};

const scheduleHashCorrection = (behavior: ScrollBehavior = 'auto') => {
  window.requestAnimationFrame(() => correctHashScroll(behavior));
};

scheduleHashCorrection();
window.addEventListener('load', () => scheduleHashCorrection());
document.fonts?.ready.then(() => scheduleHashCorrection()).catch(() => undefined);
window.addEventListener('hashchange', () => scheduleHashCorrection('smooth'));

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: REVEAL_THRESHOLD },
  );

  revealItems.forEach((item) => observer.observe(item));
}

const carousels = document.querySelectorAll<HTMLElement>('[data-carousel]');
carousels.forEach((carousel) => {
  const cards = [...carousel.querySelectorAll<HTMLElement>('[data-carousel-card]')];
  const dots = [...carousel.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]')];
  const metaItems = [...carousel.querySelectorAll<HTMLElement>('[data-carousel-meta]')];
  const current = carousel.querySelector<HTMLElement>('[data-carousel-current]');
  const prev = carousel.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const next = carousel.querySelector<HTMLButtonElement>('[data-carousel-next]');
  if (!cards.length || !current || !prev || !next) return;

  let active = 0;
  let timer: number | undefined;

  const setActive = (nextIndex: number) => {
    active = (nextIndex + cards.length) % cards.length;
    current.textContent = String(active + 1).padStart(2, '0');

    cards.forEach((card, index) => {
      const offset = (index - active + cards.length) % cards.length;
      const reverseOffset = (active - index + cards.length) % cards.length;
      let slot = 'hidden';
      if (offset === 0) slot = 'active';
      else if (offset === 1) slot = 'next';
      else if (offset === 2) slot = 'far-next';
      else if (reverseOffset === 1) slot = 'prev';
      else if (reverseOffset === 2) slot = 'far-prev';

      card.dataset.slot = slot;
      card.setAttribute('aria-hidden', slot === 'hidden' ? 'true' : 'false');
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === active);
      dot.setAttribute('aria-current', index === active ? 'true' : 'false');
    });

    metaItems.forEach((item, index) => {
      item.classList.toggle('is-active', index === active);
    });
  };

  const start = () => {
    if (prefersReducedMotion) return;
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(() => setActive(active + 1), CAROUSEL_INTERVAL_MS);
  };

  prev.addEventListener('click', () => {
    setActive(active - 1);
    start();
  });
  next.addEventListener('click', () => {
    setActive(active + 1);
    start();
  });
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.dataset.index);
      if (!Number.isNaN(idx)) setActive(idx);
      start();
    });
  });
  carousel.addEventListener('mouseenter', () => {
    if (timer) window.clearInterval(timer);
  });
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', () => {
    if (timer) window.clearInterval(timer);
  });
  carousel.addEventListener('focusout', start);

  setActive(0);
  start();
});

const briefForm = document.querySelector<HTMLFormElement>('[data-brief-form]');
const briefStatus = document.querySelector<HTMLElement>('[data-brief-status]');
briefForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(briefForm);
  const name = String(formData.get('name') || '').trim();
  const brand = String(formData.get('brand') || '').trim();
  const contact = String(formData.get('contact') || '').trim();
  const projectType = String(formData.get('project_type') || '').trim();
  const budget = String(formData.get('budget') || '').trim();
  const timeline = String(formData.get('timeline') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!name || !contact || !projectType) {
    if (briefStatus) {
      briefStatus.textContent = 'Please fill in your name, contact, and project type.';
    }
    return;
  }

  const subject = `Project brief${brand ? `: ${brand}` : ''}`;
  const body = [
    `Name: ${name}`,
    `Brand / Project: ${brand}`,
    `Contact: ${contact}`,
    `Project type: ${projectType}`,
    `Budget range: ${budget}`,
    `Timeline: ${timeline}`,
    '',
    'Project notes:',
    message,
  ].join('\n');

  const recipient = briefForm.dataset.briefEmail || 'hello@visualatelier.studio';
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (briefStatus) {
    briefStatus.textContent = 'Opening your email app with a structured project brief...';
  }
  window.location.href = mailto;
});
