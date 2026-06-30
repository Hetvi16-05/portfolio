/**
 * Hetvi Sheth Portfolio — Awwwards-Level App JavaScript
 * GSAP + Three.js + Lenis — Cinematic AI Portfolio
 */

import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// BOOT SEQUENCE — initialize everything
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  initCursor();
  initSpotlight();
  initLoadingScreen(prefersReduced);
  initPageTransition();
  initNavigation();
  initMobileMenu();
});

// ==========================================================================
// 1. LOADING SCREEN — AI Boot Sequence
// ==========================================================================
function initLoadingScreen(reduced) {
  const loader = document.getElementById('loader');
  if (!loader) {
    afterLoad(reduced);
    return;
  }

  // Only show loader once per session
  const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');
  if (reduced || hasSeenLoader) {
    loader.style.display = 'none';
    afterLoad(reduced);
    return;
  }
  
  sessionStorage.setItem('hasSeenLoader', 'true');

  const bar = document.getElementById('loader-bar');
  const loaderName = document.getElementById('loader-name');
  const loaderSub = document.getElementById('loader-sub');
  const lines = [
    { line: document.getElementById('ll-0'), check: document.getElementById('lc-0') },
    { line: document.getElementById('ll-1'), check: document.getElementById('lc-1') },
    { line: document.getElementById('ll-2'), check: document.getElementById('lc-2') },
    { line: document.getElementById('ll-3'), check: document.getElementById('lc-3') },
  ];

  if (reduced) {
    // Skip animation for reduced motion
    loader.style.display = 'none';
    afterLoad(reduced);
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      // Fade out loader
      gsap.to(loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          afterLoad(reduced);
        }
      });
    }
  });

  // Type out lines sequentially
  lines.forEach(({ line, check }, i) => {
    tl.to(line, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, i * 0.5)
      .to(check, { opacity: 1, duration: 0.2 }, i * 0.5 + 0.35);
  });

  // Progress bar
  tl.to(bar, { width: '100%', duration: 2.2, ease: 'power1.inOut' }, 0);

  // Name reveal
  tl.to(loaderName, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' }, 1.6);
  tl.to(loaderSub,  { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.9);

  // Hold briefly then complete
  tl.to({}, { duration: 0.5 });
}

// ==========================================================================
// 2. AFTER LOAD — trigger all site animations
// ==========================================================================
function afterLoad(reduced) {
  const introContainer = document.getElementById('intro-presentation');
  
  if (introContainer) {
    introContainer.style.display = 'flex';
    initIntroSequence(reduced);
  } else {
    launchSite(reduced);
  }
}

function initIntroSequence(reduced) {
  const slides = document.querySelectorAll('.intro-slide');
  const container = document.getElementById('intro-presentation');
  const progressBar = document.getElementById('intro-progress');
  if (!slides.length) {
    launchSite(reduced);
    return;
  }

  let currentSlide = 0;
  let autoTimer;
  const slideDuration = 7000; // 7 seconds per slide

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    
    // Reset progress bar
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      // Force reflow
      void progressBar.offsetWidth;
      progressBar.style.transition = `width ${slideDuration}ms linear`;
      progressBar.style.width = '100%';
    }
  }

  function nextSlide() {
    clearTimeout(autoTimer);
    currentSlide++;
    
    if (currentSlide >= slides.length) {
      // End of presentation
      if (progressBar) {
        progressBar.style.width = '100%';
      }
      gsap.to(container, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          container.style.display = 'none';
          launchSite(reduced);
        }
      });
      document.removeEventListener('click', handleUserClick);
    } else {
      showSlide(currentSlide);
      autoTimer = setTimeout(nextSlide, slideDuration);
    }
  }

  function handleUserClick(e) {
    if (container.contains(e.target)) {
      nextSlide();
    }
  }

  // Start sequence
  showSlide(0);
  autoTimer = setTimeout(nextSlide, slideDuration);
  document.addEventListener('click', handleUserClick);
}

