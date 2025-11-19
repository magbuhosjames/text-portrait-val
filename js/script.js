/****************************************
 *           LYRICS SETUP
 ****************************************/
const lyricsData = [
    { time: "001", text: "mamamatay" },
    { time: "002", text: "akong" },
    { time: "003", text: "nakangiti" },
    { time: "004", text: "kapag ikaw" },
    { time: "006", text: "ang nasa" },
    { time: "007", text: "aking tabi" },
    { time: "008", text: "mabubuhay" },
    { time: "010", text: "akong"},
    { time: "011", text: "nagsisisi" },
    { time: "012", text: "kapag isang" },
    { time: "014", text: "araw hindi"},
    { time: "015", text: "kita mapangiti" },
    { time: "017", text: "kalapastangan" },
    { time: "019", text: "ang 'di"},
    { time: "020", text: "ka ibigin" },
    { time: "021", text: "kalokohan" },
    { time: "023", text: "ang 'di"},
    { time: "025", text: "ka isipin" },
    { time: "026", text: "kung ang mundo" },
    { time: "028", text: "ay biglang"},
    { time: "029", text: "gugunawin" },
    { time: "030", text: "ikaw" },
    { time: "031", text: "ang una kong"},
    { time: "032.5", text: "hahanapin" }
];

const audio = document.getElementById('audio');
const startButton = document.getElementById('startButton');
const lyricsDiv = document.getElementById('lyricsContainer');
const balloonContainer = document.getElementById('balloonsContainer');

let currentLyricIndex = 0;
let currentGroupCount = 0;
let pendingLyric = null;
let isFadingOut = false;

/****************************************
 *       SPAWN & SPEED CONTROLS
 ****************************************/
let spawnInterval = 2000;
// let balloonIntervalId = null;
let currentFloatDuration = 8.0;

/****************************************
 *           EVENT LISTENERS
 ****************************************/
startButton.addEventListener('click', () => {
    currentLyricIndex = 0;
    lyricsDiv.innerHTML = "";
    currentGroupCount = 0;
    pendingLyric = null;
    isFadingOut = false;

    // Audio starts at the beginning now
    audio.play().catch(error => {
        console.error("Audio playback failed:", error);
    });

    if (balloonIntervalId) clearInterval(balloonIntervalId);
    balloonIntervalId = setInterval(createBalloon, spawnInterval);
});

audio.addEventListener('timeupdate', () => {
    if (currentLyricIndex < lyricsData.length) {
        const nextLyric = lyricsData[currentLyricIndex];
        if (audio.currentTime >= nextLyric.time) {
            processLyric(nextLyric);
        }
    }
    // adjustBalloonSpeed(audio.currentTime);
});

/****************************************
 *   PROCESS LYRIC WITH GROUPING
 ****************************************/
function processLyric(lyricObj) {
    if (currentGroupCount < 3) {
        appendLyric(lyricObj);
        currentGroupCount++;
        currentLyricIndex++;
    } else {
        if (!isFadingOut) {
            pendingLyric = lyricObj;
            isFadingOut = true;
            fadeOutCurrentGroup(() => {
                lyricsDiv.innerHTML = "";
                currentGroupCount = 0;
                isFadingOut = false;
                if (pendingLyric) {
                    appendLyric(pendingLyric);
                    currentGroupCount++;
                    pendingLyric = null;
                    currentLyricIndex++;
                }
            });
        }
    }
}

/****************************************
 *   APPEND LYRIC (Fade or Typing Effect)
 ****************************************/
function appendLyric(lyricObj) {
    if (lyricObj.time >= 354) {
        typeLyric(lyricObj.text);
    } else {
        displayFadeLyric(lyricObj.text);
    }
}

/****************************************
 *   FADE OUT CURRENT GROUP
 ****************************************/
function fadeOutCurrentGroup(callback) {
    const children = Array.from(lyricsDiv.children);
    children.forEach(child => child.classList.add('fade-out'));
    setTimeout(callback, 800);
}

/****************************************
 *   LYRICS DISPLAY (Fade Effect)
 ****************************************/
function displayFadeLyric(text) {
    const newEl = document.createElement('div');
    newEl.className = 'lyric-line';
    newEl.innerHTML = text.split('\n').join('<br>');
    newEl.style.animation = 'fadeIn 0.8s ease forwards';
    lyricsDiv.appendChild(newEl);
}

