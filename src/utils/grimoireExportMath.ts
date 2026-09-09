// Formateador y Generador de Documento Imprimible / PDF del Grimorio de Aventuras
// Diseñado para exportación en alta fidelidad estilo pergamino medieval con sellos imperiales.

import { Character, CharacterAdventureRecord } from '../types/dnd';
import { getRankClassFromLevel, getRankClassTitle } from './campaignAuthMath';

export interface GrimoirePrintSummary {
  characterName: string;
  className: string;
  level: number;
  rankClass: string;
  rankTitle: string;
  goldDragons: number;
  totalMissions: number;
  victories: number;
  defeats: number;
  retreats: number;
  winRate: number;
}

export function computeGrimoireSummary(character: Character, chronicles: CharacterAdventureRecord[]): GrimoirePrintSummary {
  const rankClass = getRankClassFromLevel(character.level);
  const rankTitle = getRankClassTitle(rankClass);
  const totalMissions = chronicles.length;
  const victories = chronicles.filter(c => c.outcome === 'victory').length;
  const defeats = chronicles.filter(c => c.outcome === 'defeat').length;
  const retreats = chronicles.filter(c => c.outcome === 'retreat').length;
  const winRate = totalMissions > 0 ? Math.round((victories / totalMissions) * 100) : 100;
  const goldDragons = (character.goldDragons || 0) + (character.coins?.gp || 0);

  return {
    characterName: character.name,
    className: character.className || (character as any).class || 'Aventurero',
    level: character.level,
    rankClass: `Clase ${rankClass}`,
    rankTitle,
    goldDragons,
    totalMissions,
    victories,
    defeats,
    retreats,
    winRate
  };
}

export function generateGrimoirePrintableHtml(character: Character, chronicles: CharacterAdventureRecord[]): string {
  const summary = computeGrimoireSummary(character, chronicles);

  const chroniclesRowsHtml = chronicles.length === 0
    ? `<tr><td colspan="5" style="text-align:center; padding: 20px; font-style: italic; color: #78716c;">No hay crónicas inscritas en el grimorio aún.</td></tr>`
    : chronicles.map((c, i) => {
        const outcomeColor = c.outcome === 'victory' ? '#15803d' : c.outcome === 'defeat' ? '#b91c1c' : '#b45309';
        const outcomeLabel = c.outcome === 'victory' ? 'Victoria 🏆' : c.outcome === 'defeat' ? 'Derrota 💀' : 'Retirada 👣';
        return `
          <tr style="border-bottom: 1px solid #e7e5e4; background-color: ${i % 2 === 0 ? '#ffffff' : '#fafaf9'};">
            <td style="padding: 10px; font-weight: bold; color: #1c1917;">${c.sessionDate || 'Fecha desconocida'}</td>
            <td style="padding: 10px; color: #292524;"><strong>${c.questTitle}</strong></td>
            <td style="padding: 10px; color: #44403c;">${c.masterName || 'Dungeon Master'}</td>
            <td style="padding: 10px; font-weight: bold; color: ${outcomeColor};">${outcomeLabel}</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; color: #b45309;">+${c.goldEarned || 0} DO</td>
          </tr>
          <tr style="border-bottom: 1px solid #d6d3d1; background-color: ${i % 2 === 0 ? '#fafaf9' : '#f5f5f4'};">
            <td colspan="5" style="padding: 6px 12px 12px 12px; font-size: 12px; color: #57534e; font-style: italic;">
              📜 <em>Nota del Master:</em> "${c.chronicleNotes || 'Sin notas registradas.'}"
            </td>
          </tr>
        `;
      }).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Grimorio de Aventuras — ${character.name}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        body {
          font-family: 'Cinzel', 'Georgia', serif;
          background-color: #fdfbf7;
          color: #1c1917;
          margin: 0;
          padding: 24px;
        }
        .parchment-border {
          border: 3px double #d97706;
          padding: 24px;
          background: #ffffff;
          box-shadow: inset 0 0 40px rgba(217, 119, 6, 0.08);
          border-radius: 8px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #d97706;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          letter-spacing: 2px;
          color: #78350f;
          text-transform: uppercase;
        }
        .header h2 {
          margin: 4px 0 0 0;
          font-size: 16px;
          color: #b45309;
          font-weight: 500;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: #fafaf9;
          border: 1px solid #d6d3d1;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
        }
        .stat-card .label {
          font-size: 11px;
          color: #78716c;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .stat-card .value {
          font-size: 18px;
          font-weight: bold;
          color: #1c1917;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th {
          background: #78350f;
          color: #fef3c7;
          text-align: left;
          padding: 8px 10px;
          font-size: 12px;
          text-transform: uppercase;
        }
        .footer {
          margin-top: 32px;
          padding-top: 16px;
          border-top: 1px solid #d97706;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          color: #78716c;
        }
        .seal {
          display: inline-block;
          border: 2px dashed #b45309;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: bold;
          color: #b45309;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        @media print {
          body { padding: 0; background: #fff; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="parchment-border">
        <div class="header">
          <h1>📖 Grimorio de Aventuras & Hazañas</h1>
          <h2>Crónicas del Reino • D&D T Editions</h2>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Héroe Registrado</div>
            <div class="value" style="font-size: 15px;">${summary.characterName}</div>
            <div style="font-size: 10px; color: #78716c;">${summary.className} Nvl ${summary.level}</div>
          </div>
          <div class="stat-card">
            <div class="label">Rango Imperial</div>
            <div class="value" style="color: #b45309;">${summary.rankClass}</div>
            <div style="font-size: 10px; color: #78716c;">${summary.rankTitle}</div>
          </div>
          <div class="stat-card">
            <div class="label">Bolsa de Dragones</div>
            <div class="value" style="color: #d97706;">🪙 ${summary.goldDragons.toLocaleString()} DO</div>
            <div style="font-size: 10px; color: #78716c;">Fondos acumulados</div>
          </div>
          <div class="stat-card">
            <div class="label">Efectividad</div>
            <div class="value" style="color: #15803d;">${summary.winRate}%</div>
            <div style="font-size: 10px; color: #78716c;">${summary.victories}V / ${summary.defeats}D (${summary.totalMissions} misiones)</div>
          </div>
        </div>

        <h3 style="color: #78350f; font-size: 15px; margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">
          📜 Registro Cronológico de Partidas Selladas
        </h3>

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Misión / Campaña</th>
              <th>Dungeon Master</th>
              <th>Desenlace</th>
              <th style="text-align: right;">Dragones de Oro</th>
            </tr>
          </thead>
          <tbody>
            ${chroniclesRowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>
            <span>Documento generado con el Compendio D&D 2024</span><br>
            <span style="font-size: 10px;">Autenticado por Archimago Aurelius & Elara Rompealbas</span>
          </div>
          <div class="seal">
            👑 Sello Imperial • Valioso
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Disparador nativo de impresión en ventana emergente o pestaña
 */
export function triggerGrimoirePrint(character: Character, chronicles: CharacterAdventureRecord[]): boolean {
  if (typeof window === 'undefined') return false;

  const html = generateGrimoirePrintableHtml(character, chronicles);
  const printWindow = window.open('', '_blank', 'width=900,height=750');
  if (!printWindow) return false;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // Esperar a renderizar y disparar diálogo de impresión
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 250);

  return true;
}
