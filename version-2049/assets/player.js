(function () {
  const video = document.querySelector('[data-video-player]');
  const button = document.querySelector('[data-play-button]');

  if (!video) {
    return;
  }

  const src = video.getAttribute('data-src');
  let ready = false;
  let hls = null;

  function attach() {
    if (ready || !src) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      ready = true;
      return;
    }

    video.src = src;
    ready = true;
  }

  function play() {
    attach();
    video.controls = true;

    if (button) {
      button.classList.add('is-hidden');
    }

    const task = video.play();

    if (task && typeof task.catch === 'function') {
      task.catch(function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    }
  }

  if (button) {
    button.addEventListener('click', play);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener('play', function () {
    if (button) {
      button.classList.add('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
})();
