const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navBar = document.querySelector('.nav');
const yearSpan = document.getElementById('year');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('is-open');
    navToggle.setAttribute(
      'aria-expanded',
      navMenu.classList.contains('is-open'),
    );
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const handleNavShadow = () => {
  if (!navBar) return;
  if (window.scrollY > 12) {
    navBar.classList.add('is-scrolled');
  } else {
    navBar.classList.remove('is-scrolled');
  }
};

handleNavShadow();
window.addEventListener('scroll', handleNavShadow);

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const contactForm = document.querySelector('.cta__form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');

    const friendlyName = name || 'there';
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<strong>Thanks, ${friendlyName}!</strong><br/>A FixItZed concierge will call you shortly.`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 4200);

    contactForm.reset();
  });
}

const testimonialCarousel = document.querySelector('[data-carousel]');
if (testimonialCarousel) {
  const track = testimonialCarousel.querySelector('.carousel__track');
  const slides = Array.from(
    testimonialCarousel.querySelectorAll('.carousel__slide'),
  );
  const viewport = testimonialCarousel.querySelector('.carousel__viewport');
  const prevBtn = testimonialCarousel.querySelector(
    '.carousel__control--prev',
  );
  const nextBtn = testimonialCarousel.querySelector(
    '.carousel__control--next',
  );
  const dots = Array.from(
    testimonialCarousel.parentElement.querySelectorAll('.carousel__dot'),
  );
  let activeIndex = 0;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  let autoplayTimer;
  let slideWidth = 0;

  if (slides.length <= 1 || !track) {
    slides.forEach((slide) => slide.classList.add('is-active'));
    dots.forEach((dot, dotIndex) =>
      dot.setAttribute('aria-pressed', dotIndex === 0 ? 'true' : 'false'),
    );
    return;
  }

  const updateDimensions = () => {
    const viewportWidth = viewport?.getBoundingClientRect().width || 0;
    const trackWidth = track?.getBoundingClientRect().width || 0;
    const fallbackWidth =
      slides[0]?.getBoundingClientRect().width ||
      testimonialCarousel.getBoundingClientRect().width ||
      0;
    const newWidth = viewportWidth || trackWidth || fallbackWidth;

    if (!newWidth) {
      requestAnimationFrame(updateDimensions);
      return;
    }

    slideWidth = newWidth;
    slides.forEach((slide) => {
      slide.style.width = `${slideWidth}px`;
    });
    track.style.transform = `translate3d(-${activeIndex * slideWidth}px, 0, 0)`;
  };

  const setActiveState = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
      slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true');
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
      dot.setAttribute('aria-pressed', dotIndex === index ? 'true' : 'false');
      dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
    });

    track.style.transform = `translate3d(-${index * slideWidth}px, 0, 0)`;
  };

  const goToSlide = (index) => {
    const total = slides.length;
    activeIndex = (index + total) % total;
    setActiveState(activeIndex);
  };

  const startAutoplay = () => {
    if (prefersReducedMotion) return;
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => {
      goToSlide(activeIndex + 1);
    }, 6500);
  };

  const stopAutoplay = () => {
    clearInterval(autoplayTimer);
  };

  prevBtn?.addEventListener('click', () => {
    goToSlide(activeIndex - 1);
    startAutoplay();
  });

  nextBtn?.addEventListener('click', () => {
    goToSlide(activeIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      startAutoplay();
    });
  });

  testimonialCarousel.addEventListener('mouseenter', stopAutoplay);
  testimonialCarousel.addEventListener('mouseleave', startAutoplay);
  testimonialCarousel.addEventListener('touchstart', stopAutoplay, {
    passive: true,
  });
  testimonialCarousel.addEventListener('touchend', startAutoplay);
  testimonialCarousel.addEventListener('focusin', stopAutoplay);
  testimonialCarousel.addEventListener('focusout', (event) => {
    const nextFocusedElement = event.relatedTarget;
    if (!nextFocusedElement || !testimonialCarousel.contains(nextFocusedElement)) {
      startAutoplay();
    }
  });

  window.addEventListener('resize', updateDimensions);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  requestAnimationFrame(updateDimensions);
  window.addEventListener('load', updateDimensions);
  window.addEventListener('DOMContentLoaded', updateDimensions);
  setActiveState(activeIndex);
  startAutoplay();
}
