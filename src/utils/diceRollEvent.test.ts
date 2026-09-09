import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  evaluateDramaticRoll, 
  triggerDramaticDiceRoll, 
  subscribeToDramaticRolls,
  getDiceSoundEnabled, 
  setDiceSoundEnabled,
  DramaticRollPayload
} from './diceRollEvent';

// Mock simple de localStorage y EventTarget para Node/Vitest
const storage: Record<string, string> = {};
const eventListeners: Record<string, ((e: any) => void)[]> = {};

const mockLocalStorage = {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, val: string) => { storage[key] = val; },
  removeItem: (key: string) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

beforeEach(() => {
  mockLocalStorage.clear();
  Object.keys(eventListeners).forEach(k => delete eventListeners[k]);

  // Instalar en globalThis / window
  (globalThis as any).localStorage = mockLocalStorage;
  (globalThis as any).window = {
    localStorage: mockLocalStorage,
    addEventListener: (type: string, listener: any) => {
      if (!eventListeners[type]) eventListeners[type] = [];
      eventListeners[type].push(listener);
    },
    removeEventListener: (type: string, listener: any) => {
      if (eventListeners[type]) {
        eventListeners[type] = eventListeners[type].filter(l => l !== listener);
      }
    },
    dispatchEvent: (event: any) => {
      const list = eventListeners[event.type] || [];
      list.forEach(fn => fn(event));
      return true;
    }
  };
  (globalThis as any).CustomEvent = class CustomEvent {
    type: string;
    detail: any;
    constructor(type: string, params?: { detail: any }) {
      this.type = type;
      this.detail = params?.detail;
    }
  };
});

describe('diceRollEvent utilities', () => {
  it('evaluates normal roll correctly', () => {
    const payload = evaluateDramaticRoll(20, 14, 3, 'Ataque Espada');
    expect(payload.sides).toBe(20);
    expect(payload.result).toBe(14);
    expect(payload.total).toBe(17);
    expect(payload.bonus).toBe(3);
    expect(payload.expression).toBe('1d20+3');
    expect(payload.label).toBe('Ataque Espada');
    expect(payload.isCrit).toBe(false);
    expect(payload.isFumble).toBe(false);
    expect(payload.isMax).toBe(false);
  });

  it('detects fumble (result = 1)', () => {
    const payload = evaluateDramaticRoll(20, 1, 5, 'Salvación Reflejos');
    expect(payload.result).toBe(1);
    expect(payload.isFumble).toBe(true);
    expect(payload.isCrit).toBe(false);
    expect(payload.isMax).toBe(false);
    expect(payload.total).toBe(6);
  });

  it('detects critical maximum (result = sides)', () => {
    const payload20 = evaluateDramaticRoll(20, 20, 4, 'Golpe Mortal');
    expect(payload20.result).toBe(20);
    expect(payload20.isCrit).toBe(true);
    expect(payload20.isMax).toBe(true);
    expect(payload20.isFumble).toBe(false);

    const payload6 = evaluateDramaticRoll(6, 6, 0);
    expect(payload6.isMax).toBe(true);
    expect(payload6.isCrit).toBe(true);
  });

  it('correctly manages sound enabled state in localStorage', () => {
    expect(getDiceSoundEnabled()).toBe(true);

    setDiceSoundEnabled(false);
    expect(getDiceSoundEnabled()).toBe(false);

    setDiceSoundEnabled(true);
    expect(getDiceSoundEnabled()).toBe(true);
  });

  it('triggers and receives event via subscribeToDramaticRolls', () => {
    const mockCallback = vi.fn();
    const unsubscribe = subscribeToDramaticRolls(mockCallback);

    const testPayload: DramaticRollPayload = {
      sides: 20,
      result: 1,
      total: 1,
      isFumble: true,
      label: 'Test Fumble'
    };

    triggerDramaticDiceRoll(testPayload);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(testPayload);

    unsubscribe();

    triggerDramaticDiceRoll(testPayload);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
