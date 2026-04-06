/**
 * ============================================================
 *  LUXE WINDOW FILM – SCRIPT.JS  (Elementor-Style Animations)
 *  Design & Developed by American Softec
 * ============================================================
 *
 *  01. Elementor-Style Animation Engine
 *  02. Top Bar Dismiss
 *  03. Header Scroll, Mega Menu, Sidebar
 *  04. Hero – Particle Canvas
 *  05. Hero – Number Counter
 *  06. CST Case Studies Slider
 *  07. Reviews Slider (Responsive: 3 desktop / 1 mobile)
 *  08. FAQ Accordion
 *  09. Contact Form + File Upload
 *  10. Footer Year
 */

/* ============================================================
   01. ELEMENTOR-STYLE ANIMATION ENGINE
   ============================================================ */
(function () {
    'use strict';

    /* ── Reduced-motion bail-out ── */
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* All selectors that start at opacity:0 via CSS */
    var ALL_HIDDEN = [
        '.hero__eyebrow',
        '.hero__h1-word',
        '.hero__h1-tag',
        '.hero__desc',
        '.hero__ctas',
        '.hero__trust',
        '.hero__right',
        '.wcwf__header',
        '.wcwf__visual',
        '.wcwf__benefits',
        '.wcwf__prose-block',
        '.wcwf__cta-wrap',
        '.bnf__header',
        '.bnf__card',
        '.bnf__cta-strip',
        '.owfs__header',
        '.owfs__card',
        '.owfs__footer',
        '.cst__header',
        '.cst__slider-outer',
        '.cst__footer',
        '.trust__visual',
        '.trust__content',
        '.trust__pillars',
        '.trust__cta-row',
        '.rev__header',
        '.rev__slider-outer',
        '.logo-bar__label',
        '.logo-bar__track-outer',
        '.proc__header',
        '.proc__steps',
        '.proc__cta',
        '.qcta__label',
        '.qcta__title',
        '.qcta__sub',
        '.qcta__btns',
        '.area__header',
        '.area__body',
        '.faq__header',
        '.faq__list',
        '.cform__info',
        '.cform__form-wrap',
        '.foot__top',
        '.foot__bottom'
    ];

    if (prefersReduced) {
        /* Make everything instantly visible */
        ALL_HIDDEN.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        });
        return;
    }

    /* ── Determine animation type from element ── */
    function getAnimType(el) {
        var cls = el.className || '';

        /* Left-entry: image/visual panels */
        if (/wcwf__visual|trust__visual/.test(cls)) return 'fadeInLeft';

        /* Right-entry: text content panels */
        if (/wcwf__benefits|trust__content|cform__form-wrap/.test(cls)) return 'fadeInRight';

        /* Down-entry: eyebrows / labels */
        if (/eyebrow|logo-bar__label|qcta__label/.test(cls)) return 'fadeInDown';

        /* Zoom-in: cards */
        if (/bnf__card|owfs__card/.test(cls)) return 'zoomIn';

        /* Default */
        return 'fadeInUp';
    }

    /* ── Read delay from any data-xxx-delay attribute (scaled down for speed) ── */
    var DELAY_SCALE = 0.5; /* 0.5 = half the original stagger gaps */

    function getDelay(el) {
        var attrs = el.attributes;
        for (var i = 0; i < attrs.length; i++) {
            if (attrs[i].name.indexOf('-delay') !== -1) {
                return Math.round((parseInt(attrs[i].value, 10) || 0) * DELAY_SCALE);
            }
        }
        return 0;
    }

    /* ── Apply animation to a single element ── */
    function reveal(el, animType, delay) {
        setTimeout(function () {
            el.style.animationDelay = '0ms'; /* already delayed via setTimeout */
            el.classList.add('animated', animType || getAnimType(el));
        }, delay || 0);
    }

    /* ── HERO: above-fold → trigger on load ── */
    function initHeroAnimations() {
        var hero = document.getElementById('hero');
        if (!hero) return;

        /* Eyebrow */
        var eyebrow = hero.querySelector('.hero__eyebrow');
        if (eyebrow) reveal(eyebrow, 'fadeInDown', 80);

        /* H1 words (use inline --d value for stagger) */
        hero.querySelectorAll('.hero__h1-word, .hero__h1-tag').forEach(function (el) {
            var styleAttr = el.getAttribute('style') || '';
            var match = styleAttr.match(/--d\s*:\s*(\d+)/);
            var d = match ? parseInt(match[1], 10) : 0;
            reveal(el, 'fadeInUp', 120 + d * 65);
        });

        /* Desc + CTAs */
        var desc = hero.querySelector('.hero__desc');
        if (desc) reveal(desc, 'fadeInUp', 400);

        var ctas = hero.querySelector('.hero__ctas');
        if (ctas) reveal(ctas, 'fadeInUp', 490);

        var trust = hero.querySelector('.hero__trust');
        if (trust) reveal(trust, 'fadeInUp', 570);

        /* Right column (image frame) */
        var right = hero.querySelector('.hero__right');
        if (right) reveal(right, 'zoomIn', 150);
    }

    /* ── UNIVERSAL IntersectionObserver for all below-fold elements ── */
    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            var delay = getDelay(el);
            reveal(el, getAnimType(el), delay);
            obs.unobserve(el);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    /* ── Special elements with fixed delays (no data-xxx-delay attribute) ── */
    var FIXED_DELAYS = {
        '.wcwf__benefits':    { anim: 'fadeInRight', delay: 30  },
        '.trust__content':    { anim: 'fadeInRight', delay: 50  },
        '.foot__top':         { anim: 'fadeInUp',    delay: 0   },
        '.foot__bottom':      { anim: 'fadeInUp',    delay: 60  }
    };

    /* ── Register all below-fold elements ── */
    function registerElements() {
        /* All [data-xxx-reveal] elements (already handle their own delay via attribute) */
        var dataRevealEls = document.querySelectorAll(
            '[data-wcwf-reveal], [data-bnf-reveal], [data-owfs-reveal], [data-cst-reveal],' +
            '[data-trust-reveal], [data-rev-reveal], [data-lbar-reveal], [data-proc-reveal],' +
            '[data-qcta-reveal], [data-area-reveal], [data-faq-reveal], [data-cform-reveal]'
        );
        dataRevealEls.forEach(function (el) { observer.observe(el); });

        /* Fixed-delay specials */
        Object.keys(FIXED_DELAYS).forEach(function (sel) {
            var el = document.querySelector(sel);
            if (!el) return;

            /* Use a dedicated one-shot observer with fixed delay */
            var cfg = FIXED_DELAYS[sel];
            var specialObs = new IntersectionObserver(function (entries, o) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    reveal(entry.target, cfg.anim, cfg.delay);
                    o.unobserve(entry.target);
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
            specialObs.observe(el);
        });

        /* BNF metric bars (animated separately) */
        var bars = document.querySelectorAll('[data-bnf-bar]');
        if (bars.length) {
            var barObs = new IntersectionObserver(function (entries, o) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('bnf--bar-active');
                    o.unobserve(entry.target);
                });
            }, { threshold: 0.5 });
            bars.forEach(function (bar) { barObs.observe(bar); });
        }
    }

    /* ── Boot ── */
    initHeroAnimations();
    registerElements();

})();


