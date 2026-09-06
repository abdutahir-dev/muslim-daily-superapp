/**
 * Web Audio API synthesizer and audio clips for Adhan, Tasbih haptics, and prayer alerts.
 */

// Soft tactile click for Tasbih
export function playTasbihHapticSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);

    // Vibration on supported mobile devices
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
  } catch {
    // AudioContext blocked or unsupported
  }
}

// Chime for completing a Tasbih cycle (33 or 100)
export function playCompletionChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + idx * 0.09;
      const duration = 0.25;

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    });

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([30, 50, 60]);
    }
  } catch {}
}

// Adhan audio clips from reliable high-availability Islamic audio sources
export const ADHAN_AUDIO_SOURCES = {
  makkah: "https://www.islamcan.com/audio/adhan/azan1.mp3",
  madinah: "https://www.islamcan.com/audio/adhan/azan2.mp3",
  alafasy: "https://www.islamcan.com/audio/adhan/azan3.mp3",
};
