(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var toggle = qs('.mobile-toggle');
    var panel = qs('.mobile-panel');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = panel.hasAttribute('hidden');
      if (open) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  function initHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    }

    function play() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        play();
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        play();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        play();
      });
    });
    play();
  }

  function initFilters() {
    qsa('.filter-panel').forEach(function (panel) {
      var section = panel.closest('section');
      var input = qs('.filter-keyword', panel);
      var year = qs('.filter-year', panel);
      var genre = qs('.filter-genre', panel);
      var cards = qsa('.movie-card', section);
      var empty = qs('.empty-state', section);

      function apply() {
        var keyword = (input && input.value || '').trim().toLowerCase();
        var selectedYear = year && year.value || '';
        var selectedGenre = genre && genre.value || '';
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-year') || '',
            card.getAttribute('data-genre') || '',
            card.getAttribute('data-region') || ''
          ].join(' ').toLowerCase();
          var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var okYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
          var okGenre = !selectedGenre || (card.getAttribute('data-genre') || '').indexOf(selectedGenre) !== -1;
          var ok = okKeyword && okYear && okGenre;
          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [input, year, genre].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
    });
  }

  function cardHtml(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">' +
      '<a class="poster-link" href="' + movie.url + '" aria-label="观看' + escapeHtml(movie.title) + '">' +
      '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="poster-layer"><span class="play-chip">播放</span></span>' +
      '</a>' +
      '<div class="card-body">' +
      '<div class="meta-row"><a class="category-pill" href="category-' + movie.categorySlug + '.html">' + escapeHtml(movie.category) + '</a><span>' + escapeHtml(movie.year) + '</span></div>' +
      '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p>' + escapeHtml(movie.oneLine) + '</p>' +
      '<div class="tag-row">' + tags + '</div>' +
      '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      })[char];
    });
  }

  function initSearchPage() {
    var results = qs('#search-results');
    if (!results || !window.SEARCH_MOVIES) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim().toLowerCase();
    var title = qs('#search-title');
    var empty = qs('#search-empty');
    var input = qs('.big-search input[name="q"]');
    if (input) {
      input.value = params.get('q') || '';
    }
    var pool = window.SEARCH_MOVIES;
    var list = q ? pool.filter(function (movie) {
      return [movie.title, movie.year, movie.genre, movie.region, movie.category, (movie.tags || []).join(' '), movie.oneLine].join(' ').toLowerCase().indexOf(q) !== -1;
    }) : pool.slice(0, 48);
    list = list.slice(0, 120);
    if (title) {
      title.textContent = q ? '搜索结果' : '推荐影片';
    }
    results.innerHTML = list.map(cardHtml).join('');
    if (empty) {
      empty.hidden = list.length !== 0;
    }
  }

  function initPlayers() {
    qsa('.js-player').forEach(function (shell) {
      var video = qs('video', shell);
      var button = qs('.play-overlay', shell);
      var source = shell.getAttribute('data-src') || '';
      var ready = false;
      var hls = null;

      function bind() {
        if (ready || !video || !source) {
          return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            lowLatencyMode: true,
            backBufferLength: 60
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
        ready = true;
      }

      function start() {
        bind();
        shell.classList.add('is-playing');
        video.controls = true;
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            shell.classList.remove('is-playing');
          });
        }
      }

      if (button) {
        button.addEventListener('click', start);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            start();
          }
        });
      }
      window.addEventListener('pagehide', function () {
        if (hls && hls.destroy) {
          hls.destroy();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHero();
    initFilters();
    initSearchPage();
    initPlayers();
  });
})();