/* ============================================================
   02. TOP BAR DISMISS
   ============================================================ */
(function () {
    'use strict';

    var topBar      = document.getElementById('topBar');
    var topBarClose = document.getElementById('topBarClose');
    var siteHeader  = document.getElementById('siteHeader');

    if (!topBar || !topBarClose || !siteHeader) return;

    function dismissTopBar() {
        topBar.classList.add('is-hidden');
        siteHeader.classList.add('topbar-gone');
        try { sessionStorage.setItem('lxTopBarDismissed', '1'); } catch (e) {}
    }

    topBarClose.addEventListener('click', dismissTopBar);

    /* Restore across page loads */
    try {
        if (sessionStorage.getItem('lxTopBarDismissed') === '1') {
            topBar.classList.add('is-hidden');
            siteHeader.classList.add('topbar-gone');
        }
    } catch (e) {}
})();


/* ============================================================
   03. HEADER – SCROLL · MEGA MENU · SIDEBAR
   ============================================================ */
(function () {
    'use strict';

    var siteHeader  = document.getElementById('siteHeader');
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var mobileSidebar = document.getElementById('mobileSidebar');
    var mobOverlay  = document.getElementById('mobOverlay');
    var mobCloseBtn = document.getElementById('mobCloseBtn');
    var servicesItem = document.getElementById('servicesItem');

    if (!siteHeader) return;

    /* ── Scroll ── */
    var lastScrollY = 0;
    var ticking     = false;
    var sidebarOpen = false;
    var THRESHOLD   = 60;

    function onScroll() {
        var y = window.scrollY;

        siteHeader.classList.toggle('is-scrolled', y > THRESHOLD);

        if (!sidebarOpen) {
            if (y > lastScrollY && y > THRESHOLD + 80) {
                siteHeader.classList.add('is-hidden');
            } else {
                siteHeader.classList.remove('is-hidden');
            }
        }

        lastScrollY = y;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    onScroll();

    /* ── Mega Menu ── */
    var megaTimer = null;

    function openMega() {
        clearTimeout(megaTimer);
        if (!servicesItem) return;
        servicesItem.classList.add('is-open');
        var link = servicesItem.querySelector('.nav-link-services');
        if (link) link.setAttribute('aria-expanded', 'true');
    }

    function closeMega() {
        megaTimer = setTimeout(function () {
            if (!servicesItem) return;
            servicesItem.classList.remove('is-open');
            var link = servicesItem.querySelector('.nav-link-services');
            if (link) link.setAttribute('aria-expanded', 'false');
        }, 120);
    }

    if (servicesItem) {
        servicesItem.addEventListener('mouseenter', openMega);
        servicesItem.addEventListener('mouseleave', closeMega);
        servicesItem.addEventListener('focusin', openMega);
        servicesItem.addEventListener('focusout', function (e) {
            if (!servicesItem.contains(e.relatedTarget)) closeMega();
        });

        var servicesLink = servicesItem.querySelector('.nav-link-services');
        if (servicesLink) {
            servicesLink.addEventListener('click', function (e) {
                if (window.innerWidth > 1100 && !servicesItem.classList.contains('is-open')) {
                    e.preventDefault();
                    openMega();
                }
            });
        }
    }

    /* ── Sidebar ── */
    function openSidebar() {
        if (!mobileSidebar || !mobOverlay || !hamburgerBtn) return;
        sidebarOpen = true;
        mobileSidebar.classList.add('is-open');
        mobOverlay.classList.add('is-active');
        hamburgerBtn.classList.add('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileSidebar.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
        siteHeader.classList.remove('is-hidden');

        var navItems = mobileSidebar.querySelectorAll('.mob-nav-item');
        navItems.forEach(function (item, i) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            setTimeout(function () {
                item.style.transition = 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 80 + i * 45);
        });

        setTimeout(function () {
            var first = mobileSidebar.querySelector('a[href], button:not([disabled])');
            if (first) first.focus();
        }, 100);
    }

    function closeSidebar() {
        if (!mobileSidebar || !mobOverlay || !hamburgerBtn) return;
        sidebarOpen = false;
        mobileSidebar.classList.remove('is-open');
        mobOverlay.classList.remove('is-active');
        hamburgerBtn.classList.remove('is-active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        mobileSidebar.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
        hamburgerBtn.focus();
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', function () {
        sidebarOpen ? closeSidebar() : openSidebar();
    });
    if (mobCloseBtn) mobCloseBtn.addEventListener('click', closeSidebar);
    if (mobOverlay)  mobOverlay.addEventListener('click', closeSidebar);

    /* Mobile accordion */
    document.querySelectorAll('.mob-acc-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var expanded = this.getAttribute('aria-expanded') === 'true';
            var targetId = this.getAttribute('aria-controls');
            var submenu  = document.getElementById(targetId);
            if (!submenu) return;

            document.querySelectorAll('.mob-acc-trigger').forEach(function (t) {
                if (t !== trigger) {
                    t.setAttribute('aria-expanded', 'false');
                    var sm = document.getElementById(t.getAttribute('aria-controls'));
                    if (sm) { sm.classList.remove('is-open'); sm.setAttribute('aria-hidden', 'true'); }
                }
            });

            var next = !expanded;
            this.setAttribute('aria-expanded', String(next));
            submenu.classList.toggle('is-open', next);
            submenu.setAttribute('aria-hidden', String(!next));
        });
    });

    /* Keyboard */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (sidebarOpen) { closeSidebar(); return; }
            if (servicesItem && servicesItem.classList.contains('is-open')) closeMega();
        }
    });

    /* Focus trap */
    if (mobileSidebar) {
        mobileSidebar.addEventListener('keydown', function (e) {
            if (!sidebarOpen || e.key !== 'Tab') return;
            var focusables = Array.from(
                mobileSidebar.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')
            );
            var first = focusables[0];
            var last  = focusables[focusables.length - 1];
            if (!first || !last) return;
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        });
    }

    /* Resize guard */
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 1100 && sidebarOpen) closeSidebar();
        }, 100);
    });

    /* Active link */
    var path = window.location.pathname;
    document.querySelectorAll('.nav-link, .mob-nav-link:not(button), .mob-sub-link, .mega-card')
        .forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href) return;
            link.classList.remove('is-active', 'mob-active');
            var active = (href === '/' && path === '/') || (href !== '/' && path.startsWith(href));
            if (active) link.classList.add(link.classList.contains('mob-nav-link') ? 'mob-active' : 'is-active');
        });

    /* Header entrance stagger */
    [
        document.querySelector('.header-logo'),
        ...Array.from(document.querySelectorAll('.nav-list .nav-item')),
        document.querySelector('.header-actions')
    ].filter(Boolean).forEach(function (el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-8px)';
        setTimeout(function () {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200 + i * 60);
    });

})();


