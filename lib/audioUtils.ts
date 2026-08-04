/**
 * Audio Utility Module using HTMLAudioElement (new Audio())
 * Loads external audio files /audio/shutter.mp3 and /audio/bgm.mp3 with deferred loading.
 */

let shutterAudio: HTMLAudioElement | null = null;
let bgmAudio: HTMLAudioElement | null = null;

/**
 * Initialize or get the shutter audio element (deferred)
 */
const getShutterAudio = (): HTMLAudioElement | null => {
  if (typeof window === "undefined") return null;
  if (!shutterAudio) {
    try {
      shutterAudio = new Audio("/audio/shutter.mp3");
      shutterAudio.preload = "none";
      shutterAudio.volume = 0.8;
      shutterAudio.onerror = () => {
        console.warn("Shutter audio file /audio/shutter.mp3 not found or could not be loaded.");
      };
    } catch (err) {
      console.warn("Failed to create shutter HTMLAudioElement:", err);
    }
  }
  return shutterAudio;
};

/**
 * Initialize or get the background music audio element (deferred, no initial preload)
 */
const getBgmAudio = (): HTMLAudioElement | null => {
  if (typeof window === "undefined") return null;
  if (!bgmAudio) {
    try {
      bgmAudio = new Audio("/audio/bgm.mp3");
      bgmAudio.loop = true;
      bgmAudio.preload = "none";
      bgmAudio.volume = 0.4;
      bgmAudio.onerror = () => {
        console.warn("BGM audio file /audio/bgm.mp3 not found or could not be loaded.");
      };
    } catch (err) {
      console.warn("Failed to create BGM HTMLAudioElement:", err);
    }
  }
  return bgmAudio;
};

/**
 * Plays the camera shutter sound effect safely
 */
export const playShutterSound = (): void => {
  try {
    const audio = getShutterAudio();
    if (audio) {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Shutter sound play blocked or file missing:", err.message);
        });
      }
    }
  } catch (err) {
    console.warn("Shutter sound execution error:", err);
  }
};

/**
 * Starts or stops the background music track safely based on play/mute state
 */
export const setBgmState = (shouldPlay: boolean): void => {
  try {
    if (!shouldPlay && !bgmAudio) return;
    const audio = getBgmAudio();
    if (!audio) return;

    if (shouldPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("BGM play blocked by autoplay policy or missing /audio/bgm.mp3:", err.message);
        });
      }
    } else {
      audio.pause();
    }
  } catch (err) {
    console.warn("BGM state change error:", err);
  }
};

/**
 * Stops background music completely
 */
export const stopBgm = (): void => {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
};
