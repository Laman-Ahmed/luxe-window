/**
 * ============================================================
 *  LUXE WINDOW FILM — LEGAL PAGES JS (Shared)
 *  Used by: terms-conditions.html + privacy-policy.html
 *  Design & Developed by American Softec
 * ============================================================
 *  01. Hero entrance reveal
 *  02. Scroll reveal for sections
 *  03. Active TOC link on scroll (IntersectionObserver)
 *  04. Smooth scroll for TOC links
 *  05. Footer year
 */

(function () {
    'use strict';

    /* ══════════════════════════════════════════════════════════
       01 · HERO ENTRANCE
    ══════════════════════════════════════════════════════════ */
    document.querySelectorAll('[data-lg-reveal]').forEach(function (el) {
        var delay = parseInt(el.getAttribute('data-lg-delay') || '0', 10);
        setTimeout(function () { el.classList.add('lg--vis'); }, delay + 80);
    });

    /* ══════════════════════════════════════════════════════════
       02 · SCROLL REVEAL FOR SECTIONS
    ══════════════════════════════════════════════════════════ */
    var sections = document.querySelectorAll('.lg-section[data-lg-reveal]');
    if (sections.length) {
        var secObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('lg--vis');
                secObs.unobserve(entry.target);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        sections.forEach(function (el) { secObs.observe(el); });
    }

    /* ══════════════════════════════════════════════════════════
       03 · ACTIVE TOC ON SCROLL
    ══════════════════════════════════════════════════════════ */
    var tocLinks = document.querySelectorAll('.lg-toc__link[data-section]');
    var sectionEls = [];
    tocLinks.forEach(function (link) {
        var id = link.getAttribute('data-section');
        var el = document.getElementById(id);
        if (el) sectionEls.push(el);
    });

    if (sectionEls.length && tocLinks.length) {
        var activeObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.id;
                tocLinks.forEach(function (link) {
                    link.classList.toggle('lg-toc__link--active', link.getAttribute('data-section') === id);
                });
            });
        }, { threshold: 0.25, rootMargin: '-80px 0px -60% 0px' });
        sectionEls.forEach(function (el) { activeObs.observe(el); });
    }

    /* ══════════════════════════════════════════════════════════
       04 · SMOOTH SCROLL FOR TOC LINKS
    ══════════════════════════════════════════════════════════ */
    tocLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var id = this.getAttribute('data-section');
            var target = document.getElementById(id);
            if (!target) return;
            var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '80', 10);
            var topBarEl = document.getElementById('topBar');
            var topBarH = (topBarEl && !topBarEl.classList.contains('is-hidden'))
                ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-h') || '40', 10)
                : 0;
            var offset = headerH + topBarH + 16;
            var top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });

    /* ══════════════════════════════════════════════════════════
       05 · FOOTER YEAR
    ══════════════════════════════════════════════════════════ */
    var yearEl = document.getElementById('footYear');
    if (yearEl && !yearEl.textContent) {
        yearEl.textContent = new Date().getFullYear();
    }

})();