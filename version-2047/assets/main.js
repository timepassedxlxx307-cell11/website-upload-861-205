(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (navButton && mobileNav) {
    navButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      var target = form.getAttribute('action') || './search.html';
      window.location.href = value ? target + '?q=' + encodeURIComponent(value) : target;
    });
  });

  var filterInput = document.querySelector('[data-filter-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.js-filter-card'));
  function applyFilter(value) {
    var query = (value || '').trim().toLowerCase();
    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search-text') || '').toLowerCase();
      card.style.display = !query || text.indexOf(query) !== -1 ? '' : 'none';
    });
  }
  if (filterInput && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (initial) {
      filterInput.value = initial;
      applyFilter(initial);
    }
    filterInput.addEventListener('input', function () {
      applyFilter(filterInput.value);
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    function show(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-back-top]').forEach(function (button) {
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})();
