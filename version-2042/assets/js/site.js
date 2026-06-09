(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === activeIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5600);
  }

  var filterRoot = document.querySelector('[data-filter-root]');
  if (filterRoot) {
    var input = filterRoot.querySelector('[data-filter-input]');
    var region = filterRoot.querySelector('[data-filter-region]');
    var type = filterRoot.querySelector('[data-filter-type]');
    var year = filterRoot.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-card]'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function matches(card) {
      var query = normalize(input ? input.value : '');
      var regionValue = region ? region.value : '';
      var typeValue = type ? type.value : '';
      var yearValue = year ? year.value : '';
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre')
      ].join(' '));

      if (query && text.indexOf(query) === -1) {
        return false;
      }
      if (regionValue && card.getAttribute('data-region') !== regionValue) {
        return false;
      }
      if (typeValue && card.getAttribute('data-type') !== typeValue) {
        return false;
      }
      if (yearValue && card.getAttribute('data-year') !== yearValue) {
        return false;
      }
      return true;
    }

    function applyFilter() {
      cards.forEach(function (card) {
        card.classList.toggle('hidden-card', !matches(card));
      });
    }

    [input, region, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }
})();
