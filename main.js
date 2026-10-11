/* M.J.E.R.D. Enterprise — main.js v4 | compliance-revised */

/* SCROLL ANIMATIONS */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

/* MOBILE NAV */
const burger = document.querySelector('.nav__hamburger');
const menu   = document.querySelector('.nav__links');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav') && menu.classList.contains('open')) {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
  document.querySelectorAll('.nav__dropdown > a').forEach(a => {
    a.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const dm = a.nextElementSibling;
        if (dm) dm.style.display = dm.style.display === 'block' ? '' : 'block';
      }
    });
  });
}

/* ACTIVE NAV */
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  if (a.getAttribute('href') === page) a.classList.add('active');
});

/* JSON LOADER */
async function fetchJSON(path) {
  try {
    const r = await fetch(path + '?v=' + Date.now());
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch(e) {
    console.warn('[MJERD] Could not load', path);
    return null;
  }
}

/* NEWS PREVIEW (homepage) */
async function initNewsPreview() {
  const wrap = document.getElementById('news-preview');
  if (!wrap) return;
  const data = await fetchJSON('data/news.json');
  if (!data) return;
  wrap.innerHTML = data.posts.slice(0, 3).map(p => `
    <article class="card fade-up" style="padding:2rem">
      <div style="display:flex;gap:.6rem;align-items:center;margin-bottom:1rem;flex-wrap:wrap">
        <span class="tag tag--gold">${p.category}</span>
        <span class="body-sm" style="font-size:.75rem">${p.date}</span>
      </div>
      <h3 style="font-family:Cormorant Garamond,serif;font-size:1.2rem;font-weight:600;color:var(--cream);margin-bottom:.7rem;line-height:1.3">${p.title}</h3>
      <p class="body-sm" style="margin-bottom:1.2rem">${p.excerpt}</p>
      <a href="${p.link}" class="btn btn--ghost" style="font-size:.68rem;padding:.5rem 1rem">Read more &rarr;</a>
    </article>`).join('');
  wrap.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));
}

/* FULL NEWS PAGE */
async function initNewsPage() {
  const wrap = document.getElementById('news-full');
  if (!wrap) return;
  const data = await fetchJSON('data/news.json');
  if (!data) return;
  wrap.innerHTML = data.posts.map(p => `
    <article class="card fade-up" style="margin-bottom:1.5rem">
      <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap">
        <span class="tag tag--gold">${p.category}</span>
        <span class="body-sm">${p.date}</span>
      </div>
      <h2 style="font-family:Cormorant Garamond,serif;font-size:1.6rem;font-weight:600;color:var(--cream);margin-bottom:1rem;line-height:1.3">${p.title}</h2>
      <p class="body-md" style="margin-bottom:1.5rem">${p.body}</p>
      <a href="${p.link}" class="btn btn--ghost" style="font-size:.7rem;padding:.55rem 1.2rem">Learn more &rarr;</a>
    </article>`).join('');
  wrap.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));
}

/* CONTACT FORM (delivered via FormSubmit AJAX) */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const body    = document.getElementById('form-body') || document.getElementById('acq-form-body');
    const success = document.getElementById('form-success');
    const error   = form.querySelector('.form-error');
    const btn     = form.querySelector('button[type="submit"]');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (error) error.style.display = 'none';
    const btnHTML = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.innerHTML = 'Sending&#8230;'; }
    try {
      const res  = await fetch('https://formsubmit.co/ajax/info@mjerdenterprise.com', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && (data.success === true || data.success === 'true')) {
        form.reset();
        if (body)    body.style.display    = 'none';
        if (success) success.style.display = 'block';
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      if (error) error.style.display = 'block';
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = btnHTML; }
    }
  });
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  initNewsPreview();
  initNewsPage();
});
