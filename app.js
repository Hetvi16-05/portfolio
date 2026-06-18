document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================================================
  // Custom Cursor & Scroll Progress Tracker
  // ==========================================================================
  // Create progress bar element dynamically
  const progressContainer = document.createElement('div');
  progressContainer.className = 'scroll-progress-container';
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress-bar';
  progressContainer.appendChild(progressBar);
  document.body.appendChild(progressContainer);

  // Update progress bar width on scroll
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });

  // Create custom cursor elements dynamically
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  const cursorDot = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  // Track cursor position
  let cursorX = 0, cursorY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    
    // Immediate position for the dot
    cursorDot.style.left = targetX + 'px';
    cursorDot.style.top = targetY + 'px';
  }, { passive: true });

  // Smooth follow behavior for outer circle
  const updateCursor = () => {
    const dx = targetX - cursorX;
    const dy = targetY - cursorY;
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(updateCursor);
  };
  updateCursor();

  // Add hover class on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .project-card, .certificate-card, .btn, .report-tab-btn');
  const addHover = () => cursor.classList.add('hover');
  const removeHover = () => cursor.classList.remove('hover');

  const addCursorHoverListeners = () => {
    document.querySelectorAll('a, button, .project-card, .certificate-card, .btn, .report-tab-btn, .game-cell, .synapse-node').forEach(elem => {
      elem.removeEventListener('mouseenter', addHover);
      elem.removeEventListener('mouseleave', removeHover);
      elem.addEventListener('mouseenter', addHover);
      elem.addEventListener('mouseleave', removeHover);
    });
  };
  addCursorHoverListeners();

  // Re-run listener attachment on DOM changes (e.g. after drawer opening)
  const observer = new MutationObserver(() => {
    addCursorHoverListeners();
  });
  observer.observe(document.body, { childList: true, subtree: true });


  // ==========================================================================
  // Dynamic Typewriter Effect
  // ==========================================================================
  const typingSpan = document.getElementById('typing-text');
  if (typingSpan) {
    const words = [
      "Machine Learning.",
      "Full-Stack Web Apps.",
      "Natural Language Processing.",
      "Agentic AI Workflows."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentWord = words[wordIndex];
      if (isDeleting) {
        typingSpan.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typingSpan.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2200; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 400; // Pause before starting next word
      }

      setTimeout(type, typingSpeed);
    }

    // Start typewriter loop
    setTimeout(type, 800);
  }

  // ==========================================================================
  // Navigation & Scroll Effects
  // ==========================================================================
  const header = document.getElementById('header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const closeMenuBtn = document.querySelector('.close-menu-btn');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  // Sticky Header scroll styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggles
  const toggleMobileMenu = (state) => {
    if (state) {
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
  }
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => toggleMobileMenu(false));
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Active Nav Item highlighting based on Current Filename URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================================================
  // Scroll Reveal Animations (all variants)
  // ==========================================================================
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .stagger-children, .section-header';
  const revealElements = document.querySelectorAll(revealSelectors);

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // Parallax Scroll Effects
  // ==========================================================================
  const shapes = document.querySelectorAll('.shape');
  const heroVisual = document.querySelector('.hero-visual');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroVisual) {
      heroVisual.style.transform = `translateY(${scrollY * -0.04}px)`;
    }
    shapes.forEach((shape, i) => {
      const speed = (i + 1) * 0.025;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // ==========================================================================
  // Magnetic Button Effect
  // ==========================================================================
  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta .btn');

  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ==========================================================================
  // 3D Tilt on Interactive Cards
  // ==========================================================================
  const tiltCards = document.querySelectorAll('.code-card, .certificate-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ==========================================================================
  // Interactive Contact Form Handling
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('span') : null;
  const btnIcon = document.getElementById('btn-send-icon');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById('name').value;
      const emailVal = document.getElementById('email').value;
      const messageVal = document.getElementById('message').value;

      // Visual states
      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Sending Message...';
      if (btnIcon) {
        btnIcon.setAttribute('data-lucide', 'loader-2');
        if (typeof lucide !== 'undefined') lucide.createIcons();
        btnIcon.classList.add('spin-animation');
      }

      // Send form data to FormSubmit.co API
      fetch('https://formsubmit.co/ajax/shethhetvi11@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          message: messageVal
        })
      })
      .then(response => response.json())
      .then(data => {
        // Reset button
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message';
        if (btnIcon) {
          btnIcon.setAttribute('data-lucide', 'send');
          btnIcon.classList.remove('spin-animation');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        if (data.success === 'true' || data.success === true) {
          // Show success state
          formFeedback.textContent = 'Thank you, Hetvi will get back to you shortly!';
          formFeedback.className = 'form-feedback success';
          // Reset form
          contactForm.reset();
        } else {
          // Show error state
          formFeedback.textContent = 'Something went wrong. Please try again.';
          formFeedback.className = 'form-feedback error';
        }

        // Clear feedback after a few seconds
        setTimeout(() => {
          formFeedback.textContent = '';
          formFeedback.className = 'form-feedback';
        }, 5000);
      })
      .catch(error => {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Send Message';
        if (btnIcon) {
          btnIcon.setAttribute('data-lucide', 'send');
          btnIcon.classList.remove('spin-animation');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        formFeedback.textContent = 'Network error. Please check your connection.';
        formFeedback.className = 'form-feedback error';

        setTimeout(() => {
          formFeedback.textContent = '';
          formFeedback.className = 'form-feedback';
        }, 5000);
      });
    });
  }

  // Add keyframe animation for spinner via JS if needed
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .spin-animation {
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(style);

  // ==========================================================================
  // Signature Neural Mesh Background Canvas
  // ==========================================================================
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking variables
    let mouse = {
      x: null,
      y: null,
      radius: 120, // Interaction radius
      isActive: false
    };

    // Particles list
    let particles = [];

    // Scale particle density with screen size
    const getParticleCount = () => {
      if (window.innerWidth < 480) return 40;
      if (window.innerWidth < 768) return 60;
      return 100;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Speeds (drift rate)
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        
        // Aesthetics
        this.radius = Math.random() * 1.5 + 1.2;
        this.color = Math.random() > 0.5 ? '#8B5CF6' : '#0D9488';
        
        // 3D Parallax Scrolling depth factor
        this.depth = Math.random() * 0.75 + 0.25; 
        
        // Base alpha (fade overlay)
        this.alpha = Math.random() * 0.35 + 0.15;
      }

      draw(scrollY) {
        // Compute depth parallax offset on the vertical coordinate
        const drawY = (this.y - scrollY * this.depth) % height;
        
        // Handle negative wrapping (if scroll creates offset below 0)
        const adjustedY = drawY < 0 ? height + drawY : drawY;

        ctx.beginPath();
        ctx.arc(this.x, adjustedY, this.radius, 0, Math.PI * 2);
        
        // Apply glow style to points
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        
        // Clean glow settings for connecting lines
        ctx.shadowBlur = 0;
      }

      update() {
        // Drift movement
        this.x += this.vx;
        this.y += this.vy;

        // Wrap-around screen bounds
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse attraction interaction
        if (mouse.isActive && mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            // Apply a subtle pull towards the mouse cursor
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / distance) * force * 0.5;
            this.y += (dy / distance) * force * 0.5;
          }
        }
      }
    }

    // Populate particles
    const initParticles = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    // Draw lines between proximate nodes
    const connectParticles = (scrollY) => {
      const maxDistance = 110;
      
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const p1Y = ((p1.y - scrollY * p1.depth) % height + height) % height;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const p2Y = ((p2.y - scrollY * p2.depth) % height + height) % height;

          const dx = p1.x - p2.x;
          const dy = p1Y - p2Y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1Y);
            ctx.lineTo(p2.x, p2Y);

            // Connect opacity based on proximity
            const linkAlpha = (1 - distance / maxDistance) * 0.08;
            
            // Render beautiful gradient lines between contrasting nodes
            if (p1.color !== p2.color) {
              const gradient = ctx.createLinearGradient(p1.x, p1Y, p2.x, p2Y);
              gradient.addColorStop(0, p1.color);
              gradient.addColorStop(1, p2.color);
              ctx.strokeStyle = gradient;
            } else {
              ctx.strokeStyle = p1.color;
            }

            ctx.lineWidth = 0.8;
            ctx.globalAlpha = linkAlpha;
            ctx.stroke();

            // Periodically draw a glowing signal pulse traveling along the synapse line
            const pulseSpeed = 0.0008;
            const t = (Date.now() * pulseSpeed + (i + j)) % 1; 
            const pulseX = p1.x + (p2.x - p1.x) * t;
            const pulseY = p1Y + (p2Y - p1Y) * t;

            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = p2.color;
            ctx.globalAlpha = Math.min(linkAlpha * 3.5, 1);
            ctx.fill();
          }
        }
      }
    };

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Track current scroll position
      const scrollY = window.scrollY;

      // Update and draw nodes
      particles.forEach(p => {
        p.update();
        p.draw(scrollY);
      });

      // Connect proximate nodes
      connectParticles(scrollY);

      animationFrameId = requestAnimationFrame(animate);
    };

    // Event Listeners for canvas size & interactivity
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
      mouse.isActive = false;
    });

    // Handle touch interactions for mobile device gestures
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.isActive = true;
      }
    });

    window.addEventListener('touchend', () => {
      mouse.isActive = false;
    });

    // Start Particle System
    initParticles();
    animate();
  }

  // ==========================================================================
  // Interactive Project Reports Tabs
  // ==========================================================================
  const reportTabBtns = document.querySelectorAll('.report-tab-btn');
  const reportDetailCards = document.querySelectorAll('.report-detail-card');

  if (reportTabBtns.length > 0) {
    reportTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        reportTabBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        // Hide all detail cards and show target one
        const targetId = btn.getAttribute('data-target');
        reportDetailCards.forEach(card => {
          if (card.getAttribute('id') === targetId) {
            card.classList.add('active');
          } else {
            card.classList.remove('active');
          }
        });
      });
    });
  }

  // ==========================================================================
  // Left Side Project Drawer (Side Panel)
  // ==========================================================================
  const projectCards = document.querySelectorAll('.project-card');
  const drawer = document.getElementById('project-drawer');
  const drawerOverlay = drawer ? drawer.querySelector('.drawer-overlay') : null;
  const drawerCloseBtn = drawer ? drawer.querySelector('.drawer-close') : null;

  if (drawer && projectCards.length > 0) {
    const drawerBannerImgEl = document.getElementById('drawer-banner-img');
    const drawerCategoryEl = document.getElementById('drawer-category');
    const drawerTitleEl = document.getElementById('drawer-title');
    const drawerDescEl = document.getElementById('drawer-desc');
    const drawerFeaturesEl = document.getElementById('drawer-features');
    const drawerTechEl = document.getElementById('drawer-tech');
    const drawerGithubLinkEl = document.getElementById('drawer-github-link');

    const openDrawer = (card) => {
      // Extract data from card
      const bannerImgUrl = card.getAttribute('data-image');
      const category = card.querySelector('.project-category').textContent;
      const title = card.querySelector('.project-title').textContent;
      const desc = card.querySelector('.project-text').textContent;
      const features = Array.from(card.querySelectorAll('.project-features li')).map(li => li.textContent.trim());
      const tech = Array.from(card.querySelectorAll('.project-tech .tech-tag')).map(tag => tag.textContent.trim());
      const githubLink = card.querySelector('.project-links a[aria-label="GitHub Repository"]');

      // Populate drawer elements
      if (drawerBannerImgEl && bannerImgUrl) {
        drawerBannerImgEl.src = bannerImgUrl;
      }
      if (drawerCategoryEl && category) {
        drawerCategoryEl.textContent = category;
      }
      if (drawerTitleEl) drawerTitleEl.textContent = title;
      if (drawerDescEl) drawerDescEl.textContent = desc;

      // Populate features list
      if (drawerFeaturesEl) {
        drawerFeaturesEl.innerHTML = '';
        features.forEach(feat => {
          const li = document.createElement('li');
          li.innerHTML = `<i data-lucide="check-circle-2"></i> <span>${feat}</span>`;
          drawerFeaturesEl.appendChild(li);
        });
      }

      // Populate tech stack
      if (drawerTechEl) {
        drawerTechEl.innerHTML = '';
        tech.forEach(t => {
          const span = document.createElement('span');
          span.className = 'skill-pill';
          span.textContent = t;
          drawerTechEl.appendChild(span);
        });
      }

      // Populate GitHub source code link
      if (drawerGithubLinkEl && githubLink) {
        drawerGithubLinkEl.href = githubLink.href;
      }

      // Re-initialize Lucide Icons in the drawer
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      // Slide in drawer
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    };

    const closeDrawer = () => {
      drawer.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    // Add click listeners to all project cards
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // If click is on a link or its children, let default behavior happen
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('i')) {
          return;
        }
        openDrawer(card);
      });
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', closeDrawer);
    }
    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', closeDrawer);
    }
  }

  // ==========================================================================
  // Projects Category Filtering
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  let refreshCarousel = null;

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.classList.remove('hide');
          } else {
            card.classList.add('hide');
          }
        });

        if (refreshCarousel) refreshCarousel(true);
      });
    });
  }

  // ==========================================================================
  // Projects Carousel
  // ==========================================================================
  const projectsCarousel = document.getElementById('projects-carousel');

  if (projectsCarousel) {
    const track = projectsCarousel.querySelector('.carousel-track');
    const prevBtn = projectsCarousel.querySelector('.carousel-prev');
    const nextBtn = projectsCarousel.querySelector('.carousel-next');
    const dotsContainer = projectsCarousel.querySelector('.carousel-dots');
    const progressBar = projectsCarousel.querySelector('.carousel-progress-bar');

    let currentSlide = 0;
    let autoplayTimer = null;
    let progressTimer = null;
    let progressElapsed = 0;
    const AUTOPLAY_MS = 5500;
    const PROGRESS_TICK = 50;

    const getCardsPerView = () => window.innerWidth >= 1024 ? 2 : 1;

    const getVisibleCards = () =>
      Array.from(track.querySelectorAll('.project-card:not(.hide)'));

    const getTotalSlides = () => {
      const count = getVisibleCards().length;
      if (count === 0) return 0;
      return Math.ceil(count / getCardsPerView());
    };

    const buildDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const total = getTotalSlides();
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === currentSlide ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.setAttribute('role', 'tab');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    };

    const updateActiveCards = () => {
      const cards = getVisibleCards();
      const perView = getCardsPerView();
      const start = currentSlide * perView;

      cards.forEach((card, index) => {
        card.classList.toggle('is-active', index >= start && index < start + perView);
      });
    };

    const updateCarouselPosition = () => {
      const cards = getVisibleCards();
      const total = getTotalSlides();

      if (total === 0) {
        track.style.transform = 'translateX(0)';
        if (prevBtn) prevBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        return;
      }

      if (currentSlide >= total) currentSlide = 0;

      const firstCard = cards[0];
      if (!firstCard) return;

      const gap = parseFloat(getComputedStyle(track).gap) || 40;
      const cardWidth = firstCard.offsetWidth;
      const perView = getCardsPerView();
      const offset = currentSlide * perView * (cardWidth + gap);

      track.style.transform = `translateX(-${offset}px)`;
      updateActiveCards();

      if (prevBtn) prevBtn.disabled = currentSlide === 0;
      if (nextBtn) nextBtn.disabled = currentSlide >= total - 1;

      dotsContainer?.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    const triggerSlideAnimation = () => {
      track.classList.remove('is-animating');
      void track.offsetWidth;
      track.classList.add('is-animating');
      setTimeout(() => track.classList.remove('is-animating'), 650);
    };

    const resetProgress = () => {
      progressElapsed = 0;
      if (progressBar) progressBar.style.width = '0%';
    };

    const startAutoplay = () => {
      stopAutoplay();
      resetProgress();

      progressTimer = setInterval(() => {
        progressElapsed += PROGRESS_TICK;
        const pct = Math.min((progressElapsed / AUTOPLAY_MS) * 100, 100);
        if (progressBar) progressBar.style.width = `${pct}%`;
      }, PROGRESS_TICK);

      autoplayTimer = setInterval(() => {
        const total = getTotalSlides();
        if (total <= 1) return;
        goToSlide((currentSlide + 1) % total, false);
      }, AUTOPLAY_MS);
    };

    const stopAutoplay = () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
      if (progressTimer) clearInterval(progressTimer);
      autoplayTimer = null;
      progressTimer = null;
    };

    const goToSlide = (index, animate = true) => {
      const total = getTotalSlides();
      if (total === 0) return;

      currentSlide = Math.max(0, Math.min(index, total - 1));
      if (animate) triggerSlideAnimation();
      updateCarouselPosition();
      resetProgress();
    };

    refreshCarousel = (resetSlide = false) => {
      if (resetSlide) currentSlide = 0;
      buildDots();
      updateCarouselPosition();
      resetProgress();
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
        startAutoplay();
      });
    }

    // Touch / swipe support
    let touchStartX = 0;
    let touchDeltaX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (Math.abs(touchDeltaX) > 50) {
        if (touchDeltaX < 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
      startAutoplay();
    });

    projectsCarousel.addEventListener('mouseenter', stopAutoplay);
    projectsCarousel.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('resize', () => refreshCarousel(false));

    refreshCarousel(true);
    startAutoplay();

    // Re-bind cursor hover for carousel controls
    if (window.matchMedia('(min-width: 1025px)').matches) {
      document.dispatchEvent(new Event('click'));
    }
  }

  // ==========================================================================
  // Premium Cursor Follower
  // ==========================================================================
  // Only initialize custom cursor on non-touch desktop screens
  if (window.matchMedia('(min-width: 1025px)').matches) {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mouseX = -100;
    let mouseY = -100;
    let outlineX = -100;
    let outlineY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateCursor = () => {
      // Linear interpolation for smooth trailing outline
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Re-bind hover logic function to target hover items
    const bindCursorHover = () => {
      const hoverTargets = document.querySelectorAll('a, button, .project-card, .skills-category-card, .certificate-card, .report-tab-btn, .filter-btn, .carousel-btn, .carousel-dot');
      hoverTargets.forEach(el => {
        // Avoid duplicate event attachments
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = "true";

        el.addEventListener('mouseenter', () => {
          cursorOutline.classList.add('hover');
          cursorDot.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
          cursorOutline.classList.remove('hover');
          cursorDot.classList.remove('hover');
        });
      });
    };

    bindCursorHover();

    // Re-bind cursor events when dynamic tabs or elements are loaded/clicked
    document.addEventListener('click', () => {
      setTimeout(bindCursorHover, 100);
    });
  }

  // ==========================================================================
  // Page Transition — Split Curtain
  // ==========================================================================
  const ptOverlay = document.getElementById('page-transition');

  if (ptOverlay) {
    // On page load: run the "entering" reveal animation
    requestAnimationFrame(() => {
      ptOverlay.classList.add('is-entering');
      ptOverlay.classList.remove('is-leaving');

      // Clean up after animation completes
      setTimeout(() => {
        ptOverlay.classList.remove('is-entering');
      }, 700);
    });

    // Navigate with leave animation
    function navigateWithTransition(href) {
      if (ptOverlay.classList.contains('is-leaving')) return; // prevent double-fire
      ptOverlay.classList.remove('is-entering');
      ptOverlay.classList.add('is-leaving');
      ptOverlay.style.pointerEvents = 'all';

      setTimeout(() => {
        window.location.href = href;
      }, 520); // slightly past the 0.45s animation
    }

    // Intercept all internal HTML page links
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      // Only internal .html links (not mailto, tel, #hash, http)
      if (
        href &&
        href.endsWith('.html') &&
        !href.startsWith('http') &&
        !href.startsWith('//') &&
        !link.hasAttribute('download') &&
        link.getAttribute('target') !== '_blank'
      ) {
        link.addEventListener('click', e => {
          e.preventDefault();
          navigateWithTransition(href);
        });
      }
    });
  }

  // ==========================================================================
  // Floating AI Mind Game Widget
  // ==========================================================================
  
  // Confetti Canvas Overlay
  let confettiCanvas = document.getElementById('widget-confetti-canvas');
  if (!confettiCanvas) {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'widget-confetti-canvas';
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.top = '0';
    confettiCanvas.style.left = '0';
    confettiCanvas.style.width = '100vw';
    confettiCanvas.style.height = '100vh';
    confettiCanvas.style.pointerEvents = 'none';
    confettiCanvas.style.zIndex = '9999';
    document.body.appendChild(confettiCanvas);
  }
  
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiActive = false;
  let confettiParticles = [];
  let confettiAnimId = null;

  function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  class Confetti {
    constructor() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * -100 - 20;
      this.size = Math.random() * 6 + 4;
      this.color = ['#6D28D9', '#0D9488', '#F59E0B', '#EF4444', '#10B981', '#3B82F6'][Math.floor(Math.random() * 6)];
      this.speedY = Math.random() * 3 + 2;
      this.speedX = (Math.random() - 0.5) * 2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 4;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
    }
    draw() {
      confettiCtx.save();
      confettiCtx.translate(this.x, this.y);
      confettiCtx.rotate((this.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = this.color;
      confettiCtx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
      confettiCtx.restore();
    }
  }

  function triggerConfetti() {
    if (confettiActive) return;
    confettiActive = true;
    confettiParticles = [];
    for (let i = 0; i < 120; i++) {
      confettiParticles.push(new Confetti());
    }
    function run() {
      if (!confettiActive) return;
      confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      confettiParticles.forEach((p, idx) => {
        p.update();
        p.draw();
        if (p.y > window.innerHeight) {
          confettiParticles[idx] = new Confetti();
        }
      });
      confettiAnimId = requestAnimationFrame(run);
    }
    run();
    setTimeout(() => {
      confettiActive = false;
      confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      cancelAnimationFrame(confettiAnimId);
    }, 3500);
  }

  // Create FAB
  const fab = document.createElement('button');
  fab.className = 'floating-widget-btn';
  fab.setAttribute('aria-label', 'Open Brain Game');
  fab.innerHTML = '<i data-lucide="brain"></i>';
  document.body.appendChild(fab);

  // Create Widget Card Popup
  const widgetCard = document.createElement('div');
  widgetCard.className = 'floating-widget-card';
  widgetCard.innerHTML = `
    <div class="widget-card-header">
      <div class="widget-card-title">
        <i data-lucide="brain-circuit"></i>
        <span>Neural Mind Games</span>
      </div>
      <button class="widget-close-btn" aria-label="Close Game">
        <i data-lucide="x"></i>
      </button>
    </div>
    <div class="widget-card-body" style="padding-top: 0.75rem;">
      <!-- Game Mode Tabs -->
      <div class="widget-game-tabs" style="display: flex; gap: 0.5rem; width: 100%; margin-bottom: 0.75rem;">
        <button class="widget-tab-btn active" data-widget-game="memory" style="flex: 1; padding: 0.4rem; font-size: 0.75rem; font-family: var(--font-display); font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); cursor: pointer; transition: var(--transition-fast);">Memory Match</button>
        <button class="widget-tab-btn" data-widget-game="connect" style="flex: 1; padding: 0.4rem; font-size: 0.75rem; font-family: var(--font-display); font-weight: 700; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); cursor: pointer; transition: var(--transition-fast);">Path Finder</button>
      </div>

      <!-- Game 1: Memory Match Section -->
      <div id="widget-memory-game" style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <div class="widget-game-desc">Replicate the neural activation sequence to tune the synaptic network!</div>
        <div class="synaptic-scoreboard">
          <span>Level: <span id="synapse-level">1</span></span>
          <span>High Score: <span id="synapse-highscore">0</span></span>
        </div>
        <div class="synaptic-board">
          <svg class="synaptic-svg">
            <line x1="120" y1="40" x2="60" y2="100" class="synaptic-line" id="line-0-1"></line>
            <line x1="120" y1="40" x2="180" y2="100" class="synaptic-line" id="line-0-2"></line>
            <line x1="60" y1="100" x2="90" y2="180" class="synaptic-line" id="line-1-3"></line>
            <line x1="180" y1="100" x2="150" y2="180" class="synaptic-line" id="line-2-4"></line>
            <line x1="90" y1="180" x2="120" y2="40" class="synaptic-line" id="line-3-0"></line>
            <line x1="150" y1="180" x2="120" y2="40" class="synaptic-line" id="line-4-0"></line>
            <line x1="60" y1="100" x2="180" y2="100" class="synaptic-line" id="line-1-2"></line>
            <line x1="90" y1="180" x2="150" y2="180" class="synaptic-line" id="line-3-4"></line>
          </svg>
          <div class="synaptic-node" style="left: 50%; top: 17%;" data-node="0">IN</div>
          <div class="synaptic-node" style="left: 25%; top: 42%;" data-node="1">H1</div>
          <div class="synaptic-node" style="left: 75%; top: 42%;" data-node="2">H2</div>
          <div class="synaptic-node" style="left: 37%; top: 75%;" data-node="3">W1</div>
          <div class="synaptic-node" style="left: 63%; top: 75%;" data-node="4">OUT</div>
        </div>
        <div class="widget-game-status" id="widget-status">Click Start to begin</div>
        <button class="btn btn-primary btn-full btn-sm" id="widget-start-btn">Start Game</button>
      </div>

      <!-- Game 2: Path Finder Section -->
      <div id="widget-connect-game" style="width: 100%; display: none; flex-direction: column; align-items: center; gap: 1rem;">
        <div class="widget-game-desc">Create a path from green IN nodes to blue OUT nodes. Tap adjacent nodes while avoiding blocked (red) nodes!</div>
        <div class="synaptic-scoreboard">
          <span>Objective: <span style="color:var(--secondary)">Connect IN ➜ OUT</span></span>
          <span>Fails: <span id="connect-fails">0</span></span>
        </div>
        <div class="connect-board" id="widget-connect-board">
          <svg class="connect-svg" id="widget-connect-svg"></svg>
          <!-- Nodes dynamically drawn -->
        </div>
        <div class="widget-game-status" id="widget-connect-status">Find a neural pathway!</div>
        <button class="btn btn-primary btn-full btn-sm" id="widget-connect-reset-btn">Reset Board</button>
      </div>
    </div>
  `;
  document.body.appendChild(widgetCard);

  // Initialize Lucide Icons for injected items
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({
      attrs: {
        'stroke-width': 2
      },
      nameAttr: 'data-lucide'
    });
  }

  // FAB toggle actions
  const closeBtn = widgetCard.querySelector('.widget-close-btn');
  fab.addEventListener('click', () => {
    widgetCard.classList.toggle('open');
    fab.classList.toggle('active');
  });
  closeBtn.addEventListener('click', () => {
    widgetCard.classList.remove('open');
    fab.classList.remove('active');
  });

  // Tab Button toggling
  const tabBtns = widgetCard.querySelectorAll('.widget-tab-btn');
  const memorySection = widgetCard.querySelector('#widget-memory-game');
  const connectSection = widgetCard.querySelector('#widget-connect-game');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetGame = btn.getAttribute('data-widget-game');
      if (targetGame === 'memory') {
        memorySection.style.display = 'flex';
        connectSection.style.display = 'none';
      } else {
        memorySection.style.display = 'none';
        connectSection.style.display = 'flex';
        drawConnectNetwork(); // Initial render for connect game board
      }
    });
  });

  // ==========================================================================
  // Game 1: Memory Match Logic
  // ==========================================================================
  let gameSequence = [];
  let userSequence = [];
  let gameLevel = 1;
  let gameHighScore = parseInt(localStorage.getItem('synaptic_highscore')) || 0;
  let isAITurn = false;
  let isGameActive = false;

  const levelSpan = widgetCard.querySelector('#synapse-level');
  const highScoreSpan = widgetCard.querySelector('#synapse-highscore');
  const statusDiv = widgetCard.querySelector('#widget-status');
  const startBtn = widgetCard.querySelector('#widget-start-btn');
  const nodesDOM = widgetCard.querySelectorAll('.synaptic-node');

  highScoreSpan.textContent = gameHighScore;

  const connections = [
    { u: 0, v: 1, id: 'line-0-1' },
    { u: 0, v: 2, id: 'line-0-2' },
    { u: 1, v: 3, id: 'line-1-3' },
    { u: 2, v: 4, id: 'line-2-4' },
    { u: 3, v: 0, id: 'line-3-0' },
    { u: 4, v: 0, id: 'line-4-0' },
    { u: 1, v: 2, id: 'line-1-2' },
    { u: 3, v: 4, id: 'line-3-4' }
  ];

  function highlightLine(u, v) {
    const conn = connections.find(c => (c.u === u && c.v === v) || (c.u === v && c.v === u));
    if (conn) {
      const line = widgetCard.querySelector(`#${conn.id}`);
      if (line) {
        line.classList.add('lit');
        setTimeout(() => line.classList.remove('lit'), 450);
      }
    }
  }

  function flashNode(nodeIdx) {
    const nodeEl = widgetCard.querySelector(`.synaptic-node[data-node="${nodeIdx}"]`);
    if (nodeEl) {
      nodeEl.classList.add('flashing');
      setTimeout(() => nodeEl.classList.remove('flashing'), 400);
    }
  }

  function playAISequence() {
    isAITurn = true;
    userSequence = [];
    statusDiv.textContent = 'AI is training...';
    statusDiv.style.color = 'var(--primary)';
    
    let i = 0;
    const interval = setInterval(() => {
      if (!isGameActive) {
        clearInterval(interval);
        return;
      }
      const nodeIdx = gameSequence[i];
      flashNode(nodeIdx);
      
      if (i > 0) {
        highlightLine(gameSequence[i - 1], nodeIdx);
      }

      i++;
      if (i >= gameSequence.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (!isGameActive) return;
          isAITurn = false;
          statusDiv.textContent = 'Your turn! Replicate sequence';
          statusDiv.style.color = 'var(--secondary)';
        }, 600);
      }
    }, 700);
  }

  function addNewSequenceStep() {
    const randomNode = Math.floor(Math.random() * 5);
    gameSequence.push(randomNode);
  }

  function startWidgetGame() {
    gameSequence = [];
    userSequence = [];
    gameLevel = 1;
    levelSpan.textContent = gameLevel;
    isGameActive = true;
    startBtn.textContent = 'Restart Game';
    
    addNewSequenceStep();
    playAISequence();
  }

  function handleNodeClick(e) {
    if (!isGameActive || isAITurn) return;

    const clickedNode = parseInt(e.target.getAttribute('data-node'));
    userSequence.push(clickedNode);
    
    e.target.classList.add('user-active');
    setTimeout(() => e.target.classList.remove('user-active'), 200);

    if (userSequence.length > 1) {
      highlightLine(userSequence[userSequence.length - 2], clickedNode);
    }

    const currentStepIdx = userSequence.length - 1;
    if (userSequence[currentStepIdx] !== gameSequence[currentStepIdx]) {
      statusDiv.textContent = 'Synaptic Misalignment! Game Over';
      statusDiv.style.color = '#EF4444';
      isGameActive = false;
      startBtn.textContent = 'Start Game';
      return;
    }

    if (userSequence.length === gameSequence.length) {
      statusDiv.textContent = 'Level Up! Synapses Calibrated!';
      statusDiv.style.color = 'var(--secondary)';
      
      if (gameLevel > gameHighScore) {
        gameHighScore = gameLevel;
        localStorage.setItem('synaptic_highscore', gameHighScore);
        highScoreSpan.textContent = gameHighScore;
      }

      gameLevel++;
      levelSpan.textContent = gameLevel;
      isAITurn = true;

      if (gameLevel % 3 === 0) {
        triggerConfetti();
      }

      setTimeout(() => {
        if (!isGameActive) return;
        addNewSequenceStep();
        playAISequence();
      }, 1000);
    }
  }

  startBtn.addEventListener('click', startWidgetGame);
  nodesDOM.forEach(node => node.addEventListener('click', handleNodeClick));

  // ==========================================================================
  // Game 2: Path Finder (Connect Nodes) Logic
  // ==========================================================================
  const connectBoard = widgetCard.querySelector('#widget-connect-board');
  const connectSvg = widgetCard.querySelector('#widget-connect-svg');
  const connectStatus = widgetCard.querySelector('#widget-connect-status');
  const connectResetBtn = widgetCard.querySelector('#widget-connect-reset-btn');
  const connectFailsSpan = widgetCard.querySelector('#connect-fails');

  const connectNodes = [
    { id: 0, x: 15, y: 30, type: 'input', label: 'IN1' },
    { id: 1, x: 15, y: 70, type: 'input', label: 'IN2' },
    { id: 2, x: 42, y: 22, type: 'hidden', label: 'H1' },
    { id: 3, x: 42, y: 50, type: 'hidden', label: 'H2' },
    { id: 4, x: 42, y: 78, type: 'hidden', label: 'H3' },
    { id: 5, x: 68, y: 35, type: 'hidden', label: 'H4' },
    { id: 6, x: 68, y: 65, type: 'hidden', label: 'H5' },
    { id: 7, x: 88, y: 30, type: 'output', label: 'OUT1' },
    { id: 8, x: 88, y: 70, type: 'output', label: 'OUT2' }
  ];

  const connectEdges = [
    { u: 0, v: 2 }, { u: 0, v: 3 },
    { u: 1, v: 3 }, { u: 1, v: 4 },
    { u: 2, v: 5 }, { u: 3, v: 5 }, { u: 3, v: 6 }, { u: 4, v: 6 },
    { u: 5, v: 7 }, { u: 6, v: 8 }
  ];

  let activeConnectNodes = new Set([0, 1]); // IN nodes active by default
  let blockedNode = null; // Node index that is disconnected/blocked
  let connectFails = 0;
  let isConnectSolved = false;

  function randomizeBlockedNode() {
    // Random hidden node (2 to 6) is blocked
    blockedNode = Math.floor(Math.random() * 5) + 2;
    activeConnectNodes = new Set([0, 1]);
    isConnectSolved = false;
    if (connectStatus) {
      connectStatus.textContent = 'Trace the pathway to OUT!';
      connectStatus.style.color = 'var(--text-main)';
    }
  }

  function drawConnectNetwork() {
    if (!connectBoard || !connectSvg) return;

    connectSvg.innerHTML = '';
    const oldNodeEl = connectBoard.querySelectorAll('.connect-node');
    oldNodeEl.forEach(n => n.remove());

    const w = connectBoard.clientWidth;
    const h = connectBoard.clientHeight;

    // Draw connection lines
    connectEdges.forEach(edge => {
      // Don't draw lines linked to a blocked node
      if (edge.u === blockedNode || edge.v === blockedNode) return;

      const uNode = connectNodes[edge.u];
      const vNode = connectNodes[edge.v];

      const x1 = (uNode.x / 100) * w;
      const y1 = (uNode.y / 100) * h;
      const x2 = (vNode.x / 100) * w;
      const y2 = (vNode.y / 100) * h;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('class', 'connect-line');

      if (activeConnectNodes.has(edge.u) && activeConnectNodes.has(edge.v)) {
        line.classList.add('active');
      }

      connectSvg.appendChild(line);
    });

    // Draw circular node divs
    connectNodes.forEach(node => {
      const div = document.createElement('div');
      div.className = `connect-node ${node.type}-node`;
      div.style.left = `${node.x}%`;
      div.style.top = `${node.y}%`;
      div.textContent = node.label;
      div.setAttribute('data-id', node.id);

      if (node.id === blockedNode) {
        div.classList.add('blocked');
        div.textContent = '✖';
      } else if (activeConnectNodes.has(node.id)) {
        div.classList.add('active');
      }

      if (node.type !== 'input' && node.id !== blockedNode && !isConnectSolved) {
        div.addEventListener('click', () => handleConnectNodeClick(node.id));
      }

      connectBoard.appendChild(div);
    });
  }

  function handleConnectNodeClick(nodeId) {
    if (activeConnectNodes.has(nodeId)) {
      activeConnectNodes.delete(nodeId);
    } else {
      // Check if node is neighbor of any active node
      const hasActiveNeighbor = connectEdges.some(edge => {
        // Skip blocked path edges
        if (edge.u === blockedNode || edge.v === blockedNode) return false;
        if (edge.u === nodeId && activeConnectNodes.has(edge.v)) return true;
        if (edge.v === nodeId && activeConnectNodes.has(edge.u)) return true;
        return false;
      });

      if (hasActiveNeighbor) {
        activeConnectNodes.add(nodeId);
      } else {
        // Blink red on validation failure
        const el = connectBoard.querySelector(`.connect-node[data-id="${nodeId}"]`);
        if (el) {
          el.style.borderColor = '#EF4444';
          el.style.boxShadow = '0 0 15px #EF4444';
          setTimeout(() => {
            el.style.borderColor = '';
            el.style.boxShadow = '';
          }, 250);
        }
        connectFails++;
        connectFailsSpan.textContent = connectFails;
        return;
      }
    }

    // Run BFS starting from IN1, IN2 to prune disconnected active nodes
    pruneConnectDisconnectedNodes();
    drawConnectNetwork();
    checkConnectSolved();
  }

  function pruneConnectDisconnectedNodes() {
    const queue = [0, 1];
    const visited = new Set([0, 1]);

    while (queue.length > 0) {
      const current = queue.shift();

      connectEdges.forEach(edge => {
        if (edge.u === blockedNode || edge.v === blockedNode) return;

        let neighbor = null;
        if (edge.u === current && activeConnectNodes.has(edge.v)) neighbor = edge.v;
        if (edge.v === current && activeConnectNodes.has(edge.u)) neighbor = edge.u;

        if (neighbor !== null && !visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      });
    }

    activeConnectNodes.forEach(nodeId => {
      if (!visited.has(nodeId)) {
        activeConnectNodes.delete(nodeId);
      }
    });
  }

  function checkConnectSolved() {
    const isOut1Connected = activeConnectNodes.has(7);
    const isOut2Connected = activeConnectNodes.has(8);

    if (isOut1Connected || isOut2Connected) {
      isConnectSolved = true;
      connectStatus.textContent = 'Synaptic Flow Online! Confetti Fired!';
      connectStatus.style.color = 'var(--secondary)';
      triggerConfetti();

      // Load new board layout after 2 seconds
      setTimeout(() => {
        randomizeBlockedNode();
        drawConnectNetwork();
      }, 2500);
    }
  }

  randomizeBlockedNode();
  if (connectResetBtn) {
    connectResetBtn.addEventListener('click', () => {
      randomizeBlockedNode();
      drawConnectNetwork();
    });
  }

  // ==========================================================================
  // Sci-Fi Text Scramble Decoder Effect on Hover
  // ==========================================================================
  const scrambleText = (el) => {
    if (el.dataset.scrambling === "true") return;
    el.dataset.scrambling = "true";

    const originalText = el.getAttribute('data-original') || el.textContent;
    if (!el.getAttribute('data-original')) {
      el.setAttribute('data-original', originalText);
    }

    const prefixEl = el.querySelector('.number-prefix');
    const prefixText = prefixEl ? prefixEl.outerHTML : '';
    const cleanText = prefixEl ? originalText.replace(prefixEl.textContent, '').trim() : originalText;

    const chars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let iterations = 0;
    const maxIterations = cleanText.length;

    const interval = setInterval(() => {
      let scrambled = '';
      for (let i = 0; i < cleanText.length; i++) {
        if (cleanText[i] === ' ') {
          scrambled += ' ';
          continue;
        }
        if (i < iterations) {
          scrambled += cleanText[i];
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      el.innerHTML = prefixText + ' ' + scrambled;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        el.dataset.scrambling = "false";
      }
      iterations += 0.5; // controls speed
    }, 25);
  };

  document.querySelectorAll('.section-title').forEach(title => {
    title.addEventListener('mouseenter', () => scrambleText(title));
  });

});
