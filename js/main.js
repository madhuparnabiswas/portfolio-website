(function () {
    'use strict';

    /* --------------------------------------------------------------------
       1. CRISP INLINE VECTOR PIXEL-ART BANANA CAT MASCOT
       -------------------------------------------------------------------- */
    function renderBananaCatMascot() {
        const svg = document.getElementById('banana-cat-svg');
        if (!svg) return;

        const palette = {
            K: '#3B2314', // Dark brown outline / stem edge / banana spot
            B: '#623E27', // Stem inner brown
            L: '#FFF08A', // Bright banana highlight
            Y: '#FAD832', // Primary banana yellow
            G: '#E2A41E', // Golden banana shading
            O: '#C47A12', // Deep golden-orange shading
            C: '#B5A8A3', // Cat fur midtone
            W: '#D8CFCC', // Cat fur light / muzzle / eye gleam
            S: '#82736E', // Cat fur shadow / tabby forehead
            D: '#50413C', // Cat dark paw outline
            E: '#1C1615', // Expressive dark eyes
            N: '#925E5A', // Tiny nose
        };

        const grid = [
            '............................',
            '.........KKK................',
            '........KBBBK...............',
            '........KBBK................',
            '.........KBBK...............',
            '.........KBBKK..............',
            '........KKGGKK..............',
            '.......KLYYYGGK.............',
            '......KLLYYYYGGK............',
            '......KLYYYYYYGGK...........',
            '.....KLYYYYYYYYGGK..........',
            '.....KYYKSSSSKKYGGK.........',
            '....KYYKSCWWCSKYYGGK........',
            '....KYKCCWSSWCCKYGGK........',
            '....KYKCSCCCCSCKYYGK........',
            '...KYYKCCCCCCCCKYYGGK.......',
            '...KYKCCEECCEECCKYGGK.......',
            '...KYKCEEWCCWEECCKYGK.......',
            '...KYKCCCCNNCCCCKYGGK.......',
            '....KYKSCCWWCCSKYYGGK.......',
            '....KYYKSSWWSSKYYYGGK.......',
            '.....KYKKSSSSKKYYYGGK.......',
            '.....KYYKKKKKKYYYYGGK.......',
            '.....KYYYYYYYYYYYGGK........',
            '.....KYYYYYYYYYYGGGK........',
            '....KKKYYYYYYYYYGGGK........',
            '..DDCCKYYYYYYYYYGGGKKK......',
            '.DCCCCKYYKKYYYYGGGGCCDD.....',
            '.DSSDDKYYKKKYYYGGOGCSSD.....',
            '..DDD.KYYKKKYYGGGOGDDD......',
            '......KYYYYYYGGGOGK.........',
            '.......KKYYYYGGGGK..........',
            '........KSSKKKSSK...........',
            '........KCCK.KCCK...........',
            '.......KDCCK.KCCDK..........',
            '.....PPKDDDKPKDDDKPP........',
            '....PPPPPPPPPPPPPPPPP.......',
            '......PPPPPPPPPPPPP.........',
        ];

        const svgNS = 'http://www.w3.org/2000/svg';
        const fragment = document.createDocumentFragment();

        grid.forEach((rowStr, y) => {
            for (let x = 0; x < rowStr.length; x++) {
                const ch = rowStr[x];
                if (ch === '.') continue;

                const rect = document.createElementNS(svgNS, 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', '1.02');
                rect.setAttribute('height', '1.02');

                if (ch === 'P') {
                    rect.setAttribute('class', 'pixel-ground-shadow');
                } else if (palette[ch]) {
                    rect.setAttribute('fill', palette[ch]);
                }

                fragment.appendChild(rect);
            }
        });

        svg.appendChild(fragment);
    }

    /* --------------------------------------------------------------------
       2. THEME TOGGLE (Light Default + Dark Mode + localStorage)
       -------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const iconSun = document.getElementById('icon-sun');
    const iconMoon = document.getElementById('icon-moon');
    const themeLabel = document.getElementById('theme-label');

    function applyThemeUI(theme) {
        const isDark = theme === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

        if (iconSun && iconMoon && themeLabel) {
            iconSun.classList.toggle('hidden', !isDark);
            iconMoon.classList.toggle('hidden', isDark);
            themeLabel.textContent = isDark ? 'Light' : 'Dark';
        }
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }

    applyThemeUI(document.documentElement.getAttribute('data-theme') || 'light');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            applyThemeUI(next);
            try {
                localStorage.setItem('mb-portfolio-theme', next);
            } catch (e) {
                // Gracefully ignore storage restrictions
            }
        });
    }

    /* --------------------------------------------------------------------
       3. STICKY HEADER HAIRLINE & MOBILE MENU
       -------------------------------------------------------------------- */
    const siteHeader = document.getElementById('site-header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconOpen = document.getElementById('menu-icon-open');
    const menuIconClose = document.getElementById('menu-icon-close');

    function handleScrollHeader() {
        if (!siteHeader) return;
        siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
    }

    window.addEventListener('scroll', handleScrollHeader, { passive: true });
    handleScrollHeader();

    function toggleMobileMenu(forceClose) {
        if (!mobileMenu || !mobileMenuBtn) return;
        const shouldClose = forceClose === true ? true : !mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden', shouldClose);
        mobileMenuBtn.setAttribute('aria-expanded', String(!shouldClose));
        if (menuIconOpen && menuIconClose) {
            menuIconOpen.classList.toggle('hidden', !shouldClose);
            menuIconClose.classList.toggle('hidden', shouldClose);
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
    }

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
        link.addEventListener('click', () => toggleMobileMenu(true));
    });

    /* --------------------------------------------------------------------
       4. PROJECT CATEGORY FILTER TABS
       -------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const selected = btn.getAttribute('data-filter');

            filterButtons.forEach((tab) => {
                const isActive = tab === btn;
                tab.setAttribute('aria-selected', String(isActive));
                tab.classList.toggle('bg-fg', isActive);
                tab.classList.toggle('text-bg', isActive);
                tab.classList.toggle('text-muted', !isActive);
            });

            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                const matches = selected === 'all' || category === selected;

                card.classList.remove('is-entering');
                if (matches) {
                    card.classList.remove('is-hidden');
                    void card.offsetWidth;
                    card.classList.add('is-entering');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        });
    });

    /* --------------------------------------------------------------------
       5. TOAST NOTIFICATION & COPY EMAIL TO CLIPBOARD
       -------------------------------------------------------------------- */
    const toastEl = document.getElementById('toast');
    let toastTimer = null;

    function showToast(message) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.remove('opacity-0', 'translate-y-3');
        toastEl.classList.add('opacity-100', 'translate-y-0');

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastEl.classList.remove('opacity-100', 'translate-y-0');
            toastEl.classList.add('opacity-0', 'translate-y-3');
        }, 2200);
    }

    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailTextEl = document.getElementById('email-text');
    const copyIcon = document.getElementById('copy-icon');
    const checkIcon = document.getElementById('check-icon');
    let copyResetTimer = null;

    function copyTextReliable(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {
            success = false;
        }
        document.body.removeChild(textarea);
        return success;
    }

    if (copyEmailBtn && emailTextEl) {
        copyEmailBtn.addEventListener('click', () => {
            const email = copyEmailBtn.getAttribute('data-email') || 'madhuparna@example.com';
            const copied = copyTextReliable(email);

            emailTextEl.textContent = copied ? 'Copied!' : email;
            if (copyIcon && checkIcon && copied) {
                copyIcon.classList.add('hidden');
                checkIcon.classList.remove('hidden');
            }
            showToast(copied ? 'Email copied: ' + email : 'Email: ' + email);

            clearTimeout(copyResetTimer);
            copyResetTimer = setTimeout(() => {
                emailTextEl.textContent = email;
                if (copyIcon && checkIcon) {
                    copyIcon.classList.remove('hidden');
                    checkIcon.classList.add('hidden');
                }
            }, 2000);
        });
    }



    const resumeLink = document.getElementById('resume-link');
    if (resumeLink) {
        resumeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Link your Resume PDF in index.html');
        });
    }

    /* --------------------------------------------------------------------
      6. REPEATABLE SCROLL REVEAL ANIMATIONS (RESPECTS REDUCED MOTION)
      -------------------------------------------------------------------- */
    function initScrollReveal() {
        const revealEls = document.querySelectorAll('.reveal');
        if (!('IntersectionObserver' in window)) {
            revealEls.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        entry.target.classList.remove('is-visible');
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
        );

        revealEls.forEach((el) => observer.observe(el));
    }

    renderBananaCatMascot();
    initScrollReveal();
})();

