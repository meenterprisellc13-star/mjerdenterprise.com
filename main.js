// M.J.E.R.D Enterprise — Main JS

// ── SCROLL ANIMATIONS ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) el.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── MOBILE NAV ──
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── ACTIVE NAV LINK ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// ── COUNTER ANIMATION ──
function animateCounter(el) {
  const raw    = el.dataset.target;
  const target = parseFloat(raw);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const isInt  = Number.isInteger(target);
  const duration = 2000;
  const start  = performance.now();

  function update(time) {
    const progress = Math.min((time - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = target * eased;
    el.textContent = prefix + (isInt ? Math.floor(current).toLocaleString() : current.toFixed(1)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting && !el.target.dataset.animated) {
      el.target.dataset.animated = true;
      animateCounter(el.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── DATA LOADER ──
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch (e) {
    console.warn('Could not load', path, e);
    return null;
  }
}

// ── WEFUNDER PROGRESS BAR ──
async function loadRaiseProgress() {
  const bar = document.getElementById('raise-progress-bar');
  const amt = document.getElementById('raise-current-amt');
  const pct = document.getElementById('raise-pct');
  if (!bar) return;

  const data = await loadJSON('data/portfolio.json');
  if (!data) return;

  const { raise_current, raise_target, raise_minimum, last_updated } = data.stats;
  const percent = Math.min((raise_current / raise_target) * 100, 100).toFixed(1);

  if (amt) amt.textContent = '$' + raise_current.toLocaleString();
  if (pct) pct.textContent = percent + '%';
  if (bar) {
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = percent + '%'; }, 300);
  }

  const updatedEl = document.getElementById('raise-updated');
  if (updatedEl) updatedEl.textContent = 'Last updated: ' + last_updated;
}

// ── DYNAMIC NEWS ──
async function loadNews() {
  const container = document.getElementById('news-dynamic');
  if (!container) return;

  const data = await loadJSON('data/news.json');
  if (!data) return;

  const posts = data.posts.slice(0, 3); // show latest 3
  container.innerHTML = posts.map(post => `
    <div class="news-card fade-up">
      <div class="news-card-body">
        <div class="news-date">${post.category} — ${post.date}</div>
        <h3 class="news-title">${post.title}</h3>
        <p class="news-excerpt">${post.excerpt}</p>
        <a href="${post.link}" class="read-more" style="font-size:0.78rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);text-decoration:none;">Read More →</a>
      </div>
    </div>
  `).join('');

  // Re-observe new elements
  container.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── DYNAMIC PORTFOLIO ──
async function loadPortfolio() {
  const container = document.getElementById('portfolio-dynamic');
  if (!container) return;

  const data = await loadJSON('data/portfolio.json');
  if (!data) return;

  container.innerHTML = data.verticals.map(v => `
    <div class="vertical-card fade-up">
      <div class="vertical-icon">${v.icon}</div>
      <div>
        <span class="vertical-status ${v.status === 'active' ? 'status-active' : 'status-pipeline'}">${v.status_label}</span>
        <h3 class="heading-md" style="margin-bottom:0.6rem;">${v.name}</h3>
        <p class="body-sm">${v.description}</p>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── DYNAMIC FULL NEWS PAGE ──
async function loadFullNews() {
  const container = document.getElementById('news-full');
  if (!container) return;

  const data = await loadJSON('data/news.json');
  if (!data) return;

  container.innerHTML = data.posts.map(post => `
    <article class="news-article fade-up">
      <div class="news-article-body">
        <div class="news-meta">
          <span class="news-category">${post.category}</span>
          <span class="news-date-text">${post.date}</span>
        </div>
        <h2 class="news-article-title">${post.title}</h2>
        <p class="news-article-excerpt">${post.body}</p>
        <a href="${post.link}" class="read-more">Read More →</a>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  loadRaiseProgress();
  loadNews();
  loadPortfolio();
  loadFullNews();
});
