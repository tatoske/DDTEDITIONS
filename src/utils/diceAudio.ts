// Generador de Efectos de Sonido mediante Web Audio API para Tiradas de Dados
// Sin librerías externas, 100% nativo, con latencia cero y compatible con todos los navegadores modernos.

import { getDiceSoundEnabled } from './diceRollEvent';

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

/**
 * 1. Sonido de Dado Rodando (Tumbling rattle + impacto en mesa)
 */
export function playDiceRollSound(): void {
  if (!getDiceSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Secuencia de 6 golpecitos aleatorios rápidos simulando el dado rebotando
  for (let i = 0; i < 6; i++) {
    const time = now + i * 0.08 + Math.random() * 0.03;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320 + Math.random() * 180, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600 + Math.random() * 400, time);
    filter.Q.setValueAtTime(3, time);

    gain.gain.setValueAtTime(0.22, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  // Ruido blanco percusivo sutil (choque de madera/resina)
  try {
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, now + 0.25);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1200, now);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now + 0.25);
  } catch (e) {
    // Ignorar si el navegador restringe buffers
  }

  // Impacto final al detenerse (thud) a los ~0.65s
  const hitTime = now + 0.65;
  const thudOsc = ctx.createOscillator();
  const thudGain = ctx.createGain();

  thudOsc.type = 'sine';
  thudOsc.frequency.setValueAtTime(160, hitTime);
  thudOsc.frequency.exponentialRampToValueAtTime(45, hitTime + 0.12);

  thudGain.gain.setValueAtTime(0.35, hitTime);
  thudGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.15);

  thudOsc.connect(thudGain);
  thudGain.connect(ctx.destination);

  thudOsc.start(hitTime);
  thudOsc.stop(hitTime + 0.16);
}

/**
 * 2. Sonido Espeluznante / Pifia Crítica (Calavera, fallo 1)
 * Zumbido diabólico ultragrave + acorde disonante tritonico + gemido espectral
 */
export function playSpookySound(): void {
  if (!getDiceSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Master Gain para el efecto espeluznante
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.4, now);
  masterGain.connect(ctx.destination);

  // A. Drone Infernal Sub-grave (55Hz y 58Hz desafinados para generar batimiento tétrico)
  const drone1 = ctx.createOscillator();
  const drone2 = ctx.createOscillator();
  const droneGain = ctx.createGain();

  drone1.type = 'sawtooth';
  drone1.frequency.setValueAtTime(55, now);
  drone1.frequency.exponentialRampToValueAtTime(36, now + 2.2);

  drone2.type = 'triangle';
  drone2.frequency.setValueAtTime(58.5, now);
  drone2.frequency.exponentialRampToValueAtTime(37.5, now + 2.2);

  // Filtro pasa-bajos oscuro
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.setValueAtTime(280, now);
  droneFilter.frequency.linearRampToValueAtTime(120, now + 2.0);

  droneGain.gain.setValueAtTime(0.0, now);
  droneGain.gain.linearRampToValueAtTime(0.35, now + 0.1);
  droneGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

  drone1.connect(droneFilter);
  drone2.connect(droneFilter);
  droneFilter.connect(droneGain);
  droneGain.connect(masterGain);

  drone1.start(now);
  drone2.start(now);
  drone1.stop(now + 2.5);
  drone2.stop(now + 2.5);

  // B. Tritono Disonante ("Diabolus in Musica"): D4 (293Hz) y G#4 (415Hz)
  const tritone1 = ctx.createOscillator();
  const tritone2 = ctx.createOscillator();
  const tritoneGain = ctx.createGain();

  tritone1.type = 'sawtooth';
  tritone1.frequency.setValueAtTime(293.66, now + 0.1);
  tritone1.frequency.exponentialRampToValueAtTime(220, now + 1.8);

  tritone2.type = 'sawtooth';
  tritone2.frequency.setValueAtTime(415.30, now + 0.1);
  tritone2.frequency.exponentialRampToValueAtTime(311, now + 1.8);

  // Vibrato espectral (LFO)
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(5.5, now);
  lfoGain.gain.setValueAtTime(12, now);
  lfo.connect(tritone1.frequency);
  lfo.connect(tritone2.frequency);
  lfo.start(now);
  lfo.stop(now + 2.4);

  const spookyFilter = ctx.createBiquadFilter();
  spookyFilter.type = 'bandpass';
  spookyFilter.frequency.setValueAtTime(650, now);
  spookyFilter.Q.setValueAtTime(4.0, now);

  tritoneGain.gain.setValueAtTime(0.0, now);
  tritoneGain.gain.linearRampToValueAtTime(0.28, now + 0.15);
  tritoneGain.gain.exponentialRampToValueAtTime(0.001, now + 2.3);

  tritone1.connect(spookyFilter);
  tritone2.connect(spookyFilter);
  spookyFilter.connect(tritoneGain);
  tritoneGain.connect(masterGain);

  tritone1.start(now);
  tritone2.start(now);
  tritone1.stop(now + 2.4);
  tritone2.stop(now + 2.4);

  // C. Chillido espectral agudo que desciende como alma en pena
  const wail = ctx.createOscillator();
  const wailGain = ctx.createGain();
  wail.type = 'sine';
  wail.frequency.setValueAtTime(1100, now + 0.05);
  wail.frequency.exponentialRampToValueAtTime(320, now + 1.5);

  wailGain.gain.setValueAtTime(0.0, now);
  wailGain.gain.linearRampToValueAtTime(0.18, now + 0.1);
  wailGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

  wail.connect(wailGain);
  wailGain.connect(masterGain);

  wail.start(now + 0.05);
  wail.stop(now + 1.7);
}

