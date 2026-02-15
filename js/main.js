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

    // Initialize AI Chat
    initAIChat();
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
    const direction = currentLang === 'ar' ? '30px' : '30px';
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

    // Update AI chat placeholder
    updateAIChatPlaceholder();
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

// ===== AI Chat Integration with Groq API =====

const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const AI_MODEL = 'llama-3.3-70b-versatile';

let chatHistory = [];

// ===== Chat History Persistence =====
const CHAT_STORAGE_KEY = 'devya_chat_history';

function saveChatHistory() {
    try {
        const chatData = {
            history: chatHistory,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatData));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

function loadChatHistory() {
    try {
        const saved = localStorage.getItem(CHAT_STORAGE_KEY);
        if (saved) {
            const chatData = JSON.parse(saved);
            return chatData.history || [];
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
    return [];
}

function clearChatHistory() {
    try {
        localStorage.removeItem(CHAT_STORAGE_KEY);
        chatHistory = [];
    } catch (error) {
        console.error('Error clearing chat history:', error);
    }
}

function getSystemPrompt() {
    const isArabic = currentLang === 'ar';
    if (isArabic) {
        return `أنت مساعد ديفيا كود الذكي، شركة برمجيات محترفة مقرها الإسكندرية، مصر. تأسست عام 2025.
خدماتنا: تطوير الويب، تطوير تطبيقات الجوال، أنظمة برمجية متكاملة للمؤسسات مثل نظام ERP ونظام CRM، تطبيقات سطح المكتب، الأمان والتحسين، التحليلات.
أجب بشكل مختصر ومهني. ساعد العملاء في أسئلتهم التقنية وعن خدماتنا.
للتواصل: info@devya.cloud أو +20 1508130700
الموقع: devya.cloud`;
    }
    return `You are the AI assistant for Devya Code, a professional software company based in Alexandria, Egypt, founded in 2025.
Our services: Web Development, Mobile App Development, Enterprise software solutions like ERP System and CRM System, Desktop Apps, Security & Optimization, Analytics & Insights.
Answer concisely and professionally. Help clients with tech questions and information about our services.
Contact: info@devya.cloud or +20 1508130700
Website: devya.cloud`;
}

function initAIChat() {
    const chatForm = document.getElementById('aiChatForm');
    const chatInput = document.getElementById('aiChatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (!chatForm || !chatInput || !chatMessages) return;

    // Load saved chat history
    chatHistory = loadChatHistory();

    // Restore previous messages to UI
    if (chatHistory.length > 0) {
        // Hide quick suggestions if there's history
        const suggestions = document.getElementById('quickSuggestions');
        if (suggestions) suggestions.style.display = 'none';

        // Restore each message
        chatHistory.forEach(msg => {
            if (msg.role === 'user') {
                appendMessage('user', msg.content);
            } else if (msg.role === 'assistant') {
                appendMessage('ai', msg.content);
            }
        });
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // Hide quick suggestions after first message
        const suggestions = document.getElementById('quickSuggestions');
        if (suggestions) suggestions.style.display = 'none';

        // Add user message to UI
        appendMessage('user', message);
        chatInput.value = '';
        chatInput.disabled = true;

        // Show typing indicator
        const typingEl = showTypingIndicator();

        // Add to history
        chatHistory.push({ role: 'user', content: message });
        saveChatHistory(); // Save after user message


        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: AI_MODEL,
                    messages: [
                        { role: 'system', content: getSystemPrompt() },
                        ...chatHistory.slice(-10)
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            if (typingEl) typingEl.remove();

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices?.[0]?.message?.content || (currentLang === 'ar' ? 'عذراً، لم أتمكن من الرد.' : 'Sorry, I could not generate a response.');

            chatHistory.push({ role: 'assistant', content: aiResponse });
            saveChatHistory(); // Save after AI response
            appendMessage('ai', aiResponse);
        } catch (error) {
            console.error('Groq API Error:', error);
            if (typingEl) typingEl.remove();
            const errorMsg = currentLang === 'ar'
                ? '❌ عذراً، حدث خطأ. حاول مرة أخرى.'
                : '❌ Sorry, something went wrong. Please try again.';
            appendMessage('ai', errorMsg);
        } finally {
            chatInput.disabled = false;
            chatInput.focus();
        }
    });

    // Quick Suggestion Buttons
    const suggestionBtns = document.querySelectorAll('.quick-suggestion-btn');
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.textContent.trim();
            chatInput.value = text;
            chatForm.dispatchEvent(new Event('submit'));
        });
    });
}

const MINI_ROBOT_SVG = `<svg viewBox="0 0 200 200" class="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
    <rect x="55" y="65" width="90" height="80" rx="16" fill="#0f172a" stroke="#22d3ee" stroke-width="3"/>
    <rect x="62" y="72" width="76" height="50" rx="10" fill="#0c1222" opacity="0.9"/>
    <circle cx="82" cy="95" r="7" fill="#22d3ee"/><circle cx="118" cy="95" r="7" fill="#22d3ee"/>
    <path d="M88 108 Q100 118 112 108" stroke="#22d3ee" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>
    <line x1="100" y1="65" x2="100" y2="48" stroke="#22d3ee" stroke-width="3" stroke-linecap="round"/>
    <circle cx="100" cy="44" r="5" fill="#22d3ee" opacity="0.9"/>
</svg>`;

function appendMessage(type, text) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');

    if (type === 'user') {
        msgDiv.className = 'flex items-start gap-3 justify-end';
        msgDiv.innerHTML = `
            <div class="user-message bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
                <p class="text-white text-sm leading-relaxed">${escapeHtml(text)}</p>
            </div>
            <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            </div>
        `;
    } else {
        msgDiv.className = 'flex items-start gap-3';
        msgDiv.innerHTML = `
            <div class="ai-avatar-mini w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
                ${MINI_ROBOT_SVG}
            </div>
            <div class="ai-message bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                <p class="text-slate-300 text-sm leading-relaxed">${formatAIResponse(text)}</p>
            </div>
        `;
    }

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return null;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex items-start gap-3 typing-wrapper';
    typingDiv.innerHTML = `
        <div class="ai-avatar-mini w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden">
            ${MINI_ROBOT_SVG}
        </div>
        <div class="ai-message bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
            <div class="typing-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `;

    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatAIResponse(text) {
    // Escape HTML first
    let formatted = escapeHtml(text);
    // Convert **bold** to <strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}

// Update AI chat placeholder on language switch
function updateAIChatPlaceholder() {
    const chatInput = document.getElementById('aiChatInput');
    if (chatInput) {
        chatInput.placeholder = currentLang === 'ar'
            ? chatInput.getAttribute('data-placeholder-ar')
            : chatInput.getAttribute('data-placeholder-en');
    }
}

init();
