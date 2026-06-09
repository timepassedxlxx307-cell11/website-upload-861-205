(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileNav() {
    var button = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }

    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero-carousel]');
    if (!hero) {
      return;
    }

    var slides = selectAll('.hero-slide', hero);
    var dots = selectAll('.hero-dot', hero);
    var index = 0;

    function show(next) {
      index = next;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show((index + 1) % slides.length);
      }, 6200);
    }
  }

  function setupLocalFilters() {
    var panel = document.querySelector('[data-local-filter]');
    if (!panel) {
      return;
    }

    var input = panel.querySelector('.filter-input');
    var chips = selectAll('.filter-chip', panel);
    var cards = selectAll('[data-movie-card]');
    var activeType = 'all';

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var type = card.getAttribute('data-type') || '';
        var matchesText = !query || text.indexOf(query) !== -1;
        var matchesType = activeType === 'all' || type.indexOf(activeType) !== -1;
        card.style.display = matchesText && matchesType ? '' : 'none';
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeType = chip.getAttribute('data-filter') || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        apply();
      });
    });
  }

  function cardHtml(item) {
    return [
      '<article class="movie-card">',
      '<a class="poster-link" href="' + item.link + '">',
      '<span class="card-topline"><span class="rating-pill">★ ' + item.rating + '</span><span class="badge">' + item.year + '</span></span>',
      '<img src="' + item.image + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy">',
      '</a>',
      '<div class="movie-card-body">',
      '<h2 class="movie-card-title"><a href="' + item.link + '">' + item.title + '</a></h2>',
      '<div class="movie-card-meta"><span>' + item.region + '</span><span>' + item.type + '</span><span>' + item.genre + '</span></div>',
      '<p class="movie-card-text">' + item.oneLine + '</p>',
      '<a class="card-link" href="' + item.link + '">进入详情</a>',
      '</div>',
      '</article>'
    ].join('');
  }

  function setupSearch() {
    var box = document.querySelector('[data-search-page]');
    if (!box || !window.SEARCH_INDEX) {
      return;
    }

    var input = document.getElementById('globalSearch');
    var region = document.getElementById('regionFilter');
    var type = document.getElementById('typeFilter');
    var results = document.getElementById('searchResults');
    var message = document.getElementById('searchMessage');

    function valueOf(element) {
      return element ? element.value : '';
    }

    function apply() {
      var query = valueOf(input).trim().toLowerCase();
      var regionValue = valueOf(region);
      var typeValue = valueOf(type);
      var matches = window.SEARCH_INDEX.filter(function (item) {
        var text = (item.title + ' ' + item.region + ' ' + item.type + ' ' + item.genre + ' ' + item.tags + ' ' + item.oneLine).toLowerCase();
        var okQuery = !query || text.indexOf(query) !== -1;
        var okRegion = !regionValue || item.region.indexOf(regionValue) !== -1;
        var okType = !typeValue || item.type.indexOf(typeValue) !== -1;
        return okQuery && okRegion && okType;
      }).slice(0, 60);

      if (message) {
        message.textContent = matches.length ? '为你展示匹配度较高的影片' : '没有找到匹配影片，请调整关键词。';
      }

      if (results) {
        results.innerHTML = matches.map(cardHtml).join('');
      }
    }

    [input, region, type].forEach(function (element) {
      if (element) {
        element.addEventListener('input', apply);
        element.addEventListener('change', apply);
      }
    });

    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileNav();
    setupHero();
    setupLocalFilters();
    setupSearch();
  });
}());
