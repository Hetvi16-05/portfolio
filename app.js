/**
 * Hetvi Sheth Portfolio — App JavaScript
 * Premium Light-Themed AI & Data Analytics Portfolio
 * All interactive features: navigation, canvas animations, scroll reveals, etc.
 */

// ==========================================================================
// INIT — Run after DOM is ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initNavigation();
  initScrollReveal();
  initMobileMenu();
  initJourneyPath();
  initStatCounters();
  initRoleTyper();
  initProjectFilters();
  initProjectStages();
  initReportTabs();
  initSkillBars();
  initReadingProgress();
  initContactForm();
  initSkillsCanvas();
  initConstellationCanvas();
  initPageTransition();
});

// ==========================================================================
// 1. NAVIGATION — scroll shrink + active link
// ==========================================================================
function initNavigation() {
  const header = document.getElementById('header');
  if (!header) return;

  // Set active link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  // Scroll shrink
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ==========================================================================
// 2. MOBILE MENU
// ==========================================================================
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('close-menu-btn');

  if (!btn || !overlay) return;

  const openMenu = () => {
    overlay.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  btn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close on mobile link click
  overlay.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
  });
}

// ==========================================================================
// 3. SCROLL REVEAL — IntersectionObserver for all .reveal elements
// ==========================================================================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ==========================================================================
// 4. HERO ROLE TYPER — cycling role text
// ==========================================================================
function initRoleTyper() {
  const el = document.getElementById('hero-role-text');
  if (!el) return;

  const roles = ['AI Systems', 'Data Pipelines', 'Smart Applications', 'ML Models', 'Intelligent Agents'];
  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId;

  const type = () => {
    const currentRole = roles[currentIndex];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % roles.length;
      delay = 400;
    }

    timeoutId = setTimeout(type, delay);
  };

  timeoutId = setTimeout(type, 800);
}

// ==========================================================================
// 5. ANIMATED STAT COUNTERS
// ==========================================================================
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = target >= 500 ? '+' : '+';
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = Math.floor(eased * target);
      el.textContent = current + (progress >= 1 ? suffix : '');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ==========================================================================
// 6. JOURNEY PATH — SVG stroke animation on scroll
// ==========================================================================
function initJourneyPath() {
  const path = document.getElementById('journey-path-line');
  if (!path) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        path.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(path);
}

