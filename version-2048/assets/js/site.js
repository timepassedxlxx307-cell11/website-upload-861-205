(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    ready(function () {
        var menuButton = document.querySelector('[data-menu-button]');
        var mobilePanel = document.querySelector('[data-mobile-panel]');
        if (menuButton && mobilePanel) {
            menuButton.addEventListener('click', function () {
                mobilePanel.classList.toggle('is-open');
            });
        }

        var backTop = document.querySelector('[data-back-top]');
        if (backTop) {
            backTop.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        var prev = document.querySelector('[data-hero-prev]');
        var next = document.querySelector('[data-hero-next]');
        var activeIndex = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === activeIndex);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === activeIndex);
            });
        }

        function startHero() {
            if (timer) {
                window.clearInterval(timer);
            }
            if (slides.length > 1) {
                timer = window.setInterval(function () {
                    showSlide(activeIndex + 1);
                }, 5200);
            }
        }

        if (slides.length) {
            showSlide(0);
            startHero();
            if (prev) {
                prev.addEventListener('click', function () {
                    showSlide(activeIndex - 1);
                    startHero();
                });
            }
            if (next) {
                next.addEventListener('click', function () {
                    showSlide(activeIndex + 1);
                    startHero();
                });
            }
            dots.forEach(function (dot, index) {
                dot.addEventListener('click', function () {
                    showSlide(index);
                    startHero();
                });
            });
        }

        var filterPanel = document.querySelector('[data-filter-panel]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var noResults = document.querySelector('[data-no-results]');

        function applyFilters() {
            if (!filterPanel || !cards.length) {
                return;
            }
            var keywordInput = filterPanel.querySelector('[data-filter-keyword]');
            var regionSelect = filterPanel.querySelector('[data-filter-region]');
            var typeSelect = filterPanel.querySelector('[data-filter-type]');
            var genreSelect = filterPanel.querySelector('[data-filter-genre]');
            var keyword = normalize(keywordInput && keywordInput.value);
            var region = normalize(regionSelect && regionSelect.value);
            var type = normalize(typeSelect && typeSelect.value);
            var genre = normalize(genreSelect && genreSelect.value);
            var visibleCount = 0;

            cards.forEach(function (card) {
                var text = normalize(card.textContent + ' ' + card.dataset.title + ' ' + card.dataset.genre + ' ' + card.dataset.region + ' ' + card.dataset.type + ' ' + card.dataset.year);
                var ok = true;
                if (keyword && text.indexOf(keyword) === -1) {
                    ok = false;
                }
                if (region && normalize(card.dataset.region).indexOf(region) === -1) {
                    ok = false;
                }
                if (type && normalize(card.dataset.type).indexOf(type) === -1) {
                    ok = false;
                }
                if (genre && normalize(card.dataset.genre).indexOf(genre) === -1 && text.indexOf(genre) === -1) {
                    ok = false;
                }
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visibleCount += 1;
                }
            });

            if (noResults) {
                noResults.classList.toggle('is-visible', visibleCount === 0);
            }
        }

        if (filterPanel) {
            filterPanel.addEventListener('input', applyFilters);
            filterPanel.addEventListener('change', applyFilters);
            var reset = filterPanel.querySelector('[data-filter-reset]');
            if (reset) {
                reset.addEventListener('click', function () {
                    Array.prototype.slice.call(filterPanel.querySelectorAll('input, select')).forEach(function (field) {
                        field.value = '';
                    });
                    applyFilters();
                });
            }
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            var qInput = filterPanel.querySelector('[data-filter-keyword]');
            if (q && qInput) {
                qInput.value = q;
            }
            applyFilters();
        }
    });
})();
