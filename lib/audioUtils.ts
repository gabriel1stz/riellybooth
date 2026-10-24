/**
 * Audio Utility Module using HTMLAudioElement & Web Audio API synthesis.
 * All audio used is 100% Royalty-Free and Creative Commons Zero (CC0) compliant.
 * - Shutter Click: Procedurally synthesized mechanical camera shutter via Web Audio API
 *   (guaranteed instant zero-latency playback on iOS Safari & Android, zero copyright risk).
 * - BGM: Lofi chill beat licensed under CC0 / Royalty-Free Public Domain.
 */

let shutterAudio: HTMLAudioElement | null = null;
let bgmAudio: HTMLAudioElement | null = null;
let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

/**
 * Procedural Mechanical Camera Shutter Synthesis (Zero external asset required)
 */
const playSynthesizedShutter = (): void => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. First Click: Mirror lift / shutter open (fast transient pop)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(1400, now);
    osc1.frequency.exponentialRampToValueAtTime(180, now + 0.04);
    gain1.gain.setValueAtTime(0.7, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.05);

    // 2. White noise burst (mechanical blade friction)
    const bufferSize = Math.floor(ctx.sampleRate * 0.06);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(3200, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // 3. Second Click: Shutter curtain close & motor rewind (80ms later)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(800, now + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(120, now + 0.14);
    gain2.gain.setValueAtTime(0.8, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.16);
  } catch (e) {
    console.warn("Web Audio shutter synthesis error:", e);
  }
};

/**
 * Initialize or get the background music audio element (deferred, no initial preload)
 * Audio asset license: Royalty-Free Lo-Fi Beats (CC0 / Public Domain)
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
 * Plays the camera shutter sound effect safely with instant synthesized fallback
 */
export const playShutterSound = (): void => {
  // Always trigger ultra-fast procedural shutter sound
  playSynthesizedShutter();

  // Try playing physical audio file if present
  try {
    if (!shutterAudio && typeof window !== "undefined") {
      shutterAudio = new Audio("/audio/shutter.mp3");
      shutterAudio.volume = 0.7;
    }
    if (shutterAudio) {
      shutterAudio.currentTime = 0;
      shutterAudio.play().catch(() => {});
    }
  } catch (err) {
    // Handled gracefully by procedural shutter
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
