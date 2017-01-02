/* get the elements */
const player = document.querySelector('video');
const controls = document.querySelector('.player__controls');
const toggle = document.querySelector('button.player__button.toggle');

const progressBar = document.querySelector('.progress__filled');
const progressSlider = document.querySelector('.progress');

const ranges = document.querySelectorAll('.player__slider');
const skipButtons = document.querySelectorAll('[data-skip]');

let mouseActive = false;

/* Build out the functions */

// stop/play the video
function togglePlay(video) {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

// update play button icon based on video play state
function updatePlayButton(video, button) {
  const icon = video.paused ? '►' : '❚ ❚';
  button.textContent = icon;
}

// update progress bar based on current video state
function handleProgress(video, bar) {
  const percent = (video.currentTime / video.duration) * 100;
  bar.style.flexBasis = `${percent}%`;
}

// update video based on progress bar scrubbing
function scrub(e, video, range) {
  if (mouseActive) {
    const scrubTime = (e.offsetX / range.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
  }
}

// slide volume or playback speed
function handleRangeUpdate(slider, video) {
  if (mouseActive) {
    video[slider.name] = slider.value;
  }
}

// skip back or forward on the video
function skip(video) {
  video.currentTime += parseFloat(this.dataset.skip);
}

/* hook up event listeners */
player.addEventListener('click', togglePlay.bind(null, player));
toggle.addEventListener('click', togglePlay.bind(null, player));
player.addEventListener('play', updatePlayButton.bind(null, player, toggle));
player.addEventListener('pause', updatePlayButton.bind(null, player, toggle));

// can also use event called 'progress'
player.addEventListener('timeupdate', handleProgress.bind(null, player, progressBar));
progressSlider.addEventListener('click', (e) => {
  mouseActive = true;
  scrub(e, player, progressSlider);
});
progressSlider.addEventListener('mousemove', (e) => {
  scrub(e, player, progressSlider);
});
progressSlider.addEventListener('mousedown', () => mouseActive = true);
progressSlider.addEventListener('mouseup', () => mouseActive = false);
progressSlider.addEventListener('mouseout', () => mouseActive = false);

ranges.forEach(range => range.addEventListener('change', () => {
  mouseActive = true;
  handleRangeUpdate.bind(range, player);
}));
ranges.forEach(range => range.addEventListener('mousedown', () => mouseActive = true));
ranges.forEach(range => range.addEventListener('click', () => {
  mouseActive = true;
  handleRangeUpdate.call(null, range, player);
}));
ranges.forEach(range => range.addEventListener('mouseup', () => mouseActive = false));
ranges.forEach(range => range.addEventListener('mouseout', () => mouseActive = false));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate.bind(null, range, player)));

skipButtons.forEach(button => button.addEventListener('click', skip.bind(button, player)));
