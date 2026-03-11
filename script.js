/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('hidden'), 1900);
});

/* ===== AOS ===== */
AOS.init({ duration: 750, once: true, easing: 'ease-out-quart', offset: 50 });

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

/* ===== HAMBURGER ===== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ===== PARTICLES ===== */
(function () {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const s = Math.random() * 7 + 2;
    p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${Math.random()*18+10}s;animation-delay:${Math.random()*18}s;`;
    c.appendChild(p);
  }
})();

/* ===== COUNTER ===== */
function animateCounter(el, target) {
  let v = 0;
  const step = Math.max(1, Math.ceil(target / 110));
  const t = setInterval(() => {
    v += step;
    if (v >= target) { v = target; clearInterval(t); }
    el.textContent = v.toLocaleString();
  }, 16);
}
const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(n => animateCounter(n, parseInt(n.dataset.target)));
      statsObs.disconnect();
    }
  });
}, { threshold: 0.4 });
const sb = document.querySelector('.stats-bar');
if (sb) statsObs.observe(sb);

/* ===== COMMODITY FILTER TABS ===== */
const tabs   = document.querySelectorAll('.ctab');
const allCards = document.querySelectorAll('.c-card');
const catHeaders = document.querySelectorAll('.cat-header');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;

    allCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    catHeaders.forEach(hdr => {
      const cat = hdr.dataset.commodityCat;
      if (filter === 'all' || filter === cat) {
        hdr.style.display = '';
      } else {
        hdr.style.display = 'none';
      }
    });

    // Re-trigger AOS for newly visible items
    setTimeout(() => AOS.refresh(), 50);
  });
});

/* ===== VIEW MORE TEAM ===== */
const viewMoreBtn  = document.getElementById('viewMoreBtn');
const teamExtra    = document.getElementById('teamExtra');
const viewMoreText = document.getElementById('viewMoreText');
const viewMoreIcon = document.getElementById('viewMoreIcon');
let expanded = false;

if (viewMoreBtn) {
  viewMoreBtn.addEventListener('click', () => {
    expanded = !expanded;
    if (expanded) {
      teamExtra.classList.add('visible');
      viewMoreText.textContent = 'Show Less';
      viewMoreBtn.classList.add('open');
      setTimeout(() => { AOS.refresh(); teamExtra.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 80);
    } else {
      teamExtra.classList.remove('visible');
      viewMoreText.textContent = 'View All Members';
      viewMoreBtn.classList.remove('open');
      document.getElementById('team').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ===== CONTACT FORM ===== */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    setTimeout(() => { form.style.display = 'none'; formSuccess.classList.add('show'); }, 1500);
  });
}

/* ===== ACTIVE NAV ===== */
const sections = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  navItems.forEach(l => { l.style.color = l.getAttribute('href') === `#${cur}` ? 'var(--gold-light)' : ''; });
}, { passive: true });

/* ===== TEAM CARD TILT ===== */
document.querySelectorAll('.team-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-10px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ===== COMMODITY EXPERT MODAL ===== */
(function () {
  const overlay    = document.getElementById('cmOverlay');
  const closeBtn   = document.getElementById('cmClose');
  const bannerImg  = document.getElementById('cmBannerImg');
  const catTag     = document.getElementById('cmCatTag');
  const commName   = document.getElementById('cmCommodityName');
  const numBadge   = document.getElementById('cmNumBadge');
  const expertImg  = document.getElementById('cmExpertImg');
  const initials   = document.getElementById('cmExpertInitials');
  const nameEl     = document.getElementById('cmName');
  const roleEl     = document.getElementById('cmRole');
  const expBadge   = document.getElementById('cmExpBadge');
  const bioEl      = document.getElementById('cmBio');
  const highlights = document.getElementById('cmHighlights');
  const ctaBtn     = document.getElementById('cmCtaBtn');

  function openModal(card) {
    const d = card.dataset;
    const isCrop = d.category === 'crop';

    // Banner
    bannerImg.style.backgroundImage = `url('${d.img}')`;
    catTag.textContent  = isCrop ? '🌿 Crop Farming' : '🐄 Livestock';
    catTag.style.background = isCrop ? '#2d6040' : 'var(--gold)';
    catTag.style.color      = isCrop ? '#fff'   : 'var(--navy-dark)';
    commName.textContent    = d.name;
    numBadge.textContent    = `#${d.num}`;

    // Expert photo — try real photo, fallback to initials
    const colors = (d.color || '').split(',');
    initials.style.background = `linear-gradient(135deg, ${colors[0] || '#1a1f5e'}, ${colors[1] || '#3a42b0'})`;
    initials.textContent = d.initials || '?';
    initials.style.display = 'none';

    expertImg.style.display = 'block';
    expertImg.src = d.expertPhoto || '';
    expertImg.alt = d.expert || '';

    // Identity
    nameEl.textContent    = d.expert   || 'IRFA Specialist';
    roleEl.innerHTML      = d.role     || 'IRFA Member';
    expBadge.textContent  = d.experience || 'Experienced Specialist';

    // Bio
    bioEl.innerHTML = d.bio || '';

    // Highlights
    highlights.innerHTML = '';
    [d.h1, d.h2, d.h3].filter(Boolean).forEach(h => {
      const el = document.createElement('div');
      el.className = 'cm-highlight-item';
      el.innerHTML = `<i class="fas fa-check-circle"></i><span>${h}</span>`;
      highlights.appendChild(el);
    });

    // CTA
    ctaBtn.href = '#contact';
    ctaBtn.onclick = () => closeModal();

    // Open
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Bind every commodity card
  document.querySelectorAll('.c-card').forEach(card => {
    card.addEventListener('click', () => openModal(card));
  });

  // Close on button / backdrop
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  // Close on Escape key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();
