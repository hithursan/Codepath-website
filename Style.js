// bynary background
function generateBinary() {
    const bg = document.getElementById('binaryBg');
    if (!bg) return;

    const isMobile = window.innerWidth <= 768;
    const count = isMobile ? 3000 : 9000;

    let binary = '';
    for (let i = 0; i < count; i++) {
        binary += Math.random() > 0.5 ? '1' : '0';
    }
    bg.textContent = binary;
}

// theme changer
function toggleTheme() {
    document.body.classList.toggle('dark');
    const btn = document.getElementById('toggle-btn');
    const isDark = document.body.classList.contains('dark');

    if (btn) {
        btn.textContent = isDark ? '☀️' : '🌑';
    }

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function loadTheme() {
    const saved = localStorage.getItem('theme');
    const btn = document.getElementById('toggle-btn');

    if (saved === 'dark') {
        document.body.classList.add('dark');
        if (btn) btn.textContent = '☀️';
    }
}

// Nav bar setup
function setupHamburgerMenu() {
    const navbar = document.querySelector('.navbar_index, .navbar');
    if (!navbar) return;

    if (navbar.querySelector('.hamburger-btn')) return;

    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger-btn';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.textContent = '☰';

    const nav = navbar.querySelector('nav');
    if (nav) {
        navbar.insertBefore(hamburger, nav);
    } else {
        navbar.appendChild(hamburger);
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navbar.classList.toggle('nav-open');
        hamburger.textContent = isOpen ? '✕' : '☰';
        hamburger.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
    });

    navbar.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('nav-open');
            hamburger.textContent = '☰';
            hamburger.style.transform = 'rotate(0deg)';
        });
    });

    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navbar.classList.remove('nav-open');
            hamburger.textContent = '☰';
            hamburger.style.transform = 'rotate(0deg)';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar.classList.contains('nav-open')) {
            navbar.classList.remove('nav-open');
            hamburger.textContent = '☰';
            hamburger.style.transform = 'rotate(0deg)';
        }
    });
}

// Scroll bar
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar_index, .navbar');
    if (!navbar) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 80) {
                    navbar.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                    navbar.style.borderColor = 'rgba(128,128,128,0.3)';
                } else {
                    navbar.style.boxShadow = '0 8px 32px var(--nav-shadow)';
                    navbar.style.borderColor = '';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

//scroll efact
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navbarHeight = 80;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

//mobile nav bar
function setupMobileWeekNav() {
    const originalNav = document.querySelector('.rm-nav');
    if (!originalNav) return;

    const links = Array.from(originalNav.querySelectorAll('a'));
    if (links.length === 0) return;

    const sections = links.map(a => {
        const id = a.getAttribute('href').replace('#', '');
        return {
            id,
            label: a.textContent.trim(),
            target: document.getElementById(id)
        };
    }).filter(s => s.target);

    if (sections.length === 0) return;

    const bar = document.createElement('div');
    bar.className = 'rm-nav-mobile';

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Previous section');
    prevBtn.textContent = '◀';

    const currentLabel = document.createElement('div');
    currentLabel.className = 'rm-nav-current';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'Next section');
    nextBtn.textContent = '▶';

    bar.appendChild(prevBtn);
    bar.appendChild(currentLabel);
    bar.appendChild(nextBtn);
    document.body.appendChild(bar);

    let currentIndex = 0;

    function updateBar() {
        currentLabel.textContent = sections[currentIndex].label;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === sections.length - 1;
    }

    function goTo(index) {
        if (index < 0 || index >= sections.length) return;
        currentIndex = index;
        sections[currentIndex].target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        updateBar();
    }

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    updateBar();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = sections.findIndex(s => s.target === entry.target);
                if (idx !== -1) {
                    currentIndex = idx;
                    updateBar();
                }
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s.target));
}

// adjestable binary background
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        generateBinary();

        // Auto-close hamburger menu on resize to desktop
        const navbar = document.querySelector('.navbar_index, .navbar');
        const hamburger = navbar?.querySelector('.hamburger-btn');
        if (window.innerWidth > 768 && navbar) {
            navbar.classList.remove('nav-open');
            if (hamburger) {
                hamburger.textContent = '☰';
                hamburger.style.transform = 'rotate(0deg)';
            }
        }
    }, 250);
});


generateBinary();
loadTheme();

document.addEventListener('DOMContentLoaded', () => {
    setupHamburgerMenu();
    setupScrollEffects();
    setupSmoothScroll();
    setupMobileWeekNav();
});