// ==========================================================================
// 7. PROJECT FILTERS — filter cards by category
// ==========================================================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        if (show) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ==========================================================================
// 8. PROJECT STORYTELLING STAGES — accordion tabs
// ==========================================================================
function initProjectStages() {
  document.querySelectorAll('.project-card').forEach(card => {
    const tabs = card.querySelectorAll('.stage-tab');
    const panels = card.querySelectorAll('.stage-panel');

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const panel = card.querySelector(`.stage-panel[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

// ==========================================================================
// 9. REPORT TABS — sidebar navigation
// ==========================================================================
function initReportTabs() {
  const tabBtns = document.querySelectorAll('.report-tab-btn');
  const reportCards = document.querySelectorAll('.report-detail-card');

  if (!tabBtns.length || !reportCards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');

      tabBtns.forEach(b => b.classList.remove('active'));
      reportCards.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const card = document.getElementById(target);
      if (card) card.classList.add('active');
    });
  });
}

// ==========================================================================
// 10. SKILL BARS — animate progress bars on scroll
// ==========================================================================
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill, .progress-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        if (width) {
          setTimeout(() => {
            bar.style.width = `${width}%`;
          }, 200);
        }
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

// ==========================================================================
// 11. READING PROGRESS BAR
// ==========================================================================
function initReadingProgress() {
  const bar = document.getElementById('reading-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }, { passive: true });
}

// ==========================================================================
// 12. CONTACT FORM — validation & feedback
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const feedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-send-icon');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !email || !message) {
      showFeedback('error', '⚠️ Please fill in your name, email, and message.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('error', '⚠️ Please enter a valid email address.');
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending...';
    submitBtn.style.opacity = '0.75';

    // Simulate send (no backend)
    await new Promise(resolve => setTimeout(resolve, 1400));

    // Success
    if (btnText) btnText.textContent = 'Message Sent!';
    submitBtn.style.opacity = '1';
    showFeedback('success', '✓ Thank you! I\'ll get back to you within 24 hours.');
    form.reset();

    setTimeout(() => {
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message';
      hideFeedback();
    }, 5000);
  });

  function showFeedback(type, message) {
    if (!feedback) return;
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
    feedback.style.display = 'flex';
  }

  function hideFeedback() {
    if (!feedback) return;
    feedback.style.display = 'none';
  }
}

// ==========================================================================
// 13. SKILLS ECOSYSTEM CANVAS — interactive bubble clusters
// ==========================================================================
function initSkillsCanvas() {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, mouse = { x: -999, y: -999 };
  let animId;

  // Skill categories with colors matching CSS
  const categories = [
    {
      name: 'Programming',
      color: 'hsla(258,80%,62%,',
      skills: ['Python', 'Java', 'JavaScript', 'C', 'SQL'],
      centerRatio: { x: 0.2, y: 0.3 }
    },
    {
      name: 'Data Analytics',
      color: 'hsla(210,85%,58%,',
      skills: ['Pandas', 'NumPy', 'Power BI', 'Tableau', 'Seaborn'],
      centerRatio: { x: 0.5, y: 0.25 }
    },
    {
      name: 'ML & AI',
      color: 'hsla(280,70%,58%,',
      skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'YOLO', 'LSTM', 'LLMs'],
      centerRatio: { x: 0.78, y: 0.3 }
    },
    {
      name: 'Web Dev',
      color: 'hsla(175,65%,42%,',
      skills: ['React', 'Node.js', 'FastAPI', 'Streamlit', 'HTML5'],
      centerRatio: { x: 0.25, y: 0.7 }
    },
    {
      name: 'Big Data',
      color: 'hsla(210,85%,58%,',
      skills: ['Hadoop', 'Spark', 'Kafka', 'MongoDB'],
      centerRatio: { x: 0.55, y: 0.72 }
    },
    {
      name: 'Databases',
      color: 'hsla(258,80%,62%,',
      skills: ['PostgreSQL', 'MySQL', 'pgvector', 'Supabase'],
      centerRatio: { x: 0.82, y: 0.68 }
    }
  ];

  let bubbles = [];

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
    initBubbles();
  }

  function initBubbles() {
    bubbles = [];
    categories.forEach(cat => {
      const cx = cat.centerRatio.x * width;
      const cy = cat.centerRatio.y * height;
      const r = Math.min(width, height) * 0.085;

      cat.skills.forEach((skill, i) => {
        const angle = (i / cat.skills.length) * Math.PI * 2;
        const dist = r * (0.5 + Math.random() * 0.5);
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const radius = 20 + Math.random() * 12;

        bubbles.push({
          x, y,
          ox: x, oy: y,
          vx: 0, vy: 0,
          radius,
          label: skill,
          color: cat.color,
          categoryX: cx,
          categoryY: cy,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.5
        });
      });
    });
  }

  function drawBubble(b, hovered) {
    const alpha = hovered ? 1.0 : 0.85;

    // Glow
    if (hovered) {
      ctx.shadowColor = b.color + '0.4)';
      ctx.shadowBlur = 20;
    }

    // Circle fill
    const grad = ctx.createRadialGradient(b.x - b.radius * 0.3, b.y - b.radius * 0.3, 2, b.x, b.y, b.radius);
    grad.addColorStop(0, b.color + '0.95)');
    grad.addColorStop(1, b.color + '0.6)');

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0;

    // Text
    ctx.font = `${hovered ? 600 : 500} ${Math.max(9, b.radius * 0.45)}px Inter, system-ui`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b.label, b.x, b.y);
  }

  function drawConnections() {
    categories.forEach(cat => {
      const cx = cat.centerRatio.x * width;
    const cy = cat.centerRatio.y * height;

      // Draw category label
      ctx.font = '700 11px Outfit, system-ui';
      ctx.fillStyle = cat.color + '0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cat.name.toUpperCase(), cx, cy);

      // Subtle connections between same-category bubbles
      const catBubbles = bubbles.filter(b => b.color === cat.color);
      catBubbles.forEach((b1, i) => {
        catBubbles.forEach((b2, j) => {
          if (j <= i) return;
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.15;
            ctx.beginPath();
            ctx.moveTo(b1.x, b1.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.strokeStyle = cat.color + `${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
    });
  }

  let t = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections first (behind bubbles)
    drawConnections();

    t += 0.008;

    bubbles.forEach(b => {
      // Gentle float
      const floatX = Math.sin(t * b.speed + b.phase) * 4;
      const floatY = Math.cos(t * b.speed * 0.7 + b.phase) * 4;
      const targetX = b.ox + floatX;
      const targetY = b.oy + floatY;

      // Mouse repulsion
      const dx = b.x - mouse.x;
      const dy = b.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulsionRadius = 100;

      if (dist < repulsionRadius) {
        const force = (repulsionRadius - dist) / repulsionRadius;
        b.vx += (dx / dist) * force * 3;
        b.vy += (dy / dist) * force * 3;
      }

      // Spring back toward target
      b.vx += (targetX - b.x) * 0.06;
      b.vy += (targetY - b.y) * 0.06;

      // Damping
      b.vx *= 0.82;
      b.vy *= 0.82;

      b.x += b.vx;
      b.y += b.vy;

      const hovered = dist < b.radius + 20;
      drawBubble(b, hovered);
    });

    animId = requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (width / rect.width);
    mouse.y = (e.clientY - rect.top) * (height / rect.height);
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  resize();
  animate();

  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(animId);
    resize();
    animate();
  });
  ro.observe(canvas.parentElement);
}

