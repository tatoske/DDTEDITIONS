# Índice y Arquitectura General: D&D T Editions (2024)

Bienvenido a la documentación oficial de **D&D T Editions**, una plataforma web integral creada para partidas presenciales y virtuales de Dungeons & Dragons con el reglamento oficial revisado **D&D 2024 (PHB & DMG 2024)** y suplementos canónicos (*Tasha's Cauldron of Everything*, *Xanathar's Guide to Everything*, *Mordenkainen Presents: Monsters of the Multiverse*, *Eberron: Rising from the Last War*, *Van Richten's Guide to Ravenloft*, *Vecna: Eve of Ruin*, *Young Adventurer's Guides*).

---

## 🏛️ Estructura de la Documentación

1. **[01_SISTEMA_Y_ROLES.md](./01_SISTEMA_Y_ROLES.md)**: Jerarquía de usuarios (Super Master, Master, Jugador), acceso obligatorio con Login, seguridad feudal y economía del reino en Dragones de Oro (DO).
2. **[02_GUIA_DEL_JUGADOR.md](./02_GUIA_DEL_JUGADOR.md)**: Manual del aventurero: Ficha interactiva 2024, creación paso a paso, Maestría con Armas, Bastiones (Nvl 5+), Dotes, Escuderos, Tablero de Campañas y Grimorio de Hazañas.
3. **[03_GUIA_DEL_DUNGEON_MASTER.md](./03_GUIA_DEL_DUNGEON_MASTER.md)**: Manual del Dungeon Master: Las 25 herramientas organizadas en 5 categorías ergonómicas, concesión directa y grupal de botines/XP, Bestiario, Tracker de Encuentros, Trampas, Venenos, Clima y Mitología.
4. **[04_GUIA_DEL_SUPER_MASTER.md](./04_GUIA_DEL_SUPER_MASTER.md)**: Manual del Super Master: Panel Imperial supremo, control de la boveda de Dragones de Oro, asignación de roles, licencias feudales (Bastiones y Escuderos) y monitor/escalado de campañas caídas.
5. **[05_REGLAS_RAPIDAS_DND_2024.md](./05_REGLAS_RAPIDAS_DND_2024.md)**: Compendio de mecánicas D&D 2024: Modificadores, acciones de combate, propiedades tácticas de armas (*Topple*, *Graze*, *Nick*, etc.), tabla de condiciones y descansos.

---

## 🧭 Mapa de Navegación & Roles

| Rol | Vista Predeterminada | Pestañas Disponibles | Asistente Personal en Tiempo Real |
| :--- | :--- | :--- | :--- |
| **Jugador (`player`)** | Ficha de Personaje | 🛡️ Ficha, 📜 Tablero de Campañas, 📖 Grimorio de Aventuras | **Elara, la Guía del Camino** (Aventurera Novicia) |
| **Dungeon Master (`dm`)** | Herramientas de DM | ⚔️ Herramientas de DM, 📜 Tablero de Campañas, 📖 Grimorio de Aventuras | **Dienteazur, el Mímico Sabio** (Tomo Mímico) |
| **Super Master (`supermaster`)** | Panel Imperial | 👑 Panel Imperial, ⚔️ Herramientas de DM, 📜 Tablero, 📖 Grimorio | **Archimago Aurelius** (Cronista Supremo) |

---

## 🛠️ Stack Tecnológico
- **Frontend**: React 18, TypeScript 5, Vite 6.
- **Estilos**: Vanilla CSS con variables de diseño pergamino/marfil (`[data-theme="light"]`) y noche arcana (`[data-theme="dark"]`). Capa de utilidades de diseño en `src/styles/tw-compat.css`.
- **Iconos**: Lucide React.
- **Audio & Cinemática**: Web Audio API sintetizado nativo para rodar de dados, pifias terroríficas (calavera 36Hz) y críticos celestiales (campanas en C Mayor 9).
- **Backend**: Express + CORS + pdf-parse (Puerto 3001) para indexación y búsqueda en 11 libros PDF oficiales.
- **Persistencia**: LocalStorage estructurado con claves seguras y soporte de exportación/importación JSON en el modal de respaldos.
