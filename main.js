/* M.J.E.R.D Enterprise — main.js v2 */

/* ── SCROLL ANIMATIONS ── */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

/* ── MOBILE NAV ── */
const burger  = document.querySelector('.nav__hamburger');
const navMenu = document.querySelector('.nav__links');
if (burger && navMenu) {
  burger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav') && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    }
  });
}

/* ── ACTIVE NAV LINK ── */
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
});

/* ── COUNTER ANIMATION ── */
function runCounter(el) {
  const target   = parseFloat(el.dataset.target);
  const prefix   = el.dataset.prefix  || '';
  const suffix   = el.dataset.suffix  || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = 2000;
  const t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / duration, 1);
    const v = target * (1 - Math.pow(1 - p, 3));
    el.textContent = prefix + (decimals ? v.toFixed(decimals) : Math.floor(v).toLocaleString()) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
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

/* ── DATA LOADER ── */
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

/* ── RAISE PROGRESS BAR ── */
async function initProgressBar() {
  const bar   = document.getElementById('raise-bar');
  const amt   = document.getElementById('raise-amt');
  const pctEl = document.getElementById('raise-pct');
  const upd   = document.getElementById('raise-updated');
  if (!bar) return;

  const data = await fetchJSON('data/portfolio.json');
  if (!data) return;

  const { raise_current = 0, raise_target = 124000, last_updated = '' } = data.stats;
  const pct = Math.min((raise_current / raise_target) * 100, 100);

  if (amt)   amt.textContent   = '$' + raise_current.toLocaleString();
  if (pctEl) pctEl.textContent = pct.toFixed(1) + '%';
  if (upd)   upd.textContent   = 'Updated: ' + last_updated;
  setTimeout(() => { bar.style.width = pct + '%'; }, 400);
}

/* ── DYNAMIC NEWS (homepage preview) ── */
async function initNewsPreview() {
  const wrap = document.getElementById('news-preview');
  if (!wrap) return;
  const data = await fetchJSON('data/news.json');
  if (!data) return;

  wrap.innerHTML = data.posts.slice(0, 3).map(p => `
    <article class="news-card card fade-up" aria-label="${p.title}">
      <div class="tag ${p.category === 'Acquisitions' ? 'tag--gold' : 'tag--dim'}" style="margin-bottom:1rem">${p.category}</div>
      <p class="body-sm" style="color:var(--gold);margin-bottom:0.5rem">${p.date}</p>
      <h3 class="h3" style="font-size:1.2rem;margin-bottom:0.8rem">${p.title}</h3>
      <p class="body-sm" style="margin-bottom:1.2rem">${p.excerpt}</p>
      <a href="${p.link}" class="btn btn--ghost" style="font-size:0.68rem;padding:0.5rem 1rem">Read more →</a>
    </article>`).join('');

  wrap.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));
}

/* ── DYNAMIC PORTFOLIO (homepage verticals) ── */
async function initPortfolio() {
  const wrap = document.getElementById('verticals-grid');
  if (!wrap) return;
  const data = await fetchJSON('data/portfolio.json');
  if (!data) return;

  wrap.innerHTML = data.verticals.map(v => `
    <div class="vertical-card fade-up">
      <div class="vertical-icon" aria-hidden="true">${v.icon}</div>
      <div>
        <span class="tag ${v.status === 'active' ? 'tag--gold' : 'tag--dim'}" style="margin-bottom:0.7rem;display:inline-block">${v.status_label}</span>
        <h3 class="h3" style="margin-bottom:0.6rem">${v.name}</h3>
        <p class="body-sm">${v.description}</p>
      </div>
    </div>`).join('');

  wrap.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));
}

/* ── DYNAMIC FULL NEWS PAGE ── */
async function initNewsPage() {
  const wrap = document.getElementById('news-full');
  if (!wrap) return;
  const data = await fetchJSON('data/news.json');
  if (!data) return;

  wrap.innerHTML = data.posts.map(p => `
    <article class="news-article card fade-up" style="margin-bottom:1.5rem">
      <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap">
        <span class="tag tag--gold">${p.category}</span>
        <span class="body-sm">${p.date}</span>
      </div>
      <h2 class="h2" style="font-size:1.6rem;margin-bottom:1rem">${p.title}</h2>
      <p class="body-md" style="margin-bottom:1.5rem">${p.body}</p>
      <a href="${p.link}" class="btn btn--ghost" style="font-size:0.7rem;padding:0.55rem 1.2rem">Learn more →</a>
    </article>`).join('');

  wrap.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));
}

/* ── CONTACT FORM ── */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('form-body').style.display  = 'none';
    document.getElementById('form-success').style.display = 'block';
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initNewsPreview();
  initPortfolio();
  initNewsPage();
});
