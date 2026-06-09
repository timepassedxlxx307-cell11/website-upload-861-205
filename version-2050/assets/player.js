(function () {
  function showError(box, text) {
    if (!box) {
      return;
    }
    box.textContent = text;
    box.classList.add('is-visible');
  }

  function setupMoviePlayer(config) {
    var video = document.getElementById(config.videoId);
    var overlay = document.getElementById(config.overlayId);
    var errorBox = document.getElementById(config.errorId);
    var loaded = false;
    var hls = null;

    if (!video || !config.src) {
      return;
    }

    function loadStream() {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = config.src;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(config.src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (data && data.fatal) {
            showError(errorBox, '播放暂时不可用，请稍后重试。');
          }
        });
        return;
      }

      video.src = config.src;
    }

    function startPlayback() {
      loadStream();
      video.controls = true;
      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (!video.ended && overlay) {
        overlay.classList.remove('is-hidden');
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
}());
