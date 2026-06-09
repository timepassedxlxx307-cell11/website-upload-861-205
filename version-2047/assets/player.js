(function () {
  function attachSource(video, url, box) {
    if (box.dataset.ready === 'true') {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      box._hls = hls;
    } else {
      video.src = url;
    }
    box.dataset.ready = 'true';
  }

  function start(box) {
    var video = box.querySelector('video');
    var url = box.getAttribute('data-stream');
    if (!video || !url) {
      return;
    }
    attachSource(video, url, box);
    box.classList.add('is-playing');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  document.querySelectorAll('[data-player]').forEach(function (box) {
    var button = box.querySelector('[data-play-button]');
    var video = box.querySelector('video');
    if (button) {
      button.addEventListener('click', function () {
        start(box);
      });
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start(box);
        }
      });
      video.addEventListener('play', function () {
        box.classList.add('is-playing');
      });
    }
  });
})();