/* ============================================================
   04. HERO – PARTICLE CANVAS
   ============================================================ */
(function () {
    'use strict';

    var hero   = document.getElementById('hero');
    var canvas = document.getElementById('heroCanvas');
    if (!hero || !canvas) return;

    hero.classList.add('is-ready');

    var ctx = canvas.getContext('2d');
    var W, H, particles = [], RAF;
    var COUNT   = 55;
    var G_COLOR = '64,187,88';

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function mkParticle() {
        return {
            x:  Math.random() * W,
            y:  Math.random() * H,
            r:  Math.random() * 1.4 + 0.3,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            a:  Math.random() * 0.45 + 0.05,
            da: (Math.random() - 0.5) * 0.004
        };
    }

    function init() {
        particles = [];
        for (var i = 0; i < COUNT; i++) particles.push(mkParticle());
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx   = particles[i].x - particles[j].x;
                var dy   = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.strokeStyle = 'rgba(' + G_COLOR + ',' + (0.12 * (1 - dist / 130)).toFixed(3) + ')';
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        particles.forEach(function (p) {
            p.x += p.vx; p.y += p.vy; p.a += p.da;
            if (p.a <= 0.05 || p.a >= 0.5) p.da *= -1;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
            ctx.fillStyle = 'rgba(' + G_COLOR + ',' + p.a + ')';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });

        RAF = requestAnimationFrame(draw);
    }

    resize(); init(); draw();

    var rTimer;
    window.addEventListener('resize', function () {
        clearTimeout(rTimer);
        rTimer = setTimeout(function () { resize(); init(); }, 200);
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) cancelAnimationFrame(RAF);
        else draw();
    });
})();


