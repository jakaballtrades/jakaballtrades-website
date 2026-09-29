(() => {
'use strict';

// Reuses the Formspree endpoint on https://jakaballtrades.com/connect/.
// Initialize the form before optional navigation or gallery features.
function initializeBookingForm() {
const form = document.getElementById('booking-form');
const formFields = document.getElementById('booking-fields');
const submitButton = document.getElementById('booking-submit');
const submitLabel = document.getElementById('booking-submit-label');
const formHelp = document.getElementById('form-help');
const formError = document.getElementById('booking-error');
const formStatus = document.getElementById('booking-status');
const formSuccess = document.getElementById('booking-success');
const eventDate = document.getElementById('event-date');
if (!form || !formFields || !submitButton || !submitLabel || !formHelp || !formError || !formStatus || !formSuccess || !eventDate) return;
const now = new Date();
eventDate.min = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
let sending = false;
let showingValidation = false;

function showValidationErrors() {
  const problems = [];
  Array.from(form.elements).forEach(field => {
    if (!field.willValidate) return;
    const invalid = !field.validity.valid;
    field.setAttribute('aria-invalid', String(invalid));
    if (!invalid) return;
    const label = field.labels && field.labels[0]
      ? field.labels[0].textContent.replace(/\s*\([^)]*\)|\*/g, '').trim()
      : 'Event details';
    problems.push(`${label}: ${field.validationMessage || 'Please check this field.'}`);
  });
  formError.textContent = problems.length ? `Your inquiry has not been sent. ${problems.join(' ')}` : '';
  formError.hidden = problems.length === 0;
  showingValidation = problems.length > 0;
}

// Native validation runs BEFORE the submit event. Capture it so a blocked
// submission always leaves a visible explanation beside the button.
form.addEventListener('invalid', () => {
  showValidationErrors();
}, true);
form.addEventListener('input', () => {
  if (showingValidation) showValidationErrors();
});

// Older browsers can still use the form's normal HTML POST to Formspree.
if (typeof fetch !== 'function' || typeof FormData !== 'function' || typeof AbortController !== 'function') return;

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending || form.hidden || !form.reportValidity()) return;
  sending = true;
  showingValidation = false;
  form.setAttribute('aria-busy', 'true');
  submitButton.disabled = true;
  submitLabel.textContent = 'Sending…';
  formError.hidden = true;
  formError.textContent = '';
  formStatus.hidden = false;
  formStatus.textContent = 'Sending your event inquiry…';
  let timer;
  try {
    // Capture values before disabling inputs; keep setup inside the error handler.
    const data = new FormData(form);
    const eventType = String(data.get('event_type') || 'Event');
    const preferredDate = String(data.get('event_date') || '').trim();
    data.set('_subject', `Mush ’n Squish inquiry: ${eventType}${preferredDate ? ' — ' + preferredDate : ''}`);
    formFields.disabled = true;
    const controller = new AbortController();
    timer = window.setTimeout(() => controller.abort(), 25000);
    const response = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result || result.ok === false || (Array.isArray(result.errors) && result.errors.length)) {
      const problems = Array.isArray(result?.errors)
        ? result.errors.map(error => error.message).filter(message => typeof message === 'string').join(' ')
        : '';
      throw new Error(problems || 'We couldn’t send your inquiry. Please try again, or call Lucy at 864-395-6377.');
    }
    form.reset();
    form.hidden = true;
    formHelp.hidden = true;
    formSuccess.hidden = false;
    document.getElementById('success-heading').focus();
  } catch (error) {
    formError.textContent = error && (error.name === 'AbortError' || error instanceof TypeError)
      ? 'We couldn’t confirm your inquiry. Your details are still here. Please try again, or call Lucy at 864-395-6377.'
      : (error && error.message) || 'Your inquiry could not be sent. Please try again, or call Lucy at 864-395-6377.';
    formError.hidden = false;
    formError.focus();
  } finally {
    window.clearTimeout(timer);
    sending = false;
    form.setAttribute('aria-busy', 'false');
    formFields.disabled = false;
    submitButton.disabled = false;
    submitLabel.textContent = 'Send event inquiry';
    formStatus.hidden = true;
    formStatus.textContent = '';
  }
});

document.getElementById('another-inquiry').addEventListener('click', () => {
  formSuccess.hidden = true;
  form.hidden = false;
  formHelp.hidden = false;
  formError.hidden = true;
  formError.textContent = '';
  document.getElementById('full-name').focus();
});
}
initializeBookingForm();

const menuButton = document.querySelector('[data-menu-button]');
const navigation = document.querySelector('[data-site-nav]');
if (menuButton && navigation) {
  function closeMenu(restoreFocus = false) {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  const wideScreen = window.matchMedia('(min-width: 921px)');
  if (wideScreen.addEventListener) wideScreen.addEventListener('change', () => closeMenu());
  else if (wideScreen.addListener) wideScreen.addListener(() => closeMenu());
}
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

// Gallery configuration lives in gallery.js. Only real, successfully loaded photos appear.
const gallery = document.getElementById('event-gallery');
const galleryEmpty = document.getElementById('gallery-empty');
const galleryTemplate = document.getElementById('event-photo-template');
const eventPhotos = Array.isArray(window.MUSH_N_SQUISH_PHOTOS) ? window.MUSH_N_SQUISH_PHOTOS : [];

for (const photo of eventPhotos) {
  if (!photo || typeof photo.src !== 'string' || !photo.src.trim()) continue;
  const photoUrl = new URL(photo.src, window.location.href);
  if (photoUrl.origin !== window.location.origin) continue;
  const figure = galleryTemplate.content.firstElementChild.cloneNode(true);
  const link = figure.querySelector('a');
  const img = figure.querySelector('img');
  const caption = figure.querySelector('figcaption');
  const alt = typeof photo.alt === 'string' && photo.alt.trim() ? photo.alt : 'Mush ’n Squish Slime Bar at a party or event';
  figure.hidden = true;
  link.href = photoUrl.href;
  link.setAttribute('aria-label', `View full-size photo: ${alt}`);
  img.alt = alt;
  caption.textContent = typeof photo.caption === 'string' ? photo.caption : '';
  img.addEventListener('load', () => {
    figure.hidden = false;
    gallery.hidden = false;
    galleryEmpty.hidden = true;
  }, { once: true });
  img.addEventListener('error', () => {
    figure.remove();
    const hasPhotos = Boolean(gallery.querySelector('figure:not([hidden])'));
    gallery.hidden = !hasPhotos;
    galleryEmpty.hidden = hasPhotos;
  }, { once: true });
  // At most a small gallery is expected; eager loading avoids hidden-image lazy-load deadlocks.
  gallery.appendChild(figure);
  img.src = photoUrl.href;
}
})();
