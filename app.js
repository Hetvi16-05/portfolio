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
  
  initNeuralCursor();
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
  initThemeToggle();
  initRecruiterMode();
  initHeroBrain3D(reduced);
  initAIAssistant();
  initSkillsGalaxy(reduced);
  initGitHubGraph();
  initCodeTerminal();
  initFAQ();
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
// 4. THREE.JS NEURAL BACKGROUND
// ==========================================================================
function initStarField(reduced) {
  const canvas = document.getElementById('star-canvas');
  if (!canvas || reduced) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 400;

  const particleCount = 120;
  const maxDistance = 100;
  
  const particles = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = [];

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 800;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 800;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 400;

    particleVelocities.push({
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
      z: (Math.random() - 0.5) * 0.5
    });
  }

  particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const pMaterial = new THREE.PointsMaterial({
    color: 0x8b5cf6,
    size: 3,
    transparent: true,
    opacity: 0.6
  });

  const particleSystem = new THREE.Points(particles, pMaterial);
  scene.add(particleSystem);

  const linesGeometry = new THREE.BufferGeometry();
  const linesMaterial = new THREE.LineBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.15
  });

  const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
  scene.add(linesMesh);

  // Mouse parallax
  let targetMX = 0, targetMY = 0;
  let currentMX = 0, currentMY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMX = (e.clientX / window.innerWidth - 0.5) * 100;
    targetMY = (e.clientY / window.innerHeight - 0.5) * 100;
  });

  function animate() {
    requestAnimationFrame(animate);

    const positions = particleSystem.geometry.attributes.position.array;
    
    // Move particles
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += particleVelocities[i].x;
      positions[i * 3 + 1] += particleVelocities[i].y;
      positions[i * 3 + 2] += particleVelocities[i].z;

      // Bounce
      if (Math.abs(positions[i * 3]) > 400) particleVelocities[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 400) particleVelocities[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 200) particleVelocities[i].z *= -1;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;

    // Connect lines
    const linePositions = [];
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }
    linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    // Parallax
    currentMX += (targetMX - currentMX) * 0.05;
    currentMY += (targetMY - currentMY) * 0.05;
    camera.position.x = currentMX;
    camera.position.y = -currentMY;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}


// ==========================================================================
// 5. AI NEURAL CURSOR
// ==========================================================================
function initNeuralCursor() {
  const node = document.getElementById('cursor-node');
  const synapse = document.getElementById('cursor-synapse');
  
  if (!node || !synapse || window.matchMedia('(hover: none)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  let synapseX = mouseX;
  let synapseY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Node follows instantly
    node.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  // Synapse follows with lerp
  function animateSynapse() {
    synapseX += (mouseX - synapseX) * 0.15;
    synapseY += (mouseY - synapseY) * 0.15;
    synapse.style.transform = `translate(calc(${synapseX}px - 50%), calc(${synapseY}px - 50%))`;
    requestAnimationFrame(animateSynapse);
  }
  animateSynapse();

  // Hover states
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .sg-planet, .btn-primary, .btn-outline, .project-card');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      node.classList.add('is-hovering');
      synapse.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
      node.classList.remove('is-hovering');
      synapse.classList.remove('is-hovering');
    });
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
  const el = document.getElementById('hero-typer-text'); // updated ID
  if (!el) return;

  const roles = ['AI Engineer', 'Data Analyst', 'Machine Learning Developer', 'LLM Builder', 'Full Stack Developer'];
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

  setTimeout(type, 1500); // after loader
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

  container.className = 'projects-accordion reveal';
  container.innerHTML = '';
  
  let cardsHtml = '';
  window.githubProjects.forEach((proj, i) => {
    // Generate tech tags HTML
    const tagsHtml = proj.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');
    
    cardsHtml += `
      <a href="project-details.html?id=${proj.repoId}" class="accordion-item" data-category="${proj.category}">
        
        <!-- The collapsed vertical strip -->
        <div class="accordion-strip">
          <div class="accordion-vertical-title">${proj.title}</div>
          <div class="accordion-icon"><i data-lucide="${proj.icon}"></i></div>
        </div>
        
        <!-- The expanded content -->
        <div class="accordion-content">
          <div class="proj-badge" style="background: var(--bg-hover); border: 1px solid var(--border); padding: 0.3rem 0.8rem; border-radius: 100px; font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase;">
            ${proj.badge}
          </div>
          <h3>${proj.title}</h3>
          <p>${proj.shortDesc}</p>
          <div class="tech-tags" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${tagsHtml}
          </div>
        </div>
        
      </a>
    `;
  });
  
  container.innerHTML = cardsHtml;
  
  // Re-initialize Lucide icons for dynamically added elements
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
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

// ==========================================================================
// 23. THEME TOGGLE
// ==========================================================================
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  
  // Check local storage or system preference
  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    updateToggleIcons('moon');
  } else {
    updateToggleIcons('sun');
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      updateToggleIcons(isLight ? 'moon' : 'sun');
    });
  });

  function updateToggleIcons(iconName) {
    toggleBtns.forEach(btn => {
      btn.innerHTML = `<i data-lucide="${iconName}"></i>`;
    });
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}