/****************************************
 *   LYRICS DISPLAY WITH TYPING EFFECT
 ****************************************/
function typeLyric(text) {
    const newEl = document.createElement('div');
    newEl.className = 'lyric-line';
    lyricsDiv.appendChild(newEl);

    let i = 0;
    function typeNext() {
        if (i < text.length) {
            const char = text[i];
            newEl.innerHTML += (char === "\n") ? "<br>" : char;
            i++;
            setTimeout(typeNext, 50);
        } else {
            newEl.style.animation = 'fadeIn 0.8s ease forwards';
        }
    }
    typeNext();
}

// /****************************************
//  *         BALLOON CREATION
//  ****************************************/
// function createBalloon() {
//     const balloonWrapper = document.createElement('div');
//     balloonWrapper.className = 'balloon';
//     balloonWrapper.style.animationDuration = currentFloatDuration + 's';

//     const balloonShape = document.createElement('div');
//     balloonShape.className = 'balloon-shape';

//     const balloonString = document.createElement('div');
//     balloonString.className = 'balloon-string';

//     const randomHue = Math.floor(Math.random() * 360);
//     const randomSaturation = 80 + Math.floor(Math.random() * 20);
//     const randomLightness = 40 + Math.floor(Math.random() * 20);
//     const balloonColor = `hsl(${randomHue}, ${randomSaturation}%, ${randomLightness}%)`;

//     balloonWrapper.dataset.color = balloonColor;
//     balloonShape.style.background =
//         `radial-gradient(circle at 30% 30%, #fff, ${balloonColor})`;
//     balloonWrapper.style.left = Math.floor(Math.random() * 90) + '%';

//     balloonWrapper.appendChild(balloonShape);
//     balloonWrapper.appendChild(balloonString);
//     balloonContainer.appendChild(balloonWrapper);

//     const popTime = Math.random() * 2000 + 1000;
//     const autoPopTimer = setTimeout(() => popBalloon(balloonWrapper), popTime);

//     balloonShape.addEventListener('click', () => {
//         clearTimeout(autoPopTimer);
//         popBalloon(balloonWrapper);
//     });
// }

// /****************************************
//  *         BALLOON POP
//  ****************************************/
// function popBalloon(balloonWrapper) {
//     if (!balloonWrapper.parentNode) return;
//     const rect = balloonWrapper.getBoundingClientRect();
//     const x = rect.left + rect.width / 2;
//     const y = rect.top + rect.height / 2;
//     balloonWrapper.remove();

//     const splash = document.createElement('div');
//     splash.className = 'splash';
//     splash.style.left = x + 'px';
//     splash.style.top = y + 'px';

//     const color = balloonWrapper.dataset.color || '#00f';
//     splash.style.background = `radial-gradient(circle, ${color} 20%, transparent 70%)`;
//     const randomAngle = Math.floor(Math.random() * 360);
//     splash.style.transform = `translate(-50%, -50%) rotate(${randomAngle}deg)`;

//     balloonContainer.appendChild(splash);
//     splash.addEventListener('animationend', () => splash.remove());

//     triggerConfetti(x, y);
// }

// /****************************************
//  *       DYNAMIC SPEED ADJUSTMENT
//  ****************************************/
// function adjustBalloonSpeed(currentTime) {
//     const startTime = 341;
//     const endTime = 345;
//     if (currentTime < startTime) {
//         currentFloatDuration = 8.0;
//         return;
//     }
//     if (currentTime > endTime) {
//         currentFloatDuration = 4.0;
//         return;
//     }
//     const progress = (currentTime - startTime) / (endTime - startTime);
//     currentFloatDuration = 8.0 - 4.0 * progress;
// }

// /****************************************
//  *         CONFETTI EFFECT
//  ****************************************/
// function triggerConfetti(x, y) {
//     for (let i = 0; i < 20; i++) {
//         const confetti = document.createElement('div');
//         confetti.className = 'confetti';
//         const hue = Math.floor(Math.random() * 360);
//         confetti.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
//         confetti.style.left = (x + (Math.random() * 50 - 25)) + 'px';
//         confetti.style.top = (y + (Math.random() * 50 - 25)) + 'px';
//         confetti.style.animationDelay = Math.random() * 0.5 + 's';
//         balloonContainer.appendChild(confetti);
//         confetti.addEventListener('animationend', () => confetti.remove());
//     }
// }
