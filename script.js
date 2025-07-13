/**
 * EpicTech.AI Landing Page - Advanced JavaScript
 * Modern ES6+ implementation with performance optimizations
 */

// Utility Functions
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top <= windowHeight * (1 - threshold) &&
            rect.bottom >= windowHeight * threshold &&
            rect.left <= windowWidth * (1 - threshold) &&
            rect.right >= windowWidth * threshold
        );
    },

    // Smooth scroll to element
    smoothScrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }
};

// Main Application Class
class EpicTechApp {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupAnimations();
        this.setupPerformanceOptimizations();
    }

    init() {
        // Initialize application state
        this.isScrolled = false;
        this.animatedElements = new Set();
        this.header = document.querySelector('.header');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.demoModal = document.getElementById('demo-modal');
        this.demoForm = document.getElementById('demo-form');
        
        // Set initial states
        this.updateHeaderState();
        this.setupIntersectionObserver();
        this.setupFormValidation();
        
        console.log('🚀 EpicTech.AI App Initialized');
    }

    bindEvents() {
        // Scroll events with throttling
        window.addEventListener('scroll', utils.throttle(() => {
            this.handleScroll();
        }, 16)); // ~60fps

        // Resize events with debouncing
        window.addEventListener('resize', utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Navigation events
        this.setupNavigation();
        
        // Modal events
        this.setupModal();
        
        // Form events
        this.setupForms();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    setupNavigation() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = this.header.offsetHeight;
                    utils.smoothScrollTo(targetElement, headerHeight + 20);
                    
                    // Update active navigation state
                    this.updateActiveNavLink(anchor);
                    
                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });

        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.header.contains(e.target) && this.navLinks.classList.contains('mobile-open')) {
                this.closeMobileMenu();
            }
        });
    }

    setupModal() {
        // Demo modal triggers - redirect to Stripe
        document.querySelectorAll('a[href="#demo"]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('https://buy.stripe.com/8wM6px5ycf9pgfK000', '_blank', 'noopener');
            });
        });

        // Close modal events
        const closeButton = document.getElementById('close-modal');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal());
        }

        // Close modal on backdrop click
        if (this.demoModal) {
            this.demoModal.addEventListener('click', (e) => {
                if (e.target === this.demoModal) {
                    this.closeModal();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.demoModal.style.display === 'flex') {
                this.closeModal();
            }
        });
    }

    setupForms() {
        if (this.demoForm) {
            this.demoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            });

            // Real-time validation
            this.demoForm.querySelectorAll('input').forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        }
    }

    setupFormValidation() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid name (letters and spaces only)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            company: {
                required: false,
                minLength: 2,
                message: 'Company name must be at least 2 characters'
            }
        };
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for accessibility
        document.addEventListener('keydown', (e) => {
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupAnimations() {
        // Setup CSS custom properties for dynamic animations
        document.documentElement.style.setProperty('--scroll-progress', '0');
        
        // Parallax effect for hero section
        this.setupParallaxEffect();
        
        // Typing animation for hero text
        this.setupTypingAnimation();
        
        // Counter animations
        this.setupCounterAnimations();
    }

    setupIntersectionObserver() {
        // Intersection Observer for scroll animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animatable elements
        document.querySelectorAll('.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right, .feature-card, .testimonial-card').forEach(el => {
            this.observer.observe(el);
        });
    }

    setupParallaxEffect() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const parallaxElements = hero.querySelectorAll('.hero-content');
        
        window.addEventListener('scroll', utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(el => {
                el.style.transform = `translateY(${rate}px)`;
            });
        }, 16));
    }

    setupTypingAnimation() {
        const heroTitle = document.querySelector('.hero h1');
        if (!heroTitle) return;

        // Add typing cursor effect
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        cursor.style.cssText = `
            animation: blink 1s infinite;
            color: #ffd700;
            font-weight: 300;
        `;
        
        // Add CSS for blinking cursor
        if (!document.querySelector('#typing-styles')) {
            const style = document.createElement('style');
            style.id = 'typing-styles';
            style.textContent = `
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        heroTitle.appendChild(cursor);
    }

    setupCounterAnimations() {
        // Animated counters for statistics
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }

    setupPerformanceOptimizations() {
        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Preload critical resources
        this.preloadCriticalResources();
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            new PerformanceObserver((entryList) => {
                let clsValue = 0;
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    // Event Handlers
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const scrollProgress = Math.min(scrollTop / (document.body.scrollHeight - window.innerHeight), 1);
        
        // Update CSS custom property for scroll-based animations
        document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
        
        // Update header state
        this.updateHeaderState();
        
        // Update active navigation based on scroll position
        this.updateActiveNavOnScroll();
        
        // Parallax effects
        this.updateParallaxEffects(scrollTop);
    }

    handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
        
        // Recalculate animations
        this.recalculateAnimations();
    }

    updateHeaderState() {
        const scrollTop = window.pageYOffset;
        const shouldBeScrolled = scrollTop > 50;
        
        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            this.header.classList.toggle('scrolled', this.isScrolled);
        }
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPos = window.pageYOffset + this.header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    updateParallaxEffects(scrollTop) {
        // Additional parallax effects can be added here
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            const yPos = -(scrollTop * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Navigation Methods
    toggleMobileMenu() {
        const isOpen = this.navLinks.classList.contains('mobile-open');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.navLinks.classList.add('mobile-open');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
        this.mobileMenuToggle.innerHTML = '✕';
        document.body.style.overflow = 'hidden';
        
        // Add mobile menu styles if not already present
        if (!document.querySelector('#mobile-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-menu-styles';
            style.textContent = `
                @media (max-width: 768px) {
                    .nav-links.mobile-open {
                        display: flex !important;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100vh;
                        background: rgba(255, 255, 255, 0.98);
                        backdrop-filter: blur(10px);
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        gap: 2rem;
                        z-index: 999;
                        animation: slideInFromTop 0.3s ease-out;
                    }
                    
                    @keyframes slideInFromTop {
                        from {
                            opacity: 0;
                            transform: translateY(-100%);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    closeMobileMenu() {
        this.navLinks.classList.remove('mobile-open');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        this.mobileMenuToggle.innerHTML = '☰';
        document.body.style.overflow = '';
    }

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Modal Methods
    openModal() {
        if (this.demoModal) {
            this.demoModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Focus first input for accessibility
            const firstInput = this.demoModal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
            
            // Add modal animation
            this.demoModal.style.animation = 'modalFadeIn 0.3s ease-out';
        }
    }

    closeModal() {
        if (this.demoModal) {
            this.demoModal.style.animation = 'modalFadeOut 0.3s ease-out';
            setTimeout(() => {
                this.demoModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // Form Methods
    validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required validation
        if (rules.required && !fieldValue) {
            this.showFieldError(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!fieldValue && !rules.required) return true;
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(fieldValue)) {
            this.showFieldError(field, rules.message);
            return false;
        }
        
        // Length validation
        if (rules.minLength && fieldValue.length < rules.minLength) {
            this.showFieldError(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters`);
            return false;
        }
        
        // Show success state
        this.showFieldSuccess(field);
        return true;
    }

    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        field.style.backgroundColor = '#fef2f2';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    showFieldSuccess(field) {
        field.style.borderColor = '#10b981';
        field.style.backgroundColor = '#f0fdf4';
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) errorDiv.remove();
    }

    async handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate all fields
        let isValid = true;
        form.querySelectorAll('input').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call
            await this.simulateAPICall(data);
            
            // Show success message
            this.showSuccessMessage();
            this.closeModal();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('Something went wrong. Please try again.');
        } finally {
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    async simulateAPICall(data) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Log form data (in real app, send to server)
        console.log('Form submitted:', data);
        
        // Simulate success
        return { success: true, message: 'Trial started successfully!' };
    }

    showSuccessMessage() {
        this.showNotification('🎉 Success! Your free trial has been activated. Check your email for next steps.', 'success');
    }

    showErrorMessage(message) {
        this.showNotification(`❌ ${message}`, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10001;
            max-width: 400px;
            animation: slideInFromRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        // Add animation styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInFromRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideOutToRight {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutToRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Animation Methods
    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        // Trigger animation
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        
        // Handle counter animations
        if (element.dataset.counter) {
            this.animateCounter(element);
        }
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 2000; // 2 seconds
        const start = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    recalculateAnimations() {
        // Recalculate animation triggers on resize
        this.animatedElements.clear();
        
        // Re-observe elements
        document.querySelectorAll('.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right').forEach(el => {
            el.style.opacity = '';
            el.style.transform = '';
            el.style.transition = '';
        });
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
        
        // Preload hero background image if any
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const computedStyle = window.getComputedStyle(heroSection);
            const backgroundImage = computedStyle.backgroundImage;
            if (backgroundImage && backgroundImage !== 'none') {
                const imageUrl = backgroundImage.slice(4, -1).replace(/"/g, '');
                const img = new Image();
                img.src = imageUrl;
            }
        }
    }
}

// Enhanced Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Check for browser compatibility
    if (!window.IntersectionObserver || !window.requestAnimationFrame) {
        console.warn('Some features may not work in this browser');
    }
    
    // Initialize the application
    window.epicTechApp = new EpicTechApp();
    
    // Add modal animation styles
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            @keyframes modalFadeOut {
                from {
                    opacity: 1;
                    transform: scale(1);
                }
                to {
                    opacity: 0;
                    transform: scale(0.9);
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // In a real application, you would register a service worker here
        console.log('Service Worker support detected');
    });
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EpicTechApp, utils };
}