// ==========================================================================
// 24. RECRUITER SIDEBAR INTERACTION
// ==========================================================================
function initRecruiterMode() {
  const recruiterBtn = document.querySelector('.recruiter-pill');
  const closeTooltip = document.querySelector('.close-recruiter');
  const tooltip = document.querySelector('.recruiter-tooltip');

  const sidebar = document.getElementById('recruiter-sidebar');
  const overlay = document.getElementById('recruiter-panel-overlay');
  const closeSidebarBtn = document.getElementById('rs-close-btn');
  const printBtn = document.getElementById('rs-print-btn');
  const options = document.querySelectorAll('.rs-option');

  // Tooltip close logic
  if (closeTooltip && tooltip) {
    closeTooltip.addEventListener('click', (e) => {
      e.stopPropagation();
      gsap.to(tooltip, {
        opacity: 0,
        y: 10,
        duration: 0.3,
        onComplete: () => tooltip.style.display = 'none'
      });
    });
  }

  const openSidebar = () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (recruiterBtn) {
    recruiterBtn.addEventListener('click', openSidebar);
  }

  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Role selection data
  const roleData = {
    ml_ai: {
      score: 94,
      subtitle: "Highly Recommended",
      reasons: [
        '<i data-lucide="check-circle-2"></i> Strong foundation in PyTorch and TensorFlow',
        '<i data-lucide="check-circle-2"></i> Experience deploying RAG pipelines and LLMs',
        '<i data-lucide="check-circle-2"></i> Proven ability to solve real-world problems'
      ]
    },
    data: {
      score: 88,
      subtitle: "Strong Match",
      reasons: [
        '<i data-lucide="check-circle-2"></i> Proficient in complex Data Pipelines and EDA',
        '<i data-lucide="check-circle-2"></i> Advanced SQL and predictive modeling',
        '<i data-lucide="check-circle-2"></i> Experience handling severe class imbalances'
      ]
    },
    fullstack_ai: {
      score: 98,
      subtitle: "Perfect Match",
      reasons: [
        '<i data-lucide="check-circle-2"></i> End-to-end FastAPI & React deployments',
        '<i data-lucide="check-circle-2"></i> Seamless GenAI and pgvector integrations',
        '<i data-lucide="check-circle-2"></i> Proven track record of scalable systems'
      ]
    },
    software: {
      score: 85,
      subtitle: "Good Fit",
      reasons: [
        '<i data-lucide="check-circle-2"></i> Excellent Python systems programming skills',
        '<i data-lucide="check-circle-2"></i> Experience building robust REST APIs',
        '<i data-lucide="check-circle-2"></i> Deep understanding of computer science fundamentals'
      ]
    }
  };

  // Radio button selection logic
  options.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active from all
      options.forEach(opt => opt.classList.remove('active'));
      // Add active to clicked
      option.classList.add('active');
      // Set the radio input to checked
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        
        // Update Match Score & Why Hire Me
        const data = roleData[radio.value];
        if (data) {
          const circle = document.getElementById('rs-match-circle');
          const percentage = document.getElementById('rs-match-percentage');
          const subtitle = document.querySelector('.rs-match-subtitle');
          const list = document.getElementById('rs-why-list');
          
          if (circle && percentage && list) {
            circle.style.strokeDasharray = `${data.score}, 100`;
            percentage.textContent = `${data.score}%`;
            if (subtitle) subtitle.textContent = data.subtitle;
            list.innerHTML = data.reasons.map(r => `<li>${r}</li>`).join('');
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }
        }
      }
    });
  });

  // Print button logic
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      // In a real app, this might generate a PDF based on the selected role
      const selected = document.querySelector('.rs-option input:checked');
      console.log('Generating brief for:', selected ? selected.value : 'default');
      window.open('Hetvisheth_resume.pdf', '_blank');
    });
  }
}

