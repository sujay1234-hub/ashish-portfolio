/* =============================================
   SCRIPT.JS — Ashish Narayan Biotech Portfolio
   Particles · DNA Helix · Tilt · Parallax
   ============================================= */

'use strict';

// ─── CUSTOM CURSOR ──────────────────────────
const cursor = document.createElement('div');
cursor.className = 'cursor';
const cursorRing = document.createElement('div');
cursorRing.className = 'cursor-ring';
document.body.append(cursor, cursorRing);

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});
(function animateCursorRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursorRing);
})();
document.querySelectorAll('a,button,.skill-card,.project-card,.contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.style.cssText += 'width:60px;height:60px;border-color:#00aaff;');
  el.addEventListener('mouseleave', () => cursorRing.style.cssText += 'width:36px;height:36px;border-color:#00ff88;');
});

// ─── NAVBAR SCROLL ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNavLink();
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

// ─── MOBILE MENU ────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform=''; s.style.opacity=''; });
  }
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
}));

// ─── BACKGROUND PARTICLES ───────────────────
const pCanvas = document.getElementById('particle-canvas');
const pCtx = pCanvas.getContext('2d');
let particles = [];
let W, H;

function resizeParticleCanvas() {
  W = pCanvas.width = window.innerWidth;
  H = pCanvas.height = window.innerHeight;
}
resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.colorArr = Math.random() > 0.5
      ? [0, 255, 136]
      : [0, 170, 255];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(${this.colorArr[0]},${this.colorArr[1]},${this.colorArr[2]},${this.alpha})`;
    pCtx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(120, Math.floor(W * H / 12000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();
window.addEventListener('resize', initParticles);

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.15;
        pCtx.beginPath();
        pCtx.moveTo(particles[i].x, particles[i].y);
        pCtx.lineTo(particles[j].x, particles[j].y);
        pCtx.strokeStyle = `rgba(0,255,136,${alpha})`;
        pCtx.lineWidth = 0.6;
        pCtx.stroke();
      }
    }
  }
}

(function animateParticles() {
  pCtx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
})();

// ─── DNA HELIX CANVAS ───────────────────────
const dnaCanvas = document.getElementById('dna-canvas');
const dnaCtx = dnaCanvas.getContext('2d');
let dnaW, dnaH, dnaT = 0;

function resizeDNA() {
  dnaW = dnaCanvas.width = dnaCanvas.offsetWidth;
  dnaH = dnaCanvas.height = dnaCanvas.offsetHeight;
}
resizeDNA();
window.addEventListener('resize', resizeDNA);

function drawDNA() {
  dnaCtx.clearRect(0, 0, dnaW, dnaH);
  const cx = dnaW / 2;
  const amplitude = dnaW * 0.12;
  const wavelength = 220;
  const speed = 0.012;
  dnaT += speed;

  const steps = Math.floor(dnaH / 8);
  for (let i = 0; i < steps; i++) {
    const y = (i / steps) * dnaH;
    const progress = i / steps;
    const phase1 = dnaT + progress * Math.PI * 6;
    const phase2 = dnaT + progress * Math.PI * 6 + Math.PI;

    const x1 = cx + Math.sin(phase1) * amplitude;
    const x2 = cx + Math.sin(phase2) * amplitude;

    const alpha = 0.6 - Math.abs(Math.sin(phase1)) * 0.3;

    // Strand 1
    if (i > 0) {
      const prevY = ((i - 1) / steps) * dnaH;
      const prevPhase = dnaT + ((i - 1) / steps) * Math.PI * 6;
      const prevX1 = cx + Math.sin(prevPhase) * amplitude;
      const prevX2 = cx + Math.sin(prevPhase + Math.PI) * amplitude;

      dnaCtx.beginPath();
      dnaCtx.moveTo(prevX1, prevY);
      dnaCtx.lineTo(x1, y);
      dnaCtx.strokeStyle = `rgba(0,255,136,${alpha})`;
      dnaCtx.lineWidth = 2;
      dnaCtx.stroke();

      dnaCtx.beginPath();
      dnaCtx.moveTo(prevX2, prevY);
      dnaCtx.lineTo(x2, y);
      dnaCtx.strokeStyle = `rgba(0,170,255,${alpha})`;
      dnaCtx.lineWidth = 2;
      dnaCtx.stroke();
    }

    // Cross-rungs
    if (i % 10 === 0) {
      const rungAlpha = 0.25 + 0.15 * Math.abs(Math.cos(phase1));
      dnaCtx.beginPath();
      dnaCtx.moveTo(x1, y);
      dnaCtx.lineTo(x2, y);
      dnaCtx.strokeStyle = `rgba(136,255,68,${rungAlpha})`;
      dnaCtx.lineWidth = 1.2;
      dnaCtx.stroke();

      // Node dots
      dnaCtx.beginPath();
      dnaCtx.arc(x1, y, 3, 0, Math.PI * 2);
      dnaCtx.fillStyle = `rgba(0,255,136,${alpha + 0.2})`;
      dnaCtx.fill();
      dnaCtx.beginPath();
      dnaCtx.arc(x2, y, 3, 0, Math.PI * 2);
      dnaCtx.fillStyle = `rgba(0,170,255,${alpha + 0.2})`;
      dnaCtx.fill();
    }
  }
}
(function animateDNA() {
  drawDNA();
  requestAnimationFrame(animateDNA);
})();

// ─── MOUSE PARALLAX ─────────────────────────
let mx = 0, my = 0;
document.addEventListener('mousemove', e => {
  mx = (e.clientX / window.innerWidth  - 0.5) * 2;
  my = (e.clientY / window.innerHeight - 0.5) * 2;
  document.querySelectorAll('.orb').forEach((orb, i) => {
    const strength = (i + 1) * 12;
    orb.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
  });
  document.querySelectorAll('.floating-mol').forEach((m, i) => {
    const s = (i + 1) * 8;
    m.style.transform = `translate(${mx * s}px, ${my * s}px)`;
  });
  document.querySelectorAll('.molecule-ring').forEach((r, i) => {
    const s = (i + 1) * 4;
    r.style.marginLeft = mx * s + 'px';
    r.style.marginTop  = my * s + 'px';
  });
});

// ─── 3D TILT CARDS ──────────────────────────
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = dy * -10;
    const rotY = dx *  12;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
  });
  card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
});

// ─── SCROLL REVEAL ──────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible', 'revealed');
      // Animate skill bars
      entry.target.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animate'));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card, .project-card, .about-text, .timeline-item, .contact-link, .contact-form, .section-header').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Trigger timeline item reveals separately
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.style.transitionDelay = (i * 0.15) + 's';
  revealObserver.observe(item);
});

// ─── SKILL BARS ON SECTION ENTER ────────────
const skillsSection = document.getElementById('skills');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animate'));
      skillObserver.disconnect();
    }
  });
}, { threshold: 0.2 });
if (skillsSection) skillObserver.observe(skillsSection);

// ─── TITLE TYPING EFFECT ─────────────────── 
(function typeTitle() {
  const el = document.getElementById('title-name');
  if (!el) return;
  const text = 'ASHISH NARAYAN';
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent = text.slice(0, i) + (i < text.length ? '_' : '');
    i++;
    if (i > text.length) { el.textContent = text; clearInterval(interval); }
  }, 80);
})();

// ─── CONTACT FORM ───────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const success = document.getElementById('form-success');
  btn.innerHTML = '<span>Transmitting...</span>';
  btn.disabled = true;
  setTimeout(() => {
    success.classList.remove('hidden');
    btn.innerHTML = '<span>Send Message</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
    btn.disabled = false;
    e.target.reset();
    setTimeout(() => success.classList.add('hidden'), 4000);
  }, 1600);
}

// ─── SMOOTH SCROLL FOR CTA ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
