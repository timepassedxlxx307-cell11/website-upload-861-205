(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-video-src]'));
        players.forEach(function (shell) {
            var video = shell.querySelector('video');
            var button = shell.querySelector('[data-play-button]');
            var source = shell.getAttribute('data-video-src');
            var initialized = false;
            var hlsInstance = null;

            function attachSource() {
                if (!video || !source || initialized) {
                    return;
                }
                initialized = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: false,
                        backBufferLength: 90
                    });
                    hlsInstance.loadSource(source);
                    hlsInstance.attachMedia(video);
                } else {
                    video.src = source;
                }
                shell.dataset.hlsReady = 'true';
            }

            function playVideo(event) {
                if (event) {
                    event.preventDefault();
                }
                attachSource();
                if (video) {
                    var playPromise = video.play();
                    if (playPromise && typeof playPromise.catch === 'function') {
                        playPromise.catch(function () {});
                    }
                }
            }

            if (button) {
                button.addEventListener('click', playVideo);
            }
            shell.addEventListener('click', function (event) {
                if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'video') {
                    attachSource();
                    return;
                }
                playVideo(event);
            });
            if (video) {
                video.addEventListener('play', function () {
                    shell.classList.add('is-playing');
                });
                video.addEventListener('pause', function () {
                    if (video.currentTime === 0 || video.ended) {
                        shell.classList.remove('is-playing');
                    }
                });
                video.addEventListener('ended', function () {
                    shell.classList.remove('is-playing');
                    if (hlsInstance && typeof hlsInstance.stopLoad === 'function') {
                        hlsInstance.stopLoad();
                    }
                });
            }
        });
    });
})();