/* ============================================================
   05. HERO – NUMBER COUNTER
   ============================================================ */
(function () {
    'use strict';

    var counters = document.querySelectorAll('.hero__count[data-target]');
    if (!counters.length) return;

    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el     = entry.target;
            var target = parseInt(el.getAttribute('data-target'), 10);
            var dur    = 1800;
            var start  = null;

            function step(ts) {
                if (!start) start = ts;
                var p     = Math.min((ts - start) / dur, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(eased * target);
                if (p < 1) requestAnimationFrame(step);
                else el.textContent = target;
            }
            requestAnimationFrame(step);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { obs.observe(el); });
})();


/* ============================================================
   06. CST – CASE STUDIES SLIDER
   ============================================================ */
(function () {
    'use strict';

    var track    = document.getElementById('cstTrack');
    var prevBtn  = document.getElementById('cstPrev');
    var nextBtn  = document.getElementById('cstNext');
    var curEl    = document.getElementById('cstCur');
    var totEl    = document.getElementById('cstTot');
    var progress = document.getElementById('cstProgress');
    var dotsWrap = document.getElementById('cstDots');

    if (!track || !prevBtn || !nextBtn) return;

    var slides  = track.querySelectorAll('.cst__slide');
    var total   = slides.length;
    var current = 0;

    if (totEl) totEl.textContent = total;

    function goTo(idx) {
        /* Infinite wrap */
        if (idx >= total) idx = 0;
        if (idx < 0)      idx = total - 1;
        current = idx;

        var slideW = track.parentElement.offsetWidth;
        var gap    = parseInt(getComputedStyle(track).gap) || 24;
        track.style.transform = 'translateX(-' + ((slideW + gap) * idx) + 'px)';

        if (curEl)    curEl.textContent = idx + 1;
        if (progress) progress.style.width = (((idx + 1) / total) * 100) + '%';

        if (dotsWrap) {
            dotsWrap.querySelectorAll('.cst__dot').forEach(function (d, i) {
                var active = i === idx;
                d.classList.toggle('cst__dot--active', active);
                d.setAttribute('aria-selected', String(active));
            });
        }

        /* Never disable – infinite loop */
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }

    goTo(0);

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    if (dotsWrap) {
        dotsWrap.addEventListener('click', function (e) {
            var dot = e.target.closest('[data-dot]');
            if (dot) goTo(parseInt(dot.getAttribute('data-dot'), 10));
        });
    }

    /* Keyboard navigation */
    document.addEventListener('keydown', function (e) {
        if (!document.getElementById('caseStudies')) return;
        if (e.key === 'ArrowLeft')  goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });

    /* Recalculate on resize */
    var cstResizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(cstResizeTimer);
        cstResizeTimer = setTimeout(function () { goTo(current); }, 150);
    }, { passive: true });

    /* Touch swipe */
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) >= 50) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });

    /* Auto-play (optional – comment out if not needed) */
    /* var autoPlay = setInterval(function () { goTo(current + 1); }, 6000); */
    /* track.parentElement.addEventListener('mouseenter', function() { clearInterval(autoPlay); }); */
})();


