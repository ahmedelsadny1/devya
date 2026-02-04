let currentLang = 'en';
let isDarkMode = false;

function init() {
    const savedLang = localStorage.getItem('language') || 'en';
    const savedDarkMode = localStorage.getItem('darkMode');
    currentLang = savedLang;
    // Default to true if not set, otherwise parse the saved value
    isDarkMode = savedDarkMode === null ? true : savedDarkMode === 'true';
    updateLanguage();
    updateDarkMode();

    // Initialize mobile menu
    initMobileMenu();

    // Initialize subscribe form
    initSubscribeForm();

    // Initialize scroll animations
    initScrollAnimations();
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');

            // Animate icon
            const icon = mobileMenuBtn.querySelector('svg');
            if (!mobileMenu.classList.contains('hidden')) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });

        // Close menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            });
        });
    }
}

// Show toast notification in center of screen
function showToast(elementId, duration = 3000) {
    const toast = document.getElementById(elementId);
    if (toast) {
        // Get inner div for animation
        const innerDiv = toast.querySelector('div');

        // Show toast
        toast.classList.remove('opacity-0');
        toast.classList.add('opacity-100');
        toast.style.pointerEvents = 'auto';

        // Animate in
        if (innerDiv) {
            innerDiv.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            innerDiv.style.transform = 'scale(1)';
            innerDiv.style.opacity = '1';
        }

        // Hide after duration with smooth animation
        setTimeout(() => {
            // Animate out smoothly
            if (innerDiv) {
                innerDiv.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                innerDiv.style.transform = 'scale(0.8) translateY(-20px)';
                innerDiv.style.opacity = '0';
            }

            // Then hide the overlay
            setTimeout(() => {
                toast.classList.remove('opacity-100');
                toast.classList.add('opacity-0');
                toast.style.pointerEvents = 'none';

                // Reset for next use
                if (innerDiv) {
                    innerDiv.style.transition = '';
                    innerDiv.style.transform = 'scale(0.95)';
                    innerDiv.style.opacity = '1';
                }
            }, 400);
        }, duration);
    }
}

// Subscribe Form with Formspree
function initSubscribeForm() {
    const subscribeForm = document.getElementById('subscribeForm');

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(subscribeForm);

            // Send to Formspree
            axios.post('https://formspree.io/f/mgowprow', formData)
                .then(() => {
                    showToast('subscribeSuccessMsg', 3000);
                    subscribeForm.reset();
                })
                .catch((err) => {
                    showToast('subscribeErrorMsg', 3000);
                    console.error('Subscribe error:', err);
                });
        });
    }
}

// Scroll Animations using Intersection Observer
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.service-card, .stat-card, .contact-info-card, #about .space-y-6, #about .relative.h-80, #services .text-center, #contact .text-center');

    // Add initial hidden state
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements
    animatedElements.forEach(el => observer.observe(el));

    // Also animate section titles
    const sectionTitles = document.querySelectorAll('section h2');
    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(20px)';
        title.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        titleObserver.observe(title);
    });
}

document.getElementById('langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'ar' : 'en';
    localStorage.setItem('language', currentLang);
    updateLanguage();
});

document.getElementById('darkToggle').addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkMode();
});

function updateLanguage() {
    document.getElementById('langToggle').textContent = currentLang === 'en' ? 'EN' : 'AR';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    const direction = currentLang === 'ar' ? '-30px' : '30px';
    document.documentElement.style.setProperty('--toggle-direction', direction);
    document.querySelectorAll('[data-en]').forEach(el => {
        if (currentLang === 'en') {
            el.textContent = el.getAttribute('data-en');
        } else if (el.hasAttribute('data-ar')) {
            el.textContent = el.getAttribute('data-ar');
        }
    });

    // Update placeholders based on language
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        if (currentLang === 'ar') {
            input.placeholder = 'أدخل بريدك الإلكتروني';
        } else {
            input.placeholder = input.name === 'email' && input.closest('#subscribeForm') ? 'Enter your email' : 'your@email.com';
        }
    });
}

function updateDarkMode() {
    const html = document.documentElement;
    const toggle = document.getElementById('darkToggle');
    const body = document.body;
    if (isDarkMode) {
        html.classList.add('dark');
        body.classList.remove('light-mode');
        toggle.classList.add('active');
    } else {
        html.classList.remove('dark');
        body.classList.add('light-mode');
        toggle.classList.remove('active');
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // Show/hide button on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.remove('opacity-0', 'invisible');
                backToTopBtn.classList.add('opacity-100', 'visible');
            } else {
                backToTopBtn.classList.remove('opacity-100', 'visible');
                backToTopBtn.classList.add('opacity-0', 'invisible');
            }
        });

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize Back to Top after DOM is ready
document.addEventListener('DOMContentLoaded', initBackToTop);

init();
