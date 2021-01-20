const audioPlayer = document.getElementById("audio-player");
let pastVolume = 0;
let playerInterval;
let firstPlay = 0;

onload = () => {
  const buttonPlayPause = document.getElementById("play-pause-btn");
  const buttonVolume = document.getElementById("volume-btn");
  const buttonMoreOptions = document.getElementById("more-options-btn");
  const volumeBar = document.getElementById("volume-bar");
  const speedOptions = document.querySelectorAll(".speed-options p");

  buttonPlayPause.addEventListener("click", togglePlayPause);
  buttonVolume.addEventListener("click", toggleMuteUnmute);
  buttonMoreOptions.addEventListener("click", showMoreOptionsPanel);
  volumeBar.addEventListener("input", volumeHandler);

  for (option of speedOptions) {
    option.addEventListener("click", speedHandler);
  }

  audioPlayer.addEventListener("ended", restartPlayer);
};

function changeTime(e) {
  const progressBar = e.target;

  audioPlayer.currentTime = parseInt(progressBar.value);
  currentTime();
}

function setProgressBar() {
  const progressBar = document.getElementById("progress-bar");

  progressBar.setAttribute("min", "0");
  progressBar.setAttribute("max", `${audioPlayer.duration}`);
  progressBar.setAttribute("value", "0");

  progressBar.addEventListener("input", changeTime);
}

function restartPlayer() {
  clearInterval(playerInterval);

  audioPlayer.currentTime = 0;
  currentTime();
  togglePlayPause();
}

function convertTime(durationSeconds) {
  const hour = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = Math.floor((durationSeconds % 3600) % 60);

  const stringHour = hour < 10 ? `0${hour}` : `${hour}`;
  const stringMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const stringSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hour === 0) {
    return `${stringMinutes}:${stringSeconds}`;
  }

  return `${stringHour}:${stringMinutes}:${stringSeconds}`;
}

function totalTime() {
  const totalTime = document.getElementById("totalTime");

  if (!totalTime.textContent) {
    totalTime.textContent = convertTime(audioPlayer.duration);
  }
}

function currentTime() {
  const currentTime = document.getElementById("currentTime");
  const progressBar = document.getElementById("progress-bar");

  progressBar.value = audioPlayer.currentTime;
  currentTime.textContent = convertTime(audioPlayer.currentTime);
}

function clock() {
  currentTime();
}

function speedHandler(e) {
  const speedOption = e.target;
  const activeSpeedOption = document.querySelector(".speed-options .active");

  activeSpeedOption.classList.remove("active");
  speedOption.classList.add("active");

  switch (speedOption.textContent) {
    case "0.25x":
      changeSpeed(0.25);
      break;
    case "0.5x":
      changeSpeed(0.5);
      break;
    case "Normal":
      changeSpeed(1);
      break;
    case "1.5x":
      changeSpeed(1.5);
      break;
    case "2x":
      changeSpeed(2);
      break;
    default:
      console.log("speedHandler error");
      break;
  }
}

function volumeHandler(e) {
  const volumeButton = document.getElementById("volume-btn");
  const volumeButtonTitle = volumeButton.getAttribute("title");

  const volumeBar = e.target;

  if (volumeBar.value == 0 && volumeButtonTitle != "Mudo") {
    toggleMuteUnmute();
  } else if (volumeBar.value > 0 && volumeButtonTitle === "Mudo") {
    toggleMuteUnmute();
  }

  changeVolume(parseInt(volumeBar.value));
}

function showMoreOptionsPanel() {
  const moreOptionsPanel = document.querySelector(".more-options-panel");
  const visibility = moreOptionsPanel.style.visibility;

  if (visibility === "visible") {
    moreOptionsPanel.style.visibility = "hidden";
    moreOptionsPanel.style.opacity = 0;
  } else {
    moreOptionsPanel.style.visibility = "visible";
    moreOptionsPanel.style.opacity = 1;
  }
}

function togglePlayPause() {
  const button = document.getElementById("play-pause-btn");
  const buttonTitle = button.getAttribute("title");

  if (buttonTitle === "Reproduzir") {
    playAudio();

    button.setAttribute("src", "./assets/pause-white-48dp.svg");
    button.setAttribute("alt", "pausar áudio");
    button.setAttribute("title", "Pausar");
  } else if (buttonTitle === "Pausar") {
    pauseAudio();

    button.setAttribute("src", "./assets/play_arrow-white-48dp.svg");
    button.setAttribute("alt", "reproduzir áudio");
    button.setAttribute("title", "Reproduzir");
  } else {
    console.log("Play/Pause title error");
  }
}

function toggleMuteUnmute() {
  const volumeButton = document.getElementById("volume-btn");
  const volumeButtonTitle = volumeButton.getAttribute("title");
  const volumeBar = document.getElementById("volume-bar");

  if (volumeButtonTitle === "Volume") {
    pastVolume = volumeBar.value;
    muteAudio();
    volumeBar.value = 0;

    volumeButton.setAttribute("src", "./assets/volume_off-white-48dp.svg");
    volumeButton.setAttribute("alt", "volume mudo");
    volumeButton.setAttribute("title", "Mudo");
  } else if (volumeButtonTitle === "Mudo") {
    if (volumeBar.value == 0 && pastVolume == 0) {
      changeVolume(100);
      volumeBar.value = 100;
    } else {
      changeVolume(pastVolume);
      volumeBar.value = pastVolume;
    }

    volumeButton.setAttribute("src", "./assets/volume_up-white-48dp.svg");
    volumeButton.setAttribute("alt", "volume");
    volumeButton.setAttribute("title", "Volume");
  } else {
    console.log("Volume/Mute title error");
  }
}

function playAudio() {
  audioPlayer.play();

  if (!firstPlay) {
    setProgressBar();
    totalTime();
    firstPlay = 1;
  }

  clock();
  playerInterval = setInterval(clock, 1000);
}

function pauseAudio() {
  audioPlayer.pause();
  clearInterval(playerInterval);
}

function muteAudio() {
  audioPlayer.volume = 0;
}

function changeVolume(newVolume) {
  audioPlayer.volume = newVolume / 100;
}

function changeSpeed(newSpeed) {
  audioPlayer.playbackRate = newSpeed;
}
