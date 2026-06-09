(function () {
    const menuButton = document.querySelector('[data-mobile-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero-slider]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let active = 0;
        let timer = null;

        const show = function (index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        };

        const start = function () {
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5000);
        };

        const restart = function () {
            window.clearInterval(timer);
            start();
        };

        prev && prev.addEventListener('click', function () {
            show(active - 1);
            restart();
        });

        next && next.addEventListener('click', function () {
            show(active + 1);
            restart();
        });

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                restart();
            });
        });

        show(0);
        start();
    }

    const filterButtons = Array.from(document.querySelectorAll('[data-sort]'));
    const sortableGrid = document.querySelector('[data-sortable-grid]');

    if (filterButtons.length && sortableGrid) {
        const cards = Array.from(sortableGrid.querySelectorAll('[data-card]'));

        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const mode = button.getAttribute('data-sort');

                filterButtons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });

                const sorted = cards.slice().sort(function (a, b) {
                    if (mode === 'views') {
                        return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
                    }

                    if (mode === 'likes') {
                        return Number(b.dataset.likes || 0) - Number(a.dataset.likes || 0);
                    }

                    if (mode === 'title') {
                        return String(a.dataset.title || '').localeCompare(String(b.dataset.title || ''), 'zh-Hans-CN');
                    }

                    return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
                });

                sorted.forEach(function (card) {
                    sortableGrid.appendChild(card);
                });
            });
        });
    }

    const searchPageInput = document.querySelector('[data-search-input]');
    const searchGrid = document.querySelector('[data-search-grid]');
    const emptyState = document.querySelector('[data-empty-state]');

    if (searchPageInput && searchGrid) {
        const cards = Array.from(searchGrid.querySelectorAll('[data-card]'));
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get('q') || '';

        const applySearch = function (query) {
            const normalized = String(query || '').trim().toLowerCase();
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = String(card.dataset.text || '').toLowerCase();
                const matched = !normalized || haystack.indexOf(normalized) !== -1;
                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        };

        searchPageInput.value = initialQuery;
        applySearch(initialQuery);

        searchPageInput.addEventListener('input', function () {
            applySearch(searchPageInput.value);
        });
    }

    const shareButtons = Array.from(document.querySelectorAll('[data-share-button]'));

    shareButtons.forEach(function (button) {
        button.addEventListener('click', async function () {
            const title = button.getAttribute('data-share-title') || document.title;
            const url = window.location.href;

            if (navigator.share) {
                try {
                    await navigator.share({ title: title, url: url });
                } catch (error) {}
            } else if (navigator.clipboard) {
                try {
                    await navigator.clipboard.writeText(url);
                } catch (error) {}
            }
        });
    });
})();
