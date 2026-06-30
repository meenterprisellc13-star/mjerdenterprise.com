/* M.J.E.R.D Enterprise — main.js v3 | website-enhancement-v2 */

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
  /* Keyboard accessible dropdowns */
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
  const href = a.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
});

/* COUNTER */
function runCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const prefix   = el.dataset.prefix  || '';
  const suffix   = el.dataset.suffix  || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 2200;
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / duration, 1);
    const v = target * (1 - Math.pow(1 - p, 3));
    el.textContent = prefix + (decimals ? v.toFixed(decimals) : Math.floor(v).toLocaleString()) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  /* Small delay so element is visible before counting */
  setTimeout(() => requestAnimationFrame(tick), 200);
}
const ctrObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.ran) {
      e.target.dataset.ran = '1';
      runCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => ctrObs.observe(el));

/* JSON LOADER */
async function fetchJSON(path) {
  try {
    const r = await fetch(path + '?v=' + Date.now());
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch(e) {
    console.warn('[MJERD] Could not load', path, e.message);
    return null;
  }
}

/* RAISE PROGRESS BAR */
async function initProgress() {
  const bar = document.getElementById('raise-bar');
  const amt = document.getElementById('raise-amt');
  const upd = document.getElementById('raise-updated');
  if (!bar) return;
  const data = await fetchJSON('data/portfolio.json');
  if (!data) return;
  const { raise_current = 0, raise_target = 124000, last_updated = '' } = data.stats;
  const pct = Math.min((raise_current / raise_target) * 100, 100);
  if (amt) amt.textContent = '$' + raise_current.toLocaleString();
  if (upd) upd.textContent = 'Updated: ' + last_updated;
  setTimeout(() => { bar.style.width = pct + '%'; }, 400);
}

/* NEWS PREVIEW */
async function initNewsPreview() {
  const wrap = document.getElementById('news-preview');
  if (!wrap) return;
  const data = await fetchJSON('data/news.json');
  if (!data) return;
  wrap.innerHTML = data.posts.slice(0, 3).map(p => `
    <article class="card fade-up" aria-label="${p.title}" style="padding:2rem">
      <div style="display:flex;gap:.6rem;align-items:center;margin-bottom:1rem;flex-wrap:wrap">
        <span class="tag tag--gold">${p.category}</span>
        <span class="body-sm" style="font-size:.75rem">${p.date}</span>
      </div>
      <h3 style="font-family:Cormorant Garamond,serif;font-size:1.25rem;font-weight:600;color:var(--cream);margin-bottom:.7rem;line-height:1.3">${p.title}</h3>
      <p class="body-sm" style="margin-bottom:1.2rem">${p.excerpt}</p>
      <a href="${p.link}" class="btn btn--ghost" style="font-size:.68rem;padding:.5rem 1rem">Read more &#8594;</a>
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
      <a href="${p.link}" class="btn btn--ghost" style="font-size:.7rem;padding:.55rem 1.2rem">Learn more &#8594;</a>
    </article>`).join('');
  wrap.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));
}

/* CONTACT FORM */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const body = document.getElementById('form-body');
    const success = document.getElementById('form-success');
    if (body) body.style.display = 'none';
    if (success) success.style.display = 'block';
  });
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  initProgress();
  initNewsPreview();
  initNewsPage();
});
