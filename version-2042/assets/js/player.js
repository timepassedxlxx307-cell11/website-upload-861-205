(function () {
  var Hls = window.Hls;
  var shell = document.querySelector('[data-player-shell]');
  var video = document.querySelector('[data-player-video]');
  var button = document.querySelector('[data-play-button]');

  if (!shell || !video || !button) {
    return;
  }

  var started = false;
  var source = '';
  var sourceNode = video.querySelector('source');

  if (sourceNode) {
    source = sourceNode.getAttribute('src') || '';
  }

  function attachPlayer() {
    if (!source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', source);
      }
      return;
    }

    if (Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    }
  }

  function playVideo() {
    if (!started) {
      attachPlayer();
      started = true;
    }
    shell.classList.add('playing');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  button.addEventListener('click', playVideo);
  shell.addEventListener('click', function (event) {
    if (event.target === video) {
      playVideo();
    }
  });
  video.addEventListener('play', function () {
    shell.classList.add('playing');
  });
})();