/**
 * 3. Sonido Angelical / Tirada Máxima Divina (Luz celestial, 20 en d20 o max)
 * Arpegio de campanas de cristal celestiales + acorde de coro sagrado en Do Mayor 9
 */
export function playAngelicSound(): void {
  if (!getDiceSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.38, now);
  masterGain.connect(ctx.destination);

  // A. Arpegio Rápido Creciente de Campanas de Cristal: C5, E5, G5, B5, C6, E6, G6
  const crystalNotes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
  
  crystalNotes.forEach((freq, index) => {
    const noteTime = now + index * 0.07;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);

    // Armónico campana brillante (x2.76 de la fundamental)
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2.76, noteTime);

    noteGain.gain.setValueAtTime(0.0, noteTime);
    noteGain.gain.linearRampToValueAtTime(0.16, noteTime + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.4);

    osc.connect(noteGain);
    overtone.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(noteTime);
    overtone.start(noteTime);
    osc.stop(noteTime + 1.5);
    overtone.stop(noteTime + 1.5);
  });

  // B. Coro Sagrado / Catedral Cálida (Acorde celestial mayor: C4, G4, E5, B5 con fade in suave)
  const choirChord = [261.63, 392.00, 659.25, 987.77];
  const chordTime = now + 0.2;

  choirChord.forEach(freq => {
    const osc = ctx.createOscillator();
    const chordGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, chordTime);

    // LFO suave para respiración coral
    const choirLfo = ctx.createOscillator();
    const choirLfoGain = ctx.createGain();
    choirLfo.frequency.setValueAtTime(3.8, chordTime);
    choirLfoGain.gain.setValueAtTime(1.8, chordTime);
    choirLfo.connect(osc.frequency);
    choirLfo.start(chordTime);
    choirLfo.stop(chordTime + 2.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, chordTime);

    chordGain.gain.setValueAtTime(0.0, chordTime);
    chordGain.gain.linearRampToValueAtTime(0.14, chordTime + 0.4);
    chordGain.gain.setValueAtTime(0.14, chordTime + 1.4);
    chordGain.gain.exponentialRampToValueAtTime(0.001, chordTime + 2.8);

    osc.connect(filter);
    filter.connect(chordGain);
    chordGain.connect(masterGain);

    osc.start(chordTime);
    osc.stop(chordTime + 2.9);
  });

  // C. Destello Resplandeciente de Luz Divina (Campana alta con shimmer)
  const shimmerOsc = ctx.createOscillator();
  const shimmerGain = ctx.createGain();
  shimmerOsc.type = 'sine';
  shimmerOsc.frequency.setValueAtTime(2093.00, now + 0.5); // C7

  shimmerGain.gain.setValueAtTime(0.0, now + 0.5);
  shimmerGain.gain.linearRampToValueAtTime(0.18, now + 0.52);
  shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

  shimmerOsc.connect(shimmerGain);
  shimmerGain.connect(masterGain);

  shimmerOsc.start(now + 0.5);
  shimmerOsc.stop(now + 2.3);
}
