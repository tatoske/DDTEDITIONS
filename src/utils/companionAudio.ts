// Sintetizador de Audio Web Audio API para los Asistentes de D&D T Editions
// 100% nativo, sin dependencias externas ni archivos MP3, compatible con todos los navegadores.

import { CompanionId } from '../types/assistant';

const COMPANION_SOUND_KEY = 'dnd_companion_sound_enabled';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function getCompanionSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(COMPANION_SOUND_KEY);
  return val === null ? true : val === 'true';
}

export function setCompanionSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COMPANION_SOUND_KEY, enabled ? 'true' : 'false');
}

/**
 * 1. Saludo de Elara: Desenvainar de acero y brillo metálico
 */
export function playElaraSound(): void {
  if (!getCompanionSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Desenvainar metálico (fricción de acero)
  const bladeOsc = ctx.createOscillator();
  const bladeGain = ctx.createGain();
  const bladeFilter = ctx.createBiquadFilter();

  bladeOsc.type = 'sawtooth';
  bladeOsc.frequency.setValueAtTime(900, now);
  bladeOsc.frequency.exponentialRampToValueAtTime(1600, now + 0.12);
  bladeOsc.frequency.exponentialRampToValueAtTime(650, now + 0.28);

  bladeFilter.type = 'bandpass';
  bladeFilter.frequency.setValueAtTime(2200, now);
  bladeFilter.Q.setValueAtTime(4.5, now);

  bladeGain.gain.setValueAtTime(0.01, now);
  bladeGain.gain.linearRampToValueAtTime(0.18, now + 0.08);
  bladeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

  bladeOsc.connect(bladeFilter);
  bladeFilter.connect(bladeGain);
  bladeGain.connect(ctx.destination);

  bladeOsc.start(now);
  bladeOsc.stop(now + 0.32);

  // Tintineo armónico (acero templado) a los 0.15s
  const ringOsc = ctx.createOscillator();
  const ringGain = ctx.createGain();

  ringOsc.type = 'sine';
  ringOsc.frequency.setValueAtTime(2400, now + 0.15);
  ringGain.gain.setValueAtTime(0.15, now + 0.15);
  ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

  ringOsc.connect(ringGain);
  ringGain.connect(ctx.destination);

  ringOsc.start(now + 0.15);
  ringOsc.stop(now + 0.66);
}

/**
 * 2. Saludo de Dienteazur: Mordisco y chasquido de mandíbula mímica
 */
export function playMimicSound(): void {
  if (!getCompanionSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Dos chasquidos rápidos seguidos (Krak-clic!)
  [0, 0.09].forEach((offset, idx) => {
    const snapTime = now + offset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280 - idx * 40, snapTime);
    osc.frequency.exponentialRampToValueAtTime(50, snapTime + 0.05);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, snapTime);

    gain.gain.setValueAtTime(0.3, snapTime);
    gain.gain.exponentialRampToValueAtTime(0.001, snapTime + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(snapTime);
    osc.stop(snapTime + 0.07);
  });
}

/**
 * 3. Saludo de Archimago Aurelius: Resonancia cósmica y diapasón astral
 */
export function playArchmageSound(): void {
  if (!getCompanionSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Acorde armónico místico (528Hz Mi sagrado + 792Hz Sol + 1056Hz Octava)
  const freqs = [528, 792, 1056];
  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    const initialGain = 0.12 / (idx + 1);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(initialGain, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9 + idx * 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  });
}

/**
 * 4. Susurro de pergamino al recibir mensaje del asistente
 */
export function playParchmentFlutterSound(): void {
  if (!getCompanionSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(2.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  } catch (e) {
    // Ignorar si el navegador restringe buffers
  }
}

/**
 * Disparador unificado según ID del compañero
 */
export function playCompanionGreetingSound(companionId: CompanionId): void {
  if (companionId === 'elara') {
    playElaraSound();
  } else if (companionId === 'mimic') {
    playMimicSound();
  } else if (companionId === 'archmage') {
    playArchmageSound();
  }
}
