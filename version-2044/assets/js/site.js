
(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMobileMenu() {
    var button = document.querySelector("[data-menu-button]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function initHero() {
    document.querySelectorAll("[data-hero-carousel]").forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
      if (!slides.length) {
        return;
      }
      var current = 0;
      var timer = null;
      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }
      function start() {
        if (timer) {
          clearInterval(timer);
        }
        timer = setInterval(function () {
          show(current + 1);
        }, 5200);
      }
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          start();
        });
      });
      start();
    });
  }

  function normalized(value) {
    return String(value || "").toLowerCase().trim();
  }

  function initSearchAreas() {
    document.querySelectorAll("[data-search-area]").forEach(function (area) {
      var input = area.querySelector("[data-card-search]");
      var cards = Array.prototype.slice.call(area.querySelectorAll("[data-search-card]"));
      var empty = area.querySelector("[data-empty-state]");
      var chips = Array.prototype.slice.call(area.querySelectorAll("[data-filter-chip]"));
      var activeFilter = "";
      function apply() {
        var query = normalized(input ? input.value : "");
        var shown = 0;
        cards.forEach(function (card) {
          var haystack = normalized(card.innerText + " " + card.getAttribute("data-filter-text") + " " + card.getAttribute("data-title"));
          var matchQuery = !query || haystack.indexOf(query) !== -1;
          var matchFilter = !activeFilter || haystack.indexOf(activeFilter) !== -1;
          var visible = matchQuery && matchFilter;
          card.style.display = visible ? "" : "none";
          if (visible) {
            shown += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", shown === 0);
        }
      }
      if (area.hasAttribute("data-page-search") && input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q) {
          input.value = q;
        }
      }
      if (input) {
        input.addEventListener("input", apply);
      }
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chips.forEach(function (item) {
            item.classList.remove("is-active");
          });
          chip.classList.add("is-active");
          activeFilter = normalized(chip.getAttribute("data-filter-chip"));
          apply();
        });
      });
      apply();
    });
  }

  function initPlayer(rootId, streamUrl) {
    var root = document.getElementById(rootId);
    if (!root) {
      return;
    }
    var video = root.querySelector("video");
    var cover = root.querySelector(".player-cover");
    var attached = false;
    var hls = null;
    function playVideo() {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }
    function attach() {
      if (!video || !streamUrl) {
        return;
      }
      root.classList.add("is-playing");
      if (!attached) {
        attached = true;
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            playVideo();
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              hls.destroy();
              hls = null;
              video.src = streamUrl;
              playVideo();
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
          video.addEventListener("loadedmetadata", playVideo, { once: true });
        } else {
          video.src = streamUrl;
          playVideo();
        }
      } else {
        playVideo();
      }
    }
    if (cover) {
      cover.addEventListener("click", attach);
    }
    video.addEventListener("click", function () {
      if (!attached) {
        attach();
      }
    });
  }

  ready(function () {
    initMobileMenu();
    initHero();
    initSearchAreas();
  });

  window.MovieSite = {
    initPlayer: initPlayer
  };
})();
