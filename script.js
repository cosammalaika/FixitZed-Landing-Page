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
