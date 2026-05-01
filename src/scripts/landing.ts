/* ==========================================================================
   Constants
   ========================================================================== */

const SCROLL_MARGIN_FALLBACK = 84;
const REVEAL_THRESHOLD = 0.12;
const CAROUSEL_INTERVAL_MS = 4800;
const COUNTER_DURATION_MS = 1600;
const STAGGER_DELAY_MS = 120;
const TILT_MAX_DEG = 6;
const ACTIVE_CARD_SETTLE_MS = 720;

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const prefersReducedMotion = () => reducedMotionQuery.matches;

document.documentElement.classList.add('is-enhanced');

/**
 * Get fallback scroll-margin-top in case CSS variable is unavailable.
 */
const getScrollMarginFallback = () => {
  const cssValue = getComputedStyle(document.documentElement)
    .getPropertyValue('--scroll-margin-top')
    .trim()
    .replace('px', '');
  const parsed = Number.parseFloat(cssValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : SCROLL_MARGIN_FALLBACK;
};

const decodeHash = (raw: string) => {
  try {
    return decodeURIComponent(raw);
  } catch (_error) {
    return raw;
  }
};

const showAllRevealsImmediately = (items: NodeListOf<HTMLElement>) => {
  items.forEach((item) => {
    item.classList.add('is-visible');
  });
};

/* ==========================================================================
   Hash scroll correction
   ========================================================================== */

const correctHashScroll = (behavior: ScrollBehavior = 'auto') => {
  const rawHash = window.location.hash.slice(1);
  if (!rawHash) return;

  const id = decodeHash(rawHash);
  const target = document.getElementById(id);
  if (!target) return;

  const marginTop = Number.parseFloat(window.getComputedStyle(target).scrollMarginTop) || getScrollMarginFallback();
  const top = target.getBoundingClientRect().top + window.scrollY - marginTop;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion() ? 'auto' : behavior,
  });
};

const scheduleHashCorrection = (behavior: ScrollBehavior = 'auto') => {
  requestAnimationFrame(() => correctHashScroll(behavior));
};

scheduleHashCorrection();
window.addEventListener('load', () => scheduleHashCorrection());
document.fonts?.ready.then(() => scheduleHashCorrection()).catch(() => undefined);
window.addEventListener('hashchange', () => scheduleHashCorrection('smooth'));

/* ==========================================================================
   Scroll reveal (with stagger support)
   ========================================================================== */

const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
const staggerContainers = document.querySelectorAll<HTMLElement>('[data-stagger]');
const staggerChildren = new Set<Element>();

staggerContainers.forEach((container) => {
  container.querySelectorAll('[data-reveal]').forEach((child) => staggerChildren.add(child));
});

