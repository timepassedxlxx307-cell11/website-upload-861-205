(function () {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let currentSlide = 0;
  let heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  function startHero() {
    if (slides.length <= 1) {
      return;
    }

    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      startHero();
    });
  });

  startHero();

  function setupFilters(scope) {
    const input = scope.querySelector('[data-filter-input]');
    const yearSelect = scope.querySelector('[data-filter-year]');
    const typeSelect = scope.querySelector('[data-filter-type]');
    const grid = scope.querySelector('[data-filter-grid]') || document.querySelector('[data-filter-grid]');

    if (!grid) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll('[data-movie-card]'));

    function apply() {
      const query = input ? input.value.trim().toLowerCase() : '';
      const year = yearSelect ? yearSelect.value : '';
      const type = typeSelect ? typeSelect.value : '';

      cards.forEach(function (card) {
        const matchesQuery = !query || (card.dataset.search || '').toLowerCase().includes(query);
        const matchesYear = !year || card.dataset.year === year;
        const matchesType = !type || card.dataset.type === type;
        card.classList.toggle('is-hidden', !(matchesQuery && matchesYear && matchesType));
      });
    }

    [input, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
  }

  document.querySelectorAll('[data-filter-scope]').forEach(setupFilters);
})();
