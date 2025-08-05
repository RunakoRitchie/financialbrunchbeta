/**
 * Financial Brunch Website JavaScript
 * Handles navigation, language switching, and interactive features
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initializeNavigation();
    initializeLanguageToggle();
    initializeNewsletterForm();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeCarousel();
    
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const hamburgers = navToggle.querySelectorAll('.hamburger');
            hamburgers.forEach((line, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) line.style.opacity = '0';
                    if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    line.style.transform = 'none';
                    line.style.opacity = '1';
                }
            });
        });
    }
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                // Reset hamburger
                const hamburgers = navToggle.querySelectorAll('.hamburger');
                hamburgers.forEach(line => {
                    line.style.transform = 'none';
                    line.style.opacity = '1';
                });
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                
                // Reset hamburger
                const hamburgers = navToggle.querySelectorAll('.hamburger');
                hamburgers.forEach(line => {
                    line.style.transform = 'none';
                    line.style.opacity = '1';
                });
            }
        }
    });
    
    // Handle header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Language toggle functionality
 */
function initializeLanguageToggle() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            
            // Remove active class from all buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Store language preference
            localStorage.setItem('preferredLanguage', selectedLang);
            
            // Update content based on language
            updateContentLanguage(selectedLang);
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    const savedLangButton = document.querySelector(`[data-lang="${savedLang}"]`);
    if (savedLangButton) {
        savedLangButton.click();
    }
}

/**
 * Update content based on selected language
 */
function updateContentLanguage(lang) {
    const content = {
        en: {
            heroTitle: 'Independent Financial Research',
            heroSubtitle: 'Comprehensive analysis and insights for informed investment decisions in Southeast Asian markets',
            subscribeBtn: 'Subscribe to Research',
            browseBtn: 'Browse Reports',
            featuredTitle: 'Featured Research',
            featuredSubtitle: 'Latest insights and analysis from our research team',
            featuresTitle: 'Why Choose Financial Brunch',
            featuresSubtitle: 'Independent research backed by deep market expertise',
            newsletterTitle: 'Stay Informed',
            newsletterDesc: 'Get our latest research reports and market insights delivered directly to your inbox.'
        },
        id: {
            heroTitle: 'Riset Keuangan Independen',
            heroSubtitle: 'Analisis komprehensif dan wawasan untuk keputusan investasi yang tepat di pasar Asia Tenggara',
            subscribeBtn: 'Berlangganan Riset',
            browseBtn: 'Jelajahi Laporan',
            featuredTitle: 'Riset Unggulan',
            featuredSubtitle: 'Wawasan dan analisis terbaru dari tim riset kami',
            featuresTitle: 'Mengapa Memilih Financial Brunch',
            featuresSubtitle: 'Riset independen dengan dukungan keahlian pasar yang mendalam',
            newsletterTitle: 'Tetap Terinformasi',
            newsletterDesc: 'Dapatkan laporan riset terbaru dan wawasan pasar langsung ke inbox Anda.'
        }
    };
    
    const selectedContent = content[lang];
    
    // Update text content
    const elements = [
        { selector: '.hero-title', content: selectedContent.heroTitle },
        { selector: '.hero-subtitle', content: selectedContent.heroSubtitle },
        { selector: '.hero-actions .btn-primary', content: selectedContent.subscribeBtn },
        { selector: '.hero-actions .btn-secondary', content: selectedContent.browseBtn },
        { selector: '.featured .section-title', content: selectedContent.featuredTitle },
        { selector: '.featured .section-subtitle', content: selectedContent.featuredSubtitle },
        { selector: '.features .section-title', content: selectedContent.featuresTitle },
        { selector: '.features .section-subtitle', content: selectedContent.featuresSubtitle },
        { selector: '.newsletter-title', content: selectedContent.newsletterTitle },
        { selector: '.newsletter-description', content: selectedContent.newsletterDesc }
    ];
    
    elements.forEach(element => {
        const el = document.querySelector(element.selector);
        if (el) {
            el.textContent = element.content;
        }
    });
}

/**
 * Newsletter form handling
 */
function initializeNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    const input = form?.querySelector('.form-input');
    const button = form?.querySelector('.btn-primary');
    
    if (form && input && button) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = input.value.trim();
            
            // Basic email validation
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Show loading state
            const originalText = button.textContent;
            button.textContent = 'Subscribing...';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showMessage('Thank you for subscribing! Check your email for confirmation.', 'success');
                input.value = '';
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        });
        
        // Add input validation feedback
        input.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !isValidEmail(email)) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }
        });
    }
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show message to user
 */
