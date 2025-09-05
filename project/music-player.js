const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const playingSong = document.getElementById("player-song-title");
const songArtist = document.getElementById("player-song-artist");

const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
  },
  {
    id: 3,
    title: "Seasons (feat. Harley Bird)",
    artist: "Rival, Cadmium, Harley Bird",
    duration: "4:08",
    src: "../assets/audio/Rival, Cadmium, Harley Bird - Seasons (feat. Harley Bird) [NCS Release].mp3",
  },
  {
    id: 4,
    title: "Send It",
    artist: "Austin Mahone",
    duration: "2:45",
    src: "../assets/audio/Send-it-Nightcore-Austin-Mahome-ft-Rich-Homie-Quan-ft-P-L-Nightcore.mp3",
  },
  {
    id: 5,
    title: "The River",
    artist: "Axel Johansson",
    duration: "3:32",
    src: "../assets/audio/The-River-Axel-Johansson.mp3",
  },
];

const audio = new Audio();

let userData = {
  songs: allSongs,
  currentSong: null,
  songCurrentTime: 0,
};

const LoadUserData = () => {
  let dataLoaded = "";
  for (let indexSong = 0; indexSong < userData.songs.length; indexSong++) {
    dataLoaded += `<li id="song-${userData.songs[indexSong].id}" class="playlist-song">
         <button class="playlist-song-info" >
             <span class="playlist-song-title">${userData.songs[indexSong].title}</span>
             <span class="playlist-song-artist">${userData.songs[indexSong].artist}</span>
             <span class="playlist-song-duration">${userData.songs[indexSong].duration}</span>
         </button>
     </li>`;
  }
  return dataLoaded;
};
playlistSongs.innerHTML = "";
playlistSongs.innerHTML = LoadUserData();

function playSong(idSong, start = true) {
  let song = userData.songs.find((value) => value.id === idSong);
  audio.src = song.src;
  audio.title = song.title;
  if (userData.currentSong === null || start) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData.songCurrentTime;
  }
  playButton.classList.add("playing");
  userData.currentSong = song;
  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();
}

function pauseSong() {
  userData.songCurrentTime = audio.currentTime;
  playButton.classList.remove("playing");
  audio.pause();
}

function getCurrentSongIndex() {
  return userData.songs.indexOf(userData.currentSong);
}

function getNextSong() {
  return userData.songs[getCurrentSongIndex() + 1];
}

function playNextSong() {
  // if (userData.currentSong === null) {
  //   playSong(userData.songs[0].id);
  //   return;
  // }
  let nextSong = getNextSong();
  if (!nextSong) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong();
    highlightCurrentSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
    //playSong(userData.songs[0].id);
  } else {
    playSong(nextSong.id);
  }
}

function getPreviousSong() {
  return userData.songs[getCurrentSongIndex() - 1];
}

function playPreviousSong() {
  if (userData.currentSong == null) {
    return;
  }
  let previousSong = getPreviousSong();
  if (!previousSong) {
    playSong(userData.songs[0].id);
  } else {
    playSong(previousSong.id);
  }
}

function highlightCurrentSong() {
  let previousCurrentSong = document.querySelector(
    ".playlist-song[aria-current='true']"
  );
  previousCurrentSong?.removeAttribute("aria-current");
  let songToHighlight = document.getElementById(
    `song-${userData.currentSong?.id}`
  );
  songToHighlight?.setAttribute("aria-current", "true");
}

function setPlayerDisplay() {
  if (userData.currentSong === null) {
    playingSong.textContent = "";
    songArtist.textContent = "";
  } else {
    playingSong.textContent = userData.currentSong.title;
    songArtist.textContent = userData.currentSong.artist;
  }
}

function setPlayButtonAccessibleText() {
  return userData.currentSong === null
    ? playButton.setAttribute("aria-label", `Play`)
    : playButton.setAttribute(
        "aria-label",
        `Play ${userData.currentSong.title}`
      );
}

playButton.addEventListener("click", () => {
  if (userData.currentSong == null) {
    playSong(userData.songs[0].id);
  } else {
    playSong(userData.currentSong.id, false);
  }
});

let songs = document.querySelectorAll(".playlist-song");
songs.forEach((song) => {
  let id = song.id.replace("song-", "");
  song.querySelector("button").addEventListener("click", () => {
    console.log(typeof id);
    playSong(Number(id));
  });
});

pauseButton.addEventListener("click", pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

audio.addEventListener("ended", playNextSong);
