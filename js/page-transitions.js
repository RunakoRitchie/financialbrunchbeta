/**
 * Page Transitions and Animations
 * Smooth transitions between pages and enhanced navigation experience
 */

class PageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.setupPageLoader();
        this.setupNavigationTransitions();
        this.setupSectionAnimations();
        this.setupScrollAnimations();
        console.log('🎬 Page transitions initialized');
    }

    setupPageLoader() {
        // Skip page loader - directly initialize page animations
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('page-transition', 'loaded');
            this.animatePageSections();
        });

        // Fallback for window load event
        window.addEventListener('load', () => {
            document.body.classList.add('page-transition', 'loaded');
            this.animatePageSections();
        });
    }

    setupNavigationTransitions() {
        // Enhanced navigation link interactions
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            // Skip if it's the current page
            if (link.classList.contains('active')) return;

            link.addEventListener('click', (e) => {
                if (this.isTransitioning) {
                    e.preventDefault();
                    return;
                }

                // Add click animation
                this.animateNavClick(link);

                // Start page transition
                this.startPageTransition(link.href);

                // Prevent default navigation temporarily
                e.preventDefault();
            });

            // Enhanced hover effects
            link.addEventListener('mouseenter', () => {
                this.animateNavHover(link, true);
            });

            link.addEventListener('mouseleave', () => {
                this.animateNavHover(link, false);
            });
        });
    }

    animateNavClick(link) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = link.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';

        link.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    animateNavHover(link, isEntering) {
        if (isEntering) {
            link.style.transform = 'translateY(-2px) scale(1.02)';
            link.style.textShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
        } else {
            link.style.transform = link.classList.contains('active') ? 'scale(1.05)' : '';
            link.style.textShadow = '';
        }
    }

    startPageTransition(href) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        // Fade out current page
        document.body.classList.add('page-fade-out');

        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%);
            z-index: 9998;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);

        // Animate overlay in
        setTimeout(() => {
            overlay.style.opacity = '0.9';
        }, 50);

        // Navigate to new page
        setTimeout(() => {
            window.location.href = href;
        }, 400);
    }

    setupSectionAnimations() {
        // Add animation classes to main sections
        const sections = document.querySelectorAll('section, .hero, .features, .newsletter, .footer');
        sections.forEach((section, index) => {
            section.classList.add('animate-section');
            section.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    animatePageSections() {
        const sections = document.querySelectorAll('.animate-section');
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('visible');
            }, index * 100);
        });
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Animate child elements with stagger
                    const children = entry.target.querySelectorAll('.feature-card, .research-card, .form-group');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe sections for scroll animations
        const animatedElements = document.querySelectorAll('.animate-section, .feature-card, .research-card');
        animatedElements.forEach(el => {
            // Set initial state for cards
            if (el.classList.contains('feature-card') || el.classList.contains('research-card')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            observer.observe(el);
        });
    }

    // Public method to trigger page transition programmatically
    navigateToPage(href) {
        this.startPageTransition(href);
    }
}

// CSS for ripple animation
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Add ripple CSS to document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Initialize page transitions when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitions = new PageTransitions();
});

// Export for external use
window.PageTransitions = PageTransitions;
