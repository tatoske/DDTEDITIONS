# Sistema, Seguridad y Roles: D&D T Editions

Este documento detalla la jerarquía de cuentas, la pantalla de inicio de sesión obligatoria, el guardián de vistas y el modelo económico del reino basado en **Dragones de Oro (DO)**.

---

## 1. Pantalla de Acceso Obligatoria (`LoginScreen`)
* **Primera Vista Infranqueable**: Al iniciar la aplicación sin una sesión autenticada, el usuario se encuentra con la pantalla completa de login y registro. No se expone ninguna barra de herramientas, ficha ni panel hasta autenticarse.
* **Probar Cuentas de Demostración**: Para agilizar las pruebas y sesiones guiadas, la pantalla de acceso incluye un panel de *"Probar Roles de Demostración"* que permite iniciar sesión con un solo clic como:
  1. **Super Master**: `TatoSenpaiSape@gmail.com`
  2. **Dungeon Master**: `master_elminster@dnd.com`
  3. **Jugador**: `jugador_valeros@dnd.com`

---

## 2. Jerarquía de Roles y Privilegios

### A. 👑 Super Master (El Soberano Feudal)
* **Identidad Oficial**: Correo inmutable `TatoSenpaiSape@gmail.com` con contraseña designada `Sergio123Andres123`.
* **Privilegios Exclusivos**:
  - Acceso irrestricto al **Panel Imperial**.
  - Acuñación y concesión de fondos imperiales en **Dragones de Oro (DO)** hacia los Dungeon Masters.
  - **Licencias Feudales**: Potestad única para desbloquear o revocar el acceso a **Bastiones 2024** y **Escuderos / Mascotas (Tasha)** para cualquier usuario.
  - **Asignación de Roles**: Ascender jugadores a Dungeon Masters o degradar Masters a Jugadores.
  - **Monitor de Crisis del Reino**: Recepción de alertas de campañas caídas (*failed*) con la facultad de escalar la amenaza (aumentar rango de nivel y recompensa en DO).
  - Eliminación definitiva de campañas y depuración del reino.

### B. ⚔️ Dungeon Master (El Director de la Partida)
* **Privilegios**:
  - Acceso completo a la suite de **25 Herramientas de DM** (Bestiario, Encuentros, Objetos Mágicos, Trampas, etc.).
  - Lanzamiento y publicación de nuevas misiones en el **Tablero de Campañas**.
  - Aceptación o rechazo de aventureros postulados a sus sesiones.
  - Resolución de misiones (marcar como Victoria, Retirada o Derrota).
  - Concesión de objetos, oro, Dragones de Oro y experiencia en tiempo real a las fichas de los jugadores.

### C. 🛡️ Jugador (El Aventurero)
* **Privilegios**:
  - Creación y edición interactiva de personajes con las reglas oficiales de D&D 2024.
  - Gestión de equipo, inventario, maestría de armas, espacios de conjuros y descanso.
  - Acceso a su **Bastión personal** (Nivel 5+) y **Escuderos/Mascotas**, si el Super Master le otorgó la licencia feudal.
  - Postulación de su ficha activa a las misiones publicadas en el Tablero de Campañas según su Rango de Clase.
  - Consulta de su **Grimorio de Aventuras** con el historial lacrado de victorias, derrotas y Dragones de Oro acumulados.

---

## 3. Economía Feudal: Dragones de Oro (DO)
* **Unidad Monetaria Imperial**: El **Dragón de Oro (DO)** es la moneda suprema del reino, utilizada para financiar contratos de mercenarios, recompensas de misiones de alto rango y compra de artefactos extraordinarios.
* **Circulación**:
  1. El **Super Master** genera y transfiere lotes de DO a los Dungeon Masters desde la Bóveda Imperial.
  2. El **Dungeon Master** deposita los DO como recompensa en los contratos del Tablero de Campañas o los otorga mediante el modal de recompensa rápida.
  3. Al triunfar en la campaña o recibir un botín, los **Jugadores** reciben los DO acreditados en su ficha y en su Grimorio.