// ==========================================================================
// 25. PROJECTS MODAL (SPA OVERLAY) - Removed
// ==========================================================================
function initProjectsModal() {
  // Logic removed, now using projects.html page directly.
}

// ==========================================================================
// 26. HERO 3D BRAIN
// ==========================================================================
function initHeroBrain3D(reduced) {
  const container = document.getElementById('hero-3d-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  // Adjust camera to fit the right-side container
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Create nodes (Points)
  const particleCount = 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  // A rough sphere/brain shape
  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;
    
    // add slight randomness
    const r = 30 + (Math.random() * 5);
    
    positions[i * 3] = r * Math.cos(theta) * Math.sin(phi);
    positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x3b82f6,
    size: 2,
    transparent: true,
    opacity: 0.8,
  });

  const brain = new THREE.Points(geometry, material);
  scene.add(brain);

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  if (!reduced) {
    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX) * 0.05;
      mouseY = (event.clientY - windowHalfY) * 0.05;
    });
  }

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    if (!reduced) {
      // Gentle floating rotation
      brain.rotation.y += 0.002;
      brain.rotation.x = Math.sin(time * 0.5) * 0.1;

      // Mouse follow effect
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
    }

    renderer.render(scene, camera);
  }

  animate();

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// ==========================================================================
// 27. AI ASSISTANT WIDGET
// ==========================================================================
function initAIAssistant() {
  const launcher = document.getElementById('ai-launcher-btn');
  const chatWindow = document.getElementById('ai-chat-window');
  const closeBtn = document.getElementById('ai-close-btn');
  const chatBody = document.getElementById('ai-chat-body');
  const input = document.getElementById('ai-chat-input');
  const submitBtn = document.getElementById('ai-chat-submit');
  const suggestionBtns = document.querySelectorAll('.ai-suggestion-btn');

  if (!launcher || !chatWindow) return;

  const toggleChat = () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      input.focus();
    }
  };

  launcher.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', () => chatWindow.classList.remove('active'));

  const addMessage = (text, isUser = false) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${isUser ? 'user-message' : 'bot-message'}`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    
    // Remove suggestions if user types
    if (isUser) {
      const suggestions = chatBody.querySelector('.ai-suggestions');
      if (suggestions) suggestions.remove();
    }

    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const showTypingIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const removeTypingIndicator = () => {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  };

  const generateResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    let response = "I'm still learning! You can ask me about Hetvi's projects, skills, or download her resume.";

    if (lowerQuery.includes('project') || lowerQuery.includes('built') || lowerQuery.includes('work')) {
      response = "Hetvi has built several impressive systems including <strong>Saarthi AI</strong> (a multi-turn RAG chatbot), <strong>RAINWISE V3.1</strong> (rainfall prediction with 98.89% accuracy), and a <strong>Stroke Risk Engine</strong>. You can check out the Projects page for details!";
    } else if (lowerQuery.includes('skill') || lowerQuery.includes('tech') || lowerQuery.includes('know')) {
      response = "She is highly skilled in Data & AI (Python, PyTorch, TensorFlow, Pandas, SQL) and Full-Stack Development (React, Next.js, Node.js, Express, HTML/CSS).";
    } else if (lowerQuery.includes('education') || lowerQuery.includes('degree') || lowerQuery.includes('study')) {
      response = "She holds a B.Tech in Computer Science & Engineering from Navrachana University, with a CGPA of 8.87/10.";
    } else if (lowerQuery.includes('resume') || lowerQuery.includes('cv') || lowerQuery.includes('download')) {
      response = "Sure! You can download her resume by clicking the 'Download Resume' button in the hero section, or <a href='Hetvisheth_resume.pdf' target='_blank' style='color:#60A5FA;text-decoration:underline;'>click right here</a>.";
    } else if (lowerQuery.includes('contact') || lowerQuery.includes('hire') || lowerQuery.includes('email')) {
      response = "You can reach out to her via the Contact page, or email her directly at <strong>shethhetvi11@gmail.com</strong>.";
    } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi ') || lowerQuery.includes('hey')) {
      response = "Hello! How can I help you explore Hetvi's portfolio today?";
    }

    setTimeout(() => {
      removeTypingIndicator();
      addMessage(response, false);
    }, 1500); // simulate thinking
  };

  const handleSubmit = () => {
    const text = input.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    input.value = '';
    
    showTypingIndicator();
    generateResponse(text);
  };

  submitBtn.addEventListener('click', handleSubmit);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });

  suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.textContent;
      input.value = text;
      handleSubmit();
    });
  });
}

// ==========================================================================
// 28. SKILLS GALAXY
// ==========================================================================
function initSkillsGalaxy(reduced) {
  const container = document.getElementById('sg-container');
  const tooltip = document.getElementById('sg-tooltip');
  if (!container || !tooltip) return;

  const skillsData = [
    { name: 'Python', level: 'Expert', projects: 7, desc: 'Primary language for ML, Data Analysis, and backend services.', color: 'linear-gradient(135deg, #3B82F6, #10B981)' },
    { name: 'PyTorch', level: 'Advanced', projects: 4, desc: 'Used for autonomous drone navigation and deep learning models.', color: 'linear-gradient(135deg, #EF4444, #F59E0B)' },
    { name: 'React', level: 'Advanced', projects: 5, desc: 'Building interactive and dynamic user interfaces for web apps.', color: 'linear-gradient(135deg, #06B6D4, #3B82F6)' },
    { name: 'TensorFlow', level: 'Advanced', projects: 3, desc: 'Building and training neural networks for predictive analytics.', color: 'linear-gradient(135deg, #F59E0B, #EF4444)' },
    { name: 'SQL', level: 'Advanced', projects: 6, desc: 'Complex querying, database design, and data warehousing.', color: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' },
    { name: 'Power BI', level: 'Intermediate', projects: 2, desc: 'Data visualization and business intelligence reporting.', color: 'linear-gradient(135deg, #F59E0B, #10B981)' },
    { name: 'NLP', level: 'Advanced', projects: 3, desc: 'Building LLMs and text processing pipelines.', color: 'linear-gradient(135deg, #EC4899, #8B5CF6)' },
    { name: 'FastAPI', level: 'Intermediate', projects: 4, desc: 'High-performance backend APIs for ML model serving.', color: 'linear-gradient(135deg, #10B981, #06B6D4)' },
  ];

  const planets = [];

  skillsData.forEach((skill, i) => {
    const el = document.createElement('div');
    el.className = 'sg-planet';
    // Size based on level/projects roughly
    const size = skill.level === 'Expert' ? 100 : (skill.level === 'Advanced' ? 85 : 70);
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.background = skill.color;
    el.innerHTML = `<span>${skill.name}</span>`;
    
    // Initial random position
    let x = Math.random() * (container.clientWidth - size) + size / 2;
    let y = Math.random() * (container.clientHeight - size) + size / 2;
    
    // Random velocity
    let vx = (Math.random() - 0.5) * 1.5;
    let vy = (Math.random() - 0.5) * 1.5;

    planets.push({ el, x, y, vx, vy, size, skill, hovered: false });
    container.appendChild(el);

    // Interactivity
    el.addEventListener('mouseenter', () => {
      planets[i].hovered = true;
      document.getElementById('sg-tooltip-title').textContent = skill.name;
      document.getElementById('sg-tooltip-level').textContent = `Level: ${skill.level}`;
      document.getElementById('sg-tooltip-projects').textContent = `Projects used: ${skill.projects}`;
      document.getElementById('sg-tooltip-desc').textContent = skill.desc;
      
      tooltip.classList.add('active');
      
      // Position tooltip near the planet
      const rect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      let tooltipX = rect.left - containerRect.left + (size / 2);
      let tooltipY = rect.top - containerRect.top - 20;
      
      tooltip.style.left = `${tooltipX}px`;
      tooltip.style.top = `${tooltipY}px`;
    });

    el.addEventListener('mouseleave', () => {
      planets[i].hovered = false;
      tooltip.classList.remove('active');
    });
  });

  if (!reduced) {
    function animate() {
      planets.forEach(p => {
        if (p.hovered) return; // Pause if hovered

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x - p.size / 2 < 0 || p.x + p.size / 2 > container.clientWidth) p.vx *= -1;
        if (p.y - p.size / 2 < 0 || p.y + p.size / 2 > container.clientHeight) p.vy *= -1;

        // Keep inside bounds (safety)
        p.x = Math.max(p.size / 2, Math.min(p.x, container.clientWidth - p.size / 2));
        p.y = Math.max(p.size / 2, Math.min(p.y, container.clientHeight - p.size / 2));

        p.el.style.left = `${p.x}px`;
        p.el.style.top = `${p.y}px`;
      });
      requestAnimationFrame(animate);
    }
    animate();
  } else {
    // Static placement for reduced motion
    planets.forEach(p => {
      p.el.style.left = `${p.x}px`;
      p.el.style.top = `${p.y}px`;
    });
  }
}

// ==========================================================================
// 27. GITHUB CONTRIBUTION GRAPH
// ==========================================================================
function initGitHubGraph() {
  const grid = document.getElementById('github-graph-grid');
  if (!grid) return;
  
  // 52 weeks * 7 days = 364 days. Let's render about 150 squares for a clean UI block
  const numSquares = 180; 
  let html = '';
  
  for (let i = 0; i < numSquares; i++) {
    // Randomize activity levels to simulate a real graph
    // Weight it slightly towards lvl-0 and lvl-1 to look realistic
    const rand = Math.random();
    let lvl = 0;
    if (rand > 0.4) lvl = 1;
    if (rand > 0.7) lvl = 2;
    if (rand > 0.85) lvl = 3;
    if (rand > 0.95) lvl = 4;
    
    html += `<div class="day lvl-${lvl}"></div>`;
  }
  
  grid.innerHTML = html;
}

// ==========================================================================
// 28. INTERACTIVE CODE TERMINAL
// ==========================================================================
function initCodeTerminal() {
  const termBody = document.getElementById('code-terminal-body');
  if (!termBody) return;
  
  // Basic hover effect for window buttons
  const buttons = document.querySelectorAll('.t-btn');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'scale(1.2)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });
  });
}

// ==========================================================================
// 29. FAQ ACCORDION
// ==========================================================================
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      const answer = question.nextElementSibling;
      
      // Close all others
      faqQuestions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        q.nextElementSibling.style.maxHeight = null;
      });
      
      if (!isExpanded) {
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}