// ==========================================================================
// 14. ACHIEVEMENT CONSTELLATION CANVAS — floating cert nodes
// ==========================================================================
function initConstellationCanvas() {
  const canvas = document.getElementById('constellation-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animId;
  let mouse = { x: -999, y: -999 };

  const certs = [
    { label: 'Python for\nData Science', issuer: 'IBM', color: 'hsla(258,80%,62%,', x: 0, y: 0, phase: 0 },
    { label: 'Python 101\nData Science', issuer: 'Cognitive Class', color: 'hsla(210,85%,58%,', x: 0, y: 0, phase: 1.2 },
    { label: 'ML Foundations', issuer: 'AWS Academy', color: 'hsla(175,65%,42%,', x: 0, y: 0, phase: 2.3 },
    { label: 'AI Fundamentals', issuer: 'IBM SkillsBuild', color: 'hsla(280,70%,58%,', x: 0, y: 0, phase: 0.7 },
    { label: 'Data Engineering', issuer: 'AWS Academy', color: 'hsla(175,65%,42%,', x: 0, y: 0, phase: 3.1 },
    { label: 'Data Analysis\nwith Python', issuer: 'Cognitive Class', color: 'hsla(210,85%,58%,', x: 0, y: 0, phase: 1.8 },
    { label: 'Intro to IoT', issuer: 'Cisco Networking', color: 'hsla(258,80%,62%,', x: 0, y: 0, phase: 4.0 },
  ];

  function computePositions() {
    const cx = width / 2;
    const cy = height / 2;
    const rx = width * 0.34;
    const ry = height * 0.35;

    certs.forEach((cert, i) => {
      const angle = (i / certs.length) * Math.PI * 2 - Math.PI / 2;
      cert.bx = cx + Math.cos(angle) * rx;
      cert.by = cy + Math.sin(angle) * ry;
      cert.x = cert.bx;
      cert.y = cert.by;
      cert.r = Math.min(width, height) * 0.07;
    });
  }

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
    computePositions();
  }

  let t = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);
    t += 0.006;

    // Update floating positions
    certs.forEach(cert => {
      const floatX = Math.sin(t * 0.8 + cert.phase) * 6;
      const floatY = Math.cos(t * 0.6 + cert.phase) * 6;
      cert.x = cert.bx + floatX;
      cert.y = cert.by + floatY;
    });

    // Draw connection lines
    ctx.save();
    certs.forEach((c1, i) => {
      certs.forEach((c2, j) => {
        if (j <= i) return;
        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < Math.min(width, height) * 0.45) {
          const alpha = Math.max(0, 0.12 - (dist / (Math.min(width, height) * 0.45)) * 0.12);
          ctx.beginPath();
          ctx.moveTo(c1.x, c1.y);
          ctx.lineTo(c2.x, c2.y);
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });
    ctx.restore();

    // Draw nodes
    certs.forEach(cert => {
      const dx = cert.x - mouse.x;
      const dy = cert.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hovered = dist < cert.r + 10;
      const r = hovered ? cert.r * 1.15 : cert.r;

      // Glow
      if (hovered) {
        ctx.shadowColor = cert.color + '0.5)';
        ctx.shadowBlur = 24;
      }

      // Background circle
      const grad = ctx.createRadialGradient(cert.x - r * 0.3, cert.y - r * 0.3, 4, cert.x, cert.y, r);
      grad.addColorStop(0, cert.color + '1)');
      grad.addColorStop(1, cert.color + '0.7)');

      ctx.beginPath();
      ctx.arc(cert.x, cert.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.shadowBlur = 0;

      // Text label
      const lines = cert.label.split('\n');
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lineH = r * 0.32;
      const totalH = (lines.length - 1) * lineH;

      ctx.font = `700 ${Math.max(9, r * 0.28)}px Outfit, system-ui`;
      lines.forEach((line, idx) => {
        ctx.fillText(line, cert.x, cert.y - totalH / 2 + idx * lineH);
      });

      // Hovered: show issuer
      if (hovered) {
        ctx.font = `500 ${Math.max(8, r * 0.22)}px Inter, system-ui`;
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText(cert.issuer, cert.x, cert.y + r + 14);
      }
    });

    animId = requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (width / rect.width);
    mouse.y = (e.clientY - rect.top) * (height / rect.height);
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  resize();
  animate();

  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(animId);
    resize();
    animate();
  });
  ro.observe(canvas.parentElement);
}

// ==========================================================================
// 15. PAGE TRANSITION — fade on link click
// ==========================================================================
function initPageTransition() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Fade in on load (pages fade from overlay)
  overlay.classList.remove('active');

  // Intercept nav link clicks
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http') || link.hasAttribute('download') || link.getAttribute('target') === '_blank') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 320);
    });
  });
}
