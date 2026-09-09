// Event Bus y Utilidades para la Animación Dramática de Dados y Sonidos

export interface DramaticRollPayload {
  sides: number;
  result: number;
  total?: number;
  bonus?: number;
  expression?: string;
  label?: string;
  isCrit?: boolean;
  isFumble?: boolean;
  isMax?: boolean;
}

export const DRAMATIC_DICE_EVENT = 'dnd-dramatic-dice-roll';
const SOUND_ENABLED_KEY = 'dnd_dice_sound_enabled';

// Determina si una tirada es Pifia (1) o Máxima
export function evaluateDramaticRoll(sides: number, result: number, bonus: number = 0, customLabel?: string): DramaticRollPayload {
  const isFumble = result === 1;
  const isMax = result === sides;
  const isCrit = (sides === 20 && result === 20) || isMax;
  const total = result + bonus;

  let expression = `1d${sides}`;
  if (bonus !== 0) {
    expression += bonus > 0 ? `+${bonus}` : `${bonus}`;
  }

  return {
    sides,
    result,
    total,
    bonus,
    expression,
    label: customLabel || `Tirada de d${sides}`,
    isCrit,
    isFumble,
    isMax
  };
}

// Dispara el evento global para que la capa visual (DramaticDiceOverlay) lo muestre
export function triggerDramaticDiceRoll(payload: DramaticRollPayload): void {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent<DramaticRollPayload>(DRAMATIC_DICE_EVENT, { detail: payload });
    window.dispatchEvent(event);
  }
}

// Suscribe un callback al evento global de tirada dramática
export function subscribeToDramaticRolls(callback: (payload: DramaticRollPayload) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<DramaticRollPayload>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  window.addEventListener(DRAMATIC_DICE_EVENT, handler);
  return () => {
    window.removeEventListener(DRAMATIC_DICE_EVENT, handler);
  };
}

// Preferencia de Sonido en localStorage
export function getDiceSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const saved = localStorage.getItem(SOUND_ENABLED_KEY);
  return saved === null ? true : saved === 'true';
}

export function setDiceSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_ENABLED_KEY, enabled ? 'true' : 'false');
}
