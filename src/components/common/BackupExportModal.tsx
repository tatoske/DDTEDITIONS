import React, { useState, useRef } from 'react';
import { Character } from '../../types/dnd';
import {
  validateCharacterJson,
  validateCampaignBackupJson,
  createCampaignBackupPayload,
  triggerJsonDownload,
  CampaignBackupPayload
} from '../../utils/backupMath';
import {
  Download,
  Upload,
  FileText,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Database,
  X,
  User,
  Shield
} from 'lucide-react';

interface BackupExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCharacter: Character;
  allCharacters: Character[];
  onImportCharacter: (newChar: Character) => void;
  onRestoreCampaign: (payload: CampaignBackupPayload) => void;
  allMonsters?: any[];
  allSidekicks?: any[];
  campaignPatron?: any;
}

export const BackupExportModal: React.FC<BackupExportModalProps> = ({
  isOpen,
  onClose,
  activeCharacter,
  allCharacters,
  onImportCharacter,
  onRestoreCampaign,
  allMonsters = [],
  allSidekicks = [],
  campaignPatron = null
}) => {
  if (!isOpen) return null;

  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const charFileInputRef = useRef<HTMLInputElement>(null);
  const campaignFileInputRef = useRef<HTMLInputElement>(null);

  // 1. Exportar personaje individual
  const handleExportCharacter = () => {
    const fileName = `${activeCharacter.name.toLowerCase().replace(/\s+/g, '_')}_nvl${activeCharacter.level}_dnd2024.json`;
    triggerJsonDownload(activeCharacter, fileName);
    setMessage({ text: `Ficha de "${activeCharacter.name}" exportada con éxito.`, type: 'success' });
  };

  // 2. Importar personaje individual
  const handleCharFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = validateCharacterJson(content);
      if (res.valid && res.character) {
        onImportCharacter(res.character);
        setMessage({ text: `¡Aventurero "${res.character.name}" (Nvl ${res.character.level}) importado con éxito!`, type: 'success' });
      } else {
        setMessage({ text: res.error || 'Error al importar ficha.', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 3. Exportar campaña completa
  const handleExportCampaign = () => {
    const payload = createCampaignBackupPayload(allCharacters, allMonsters, allSidekicks, campaignPatron);
    const dateStr = new Date().toISOString().split('T')[0];
    triggerJsonDownload(payload, `dnd_t_editions_campana_backup_${dateStr}.json`);
    setMessage({ text: `Respaldo completo de la mesa exportado (${allCharacters.length} aventureros, ${allSidekicks.length} escuderos).`, type: 'success' });
  };

  // 4. Importar respaldo de campaña completa
  const handleCampaignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = validateCampaignBackupJson(content);
      if (res.valid && res.data) {
        onRestoreCampaign(res.data);
        setMessage({ text: `¡Campaña restaurada con éxito! (${res.data.characters.length} personajes cargados).`, type: 'success' });
      } else {
        setMessage({ text: res.error || 'Error al restaurar respaldo de campaña.', type: 'error' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 5. Imprimir en papel o PDF
  const handlePrint = () => {
    onClose();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #b45309',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ padding: '8px', backgroundColor: 'rgba(217, 119, 6, 0.15)', color: '#b45309', borderRadius: '8px', display: 'flex' }}>
              <Database size={24} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--color-primary-dark, #292524)' }}>
                Gestión de Datos, Respaldos & PDF
              </h3>
              <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-muted, #78716c)', fontSize: '0.85rem' }}>
                Exporta o importa tus fichas de personaje, respalda tu campaña completa o imprime tu hoja.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted, #78716c)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Mensaje de Notificación */}
        {message && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(220, 38, 38, 0.12)',
              border: message.type === 'success' ? '1px solid #10b981' : '1px solid #dc2626',
              color: message.type === 'success' ? '#047857' : '#b91c1c'
            }}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Sección 1: Ficha del Aventurero Activo */}
        <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={16} /> Ficha del Aventurero Activo: {activeCharacter.name}
          </h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--color-text-muted, #78716c)' }}>
            Descarga esta ficha en archivo JSON para compartirla o guardarla de forma segura.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleExportCharacter}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Exportar Personaje (JSON)
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => charFileInputRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Upload size={14} /> Importar Personaje desde JSON
            </button>
            <input
              type="file"
              ref={charFileInputRef}
              onChange={handleCharFileChange}
              accept=".json,application/json"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Sección 2: Campaña Completa del DM */}
        <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={16} /> Respaldo Completo de Campaña
          </h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--color-text-muted, #78716c)' }}>
            Guarda todos los aventureros ({allCharacters.length}), compañeros escuderos, patrono activo y monstruos en un solo archivo de respaldo.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleExportCampaign}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} /> Respaldar Campaña Completa
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => campaignFileInputRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Upload size={14} /> Restaurar Campaña desde Archivo
            </button>
            <input
              type="file"
              ref={campaignFileInputRef}
              onChange={handleCampaignFileChange}
              accept=".json,application/json"
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Sección 3: Imprimir / Guardar en PDF */}
        <div style={{ padding: '16px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--color-primary-dark, #292524)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Printer size={16} color="#b45309" /> Hoja de Aventurero Imprimible / Guardar en PDF
          </h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--color-text-muted, #78716c)' }}>
            Abre el diálogo de impresión nativo del navegador con maquetación de pergamino limpio optimizada para imprimir o guardar como PDF.
          </p>

          <button
            className="btn btn-primary btn-sm"
            onClick={handlePrint}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} /> Imprimir Hoja de Personaje o Guardar PDF
          </button>
        </div>

        {/* Pie */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
