(function () {
  function init(options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var source = options.source;
    var ready = false;
    var hls = null;
    if (!video || !overlay || !source) {
      return;
    }

    function attachSource() {
      if (ready) {
        return;
      }
      ready = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function start(event) {
      if (event) {
        event.preventDefault();
      }
      attachSource();
      overlay.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          overlay.classList.remove("is-hidden");
        });
      }
    }

    overlay.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", function () {
      overlay.classList.add("is-hidden");
    });
  }

  window.JMoviePlayer = {
    init: init
  };
})();
