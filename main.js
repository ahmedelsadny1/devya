        let currentLang = 'en';
        let isDarkMode = false;
        function init() {
            const savedLang = localStorage.getItem('language') || 'en';
            const savedDarkMode = localStorage.getItem('darkMode') === 'true';
            currentLang = savedLang;
            isDarkMode = savedDarkMode;
            updateLanguage();
            updateDarkMode();
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

        function handleSubscribe(e) {
            e.preventDefault();
            alert(currentLang === 'en' ? 'Thank you for subscribing!' : 'شكراً لاشتراكك!');
            e.target.reset();
        }

        function handleContact(e) {
            e.preventDefault();
            alert(currentLang === 'en' ? 'Message sent successfully! We will be in touch soon.' : 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.');
            e.target.reset();
        }
        init();