/* ============================================================
   07. REVIEWS SLIDER  (3 visible desktop · 1 visible mobile)
   ============================================================ */
(function () {
    'use strict';

    var revTrack = document.getElementById('revTrack');
    var revPrev  = document.getElementById('revPrev');
    var revNext  = document.getElementById('revNext');
    var revDots  = document.getElementById('revDots');

    if (!revTrack || !revPrev || !revNext) return;

    var revCards = revTrack.querySelectorAll('.rev__card');
    var revTotal = revCards.length;
    var revCur   = 0;

    /* Responsive visible count */
    function getVisible() { return window.innerWidth <= 768 ? 1 : 3; }
    function getGap()     { return window.innerWidth <= 768 ? 0 : 24; }

    /* Build dots dynamically based on visible count */
    function buildDots(visible) {
        if (!revDots) return;
        var max = revTotal - visible;
        revDots.innerHTML = '';
        for (var i = 0; i <= max; i++) {
            var d = document.createElement('button');
            d.className = 'rev__dot' + (i === 0 ? ' rev__dot--active' : '');
            d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            d.setAttribute('data-rev-dot', String(i));
            revDots.appendChild(d);
        }
    }

    /* Set card widths dynamically */
    function setCardWidths(visible, gap) {
        var containerW = revTrack.parentElement.offsetWidth;
        var cardW = (containerW - gap * (visible - 1)) / visible;
        revCards.forEach(function (card) {
            card.style.minWidth = cardW + 'px';
            card.style.maxWidth = cardW + 'px';
        });
        /* Also update gap on track */
        revTrack.style.gap = gap + 'px';
    }

    function syncDots(idx) {
        if (!revDots) return;
        revDots.querySelectorAll('.rev__dot').forEach(function (dot, i) {
            dot.classList.toggle('rev__dot--active', i === idx);
        });
    }

    function revGoTo(idx) {
        var visible = getVisible();
        var gap     = getGap();
        var maxIdx  = revTotal - visible;

        /* Infinite wrap */
        if (idx > maxIdx) idx = 0;
        if (idx < 0)      idx = maxIdx;
        revCur = idx;

        var containerW = revTrack.parentElement.offsetWidth;
        var cardW = (containerW - gap * (visible - 1)) / visible;
        var offset = (cardW + gap) * revCur;

        revTrack.style.transform = 'translateX(-' + offset + 'px)';
        syncDots(revCur);

        revPrev.disabled = false;
        revNext.disabled = false;
    }

    function initSlider() {
        var visible = getVisible();
        var gap     = getGap();
        buildDots(visible);
        setCardWidths(visible, gap);
        revGoTo(0);
    }

    initSlider();

    revPrev.addEventListener('click', function () { revGoTo(revCur - 1); });
    revNext.addEventListener('click', function () { revGoTo(revCur + 1); });

    if (revDots) {
        revDots.addEventListener('click', function (e) {
            var dot = e.target.closest('[data-rev-dot]');
            if (dot) revGoTo(parseInt(dot.getAttribute('data-rev-dot'), 10));
        });
    }

    /* Swipe */
    var rTouchX = 0;
    revTrack.addEventListener('touchstart', function (e) {
        rTouchX = e.changedTouches[0].screenX;
    }, { passive: true });
    revTrack.addEventListener('touchend', function (e) {
        var diff = rTouchX - e.changedTouches[0].screenX;
        if (Math.abs(diff) >= 50) revGoTo(diff > 0 ? revCur + 1 : revCur - 1);
    }, { passive: true });

    /* Responsive resize */
    var revResizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(revResizeTimer);
        revResizeTimer = setTimeout(function () {
            initSlider();
        }, 150);
    }, { passive: true });
})();


