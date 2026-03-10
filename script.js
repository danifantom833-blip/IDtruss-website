// ============================================
// IDtruss Ltd - Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggle.style.transform = navLinks.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0)';
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggle.style.transform = 'rotate(0)';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('header') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        toggle.style.transform = 'rotate(0)';
      }
    });
  }

  // Active Navigation Link Highlighting
  const currentLocation = location.pathname;
  navItems.forEach(link => {
    let href = link.getAttribute('href');
    if (currentLocation === '/' && href === 'index.html') {
      link.classList.add('active');
    } else if (currentLocation.includes(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });

  // Portfolio Filter Functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter projects
      const filter = this.getAttribute('data-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      
      // Simple validation
      if (!name || !email || !message) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
      }

      // Show success message
      showNotification('Message sent successfully! We will contact you soon.', 'success');
      
      // Reset form
      setTimeout(() => {
        contactForm.reset();
      }, 1000);
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Scroll Animation - Add fade-in effect when elements come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe service cards, project cards, and testimonials
  document.querySelectorAll(
    '.service-card, .project-card, .testimonial-card, .mission-card, ' +
    '.team-member, .experience-card, .process-step, .benefit-item'
  ).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add typing effect to hero section
  const heroH1 = document.querySelector('.hero-content h1');
  if (heroH1) {
    const text = heroH1.textContent;
    heroH1.textContent = '';
    let index = 0;

    function typeText() {
      if (index < text.length) {
        heroH1.textContent += text.charAt(index);
        index++;
        setTimeout(typeText, 50);
      }
    }
    // Uncomment the line below for typing effect
    // typeText();
  }

  // Counter animation for stats
  const counters = document.querySelectorAll('.experience-number, .stat-number');
  const counterSpeed = 200;

  const runCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target')) || parseFloat(counter.textContent);
    const increment = target / counterSpeed;
    let current = 0;

    const updateCount = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.ceil(current);
        setTimeout(updateCount, 10);
      } else {
        counter.textContent = target;
      }
    };

    updateCount();
  };

  // Observe counters
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  // Show notification
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 4px;
      font-weight: 600;
      z-index: 2000;
      animation: slideInRight 0.3s ease;
      background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
      color: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideInLeft 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Lazy load images for better performance
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Enhanced scrolling header effect
  let lastScrollTop = 0;
  const header = document.querySelector('header.navbar');

  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down - hide header
      header.style.transform = 'translateY(-100%)';
      header.style.transition = 'transform 0.3s ease';
    } else {
      // Scrolling up - show header
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      if (toggle) toggle.style.transform = 'rotate(0)';
    }
  });
});