if (prefersReducedMotion()) {
  showAllRevealsImmediately(revealItems);
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: REVEAL_THRESHOLD },
  );

  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const children = [...entry.target.querySelectorAll<HTMLElement>('[data-reveal]')];
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * STAGGER_DELAY_MS}ms`;
          requestAnimationFrame(() => child.classList.add('is-visible'));
        });

        staggerObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08 },
  );

  revealItems.forEach((item) => {
    if (!staggerChildren.has(item)) revealObserver.observe(item);
  });
  staggerContainers.forEach((container) => staggerObserver.observe(container));
}

/* ==========================================================================
   Hero proof drop-in
   ========================================================================== */

const proofDrop = document.querySelector<HTMLElement>('[data-proof-drop]');
if (proofDrop) {
  const revealProofDrop = () => proofDrop.classList.add('is-proof-ready');

  if (prefersReducedMotion()) {
    revealProofDrop();
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(revealProofDrop);
    });
  }
}

/* ==========================================================================
   Proof strip counter animation
   ========================================================================== */

const proofStrip = document.querySelector('.proof-strip');
if (proofStrip) {
  const counters = [...proofStrip.querySelectorAll<HTMLElement>('[data-count-target]')];

  const animateCounter = (el: HTMLElement) => {
    const target = el.dataset.countTarget ?? '';
    const numericMatch = target.match(/^([0-9]+)$/);

    if (!numericMatch) {
      el.style.opacity = '0';
      requestAnimationFrame(() => {
        el.style.transition = 'opacity .8s var(--ease)';
        el.style.opacity = '1';
        el.textContent = target;
      });
      return;
    }

    const end = Number.parseInt(numericMatch[1], 10);
    const startTime = performance.now();
    el.textContent = '0';

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / COUNTER_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(eased * end));

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (prefersReducedMotion()) {
    counters.forEach((el) => {
      el.textContent = el.dataset.countTarget ?? '';
    });
  } else {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          counters.forEach((el, i) => {
            setTimeout(() => animateCounter(el), i * STAGGER_DELAY_MS);
          });
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.3 },
    );

    counterObserver.observe(proofStrip);
  }
}

/* ==========================================================================
   Work card 3D tilt effect
   ========================================================================== */

if (!prefersReducedMotion()) {
  const workCards = document.querySelectorAll<HTMLElement>('.work-card');

  workCards.forEach((card) => {
    const image = card.querySelector<HTMLElement>('.work-image');
    if (!image) return;

    card.addEventListener('mousemove', (e: MouseEvent) => {
      if (prefersReducedMotion()) return;
      const rect = image.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * TILT_MAX_DEG;
      const rotateY = (x - 0.5) * TILT_MAX_DEG;

      image.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      image.style.transform = '';
    });
  });
}

/* ==========================================================================
   Scroll progress bar
   ========================================================================== */

if (!prefersReducedMotion()) {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progressBar);

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
}

/* ==========================================================================
   Carousel
   ========================================================================== */

type CarouselController = {
  start: () => void;
  stop: () => void;
};

const carouselControllers: CarouselController[] = [];

const mountCarousel = (carousel: HTMLElement) => {
  const cards = [...carousel.querySelectorAll<HTMLElement>('[data-carousel-card]')];
  const dots = [...carousel.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]')];
  const metaItems = [...carousel.querySelectorAll<HTMLElement>('[data-carousel-meta]')];
  const current = carousel.querySelector<HTMLElement>('[data-carousel-current]');
  const prev = carousel.querySelector<HTMLButtonElement>('[data-carousel-prev]');
  const next = carousel.querySelector<HTMLButtonElement>('[data-carousel-next]');
  if (!cards.length || !current || !prev || !next) return;

  let active = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;

  const settleActiveCard = () => {
    cards.forEach((card) => card.classList.remove('is-settling'));
    if (prefersReducedMotion()) return;

    const activeCard = cards[active];
    if (!activeCard) return;

    activeCard.classList.add('is-settling');
    if (settleTimer) window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      activeCard.classList.remove('is-settling');
    }, ACTIVE_CARD_SETTLE_MS);
  };

  const setActive = (nextIndex: number) => {
    const total = cards.length;
    active = ((nextIndex % total) + total) % total;
    current.textContent = String(active + 1).padStart(2, '0');

    cards.forEach((card, index) => {
      const offset = (index - active + total) % total;
      const reverseOffset = (active - index + total) % total;

      let slot = 'hidden';
      if (offset === 0) {
        slot = 'active';
      } else if (offset === 1) {
        slot = 'next';
      } else if (offset === 2) {
        slot = 'far-next';
      } else if (reverseOffset === 1) {
        slot = 'prev';
      } else if (reverseOffset === 2) {
        slot = 'far-prev';
      }

      card.dataset.slot = slot;
      card.setAttribute('aria-hidden', slot === 'active' ? 'false' : 'true');
    });

    dots.forEach((dot, index) => {
      const isActive = index === active;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      dot.tabIndex = isActive ? 0 : -1;
    });

    const activeDot = dots[active];
    const dotScroller = activeDot?.parentElement;
    if (activeDot && dotScroller) {
      const scrollerRect = dotScroller.getBoundingClientRect();
      const dotRect = activeDot.getBoundingClientRect();
      if (dotRect.left < scrollerRect.left || dotRect.right > scrollerRect.right) {
        dotScroller.scrollTo({
          left: activeDot.offsetLeft - dotScroller.clientWidth / 2 + activeDot.clientWidth / 2,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      }
    }

    metaItems.forEach((item, index) => {
      item.classList.toggle('is-active', index === active);
    });

    settleActiveCard();
  };

  const stop = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };

  const start = () => {
    stop();
    if (prefersReducedMotion()) return;

    timer = window.setInterval(() => {
      setActive(active + 1);
    }, CAROUSEL_INTERVAL_MS);
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
      if (Number.isNaN(idx)) return;
      setActive(idx);
      start();
    });
  });

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('pointerdown', stop);
  carousel.addEventListener('pointerup', () => {
    window.setTimeout(start, CAROUSEL_INTERVAL_MS);
  });
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget as Node | null)) {
      start();
    }
  });

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActive(active - 1);
      start();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActive(active + 1);
      start();
    }
  });

  const controls = carousel.querySelector<HTMLElement>('.showcase-dots');
  const tablistId = controls?.id || `showcase-tabs-${Math.random().toString(36).slice(2, 8)}`;
  dots.forEach((dot, index) => {
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-setsize', String(dots.length));
    dot.setAttribute('aria-posinset', String(index + 1));
    if (!dot.id) {
      dot.setAttribute('id', `${tablistId}-tab-${index}`);
    }
    dot.tabIndex = index === active ? 0 : -1;
    const controlsId = dot.dataset.controls ?? cards[index]?.id;
    if (controlsId) {
      dot.setAttribute('aria-controls', controlsId);
    }

    const panel = metaItems[index]?.id ? `${metaItems[index].id}` : '';
    if (panel) {
      dot.setAttribute('aria-describedby', panel);
    }
  });
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Signature showcase carousel');
  controls?.setAttribute('role', 'tablist');
  controls?.setAttribute('aria-label', 'Showcase work items');
  if (controls && !controls.id) {
    controls.setAttribute('id', tablistId);
  }

  setActive(0);
  start();

  return { start, stop };
};

const carousels = document.querySelectorAll<HTMLElement>('[data-carousel]');
carousels.forEach((carousel) => {
  const controller = mountCarousel(carousel);
  if (controller) {
    carouselControllers.push(controller);
  }
});

const syncCarouselMotion = () => {
  carouselControllers.forEach((controller) => {
    if (prefersReducedMotion()) {
      controller.stop();
      return;
    }
    controller.start();
  });
};

reducedMotionQuery.addEventListener('change', syncCarouselMotion);

/* ==========================================================================
   Brief form
   ========================================================================== */

const briefForm = document.querySelector<HTMLFormElement>('[data-brief-form]');
const briefStatus = document.querySelector<HTMLElement>('[data-brief-status]');
const briefIntentLinks = document.querySelectorAll<HTMLElement>('[data-brief-intent]');
const selectedBrief = document.querySelector<HTMLElement>('[data-brief-selected]');
const selectedBriefTitle = document.querySelector<HTMLElement>('[data-brief-selected-title]');
const selectedBriefMeta = document.querySelector<HTMLElement>('[data-brief-selected-meta]');
const selectedScopeField = document.querySelector<HTMLInputElement>('[data-selected-scope]');
const briefSourceField = document.querySelector<HTMLInputElement>('[data-brief-source]');
const whatsappFallback = document.querySelector<HTMLAnchorElement>('[data-brief-whatsapp]');
const copyBriefButton = document.querySelector<HTMLButtonElement>('[data-brief-copy]');
const getFormField = (id: string) => document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;

const setBriefStatus = (text: string, isError = false) => {
  if (!briefStatus) return;
  briefStatus.textContent = text;
  briefStatus.classList.toggle('is-error', isError);
};

const setFieldErrorState = (fieldId: string, isError: boolean) => {
  const field = getFormField(fieldId);
  const fieldContainer = field?.closest('.form-field');
  if (!field || !fieldContainer) return;

  field.setAttribute('aria-invalid', isError ? 'true' : 'false');
  fieldContainer.classList.toggle('is-invalid', isError);
};

const focusField = (fieldId: string) => {
  const field = getFormField(fieldId);
  if (!field) return;

  field.focus();
  field.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
};

const isContactFieldUsable = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes('@')) return true;

  const digits = trimmed.replace(/[^0-9]/g, '');
  return digits.length >= 6;
};

const resetFormStatus = () => {
  if (!briefStatus) return;
  briefStatus.textContent = '';
  briefStatus.classList.remove('is-error');
};

const setSelectValueIfOptionExists = (fieldId: string, value: string) => {
  const field = getFormField(fieldId);
  if (!(field instanceof HTMLSelectElement) || !value) return;
  const option = [...field.options].find((item) => item.value === value || item.textContent === value);
  if (option) field.value = option.value;
};

const applyBriefIntent = (trigger: HTMLElement) => {
  const intent = trigger.dataset.briefIntent ?? '';
  const projectType = trigger.dataset.briefProjectType ?? '';
  const budget = trigger.dataset.briefBudget ?? '';
  const source = trigger.dataset.briefSource ?? trigger.textContent?.trim() ?? '';
  if (selectedScopeField) selectedScopeField.value = intent;
  if (briefSourceField) briefSourceField.value = source;
  setSelectValueIfOptionExists('project-type', projectType);
  setSelectValueIfOptionExists('budget', budget);
  if (selectedBrief && selectedBriefTitle && selectedBriefMeta && intent) {
    selectedBrief.hidden = false;
    selectedBriefTitle.textContent = intent;
    selectedBriefMeta.textContent = [budget, projectType].filter(Boolean).join(' / ');
  }
};

briefIntentLinks.forEach((link) => {
  link.addEventListener('click', () => applyBriefIntent(link));
});

const buildBriefText = (formData: FormData) => [
  `Name: ${String(formData.get('name') || '').trim()}`,
  `Brand / Project: ${String(formData.get('brand') || '').trim()}`,
  `Contact: ${String(formData.get('contact') || '').trim()}`,
  `Selected scope: ${String(formData.get('selected_scope') || '').trim() || 'Not selected'}`,
  `CTA source: ${String(formData.get('brief_source') || '').trim() || 'Direct form'}`,
  `Project type: ${String(formData.get('project_type') || '').trim()}`,
  `Budget range: ${String(formData.get('budget') || '').trim()}`,
  `Timeline: ${String(formData.get('timeline') || '').trim()}`,
  '',
  'Project notes:',
  String(formData.get('message') || '').trim() || 'No extra notes yet.',
].join('\n');

const updateBriefFallbacks = (briefText: string, subject: string) => {
  const recipient = briefForm?.dataset.briefEmail || 'hello@visualatelier.studio';
  if (whatsappFallback) {
    const baseUrl = whatsappFallback.href.split('?')[0];
    whatsappFallback.href = `${baseUrl}?text=${encodeURIComponent(`Project brief for ${recipient}\n\n${briefText}`)}`;
  }
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(briefText)}`;
};