function setupSmartRoadmapNav() {
    const nav = document.querySelector('.rm-nav');
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll('a'));
    if (links.length === 0) return;

    const sections = links.map(link => {
        const id = link.getAttribute('href')?.replace('#', '');
        return id ? { link, id, target: document.getElementById(id) } : null;
    }).filter(s => s && s.target);

    if (sections.length === 0) return;


    const originalLinks = nav.innerHTML;
    

    nav.innerHTML = `
        <div class="rm-nav-header">
            <div class="rm-nav-current-label">
                <span class="pulse-dot"></span>
                <span>Currently Reading:</span>
                <span class="rm-nav-current-name">${sections[0].link.textContent}</span>
            </div>
            <div class="rm-nav-progress-text">
                <span class="current-num">1</span> / ${sections.length}
            </div>
        </div>
        <div class="rm-nav-progress-bar">
            <div class="rm-nav-progress-fill"></div>
        </div>
        <div class="rm-nav-chapters"></div>
    `;
    
    const chaptersContainer = nav.querySelector('.rm-nav-chapters');
    const currentNameEl = nav.querySelector('.rm-nav-current-name');
    const currentNumEl = nav.querySelector('.current-num');
    const progressFill = nav.querySelector('.rm-nav-progress-fill');
    

    sections.forEach(({ link }) => {
        const newLink = document.createElement('a');
        newLink.href = link.getAttribute('href');
        newLink.innerHTML = `
            <span class="check-icon">✓</span>
            <span class="link-text">${link.textContent}</span>
        `;
        chaptersContainer.appendChild(newLink);
    });


    const navLinks = Array.from(chaptersContainer.querySelectorAll('a'));
    sections.forEach((s, i) => { s.link = navLinks[i]; });


    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = nav.offsetHeight + 100;
                const targetPos = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });


    let activeIndex = 0;
    
    function updateActiveState(newIndex) {
        if (newIndex === activeIndex && newIndex !== 0) return;
        activeIndex = newIndex;
        

        sections.forEach((s, i) => {
            s.link.classList.remove('active', 'completed');
            if (i < newIndex) {
                s.link.classList.add('completed');
            } else if (i === newIndex) {
                s.link.classList.add('active');
            }
        });
        

        const activeName = sections[newIndex].link.querySelector('.link-text').textContent;
        currentNameEl.textContent = activeName;
        currentNumEl.textContent = newIndex + 1;
        

        const progress = ((newIndex + 1) / sections.length) * 100;
        progressFill.style.width = `${progress}%`;
        

        const activeLink = sections[newIndex].link;
        const containerRect = chaptersContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        
        if (linkRect.left < containerRect.left || linkRect.right > containerRect.right) {
            const scrollLeft = activeLink.offsetLeft - (chaptersContainer.offsetWidth / 2) + (activeLink.offsetWidth / 2);
            chaptersContainer.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }

    const observer = new IntersectionObserver((entries) => {

        let bestEntry = null;
        let bestRatio = 0;
        
        entries.forEach(entry => {
            if (entry.intersectionRatio > bestRatio) {
                bestRatio = entry.intersectionRatio;
                bestEntry = entry;
            }
        });
        
        if (bestEntry && bestEntry.isIntersecting) {
            const id = bestEntry.target.id;
            const index = sections.findIndex(s => s.id === id);
            if (index !== -1) {
                updateActiveState(index);
            }
        }
    }, {
        rootMargin: '-20% 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(s => observer.observe(s.target));
    

    updateActiveState(0);

    document.addEventListener('keydown', (e) => {
        // Only if not typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.key === 'ArrowRight' && e.altKey) {
            e.preventDefault();
            if (activeIndex < sections.length - 1) {
                sections[activeIndex + 1].link.click();
            }
        } else if (e.key === 'ArrowLeft' && e.altKey) {
            e.preventDefault();
            if (activeIndex > 0) {
                sections[activeIndex - 1].link.click();
            }
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    setupHamburgerMenu();
    setupScrollEffects();
    setupSmoothScroll();
    setupSmartRoadmapNav();    
    setupCopyButtons();
});
function setupNavAutoHide() {
    const nav = document.querySelector('.rm-nav');
    if (!nav) return;
    
    function checkScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const distanceFromBottom = docHeight - (scrollY + windowHeight);
        
        if (distanceFromBottom < 250) {
            nav.classList.add('hidden-on-footer');
        } else {
            nav.classList.remove('hidden-on-footer');
        }
    }
    
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
}

document.addEventListener('DOMContentLoaded', setupNavAutoHide);