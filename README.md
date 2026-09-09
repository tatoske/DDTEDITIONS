# ⚔️ D&D T Editions — Herramienta Integral D&D 2024

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-130%20Tests%20Passing-green.svg?logo=vitest)](https://vitest.dev/)
[![Rules](https://img.shields.io/badge/D%26D%20Rules-2024%20Spanish%20Edition-red.svg)](https://dnd.wizards.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**D&D T Editions** es una plataforma integral de gestión de rol y asistente de mesa virtual diseñada específicamente para combinar las reglas clásicas de **5ª Edición** con la **Actualización Oficial de Reglas 2024 en Español**. Integra soporte para todos los libros complementarios oficiales (*El Caldero de Tasha*, *Guía de Xanathar*, *Eberron*, *Ravenloft*, *Monstruos del Multiverso*, *Vecna*, y más).

---

## 🌟 Características Destacadas

- 🎭 **Sistema Multi-Rol Soberano**: Vistas y herramientas adaptadas según el rol autenticado (**Jugador**, **Dungeon Master** y **Super Master Imperial**).
- 🐾 **Mascotas y Asistentes Exclusivos por Rol**:
  - **Elara Rompealbas**: Novicia aventurera dedicada al Jugador.
  - **Grimorio Mímico "Dienteazur"**: Tomo viviente arcano exclusivo para el Dungeon Master.
  - **Archimago Aurelius**: Oráculo primordial multiversal exclusivo para el Super Master.
  - *Sintetizador Web Audio nativo* para efectos y bienvenida sonora.
  - *Motor de búsqueda e indexación rápida* sobre manuales oficiales en PDF.
- 🎲 **Motor de Dados Dramáticos**: Tirador interactivo con detección de **Crítico Natural 20** (euforia dorada) y **Pifia Natural 1** (catástrofe purpúrea), acompañados de audio dinámico y notificaciones flotantes.
- 🏰 **Bastiones 2024 y Escuderos de Tasha**: Módulos protegidos con control de licencias feudales decretadas por el Super Master.
- 📜 **Tablero de Campañas y Rangos de Aventurero**: Misiones clasificadas de **Clase F a SS+**, postulación de personajes por requisitos de nivel, y resolución colectiva con reparto de **Dragones de Oro (DO)** y crónicas históricas en el Grimorio.
- 🎨 **Diseño Inmersivo Doble Tema**: Alternancia entre **Modo Oscuro Arcana** y **Modo Pergamino Marfil** (*Light Theme*).

---

## 👑 Jerarquía de Roles y Matriz de Acceso

| Rol | Alcance y Módulos | Mascota Asignada | Moneda / Privilegio Especial |
|---|---|---|---|
| **⚔️ Jugador** (`player`) | Hoja de Personaje 2024, Creador Paso a Paso con Dotes de Origen, Grimorio de Hazañas, Subida de Nivel, Bastión personal y Escuderos. | **Elara Rompealbas** | Dragones de Oro ganados en campañas y piezas de oro (gp) de inventario. |
| **📜 Dungeon Master** (`dm`) | Bestiario, Tracker de Encuentros, Trampas Complejas, Biomas, Descansos, Baraja Tarokka, Patrones de Grupo, Marcas del Dragón, Venenos, Clima, Tiendas y Generador PNJ. | **Grimorio Mímico** | Concesión de objetos y recompensas al vuelo con `DmQuickRewardModal`. |
| **👑 Super Master** (`supermaster`) | Panel Imperial, Tesorería Global, Escalado de Misiones Fallidas, Decreto de Roles, Concesión y Auditoría de Dragones de Oro, Bloqueo/Desbloqueo de Licencias Feudales. | **Archimago Aurelius** | Tesoro Imperial de **999.999 DO**, autoridad suprema sobre todas las cuentas. |

---

## 📦 Módulos Incluidos

### 1. Módulos del Jugador
- **Hoja de Aventurero**: Cálculo reactivo de modificadores, tiradas con 1-clic con ventaja/desventaja, inventario, conjuros preparados y ranuras de magia.
- **Creador de Personajes 2024**: Selección de especies del multiverso, clases, trasfondos con bonos +2/+1 y **Dotes de Origen** (*Alerta*, *Duro*, *Curandero*, etc.).
- **Grimorio del Héroe**: Registro histórico de campañas completadas, cálculo de tasa de victorias y fortuna acumulada en Dragones de Oro (DO), con opción de exportación a PDF.
- **Bastiones 2024**: Gestión de instalaciones especiales (Laboratorio Alquímico, Sala de Entrenamiento, Forja, etc.) desbloqueable a Nivel 5+.
- **Escuderos & Mascotas (Tasha)**: Gestión de compañeros de combate que progresan del Nivel 1 al 20 (Guerrero, Experto, Conjurador).

### 2. Módulos del Dungeon Master
- **Compendio de Reglas & Especies**: Especies del Multiverso (*Mordenkainen*), Dotes 2024, Conjuros y Objetos Mágicos.
- **Generadores de Encuentros & Biomas**: Generación por entorno (Ártico, Cueva, Pantano, Desierto, Bosque, Subterráneo) y cálculo de dificultad XP/CR.
- **Mecánicas Avanzadas**:
  - *Baraja Tarokka de Ravenloft* con lectura de cartas místicas.
  - *Patrones de Grupo & Intrigas* (Academia de Tasha, Sindicatos de Ladrones, etc.).
  - *Marcas del Dragón de Eberron* con bonificadores automáticos +1d4 a tiradas.
  - *Persecuciones Urbanas y Entornos de Guarida*.
  - *Venenos, Enfermedades & Botica Alquímica*.
  - *Clima Dinámico, Estados de Mar y Navegación*.
  - *Dossier de Vecna* y *Guía de Dragones del Joven Aventurero*.

### 3. Panel del Super Master
- **Tesoro Imperial**: Fondo ilimitado para subvencionar mesas y otorgar subsidios a Masters o aventureros distinguidos.
- **Alerta de Misiones Fallidas**: Detección de expediciones aniquiladas para aprobar su escalado automático a rangos mayores (**Clase A, S, SS**).
- **Control de Licencias Feudales**: Interruptores en tiempo real para autorizar módulos avanzados (*Bastiones* y *Escuderos*).

---

## 🛠️ Stack Tecnológico

- **Frontend**:
  - [React 18.3](https://reactjs.org/) con [TypeScript](https://www.typescriptlang.org/)
  - [Vite 6.2](https://vitejs.dev/) para empaquetado ultra-rápido HMR
  - [Lucide React](https://lucide.dev/) para iconografía semántica de alta definición
  - **Web Audio API**: Motor sintetizador procedural de audio para dados y acompañantes
  - **CSS Nativo**: Sistema de tokens de diseño con soporte para Glassmorphism y temas duales
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express 4.21](https://expressjs.com/)
  - `pdf-parse` para procesamiento e indexación de libros de reglas
  - Endpoint REST `/api/books` y `/api/search`
- **Testing & Calidad**:
  - [Vitest 3.0](https://vitest.dev/) (23 suites de prueba, 130 tests automáticos pasando al 100%)
  - TypeScript strict typing (cero errores en `tsc --noEmit`)

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada)
- [npm](https://www.npmjs.com/) (versión 9.x o superior)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tatoske/DDTEDITIONS.git
cd DDTEDITIONS
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
Puedes iniciar tanto el servidor backend como la aplicación frontend de forma conjunta:
```bash
npm start
```
O de manera independiente:
```bash
# Frontend (Vite) en http://localhost:5173
npm run dev

# Backend Express en http://localhost:3001
npm run server
```

### 4. Ejecutar Pruebas Automatizadas
```bash
npm test
```

### 5. Compilar para Producción
```bash
npm run build
```

---

## 📂 Estructura del Proyecto

```text
D&D T Editions/
├── .agents/                      # Configuración de agentes de pair programming
├── D&D/                          # Carpeta local para manuales PDF oficiales de D&D
│   └── README.md
├── documentacion/                # Arquitectura técnica, historias de usuario y guías
│   ├── 00_INDICE_Y_ARQUITECTURA.md
│   ├── 01_SISTEMA_Y_ROLES.md
│   ├── 02_GUIA_DEL_JUGADOR.md
│   ├── 03_GUIA_DEL_DUNGEON_MASTER.md
│   ├── 04_GUIA_DEL_SUPER_MASTER.md
│   └── 05_REGLAS_RAPIDAS_DND_2024.md
├── public/
│   └── companions/               # Avatares 1:1 de las mascotas (Elara, Mímico, Aurelius)
├── server/
│   └── index.js                  # Servidor Express y catálogo de libros
├── src/
│   ├── components/
│   │   ├── assistant/            # CompanionWidget (Mascota IA con audio y filtros de rol)
│   │   ├── auth/                 # LoginScreen y AuthModal con validación segura
│   │   ├── campaigns/            # CampaignQuestBoard (Tablero con rangos de clase F a SS+)
│   │   ├── common/               # Dados dramáticos, modales de tiradas y respaldos JSON
│   │   ├── dm/                   # Suite completa de herramientas para el Dungeon Master
│   │   ├── player/               # Hoja de personaje, Creador 2024, Bastiones, Grimorio
│   │   └── supermaster/          # SuperMasterDashboard y tesorería de Dragones de Oro
│   ├── data/                     # Tablas de datos de dotes 2024, monstruos, venenos, etc.
│   ├── styles/                   # index.css (Tokens de diseño, temas duales, animaciones)
│   ├── types/                    # Definiciones TypeScript de entidades y reglas D&D
│   ├── utils/                    # Lógica de combate, dados, transferencias y 23 tests Vitest
│   ├── App.tsx                   # Controlador raíz de vistas, guardianes y sincronización
│   └── main.tsx                  # Punto de entrada React
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 📜 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.
Material de Dungeons & Dragons, marcas y contenido referenciado pertenecen a Wizards of the Coast LLC / Hasbro bajo las licencias abiertas del Sistema d20 (SRD 5.1 & SRD 5.2 / D&D 2024).
