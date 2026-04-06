/**
 * ============================================================
 *  LUXE WINDOW FILM — CONTACT PAGE JS
 *  Design & Developed by American Softec
 * ============================================================
 *  01. Hero entrance reveal
 *  02. Smooth scroll to form
 *  03. Form submission
 *  04. Scroll reveal for all sections
 *  05. Footer year
 */

(function () {
    'use strict';

    /* ══════════════════════════════════════════════════════════
       01 · HERO ENTRANCE REVEAL
    ══════════════════════════════════════════════════════════ */
    document.querySelectorAll('[data-ct-reveal]').forEach(function (el) {
        var delay = parseInt(el.getAttribute('data-ct-delay') || '0', 10);
        setTimeout(function () { el.classList.add('ct--vis'); }, delay + 80);
    });

    /* ══════════════════════════════════════════════════════════
       02 · SMOOTH SCROLL TO FORM
    ══════════════════════════════════════════════════════════ */
    function scrollToForm(e) {
        e.preventDefault();
        var form = document.getElementById('contactForm');
        if (!form) return;
        var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '80', 10);
        var topBarEl = document.getElementById('topBar');
        var topBarH = (topBarEl && !topBarEl.classList.contains('is-hidden'))
            ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-h') || '40', 10)
            : 0;
        var offset = headerH + topBarH + 16;
        var top = form.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
        // Focus first input after scroll
        setTimeout(function () {
            var firstInput = document.getElementById('ct_fname');
            if (firstInput) firstInput.focus();
        }, 700);
    }
    document.querySelectorAll('.ct-scroll-form').forEach(function (el) {
        el.addEventListener('click', scrollToForm);
    });

    /* ══════════════════════════════════════════════════════════
       03 · FORM SUBMISSION
    ══════════════════════════════════════════════════════════ */
    var form = document.getElementById('contactMainForm');
    var successDiv = document.getElementById('ctFormSuccess');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var ok = true;
            // Validate required fields
            form.querySelectorAll('[required]').forEach(function (input) {
                input.style.borderColor = '';
                if (!input.value.trim()) {
                    input.style.borderColor = 'rgba(220,60,60,.5)';
                    ok = false;
                }
            });
            if (!ok) return;

            // Email format check
            var emailInput = document.getElementById('ct_email');
            if (emailInput && emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                emailInput.style.borderColor = 'rgba(220,60,60,.5)';
                return;
            }

            // Show success
            form.style.display = 'none';
            var formHead = form.previousElementSibling;
            if (formHead && successDiv) {
                successDiv.hidden = false;
            } else if (successDiv) {
                successDiv.hidden = false;
            }
        });

        // Clear error border on input
        form.querySelectorAll('.ctmn__input').forEach(function (input) {
            input.addEventListener('input', function () {
                this.style.borderColor = '';
            });
        });
    }

    /* ══════════════════════════════════════════════════════════
       04 · SCROLL REVEAL FOR ALL SECTIONS
    ══════════════════════════════════════════════════════════ */
    var revEls = document.querySelectorAll('[data-ctmn-reveal],[data-ctwt-reveal],[data-ctmp-reveal]');

    if (revEls.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var delay = 0;
                ['ctmn', 'ctwt', 'ctmp'].forEach(function (ns) {
                    var val = el.getAttribute('data-' + ns + '-delay');
                    if (val !== null) delay = parseInt(val, 10);
                });
                setTimeout(function () { el.classList.add('ct--vis'); }, delay);
                observer.unobserve(el);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
        revEls.forEach(function (el) { observer.observe(el); });
    }

    /* ══════════════════════════════════════════════════════════
       05 · FOOTER YEAR
    ══════════════════════════════════════════════════════════ */
    var yearEl = document.getElementById('footYear');
    if (yearEl && !yearEl.textContent) {
        yearEl.textContent = new Date().getFullYear();
    }

})();