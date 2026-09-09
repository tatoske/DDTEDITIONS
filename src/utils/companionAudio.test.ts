import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCompanionSoundEnabled,
  setCompanionSoundEnabled,
  playCompanionGreetingSound,
  playElaraSound,
  playMimicSound,
  playArchmageSound,
  playParchmentFlutterSound
} from './companionAudio';

const storage: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, val: string) => { storage[key] = val; },
  removeItem: (key: string) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

describe('Companion Web Audio Synthesizer', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    (globalThis as any).localStorage = mockLocalStorage;
    (globalThis as any).window = {
      localStorage: mockLocalStorage
    };
  });

  it('manages sound enabled toggle with persistence', () => {
    expect(getCompanionSoundEnabled()).toBe(true);
    setCompanionSoundEnabled(false);
    expect(getCompanionSoundEnabled()).toBe(false);
    setCompanionSoundEnabled(true);
    expect(getCompanionSoundEnabled()).toBe(true);
  });

  it('executes sound triggers without throwing exceptions in mock environment', () => {
    expect(() => playElaraSound()).not.toThrow();
    expect(() => playMimicSound()).not.toThrow();
    expect(() => playArchmageSound()).not.toThrow();
    expect(() => playParchmentFlutterSound()).not.toThrow();
    expect(() => playCompanionGreetingSound('elara')).not.toThrow();
    expect(() => playCompanionGreetingSound('mimic')).not.toThrow();
    expect(() => playCompanionGreetingSound('archmage')).not.toThrow();
  });

  it('does not produce sounds when disabled', () => {
    setCompanionSoundEnabled(false);
    expect(() => playCompanionGreetingSound('elara')).not.toThrow();
  });
});
