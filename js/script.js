/**
 * Le Fouquet — Client Logic & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollReveal();
  initHeaderScroll();
  initMobileMenu();
  initActiveNavLink();
  initMenuFilters();
  initGalleryLightbox();
  initContactForm();
});

/**
 * Page Preloader Fading
 */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const fadeOut = () => {
    preloader.classList.add('fade-out');
  };

  // Hide preloader when everything is loaded
  window.addEventListener('load', fadeOut);

  // Safety fallback (maximum 3 seconds loader)
  setTimeout(() => {
    if (!preloader.classList.contains('fade-out')) {
      fadeOut();
    }
  }, 2500);
}

/**
 * Scroll Reveal Animations (Intersection Observer)
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length === 0) return;

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(element => {
    revealObserver.observe(element);
  });
}

/**
 * Sticky Header Effect on Scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Trigger once on load in case page is loaded scrolled down
  handleScroll();
}

/**
 * Responsive Mobile Menu Toggle
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
    }
  });
}

/**
 * Highlight Current Active Page in Navigation
 */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname;
  
  // Find which page we are on
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (filename === linkHref || (filename === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Tab Filters on La Carte page (carte.html)
 */
function initMenuFilters() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  if (tabButtons.length === 0 || menuItems.length === 0) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active to current tab
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'flex';
          // Smooth fade-in
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Gallery Lightbox (evenements.html & index.html)
 */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (galleryItems.length === 0) return;

  // Create lightbox markup dynamically if it doesn't exist
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-content-wrapper">
        <span class="lightbox-close">&times;</span>
        <span class="lightbox-nav lightbox-prev">&#10094;</span>
        <img src="" alt="Lightbox image">
        <span class="lightbox-nav lightbox-next">&#10095;</span>
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  const images = [];

  // Populate images list
  galleryItems.forEach((item, index) => {
    const imgElement = item.querySelector('img');
    const captionElement = item.querySelector('.gallery-caption');
    
    images.push({
      src: imgElement.getAttribute('src'),
      alt: imgElement.getAttribute('alt') || 'Le Fouquet Gallery Image',
      caption: captionElement ? captionElement.textContent : ''
    });

    item.addEventListener('click', () => {
      currentIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable page scrolling
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  function updateLightboxContent() {
    const currentImg = images[currentIndex];
    lightboxImg.setAttribute('src', currentImg.src);
    lightboxImg.setAttribute('alt', currentImg.alt);
    lightboxCaption.textContent = currentImg.caption;
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxContent();
  }

  // Pre-fetch check for cyclic nav
  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxContent();
  }

  // Event Listeners
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    nextImage();
  });
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prevImage();
  });

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  });
}

/**
 * Handle Contact Form submission placeholder animation
 */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show processing indicator
    submitBtn.innerHTML = 'Envoi en cours...';
    submitBtn.style.pointerEvents = 'none';
    submitBtn.style.opacity = '0.7';

    // Simulate standard submission delay
    setTimeout(() => {
      submitBtn.innerHTML = 'Message Envoyé ! ✓';
      submitBtn.style.backgroundColor = 'var(--logo-green)';
      submitBtn.style.boxShadow = '0 0 15px var(--logo-green-glow)';
      contactForm.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.backgroundColor = '';
        submitBtn.style.boxShadow = '';
        submitBtn.style.pointerEvents = '';
        submitBtn.style.opacity = '';
      }, 3000);
    }, 1500);
  });
}