copyBriefButton?.addEventListener('click', async () => {
  if (!briefForm) return;
  const formData = new FormData(briefForm);
  const brand = String(formData.get('brand') || '').trim();
  const subject = `Project brief${brand ? `: ${brand}` : ''}`;
  const briefText = buildBriefText(formData);
  updateBriefFallbacks(briefText, subject);
  try {
    await navigator.clipboard.writeText(briefText);
    setBriefStatus('Brief text copied. You can paste it into email or WhatsApp.');
  } catch {
    setBriefStatus('Copy failed. You can still use the WhatsApp or email fallback links.', true);
  }
});

briefForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  resetFormStatus();

  const formData = new FormData(briefForm);
  const name = String(formData.get('name') || '').trim();
  const brand = String(formData.get('brand') || '').trim();
  const contact = String(formData.get('contact') || '').trim();
  const projectType = String(formData.get('project_type') || '').trim();
  const budget = String(formData.get('budget') || '').trim();
  const timeline = String(formData.get('timeline') || '').trim();

  const requiredFields = [
    { id: 'name', value: name, error: 'Please provide your name.' },
    { id: 'contact-method', value: contact, error: 'Please provide a valid email or phone number.' },
    { id: 'project-type', value: projectType, error: 'Please choose a project type.' },
    { id: 'budget', value: budget, error: 'Please choose a budget range.' },
    { id: 'timeline', value: timeline, error: 'Please choose a timeline.' },
  ];

  requiredFields.forEach((field) => setFieldErrorState(field.id, false));

  const invalid = requiredFields.find((field) => !field.value);
  if (invalid) {
    setFieldErrorState(invalid.id, true);
    setBriefStatus(invalid.error, true);
    focusField(invalid.id);
    return;
  }

  if (!isContactFieldUsable(contact)) {
    setFieldErrorState('contact-method', true);
    setBriefStatus('Please provide a valid email or phone number so I can reply directly.', true);
    focusField('contact-method');
    return;
  }

  const subject = `Project brief${brand ? `: ${brand}` : ''}`;
  const body = buildBriefText(formData);
  const mailto = updateBriefFallbacks(body, subject);

  setBriefStatus('Opening your email app with a structured project brief. If it does not open, use WhatsApp or copy the brief below.');

  try {
    window.location.href = mailto;
  } catch {
    setBriefStatus('Unable to launch your email app. Please contact me directly.', true);
  }
});
