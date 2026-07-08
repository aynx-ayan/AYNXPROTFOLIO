// Web Audio API Synthesizer for luxury digital experience
// Synthesizes premium metallic sounds and ambient loops completely on-the-fly

let audioCtx: AudioContext | null = null;
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
}

// Synthesize an elite metallic chime sweep
export function playMetallicChime() {
  try {
    initAudio();
    if (!audioCtx) return;
    
    // Resume context if suspended
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    
    // Create multiple oscillators for rich additive metallic timbre
    const freqs = [220, 330, 440, 587.33, 659.25, 880, 1200, 1800];
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4000, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 3.0);
    filter.Q.setValueAtTime(5, now);

    freqs.forEach((f, i) => {
      const osc = audioCtx!.createOscillator();
      // Mix sine and triangle for smooth metallic tone
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);
      
      // Pitch sweep
      osc.frequency.exponentialRampToValueAtTime(f * 0.9, now + 3.0);

      const oscGain = audioCtx!.createGain();
      // Higher frequencies decay faster
      const oscVolume = (1 / (i + 1)) * 0.4;
      oscGain.gain.setValueAtTime(oscVolume, now);
      oscGain.gain.exponentialRampToValueAtTime(0.00001, now + (3.0 / (i + 1)));

      osc.connect(oscGain);
      oscGain.connect(filter);
      
      osc.start(now);
      osc.stop(now + 4.0);
    });

    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    console.log("[AUDIO] Metallic chime synthesized successfully.");
  } catch (error) {
    console.warn("Web Audio chime synthesis not supported or blocked", error);
  }
}

// Start/Stop a smooth low-frequency premium ambient cosmic drone
export function toggleAmbientDrone(play: boolean) {
  try {
    initAudio();
    if (!audioCtx) return;

    if (!play) {
      // Fade out slowly
      if (ambientGain && audioCtx) {
        const now = audioCtx.currentTime;
        ambientGain.gain.setValueAtTime(ambientGain.gain.value, now);
        ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
        setTimeout(() => {
          try {
            if (ambientOsc1) ambientOsc1.stop();
            if (ambientOsc2) ambientOsc2.stop();
            ambientOsc1 = null;
            ambientOsc2 = null;
            ambientGain = null;
          } catch (e) {}
        }, 2100);
      }
      return;
    }

    if (ambientOsc1) return; // Already playing

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0, now);
    ambientGain.gain.linearRampToValueAtTime(0.1, now + 3.0); // Quiet background drone

    // Filter to keep it extremely deep and cinematic
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now); // Low hum
    filter.Q.setValueAtTime(2, now);

    // Deep Base Note (C2 - ~65.41 Hz)
    ambientOsc1 = audioCtx.createOscillator();
    ambientOsc1.type = 'triangle';
    ambientOsc1.frequency.setValueAtTime(65.41, now);
    
    // Detuned second note for slow phase chorus (E2 - ~82.41 Hz)
    ambientOsc2 = audioCtx.createOscillator();
    ambientOsc2.type = 'sine';
    ambientOsc2.frequency.setValueAtTime(82.41, now);

    // Apply slow LFO modulation on filter frequency
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.15; // Slow sweep (once every ~7 secs)
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 50; // Sweeps filter between 100Hz and 200Hz

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    ambientOsc1.connect(filter);
    ambientOsc2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);

    lfo.start(now);
    ambientOsc1.start(now);
    ambientOsc2.start(now);
    
    console.log("[AUDIO] Immersive ambient cosmic loop initiated.");
  } catch (error) {
    console.warn("Ambient drone failed to start", error);
  }
}
