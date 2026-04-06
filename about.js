/**
 * ============================================================
 *  LUXE WINDOW FILM — ABOUT PAGE JS
 *  Design & Developed by American Softec
 * ============================================================
 *
 *  01. About Hero — entrance reveal + counter animation
 *  02. ABUS — scroll reveal
 *  03. APPR — scroll reveal
 *  04. WCLX — scroll reveal
 *  05. Footer year (shared with script.js but safe to re-run)
 */

(function () {
    'use strict';

    /* ══════════════════════════════════════════════════════════
       01 · ABOUT HERO — ENTRANCE REVEAL
    ══════════════════════════════════════════════════════════ */
    var heroEls = document.querySelectorAll('[data-abht-reveal]');

    if (heroEls.length) {
        // Immediate reveal on load with stagger
        heroEls.forEach(function (el) {
            var delay = parseInt(el.getAttribute('data-abht-delay') || '0', 10);
            setTimeout(function () {
                el.classList.add('ab--vis');
            }, delay + 100);
        });
    }

    /* Counter animation for hero stats */
    var heroCounters = document.querySelectorAll('.abht__count[data-target]');
    if (heroCounters.length) {
        var counterObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-target'), 10);
                var dur = 1600;
                var start = null;

                function step(ts) {
                    if (!start) start = ts;
                    var p = Math.min((ts - start) / dur, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(eased * target);
                    if (p < 1) requestAnimationFrame(step);
                    else el.textContent = target;
                }
                requestAnimationFrame(step);
                counterObs.unobserve(el);
            });
        }, { threshold: .5 });
        heroCounters.forEach(function (el) { counterObs.observe(el); });
    }

    /* ══════════════════════════════════════════════════════════
       02 · SHARED SCROLL REVEAL FOR ALL ABOUT SECTIONS
    ══════════════════════════════════════════════════════════ */
    var scrollRevealEls = document.querySelectorAll(
        '[data-abus-reveal], [data-appr-reveal], [data-wclx-reveal]'
    );

    if (scrollRevealEls.length) {
        var revObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                /* Find delay from whichever attribute is set */
                var delay = 0;
                ['abus', 'appr', 'wclx'].forEach(function (ns) {
                    var val = el.getAttribute('data-' + ns + '-delay');
                    if (val !== null) delay = parseInt(val, 10);
                });
                setTimeout(function () {
                    el.classList.add('ab--vis');
                }, delay);
                revObs.unobserve(el);
            });
        }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

        scrollRevealEls.forEach(function (el) { revObs.observe(el); });
    }

    /* ══════════════════════════════════════════════════════════
       03 · SMOOTH SCROLL FOR ANCHOR LINKS
    ══════════════════════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href').slice(1);
            var target = document.getElementById(targetId);
            if (!target) return;
            e.preventDefault();
            var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '80');
            var topBarH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-h') || '40');
            var offset = headerH + (document.getElementById('topBar') && !document.getElementById('topBar').classList.contains('is-hidden') ? topBarH : 0) + 20;
            var top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    /* ══════════════════════════════════════════════════════════
       04 · FOOTER YEAR (safe re-run)
    ══════════════════════════════════════════════════════════ */
    var yearEl = document.getElementById('footYear');
    if (yearEl && !yearEl.textContent) {
        yearEl.textContent = new Date().getFullYear();
    }

})();