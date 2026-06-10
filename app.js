document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

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
  // Scroll Reveal Animations
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

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
        this.color = Math.random() > 0.5 ? '#7C3AED' : '#22D3EE'; // Violet or Cyan
        
        // 3D Parallax Scrolling depth factor
        this.depth = Math.random() * 0.75 + 0.25; 
        
        // Base alpha (fade overlay)
        this.alpha = Math.random() * 0.5 + 0.3;
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
            const linkAlpha = (1 - distance / maxDistance) * 0.15;
            
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
    const drawerIconEl = document.getElementById('drawer-icon');
    const drawerTitleEl = document.getElementById('drawer-title');
    const drawerDescEl = document.getElementById('drawer-desc');
    const drawerFeaturesEl = document.getElementById('drawer-features');
    const drawerTechEl = document.getElementById('drawer-tech');
    const drawerGithubLinkEl = document.getElementById('drawer-github-link');

    const openDrawer = (card) => {
      // Extract data from card
      const icon = card.querySelector('.project-icon');
      const title = card.querySelector('.project-title').textContent;
      const desc = card.querySelector('.project-text').textContent;
      const features = Array.from(card.querySelectorAll('.project-features li')).map(li => li.textContent.trim());
      const tech = Array.from(card.querySelectorAll('.project-tech .tech-tag')).map(tag => tag.textContent.trim());
      const githubLink = card.querySelector('.project-links a[aria-label="GitHub Repository"]');

      // Populate drawer elements
      if (icon && drawerIconEl) {
        const iconName = icon.getAttribute('data-lucide') || 'folder';
        drawerIconEl.setAttribute('data-lucide', iconName);
        if (typeof lucide !== 'undefined') lucide.createIcons();
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
        // If click is on a link or its children (like the GitHub icon button), let default behavior happen
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
});
