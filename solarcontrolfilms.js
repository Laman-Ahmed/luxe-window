/**
 * ============================================================
 *  LUXE WINDOW FILM — SOLAR CONTROL FILMS PAGE JS
 *  Design & Developed by American Softec
 * ============================================================
 *
 *  01. Scroll all sf-scroll-cta buttons to form
 *  02. Hero entrance reveal
 *  03. Two-step form logic
 *  04. Form submission
 *  05. Counter animation
 *  06. Scroll reveal for all page sections
 *  07. Footer year
 */

(function () {
    'use strict';

    /* ══════════════════════════════════════════════════════════
       01 · SCROLL ALL CTA BUTTONS TO FORM
    ══════════════════════════════════════════════════════════ */
    function scrollToForm(e) {
        e.preventDefault();
        var form = document.getElementById('solarQuoteForm');
        if (!form) return;
        var headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '80');
        var topBarEl = document.getElementById('topBar');
        var topBarH = (topBarEl && !topBarEl.classList.contains('is-hidden'))
            ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-h') || '40')
            : 0;
        var offset = headerH + topBarH + 20;
        var top = form.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
    }

    document.querySelectorAll('.sf-scroll-cta').forEach(function (el) {
        el.addEventListener('click', scrollToForm);
    });

    /* ══════════════════════════════════════════════════════════
       02 · HERO ENTRANCE REVEAL
    ══════════════════════════════════════════════════════════ */
    var heroEls = document.querySelectorAll('[data-sf-reveal]');
    heroEls.forEach(function (el) {
        var delay = parseInt(el.getAttribute('data-sf-delay') || '0', 10);
        setTimeout(function () { el.classList.add('sf--vis'); }, delay + 100);
    });

    /* ══════════════════════════════════════════════════════════
       03 · TWO-STEP FORM LOGIC
    ══════════════════════════════════════════════════════════ */
    var step1 = document.getElementById('sfFormStep1');
    var step2 = document.getElementById('sfFormStep2');
    var nextBtn = document.getElementById('sfNextBtn');
    var backBtn = document.getElementById('sfBackBtn');
    var step1Label = document.getElementById('sfStep1Label');
    var step2Label = document.getElementById('sfStep2Label');
    var stepFill = document.getElementById('sfStepFill');
    var selectedBadge = document.getElementById('sfSelectedBadge');
    var selectedText = document.getElementById('sfSelectedText');
    var hiddenType = document.getElementById('sfHiddenType');
    var step1Error = document.getElementById('sfStep1Error');
    var successDiv = document.getElementById('sfFormSuccess');

    function getSelectedOption() {
        var radios = document.querySelectorAll('input[name="sf_property_type"]');
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) return radios[i].value;
        }
        return null;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            var selected = getSelectedOption();
            if (!selected) {
                step1Error && step1Error.classList.add('sf--show');
                return;
            }
            step1Error && step1Error.classList.remove('sf--show');
            // Update hidden field and badge
            if (hiddenType) hiddenType.value = selected;
            if (selectedText) selectedText.textContent = selected;
            // Transition
            step1.classList.add('sfht__form-step--hidden');
            step2.classList.remove('sfht__form-step--hidden');
            // Update progress
            if (stepFill) stepFill.style.width = '100%';
            if (step1Label) step1Label.classList.remove('sfht__step-label--active');
            if (step2Label) step2Label.classList.add('sfht__step-label--active');
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', function () {
            step2.classList.add('sfht__form-step--hidden');
            step1.classList.remove('sfht__form-step--hidden');
            if (stepFill) stepFill.style.width = '50%';
            if (step1Label) step1Label.classList.add('sfht__step-label--active');
            if (step2Label) step2Label.classList.remove('sfht__step-label--active');
        });
    }

    // Option selection feedback — clear error
    document.querySelectorAll('input[name="sf_property_type"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            step1Error && step1Error.classList.remove('sf--show');
        });
    });

    /* ══════════════════════════════════════════════════════════
       04 · FORM SUBMISSION
    ══════════════════════════════════════════════════════════ */
    var contactForm = document.getElementById('sfContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Validate required fields
            var ok = true;
            contactForm.querySelectorAll('[required]').forEach(function (input) {
                input.style.borderColor = '';
                if (!input.value.trim()) {
                    input.style.borderColor = 'rgba(220,60,60,.55)';
                    ok = false;
                }
            });
            if (!ok) return;

            // Show success
            step2.classList.add('sfht__form-step--hidden');
            if (successDiv) successDiv.classList.remove('sfht__form-step--hidden');
        });
    }

    /* ══════════════════════════════════════════════════════════
       05 · COUNTER ANIMATION
    ══════════════════════════════════════════════════════════ */
    var counters = document.querySelectorAll('.sfht__count[data-target]');
    if (counters.length) {
        var cObs = new IntersectionObserver(function (entries) {
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
                cObs.unobserve(el);
            });
        }, { threshold: .5 });
        counters.forEach(function (el) { cObs.observe(el); });
    }

    /* ══════════════════════════════════════════════════════════
       06 · SCROLL REVEAL FOR ALL PAGE SECTIONS
    ══════════════════════════════════════════════════════════ */
    var scrollRevealEls = document.querySelectorAll(
        '[data-sfin-reveal], [data-sfbn-reveal], [data-sffo-reveal], [data-sfsg-reveal], [data-sfca-reveal]'
    );

    if (scrollRevealEls.length) {
        var revObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var delay = 0;
                ['sfin', 'sfbn', 'sffo', 'sfsg', 'sfca'].forEach(function (ns) {
                    var val = el.getAttribute('data-' + ns + '-delay');
                    if (val !== null) delay = parseInt(val, 10);
                });
                setTimeout(function () { el.classList.add('sf--vis'); }, delay);
                revObs.unobserve(el);
            });
        }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });
        scrollRevealEls.forEach(function (el) { revObs.observe(el); });
    }

    /* ══════════════════════════════════════════════════════════
       07 · FOOTER YEAR
    ══════════════════════════════════════════════════════════ */
    var yearEl = document.getElementById('footYear');
    if (yearEl && !yearEl.textContent) {
        yearEl.textContent = new Date().getFullYear();
    }

})();