(function () {
  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function filterScope(scope, query) {
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-card]"));
    var empty = scope.querySelector("[data-empty-state]");
    var needle = normalize(query);
    var visible = 0;
    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-info"));
      var matched = !needle || haystack.indexOf(needle) !== -1;
      card.style.display = matched ? "" : "none";
      if (matched) {
        visible += 1;
      }
    });
    if (empty) {
      empty.classList.toggle("is-visible", visible === 0);
    }
  }

  function initFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      if (!input) {
        return;
      }
      var params = new URLSearchParams(window.location.search);
      var queryInput = scope.querySelector("[data-query-input]");
      var query = params.get("q") || "";
      if (queryInput && query) {
        input.value = query;
      }
      filterScope(scope, input.value);
      input.addEventListener("input", function () {
        filterScope(scope, input.value);
      });
      Array.prototype.slice.call(scope.querySelectorAll("[data-filter-token]")).forEach(function (button) {
        button.addEventListener("click", function () {
          input.value = button.getAttribute("data-filter-token") || "";
          filterScope(scope, input.value);
          input.focus();
        });
      });
    });
  }

  function initSearchForms() {
    Array.prototype.slice.call(document.querySelectorAll("[data-search-form]")).forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
          window.location.href = "./search.html";
        }
      });
    });
  }

  function initCarousel() {
    var carousel = document.querySelector("[data-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle("is-active", itemIndex === index);
      });
      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle("is-active", itemIndex === index);
      });
    }
    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, itemIndex) {
      dot.addEventListener("click", function () {
        show(itemIndex);
        start();
      });
    });
    show(0);
    start();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initSearchForms();
    initFilters();
    initCarousel();
  });
})();
