'use strict';

const menuButton = document.querySelector('[data-menu-button]');
const navigation = document.querySelector('[data-site-nav]');
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
window.matchMedia('(min-width: 921px)').addEventListener('change', () => closeMenu());
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

const form = document.getElementById('booking-form');
const draftPanel = document.getElementById('email-draft');
const draftText = document.getElementById('inquiry-text');
const emailLink = document.getElementById('open-email');
const copyStatus = document.getElementById('copy-status');
const eventDate = document.getElementById('event-date');
const now = new Date();
eventDate.min = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const get = key => String(values.get(key) || '').trim();
  const subject = `Mush 'n Squish inquiry: ${get('eventType')}${get('date') ? ' on ' + get('date') : ''}`;
  const body = [
    'Hi Lucy,', '',
    "I'd love to learn more about Mush 'n Squish Slime Bar for my event.", '',
    `Name: ${get('name')}`, `Email: ${get('email')}`,
    `Event: ${get('eventType')}`, `Preferred date: ${get('date') || 'Flexible / to be decided'}`,
    `Number creating slime: ${get('guests') || 'To be decided'}`, `Location: ${get('location')}`,
    '', 'More details:', get('details') || 'Please share availability and pricing.', '', 'Thank you!'
  ].join('\n');
  draftText.value = `To: JakabAllTrades@gmail.com\nSubject: ${subject}\n\n${body}`;
  emailLink.href = `mailto:JakabAllTrades@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  draftPanel.hidden = false;
  copyStatus.textContent = '';
  document.getElementById('draft-heading').focus({preventScroll: true});
  draftPanel.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest'});
});

// Editing the form invalidates the old draft so a stale inquiry cannot be sent.
form.addEventListener('input', () => {
  draftPanel.hidden = true;
  copyStatus.textContent = '';
});
form.addEventListener('change', () => { draftPanel.hidden = true; });

document.getElementById('copy-inquiry').addEventListener('click', async () => {
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(draftText.value);
    copyStatus.textContent = 'Copied. Paste this into an email to Lucy and send when you’re ready.';
  } catch {
    draftText.closest('details').open = true;
    draftText.focus();
    draftText.select();
    copyStatus.textContent = 'Your inquiry is selected. Copy it and paste it into your email.';
  }
});