/* ============================================================
   08. FAQ ACCORDION
   ============================================================ */
(function () {
    'use strict';

    var faqBtns = document.querySelectorAll('.faq__q');

    faqBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var isOpen   = this.getAttribute('aria-expanded') === 'true';
            var targetId = this.getAttribute('aria-controls');
            var panel    = document.getElementById(targetId);
            if (!panel) return;

            /* Close all */
            faqBtns.forEach(function (b) {
                b.setAttribute('aria-expanded', 'false');
                var p = document.getElementById(b.getAttribute('aria-controls'));
                if (p) p.hidden = true;
            });

            /* Open this one if it was closed */
            if (!isOpen) {
                this.setAttribute('aria-expanded', 'true');
                panel.hidden = false;
            }
        });
    });
})();


/* ============================================================
   09. CONTACT FORM + FILE UPLOAD
   ============================================================ */
(function () {
    'use strict';

    var form = document.getElementById('contactFormEl');
    if (!form) return;

    /* ── Validation & submit ── */
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;

        form.querySelectorAll('[required]').forEach(function (input) {
            input.style.borderColor = '';
            if (!input.value.trim()) {
                input.style.borderColor = 'rgba(220,60,60,.55)';
                ok = false;
            }
        });

        if (!ok) return;

        var btn = form.querySelector('.cform__submit');
        if (btn) {
            var label = btn.querySelector('.cform__submit-label');
            var icon  = btn.querySelector('.cform__submit-icon');
            if (label) label.textContent = 'Message Sent!';
            if (icon) icon.innerHTML = '<path d="M2 8l5 5L14 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.85';
        }
    });

    /* ── File upload preview ── */
    var fileInput   = document.getElementById('cf_upload');
    var uploadZone  = document.getElementById('cf_upload_label');
    var previewWrap = document.getElementById('cf_upload_preview');

    if (!fileInput || !previewWrap) return;

    var selectedFiles = [];

    function renderChips() {
        previewWrap.innerHTML = '';
        selectedFiles.forEach(function (file, idx) {
            var chip = document.createElement('div');
            chip.className = 'cform__upload-chip';

            var name = document.createElement('span');
            name.textContent = file.name;
            chip.appendChild(name);

            var remove = document.createElement('button');
            remove.className = 'cform__upload-chip-remove';
            remove.type = 'button';
            remove.setAttribute('aria-label', 'Remove ' + file.name);
            remove.textContent = '×';
            remove.addEventListener('click', function () {
                selectedFiles.splice(idx, 1);
                renderChips();
            });
            chip.appendChild(remove);
            previewWrap.appendChild(chip);
        });
    }

    fileInput.addEventListener('change', function () {
        Array.from(this.files).forEach(function (f) {
            if (f.size <= 5 * 1024 * 1024) selectedFiles.push(f);
        });
        renderChips();
    });

    /* Drag & drop */
    if (uploadZone) {
        uploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            uploadZone.classList.add('is-dragover');
        });
        uploadZone.addEventListener('dragleave', function () {
            uploadZone.classList.remove('is-dragover');
        });
        uploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            uploadZone.classList.remove('is-dragover');
            var dt = e.dataTransfer;
            if (dt && dt.files) {
                Array.from(dt.files).forEach(function (f) {
                    if (f.size <= 5 * 1024 * 1024) selectedFiles.push(f);
                });
                renderChips();
            }
        });
    }
})();


/* ============================================================
   10. FOOTER YEAR
   ============================================================ */
(function () {
    'use strict';
    var yearEl = document.getElementById('footYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();