function showMessage(message, type = 'success') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // Style the message
    Object.assign(messageEl.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '6px',
        backgroundColor: type === 'success' ? '#10b981' : '#dc3545',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '400px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    });
    
    document.body.appendChild(messageEl);
    
    // Animate in
    setTimeout(() => {
        messageEl.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        messageEl.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 300);
    }, 4000);
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll animations
 */
function initializeAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .carousel-container');
    
    animatedElements.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }
}

/**
 * Initialize search functionality (if needed)
 */
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    performSearch(query);
                }, 300);
            } else {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
            }
        });
    }
}

/**
 * Performance optimization: Lazy loading for images
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Utility function: Debounce
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

/**
 * Initialize theme handling (for future dark mode)
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

/**
 * Carousel functionality
 */
function initializeCarousel() {
    const track = document.getElementById('carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicators = document.querySelectorAll('.indicator');
    const carousel = document.querySelector('.carousel-container');
    
    if (!track || slides.length === 0) return;
    
    let currentSlide = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    let startX = 0;
    let endX = 0;
    let isTransitioning = false;
    
    // Initialize carousel
    function initCarousel() {
        updateCarousel();
        startAutoPlay();
        addEventListeners();
    }
    
    // Update carousel position and active states
    function updateCarousel() {
        if (isTransitioning) return;
        
        isTransitioning = true;
        
        // Update track position
        const translateX = -currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update slide active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        // Update indicator active states
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        // Reset transition flag after animation
        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        if (slideIndex < 0 || slideIndex >= slides.length || slideIndex === currentSlide) return;
        currentSlide = slideIndex;
        updateCarousel();
        resetAutoPlay();
    }
    
    // Go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }
    
    // Go to previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel();
    }
    
    // Auto-play functionality
    function startAutoPlay() {
        if (!isAutoPlaying) return;
        autoPlayInterval = setInterval(() => {
            if (isAutoPlaying && !isTransitioning) {
                nextSlide();
            }
        }, 5000);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        if (isAutoPlaying) {
            startAutoPlay();
        }
    }
    
    // Touch/swipe support
    function handleTouchStart(e) {
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        stopAutoPlay();
    }
    
    function handleTouchMove(e) {
        if (!startX) return;
        endX = e.touches ? e.touches[0].clientX : e.clientX;
    }
    
    function handleTouchEnd() {
        if (!startX || !endX) return;
        
        const diff = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startX = 0;
        endX = 0;
        resetAutoPlay();
    }
    
    // Keyboard navigation
    function handleKeyDown(e) {
        if (!carousel.contains(document.activeElement)) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                resetAutoPlay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                resetAutoPlay();
                break;
        }
    }
    
    // Add all event listeners
    function addEventListeners() {
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }
        
        // Indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
        });
        
        // Touch events
        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Mouse events for desktop drag
        carousel.addEventListener('mousedown', handleTouchStart);
        carousel.addEventListener('mousemove', handleTouchMove);
        carousel.addEventListener('mouseup', handleTouchEnd);
        carousel.addEventListener('mouseleave', handleTouchEnd);
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            isAutoPlaying = false;
            stopAutoPlay();
        });
        
        carousel.addEventListener('mouseleave', () => {
            isAutoPlaying = true;
            startAutoPlay();
        });
        
        // Handle focus for accessibility
        carousel.addEventListener('focusin', () => {
            isAutoPlaying = false;
            stopAutoPlay();
        });
        
        carousel.addEventListener('focusout', () => {
            isAutoPlaying = true;
            startAutoPlay();
        });
        
        // Handle visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoPlay();
            } else if (isAutoPlaying) {
                startAutoPlay();
            }
        });
    }
    
    // Initialize the carousel
    initCarousel();
    
    // Expose carousel controls for external use
    return {
        goToSlide,
        nextSlide,
        prevSlide,
        getCurrentSlide: () => currentSlide,
        getTotalSlides: () => slides.length
    };
}

// Export functions for potential external use
window.FinancialBrunch = {
    updateContentLanguage,
    showMessage,
    debounce,
    carousel: null // Will be set when carousel initializes
};