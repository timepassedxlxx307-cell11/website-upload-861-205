(function () {
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      if (slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        showSlide(dotIndex);
        start();
      });
    });

    showSlide(0);
    start();
  });

  document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
    var input = scope.querySelector('[data-search-input]');
    var region = scope.querySelector('[data-filter-region]');
    var type = scope.querySelector('[data-filter-type]');
    var category = scope.querySelector('[data-filter-category]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var empty = scope.querySelector('[data-empty-state]');

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : '';
    }

    function applyFilters() {
      var q = valueOf(input);
      var selectedRegion = valueOf(region);
      var selectedType = valueOf(type);
      var selectedCategory = valueOf(category);
      var visible = 0;

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
        var matchSearch = !q || text.indexOf(q) !== -1;
        var matchRegion = !selectedRegion || (card.getAttribute('data-region') || '').toLowerCase() === selectedRegion;
        var matchType = !selectedType || (card.getAttribute('data-type') || '').toLowerCase() === selectedType;
        var matchCategory = !selectedCategory || (card.getAttribute('data-category') || '').toLowerCase() === selectedCategory;
        var ok = matchSearch && matchRegion && matchType && matchCategory;
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    [input, region, type, category].forEach(function (element) {
      if (element) {
        element.addEventListener('input', applyFilters);
        element.addEventListener('change', applyFilters);
      }
    });

    if (input) {
      var initialQuery = new URLSearchParams(window.location.search).get('q');
      if (initialQuery) {
        input.value = initialQuery;
      }
    }

    applyFilters();
  });

  document.querySelectorAll('.player-panel').forEach(function (panel) {
    var video = panel.querySelector('video');
    var trigger = panel.querySelector('.play-trigger');

    function startVideo() {
      if (!video) {
        return;
      }

      var src = video.getAttribute('data-video');
      if (!src) {
        return;
      }

      function playNow() {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      if (trigger) {
        trigger.classList.add('is-hidden');
      }

      if (video.getAttribute('data-ready') === '1') {
        playNow();
        return;
      }

      video.setAttribute('data-ready', '1');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        playNow();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playNow();
        });
        return;
      }

      video.src = src;
      playNow();
    }

    if (trigger) {
      trigger.addEventListener('click', startVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startVideo();
        }
      });
    }
  });
})();