// ==========================================================================
// 2b. LAUNCH SITE — trigger all site animations
// ==========================================================================
function launchSite(reduced) {
  renderDynamicProjects(); // MUST RUN BEFORE ANIMATIONS
  initLenis();
  initStarField(reduced);
  initHeroAnimations(reduced);
  initScrollAnimations(reduced);
  initRoleTyper();
  initStatCounters();
  initJourneyPath();
  initTiltCards();
  initMagneticButtons();
  initRippleButtons();
  initSkillBars();
  initContactForm();
  initProjectFilters();
  initAboutNameAnimation(reduced);
}

// ==========================================================================
// 3. LENIS — Smooth Scroll
// ==========================================================================
function initLenis() {
  const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Expose for scroll indicator click
  window._lenis = lenis;
}

// ==========================================================================
// 4. THREE.JS — Star Field Galaxy
// ==========================================================================
function initStarField(reduced) {
  const canvas = document.getElementById('star-canvas');
  if (!canvas || reduced) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 5;

  // ── Star particles ──
  const COUNT = 1800;
  const geo = new THREE.BufferGeometry();
  const pos    = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const sizes  = new Float32Array(COUNT);

  // Palette: blue, purple, cyan, white
  const palette = [
    [0.23, 0.51, 0.96],  // blue   #3B82F6
    [0.55, 0.36, 0.97],  // purple #8B5CF6
    [0.02, 0.71, 0.83],  // cyan   #06B6D4
    [0.97, 0.98, 1.00],  // white
  ];

  for (let i = 0; i < COUNT; i++) {
    // Sphere distribution
    const r     = 1.5 + Math.random() * 3.5;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);

    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i*3+2] = r * Math.cos(phi);

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i*3]   = c[0];
    colors[i*3+1] = c[1];
    colors[i*3+2] = c[2];

    sizes[i] = Math.random() * 2.5 + 0.8;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      void main() {
        vColor = color;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (280.0 / -mvPos.z);
        gl_Position = projectionMatrix * mvPos;
        vAlpha = 0.5 + 0.5 * sin(uTime * 0.8 + position.x * 2.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float alpha = (1.0 - smoothstep(0.2, 0.5, d)) * vAlpha;
        gl_FragColor = vec4(vColor, alpha * 0.85);
      }
    `,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const stars = new THREE.Points(geo, mat);
  scene.add(stars);

  // Mouse parallax
  let targetMX = 0, targetMY = 0;
  let currentMX = 0, currentMY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMX = (e.clientX / window.innerWidth  - 0.5) * 0.4;
    targetMY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  let animId;
  const clock = new THREE.Clock();

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    mat.uniforms.uTime.value = t;

    stars.rotation.y += 0.00025;
    stars.rotation.x += 0.00008;

    // Smooth camera parallax
    currentMX += (targetMX - currentMX) * 0.04;
    currentMY += (targetMY - currentMY) * 0.04;
    camera.position.x = currentMX;
    camera.position.y = -currentMY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Resize
  const ro = new ResizeObserver(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  ro.observe(document.documentElement);
}

// ==========================================================================
// 5. CUSTOM CURSOR
// ==========================================================================
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mouseX = -200, mouseY = -200;
  let ringX  = -200, ringY  = -200;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  document.addEventListener('mousedown', () => ring.classList.add('is-clicking'));
  document.addEventListener('mouseup',   () => ring.classList.remove('is-clicking'));

  // Ring follows with lerp
  function lerpRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(lerpRing);
  }
  lerpRing();

  // Hover states
  const interactive = 'a, button, .magnetic, .proj-card, .featured-card, .tilt-card, .filter-btn, .social-btn, #intro-presentation';
  document.querySelectorAll(interactive).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
  });
}

// ==========================================================================
// 6. SPOTLIGHT — follows mouse
// ==========================================================================
function initSpotlight() {
  const el = document.getElementById('spotlight');
  if (!el) return;
  document.addEventListener('mousemove', (e) => {
    el.style.setProperty('--mx', `${e.clientX}px`);
    el.style.setProperty('--my', `${e.clientY}px`);
  });
}

// ==========================================================================
// 7. HERO GSAP ANIMATIONS
// ==========================================================================
function initHeroAnimations(reduced) {
  const header = document.getElementById('header');

  if (reduced) {
    if (header) { header.style.opacity = '1'; header.style.transform = 'none'; }
    document.querySelectorAll('#hero-badge, #hero-role, #hero-bio, #hero-ctas, #hero-socials, #scroll-indicator, #hero-card').forEach(el => {
      if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
    });
    return;
  }

  // Always ensure header is visible immediately
  if (header) {
    header.style.opacity = '1';
    header.style.transform = 'none';
  }

  // Split hero name into character spans
  const nameEl = document.getElementById('hero-name');
  if (nameEl) {
    splitNameChars();

    const tl = gsap.timeline({ delay: 0.4 });

    // Badge
    tl.to('#hero-badge', { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' })

    // Name characters stagger
    .from('#hero-name .char', {
      opacity: 0,
      y: 70,
      rotateX: -90,
      stagger: 0.035,
      duration: 0.65,
      ease: 'back.out(2)',
      transformOrigin: '0 100%',
    }, '-=0.2')

    // Role line
    .to('#hero-role', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')

    // Bio
    .to('#hero-bio', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')

    // CTAs
    .to('#hero-ctas', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')

    // Socials + scroll
    .to(['#hero-socials', '#scroll-indicator'], { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.2')

    // 3D card flies in from right
    .to('#hero-card', {
      opacity: 1,
      x: 0,
      rotateY: 0,
      duration: 1,
      ease: 'back.out(1.4)',
    }, '-=1.2');
  }
}

function splitNameCharsEl(nameEl) {
  if (!nameEl) return;
  const html = nameEl.innerHTML;
  // Wrap each plain text letter in a span.char, leave existing spans untouched
  nameEl.innerHTML = html.replace(/(Hetvi)/g, (match) =>
    match.split('').map(c => `<span class="char" style="display:inline-block">${c}</span>`).join('')
  );
  // Also split the gradient span
  const gradSpan = nameEl.querySelector('.gradient-text');
  if (gradSpan) {
    const text = gradSpan.textContent;
    gradSpan.innerHTML = text.split('').map(c =>
      `<span class="char" style="display:inline-block; color:inherit; -webkit-text-fill-color:inherit">${c}</span>`
    ).join('');
  }
}

function splitNameChars() {
  splitNameCharsEl(document.getElementById('hero-name'));
}

function initAboutNameAnimation(reduced) {
  const aboutNameEl = document.getElementById('about-name');
  if (!aboutNameEl) return;

  if (!reduced) {
    splitNameCharsEl(aboutNameEl);
    
    gsap.to(aboutNameEl.querySelectorAll('.char'), {
      scrollTrigger: { trigger: aboutNameEl, start: 'top 85%' },
      opacity: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.035,
      duration: 0.65,
      ease: 'back.out(2)'
    });
  }
}

// ==========================================================================
// 8. SCROLL TRIGGER ANIMATIONS
// ==========================================================================
function initScrollAnimations(reduced) {
  // Reveal elements
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => el.classList.add('visible'),
    });
  });

  if (reduced) return;

  // Stats cards pop
  gsap.utils.toArray('.stat-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 85%' },
      y: 40,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'back.out(1.5)',
    });
  });

  // Featured project cards stagger
  gsap.utils.toArray('.featured-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 87%' },
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: i * 0.12,
      ease: 'power3.out',
    });
  });

  // Section headers
  gsap.utils.toArray('h2').forEach(h => {
    gsap.from(h, {
      scrollTrigger: { trigger: h, start: 'top 88%' },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item.querySelector('.timeline-content'), {
      scrollTrigger: { trigger: item, start: 'top 85%' },
      x: i % 2 === 0 ? -40 : 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
    gsap.from(item.querySelector('.timeline-dot'), {
      scrollTrigger: { trigger: item, start: 'top 85%' },
      scale: 0,
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: 'back.out(2)',
    });
  });
}

// ==========================================================================
// 9. ROLE TYPER
// ==========================================================================
function initRoleTyper() {
  const el = document.getElementById('hero-role-text');
  if (!el) return;

  const roles = ['AI Systems', 'Data Pipelines', 'Smart Applications', 'ML Models', 'Intelligent Agents', 'Neural Networks'];
  let idx = 0, charIdx = 0, deleting = false;

  const type = () => {
    const role = roles[idx];
    el.textContent = deleting
      ? role.substring(0, charIdx - 1)
      : role.substring(0, charIdx + 1);

    charIdx += deleting ? -1 : 1;
    let delay = deleting ? 55 : 95;

    if (!deleting && charIdx === role.length) { delay = 2000; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; idx = (idx + 1) % roles.length; delay = 400; }

    setTimeout(type, delay);
  };

  setTimeout(type, 3500); // after loader
}

// ==========================================================================
// 10. STAT COUNTERS
// ==========================================================================
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = '+';
    const dur = 1800;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target) + (p >= 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

// ==========================================================================
// 11. JOURNEY PATH
// ==========================================================================
function initJourneyPath() {
  const path = document.getElementById('journey-path-line');
  if (!path) return;

  ScrollTrigger.create({
    trigger: path,
    start: 'top 80%',
    onEnter: () => path.classList.add('animated'),
  });
}

// ==========================================================================
// 12. 3D TILT CARDS (CSS perspective)
// ==========================================================================
function initTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;

      gsap.to(card, {
        rotateY: x * 18,
        rotateX: -y * 18,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

// ==========================================================================
// 13. MAGNETIC BUTTONS
// ==========================================================================
function initMagneticButtons() {
  const magnetics = document.querySelectorAll('.magnetic');

  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;

      gsap.to(el, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.35,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

// ==========================================================================
// 14. RIPPLE EFFECT on btn-primary
// ==========================================================================
function initRippleButtons() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

// ==========================================================================
// 15. PROJECT CARDS (expand/collapse accordion)
// ==========================================================================
function renderDynamicProjects() {
  const container = document.getElementById('dynamic-projects-grid');
  if (!container || !window.githubProjects) return;

  container.innerHTML = '';
  
  let cardsHtml = '';
  window.githubProjects.forEach((proj, i) => {
    // Generate tech tags HTML
    const tagsHtml = proj.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');
    
    // First card gets active-slide by default
    const activeClass = i === 0 ? 'active-slide' : '';

    cardsHtml += `
      <article class="proj-card ${activeClass}" data-category="${proj.category}" onclick="window.location.href='project-details.html?id=${proj.repoId}'">
        <div class="proj-card-collapsed" style="border-bottom: none; padding-bottom: 0;">
          <div class="proj-icon"><i data-lucide="${proj.icon}"></i></div>
          <div class="proj-header-text">
            <div class="proj-badge">${proj.badge}</div>
            <h3 class="proj-title">${proj.title}</h3>
          </div>
          <button class="proj-expand-btn" aria-label="Go to project" style="transform: rotate(-45deg);"><i data-lucide="arrow-right"></i></button>
        </div>
        
        <div class="proj-card-body" style="display: block; padding-top: 1rem; border-top: none;">
          <p class="proj-desc-text" style="margin-bottom: 1.5rem;">
            ${proj.shortDesc}
          </p>
          <div class="proj-footer-row" style="margin-top: auto; border-top: 1px solid var(--border); padding-top: 1rem;">
            <div class="tech-tags">
              ${tagsHtml}
            </div>
          </div>
        </div>
      </article>
    `;
  });
  
  container.innerHTML = cardsHtml;
  
  // Re-initialize Lucide icons for dynamically added elements
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Setup Slider Logic
  const cards = container.querySelectorAll('.proj-card');
  if (cards.length > 1) {
    let currentIndex = 0;
    
    // Interval to loop cards
    setInterval(() => {
      cards[currentIndex].classList.remove('active-slide');
      currentIndex = (currentIndex + 1) % cards.length;
      cards[currentIndex].classList.add('active-slide');
    }, 4000); // changes every 4 seconds
  }
}

// ==========================================================================
// 16. PROJECT FILTERS
// ==========================================================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.proj-card[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        if (show) {
          card.style.display = '';
          gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
        } else {
          gsap.to(card, {
            opacity: 0, y: 16, scale: 0.97, duration: 0.3, ease: 'power2.in',
            onComplete: () => { card.style.display = 'none'; }
          });
        }
      });
    });
  });
}

// ==========================================================================
// 17. SKILL BARS
// ==========================================================================
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.dataset.width;
        if (w) setTimeout(() => { entry.target.style.width = `${w}%`; }, 200);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => obs.observe(b));
}

// ==========================================================================
// 18. CONTACT FORM
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const feedback  = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  const btnText   = document.getElementById('btn-text');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name')?.value.trim();
    const email   = form.querySelector('#email')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !email || !message) {
      showFeedback('error', '⚠️ Please fill in all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('error', '⚠️ Please enter a valid email address.');
      return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.7'; }
    if (btnText) btnText.textContent = 'Sending...';

    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: {
          'Accept': 'application/json'
        },
        body: new FormData(form)
      });
      
      if (response.ok) {
        if (btnText) btnText.textContent = 'Message Sent! ✓';
        submitBtn.style.opacity = '1';
        showFeedback('success', '✓ Thank you! I\'ll get back to you within 24 hours.');
        form.reset();
        
        // Confetti burst
        launchConfetti();
      } else {
        throw new Error('Form submission failed.');
      }
    } catch (error) {
      if (btnText) btnText.textContent = 'Send Message';
      submitBtn.style.opacity = '1';
      showFeedback('error', '⚠️ Oops! There was a problem submitting your form.');
    }

    setTimeout(() => {
      if (submitBtn) { submitBtn.disabled = false; }
      if (btnText) btnText.textContent = 'Send Message';
      hideFeedback();
    }, 5000);
  });

  function showFeedback(type, msg) {
    if (!feedback) return;
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = msg;
    feedback.style.display = 'flex';
    gsap.from(feedback, { opacity: 0, y: -10, duration: 0.4, ease: 'power2.out' });
  }

  function hideFeedback() {
    if (!feedback) return;
    gsap.to(feedback, { opacity: 0, duration: 0.3, onComplete: () => { feedback.style.display = 'none'; } });
  }
}

// ==========================================================================
// 19. CONFETTI burst on form submit
// ==========================================================================
function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * 3 + 2,
    color: ['#3B82F6','#8B5CF6','#06B6D4','#EC4899','#10B981'][Math.floor(Math.random()*5)],
    size: Math.random() * 8 + 4,
    rot: Math.random() * 360,
    vrot: (Math.random() - 0.5) * 8,
  }));

  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vrot; p.vy += 0.08;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.4);
      ctx.restore();
    });
    if (pieces.some(p => p.y < canvas.height + 30)) {
      frame = requestAnimationFrame(draw);
    } else {
      canvas.remove();
    }
  }
  draw();
  setTimeout(() => { cancelAnimationFrame(frame); canvas.remove(); }, 3500);
}

// ==========================================================================
// 20. NAVIGATION
// ==========================================================================
function initNavigation() {
  const header = document.getElementById('header');
  if (!header) return;

  // Active link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll shrink
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ==========================================================================
// 21. MOBILE MENU
// ==========================================================================
function initMobileMenu() {
  const btn     = document.getElementById('mobile-menu-btn');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('close-menu-btn');
  if (!btn || !overlay) return;

  const open  = () => { overlay.classList.add('open');  btn.setAttribute('aria-expanded', 'true');  document.body.style.overflow = 'hidden'; };
  const close = () => { overlay.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };

  btn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', close));
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
}

// ==========================================================================
// 22. PAGE TRANSITION
// ==========================================================================
function initPageTransition() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  overlay.classList.remove('active');

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http') || link.hasAttribute('download') || link.getAttribute('target') === '_blank') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => { window.location.href = href; }, 340);
    });
  });
}
