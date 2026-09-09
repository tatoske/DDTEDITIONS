import { CompanionId, CompanionPersona, ChatAction } from '../types/assistant';
import { UserRole } from '../types/dnd';
import { findPdfReference } from './companionPdfSearch';

export const COMPANION_PERSONAS: Record<CompanionId, CompanionPersona> = {
  elara: {
    id: 'elara',
    name: 'Elara Rompealbas',
    title: 'Aventurera Novicia',
    subtitle: 'Aventurera Novicia • Guía del Jugador',
    roleTarget: 'player',
    portraitUrl: '/companions/elara.jpg',
    stats: {
      hp: 12,
      maxHp: 12,
      dex: 15,
      str: 12
    },
    personality: 'Valiente, honesta, compañera leal y práctica. Conoce de primera mano los peligros de los caminos y las reglas de combate.',
    greeting: '¡Saludos, camarada de armas! Soy Elara. He tomado mi espada de hierro y mi capa para recorrer este reino contigo. Si tienes dudas sobre tu ficha de personaje, tus ataques, maestría con armas 2024, descansos o cómo postularte en el tablero de campañas, ¡pregúntame y lucharemos juntos!',
    badgeColor: '#b45309',
    quickPrompts: [
      {
        id: 'p_topple',
        label: '🗡️ ¿Cómo funciona Derribar (Topple)?',
        query: '¿Cómo funciona la maestría con armas Topple (Derribar) en D&D 2024?'
      },
      {
        id: 'p_quest',
        label: '📜 ¿Cómo me postulo a una campaña?',
        query: '¿Cómo me postulo a una misión en el Tablero de Campañas y qué requisitos pide?'
      },
      {
        id: 'p_bastion',
        label: '🏰 ¿Cómo funciona mi Bastión a Nivel 5?',
        query: '¿Cómo reclamo mi Bastión y por qué está bloqueado por el Super Master?'
      },
      {
        id: 'p_rest',
        label: '🏕️ ¿Cómo funcionan los descansos?',
        query: '¿Cómo recupero vida y espacios de conjuros con descanso corto y descanso largo?'
      },
      {
        id: 'p_grimoire',
        label: '📖 ¿Dónde veo mis victorias y Dragones de Oro?',
        query: '¿Cómo funciona mi Grimorio de Aventuras y mi Rango de Héroe?'
      }
    ]
  },
  mimic: {
    id: 'mimic',
    name: 'Grimorio Mímico "Dienteazur"',
    title: 'Tomo Mímico Legendario',
    subtitle: 'Tome Mimic • Asesor del Dungeon Master',
    roleTarget: 'dm',
    portraitUrl: '/companions/mimic.jpg',
    stats: {
      hp: 28,
      maxHp: 28,
      dex: 16,
      str: 14
    },
    personality: 'Misterioso, mordaz pero leal al Master, amante de los dados y los botines brillantes. Conoce al dedillo todas las 25 herramientas del DM.',
    greeting: '*¡Grrr... Clic-clac!* (El tomo de cuero se abre, parpadea con su ojo zafiro y exhibe relucientes colmillos dorados). ¡Ah, mi amo y señor de la mazmorra! Soy Dienteazur. No muerdo a quienes me alimentan con buenas historias. ¿Necesitas calcular un encuentro, otorgar un botín DMG 2024 a tus jugadores, o desatar una trampa letal? Solo susúrramelo...',
    badgeColor: '#1d4ed8',
    quickPrompts: [
      {
        id: 'm_reward',
        label: '🎁 ¿Cómo otorgo botín o DO a un jugador?',
        query: '¿Cómo puedo entregar objetos mágicos, dinero o Dragones de Oro a mis jugadores desde mis herramientas de DM?'
      },
      {
        id: 'm_categories',
        label: '🗂️ ¿Cómo están organizadas las herramientas de DM?',
        query: 'Explícame las 5 categorías maestras de herramientas de DM y qué incluye cada una.'
      },
      {
        id: 'm_chase',
        label: '🏃 Dame una complicación de persecución',
        query: 'Dame una complicación oficial para una persecución urbana o salvaje con su tirada de salvación.'
      },
      {
        id: 'm_encounter',
        label: '⚔️ ¿Cómo balanceo un encuentro de combate?',
        query: '¿Cómo uso el Bestiario y el Rastreador de Encuentros para equilibrar la dificultad?'
      },
      {
        id: 'm_traps',
        label: '⚠️ ¿Cómo uso las trampas de mazmorra?',
        query: '¿Cómo funcionan las trampas complejas de la DMG 2024 y cómo desafiar a los pícaros?'
      }
    ]
  },
  archmage: {
    id: 'archmage',
    name: 'Archimago Aurelius',
    title: 'Dungeon Master Supremo',
    subtitle: 'Cronista Supremo • Mentor del Super Master',
    roleTarget: 'supermaster',
    portraitUrl: '/companions/archmage.jpg',
    stats: {
      hp: 120,
      maxHp: 120,
      dex: 14,
      str: 10,
      int: 22
    },
    personality: 'Majestuoso, omnisciente, solemne y ecuánime. Custodia los hilos del destino, la economía de Dragones de Oro y el equilibrio de todas las mesas.',
    greeting: 'Que la armonía de los planos ilumine tu juicio, Soberano. Soy Aurelius, Cronista Supremo. Mi báculo canaliza los hilos del destino y las leyes de este reino. Si requieres acuñar y transferir Dragones de Oro, conceder licencias de Bastión, nombrar nuevos Masters o intervenir en misiones en crisis, aquí estoy para servir a tu decreto.',
    badgeColor: '#d4af37',
    quickPrompts: [
      {
        id: 's_gold',
        label: '🪙 ¿Cómo transfiero Dragones de Oro?',
        query: '¿Cómo funciona la transferencia oficial de Dragones de Oro a los Dungeon Masters desde la Bóveda Imperial?'
      },
      {
        id: 's_feudal',
        label: '🔒 ¿Cómo gestiono las licencias feudales?',
        query: '¿Cómo desbloqueo o bloqueo el acceso a Bastiones 2024 y Escuderos de Tasha para los usuarios?'
      },
      {
        id: 's_crisis',
        label: '🚨 ¿Cómo intervengo en campañas caídas?',
        query: '¿Cómo funciona la alerta de misiones fallidas y cómo puedo escalar la amenaza y la recompensa en DO?'
      },
      {
        id: 's_roles',
        label: '👑 ¿Cómo nombro a nuevos Dungeon Masters?',
        query: '¿Cómo puedo ascender a un jugador al rol de Dungeon Master o modificar sus privilegios?'
      }
    ]
  }
};

/**
 * Retorna el compañero por defecto según el rol del usuario actual
 */
export function getDefaultCompanionForRole(role: UserRole | 'supermaster'): CompanionPersona {
  if (role === 'supermaster') return COMPANION_PERSONAS.archmage;
  if (role === 'dm') return COMPANION_PERSONAS.mimic;
  return COMPANION_PERSONAS.elara;
}

/**
 * Generador interno de respuestas base
 */
function getRawCompanionResponse(
  companionId: CompanionId,
  q: string,
  raw: string,
  _context?: any
): { text: string; actions?: ChatAction[] } {
  const companion = COMPANION_PERSONAS[companionId];

  // -------------------------------------------------------------
  // 1. ELARA (JUGADORES)
  // -------------------------------------------------------------
  if (companionId === 'elara') {
    // Maestría con Armas
    if (q.includes('topple') || q.includes('derribar')) {
      return {
        text: `**🗡️ Maestría con Armas 2024: Derribar (*Topple*)**\n\n¡Es una de mis técnicas favoritas con armas contundentes o de asta, camarada! Funciona así:\n\n1. Cuando impactas a una criatura con tu arma y le haces daño, puedes forzarla a hacer una **Tirada de Salvación de Constitución**.\n2. **CD de Salvación:** \`8 + tu Bonificador de Competencia + tu Modificador de Característica de ataque\` (FUE o DES).\n3. Si la criatura falla, ¡cae inmediatamente **Derribada (*Prone*)**!\n\n> *Consejo de Elara:* Si cae Derribada, todos los ataques cuerpo a cuerpo a menos de 1.5 metros contra ella tendrán **Ventaja**. ¡Tus aliados te lo agradecerán!`,
        actions: [
          { label: '🎲 Tirar salvación de CON (CD 13)', actionType: 'roll', payload: { dice: '1d20+2' } }
        ]
      };
    }

    if (q.includes('graze') || q.includes('rozar')) {
      return {
        text: `**⚔️ Maestría con Armas 2024: Rozar (*Graze*)**\n\n¡Excelente para armas pesadas como el Espadón o la Guja!\n\nSi realizas una tirada de ataque contra una criatura y **fallas**, de todos modos le infliges daño igual al **modificador de característica** usado en el ataque (ej. +3 si tienes 16 de Fuerza). ¡Nunca desperdicias un turno!`
      };
    }

    if (q.includes('nick') || q.includes('tajo') || q.includes('dos armas')) {
      return {
        text: `**🗡️ Maestría con Armas 2024: Tajo Rápido (*Nick*)**\n\n¡Un cambio glorioso para los ágiles con dagas o cimitarras! En D&D 2024, la propiedad *Nick* te permite hacer el ataque adicional con tu segunda arma como **parte de la misma acción de Atacar**, liberando tu **Acción Adicional** para usar astucias, hechizos o pócimas.`
      };
    }

    if (q.includes('bastion') || q.includes('bastión')) {
      return {
        text: `**🏰 Tu Bastión Personal (Reglas D&D 2024 - Nivel 5+)**\n\nAl alcanzar el Nivel 5, tu héroe puede reclamar una fortaleza propia. En tu Bastión puedes edificar instalaciones especiales:\n- Forja arcana para templar armaduras.\n- Laboratorio alquímico para sintetizar pócimas curativas.\n- Santuario o jardín sagrado.\n\n🔒 *Nota Imperial:* Por decreto del reino, el módulo de Bastión requiere la **Licencia Feudal del Super Master**. Si te aparece bloqueado, pídele al Super Master que te active el privilegio desde su Panel Imperial.`
      };
    }

    if (q.includes('campaña') || q.includes('postul') || q.includes('mision') || q.includes('tablero')) {
      return {
        text: `**📜 Tablero de Campañas y Rangos de Héroe**\n\nEn el **Tablero de Campañas** los Masters anuncian contratos para el reino:\n\n- **Rangos de Clase:** Desde **Clase F** (Niveles 1-2) hasta **Clase SS+** (Nivel 20 legendario).\n- **Cómo postularte:** Selecciona tu aventurero activo en la cabecera. Si cumples con el nivel mínimo del contrato, pulsa *"Postular mi Ficha"*. El Dungeon Master revisará tu postulación y te admitirá en la sesión.\n- **Botín:** Al ganar, recibirás la gloria y tu parte pactada en **Dragones de Oro (DO)** depositada en tu Grimorio.`
      };
    }

    if (q.includes('descanso') || q.includes('rest') || q.includes('vida') || q.includes('curar')) {
      return {
        text: `**🏕️ Descansos en D&D 2024**\n\n- **Descanso Corto (1 hora):** Puedes gastar Dados de Golpe (DG) para recuperar PG. Tiras tu dado de clase (ej. 1d10 para Guerrero) y sumas tu modificador de Constitución.\n- **Descanso Largo (8 horas):** Recuperas **todos tus Puntos de Golpe**, la mitad de tus Dados de Golpe gastados y todos tus espacios de conjuro.`
      };
    }

    if (q.includes('grimorio') || q.includes('dragon de oro') || q.includes('do') || q.includes('rango')) {
      return {
        text: `**📖 Tu Grimorio de Aventuras & Dragones de Oro (DO)**\n\nEn la pestaña **Grimorio**, tu personaje tiene un libro histórico encuadernado en piel:\n- **Rango de Héroe:** Se calcula según tu nivel actual (ej. Nivel 5 = Héroe Clase D).\n- **Bolsa de Dragones de Oro (DO):** La moneda imperial ganada en campañas.\n- **Crónicas de Aventuras:** Cada victoria, derrota o retirada queda sellada con notas del Dungeon Master para la posteridad.`
      };
    }

    // Default Elara response
    return {
      text: `Entiendo lo que buscas, compañero. Como aventurera te aconsejo revisar tu **Ficha de Personaje** para verificar tus armas, competencias y Puntos de Golpe. Recuerda que con las reglas de D&D 2024 puedes aprovechar al máximo tus **Maestrías con Armas**, tus **Dotes de Origen** y lanzar dados con efectos cinematográficos desde cualquier habilidad.`
    };
  }

  // -------------------------------------------------------------
  // 2. DIENTEAZUR (DUNGEON MASTER)
  // -------------------------------------------------------------
  if (companionId === 'mimic') {
    if (q.includes('recompensa') || q.includes('otorgar') || q.includes('dar') || q.includes('botin') || q.includes('oro')) {
      return {
        text: `*¡Krak-clic!* (Dienteazur abre sus páginas con avidez).\n\n**🎁 Cómo Conceder Botín y Recompensas a tus Jugadores:**\n\n1. **Barra Superior de DM:** En la parte alta verás el selector *"Aventurero Destinatario en Mesa"*. Elige al personaje que recibirá el premio.\n2. **Botón Rápido:** Pulsa **"🎁 Conceder Recompensa a [Aventurero]"** para abrir el modal inmediato.\n3. **Tipos de Recompensa:**\n   - *Preset Oficial DMG 2024:* Selecciona pociones, botas de velocidad, capas, etc.\n   - *Objeto Personalizado:* Ponle nombre y estadísticas ad-hoc.\n   - *Monedas y Dragones de Oro (DO):* Se transfieren a su bolsa con registro en su Grimorio.\n   - *Experiencia (XP):* Otorga puntos con detección automática de subida de nivel.\n4. **Generador de Tesoros:** En la categoría *🪙 Tesoro, Botín & Tiendas* puedes generar tesoros por CR y pulsar *"Reparto Equitativo al Grupo"* para repartir el oro entre todos.`
      };
    }

    if (q.includes('categoria') || q.includes('herramienta') || q.includes('organiza')) {
      return {
        text: `*¡Mmm, delicioso orden arcano!* Las 25 herramientas del DM ahora están pulcramente divididas en **5 Categorías Maestras**:\n\n1. **⚔️ Combate & Encuentros:** Bestiario, Creador de Monstruos, Rastreador de Encuentros y Tácticas de Volo.\n2. **🪙 Tesoro, Botín & Tiendas:** Generador de Tesoros DMG 2024, Objetos Mágicos y Tiendas/Mercados.\n3. **📜 Compendio & Reglas 2024:** Grimorio de Conjuros, Dotes 2024, Especies del Multiverso, Reglas Rápidas y Biblioteca PDF (11 libros).\n4. **🧪 Entorno, Peligros & Alquimia:** Venenos & Alquimia, Trampas Complejas, Biomas, Persecuciones y Clima/Navegación.\n5. **👑 Crónicas & Mitología:** Dossier de Vecna, Guía de Dragones, Patronos de Grupo, Ravenloft/Tarokka, Marcas del Dragón y Escuderos de Tasha.\n\n> *Truco de Dienteazur:* ¡Usa la barra de búsqueda rápida *"🔍 Filtrar herramientas..."* para saltar a cualquiera sin hacer clic en pestañas!`
      };
    }

    if (q.includes('persecucion') || q.includes('chase') || q.includes('complicacion')) {
      const complications = [
        '¡Una carreta de barriles de cerveza vuelca en la calle estrecha! (Salvación de Destreza CD 13 o caer Derribado).',
        '¡Un enjambre de cuervos o murciélagos asustados ciega la visión! (Salvación de Constitución CD 12 o sufrir desventaja en el siguiente movimiento).',
        '¡La muchedumbre del mercado se cierra en pánico! (Prueba de Fuerza/Atletismo CD 14 para abrirse paso a empujones).',
        '¡Un perro guardián encadenado se lanza ladrando furioso! (Prueba de Sabiduría/Trato con Animales CD 11 o perder 3 metros de velocidad).'
      ];
      const randomComp = complications[Math.floor(Math.random() * complications.length)];

      return {
        text: `*¡Je, je, je!* Aquí tienes una complicación oficial al vuelo de la DMG 2024 para tu persecución:\n\n> 🚨 **${randomComp}**\n\n*Regla Clave:* En D&D 2024 los participantes pueden realizar carreras libres un número de veces igual a **3 + Modificador de Constitución**. Tras eso, cada carrera adicional requiere una Salvación de CON CD 10 para evitar un nivel de agotamiento.`
      };
    }

    if (q.includes('encuentro') || q.includes('bestiario') || q.includes('balance') || q.includes('cr')) {
      return {
        text: `**⚔️ Balance de Encuentros & Bestiario:**\n\n- Entra a **⚔️ Combate & Encuentros -> Bestiario Oficial**.\n- Usa los filtros de CR (Desafío) para encontrar criaturas adecuadas para el nivel del grupo.\n- Pulsa **"Añadir al Encuentro"** en cada monstruo y luego ve a **Rastreador de Encuentros** para iniciar el combate con tirada de iniciativa y seguimiento de puntos de golpe.`
      };
    }

    if (q.includes('trampa') || q.includes('cripta') || q.includes('veneno')) {
      return {
        text: `**⚠️ Trampas y Peligros de la DMG 2024:**\n\nEn **🧪 Entorno & Alquimia -> Trampas Complejas & Criptas** encontrarás trampas con sus valores canónicos de Detección (Percepción Pasiva), Desactivación con Herramientas de Ladrón y gravedades de daño (Retraso, Peligro, Mortal). ¡Perfecto para hacer sudar a los pícaros!`
      };
    }

    // Default Mimic response
    return {
      text: `*¡Chasquido de dientes!* Todo está bajo control en tu pantalla de Master. Recuerda que puedes seleccionar al aventurero en la barra superior para premiarlo con oro o reliquias mágicas, o navegar entre las 5 categorías de combate, tesoro, compendio, peligros y mitología. ¿Qué pesadilla quieres planear ahora?`
    };
  }

  // -------------------------------------------------------------
  // 3. ARCHIMAGO AURELIUS (SUPER MASTER)
  // -------------------------------------------------------------
  if (companionId === 'archmage') {
    if (q.includes('dragon de oro') || q.includes('transfer') || q.includes('boveda') || q.includes('oro') || q.includes('do')) {
      return {
        text: `**🪙 Economía Imperial & Transferencias de Dragones de Oro (DO)**\n\nSoberano, como Super Master tú posees la custodia de la Bóveda Imperial con saldo infinito (∞ DO):\n\n1. Ve a la pestaña **👑 Panel Imperial**.\n2. En el panel lateral izquierdo verás la sección *"Transferencia Imperial de Dragones de Oro"*.\n3. Selecciona el **Dungeon Master** destinatario en el menú desplegable.\n4. Introduce la cantidad de Dragones de Oro a transferir y añade el motivo oficial (ej. *"Subvención para campaña de la Torre Carmesí"*).\n5. Pulsa **"Emitir Transferencia Oficial"**. El dinero se acreditará de inmediato en el monedero del Master para que pueda financiar contratos en el Tablero de Campañas.`
      };
    }

    if (q.includes('feudal') || q.includes('licencia') || q.includes('bastion') || q.includes('escudero') || q.includes('bloque')) {
      return {
        text: `**🔒 Control de Licencias Feudales (Bastiones & Escuderos)**\n\nPara preservar el orden y la estabilidad de las mesas de juego, los módulos de **Bastiones (Reglas 2024)** y **Escuderos / Mascotas (Tasha)** se encuentran bajo reserva imperial:\n\n- En el **Panel Imperial**, en la tabla de usuarios registrados, cada aventurero o Master posee dos interruptores feudales:\n  1. 🏰 **Licencia de Bastión** (Nvl 5+)\n  2. 🛡️ **Licencia de Escuderos & Mascotas**\n- Puedes alternar estas licencias con un solo clic para autorizar a usuarios de confianza o restringirlos según las necesidades de tu campaña.`
      };
    }

    if (q.includes('rol') || q.includes('nombra') || q.includes('ascen') || q.includes('master') || q.includes('usuario')) {
      return {
        text: `**👑 Asignación de Roles & Privilegios Imperiales**\n\nSolo tú tienes la autoridad de conferir y revocar títulos en el reino:\n\n- En el **Panel Imperial**, abre la pestaña *"Asignación de Roles & Privilegios"*.\n- Selecciona cualquier usuario registrado en el formulario de Decreto Imperial.\n- Elige su nuevo rol: **Dungeon Master** (le otorga las 25 herramientas y facultad de crear campañas) o **Jugador**.\n- *Garantía de Seguridad:* Tu cuenta soberana (\`TatoSenpaiSape@gmail.com\`) es sagrada e inmutable; nadie puede degradarla ni alterarla.`
      };
    }

    if (q.includes('alerta') || q.includes('crisis') || q.includes('fallid') || q.includes('escal') || q.includes('derrota')) {
      return {
        text: `**🚨 Intervención en Campañas Caídas & Escalado de Amenaza**\n\nCuando una partida termina en derrota (*failed*), el sistema enciende una insignia parpadeante de **ALERTA** en tu barra superior:\n\n1. En el **Monitor de Campañas en Curso**, localiza la misión caída.\n2. Pulsa en la consola de intervención suprema.\n3. **Escalado de Amenaza:** Puedes elevar el nivel mínimo requerido, ascender su Rango de Clase (ej. de Clase D a Clase C o B) e inyectar un bono de Dragones de Oro para atraer a mercenarios de élite, reabriendo la misión al gremio.\n4. **Borrado Definitivo:** Solo el Super Master posee el poder de eliminar por completo un contrato fallido si decides que la amenaza ha sido borrada del mapa.`
      };
    }

    // Default Aurelius response
    return {
      text: `El trono imperial vela por la salud del reino, Soberano. Desde tu Panel Imperial puedes supervisar todas las mesas activas, distribuir fondos en Dragones de Oro, conceder licencias feudales para Bastiones y Escuderos, y asegurar que ningún Dungeon Master se desvíe del orden sagrado de las reglas.`
    };
  }

  return {
    text: `¡Saludos! Estoy aquí para acompañarte en tus aventuras por D&D T Editions. Pregúntame sobre reglas, herramientas, misiones o economía del reino.`
  };
}

/**
 * Motor de Generación de Respuestas Inteligentes enriquecido con los 11 Manuales PDF
 */
export function generateCompanionResponse(
  companionId: CompanionId,
  rawQuery: string,
  context?: any
): { text: string; actions?: ChatAction[] } {
  const raw = rawQuery.toLowerCase().trim();
  const q = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const baseResponse = getRawCompanionResponse(companionId, q, raw, context);

  // Buscar cita oficial en los 11 manuales PDF
  const pdfRef = findPdfReference(rawQuery);
  if (pdfRef && !baseResponse.text.includes(pdfRef.bookTitle)) {
    baseResponse.text += `\n\n> 📖 **Cita Oficial en Manuales:** ${pdfRef.bookTitle} (${pdfRef.chapter}, ${pdfRef.pages})\n> *"${pdfRef.snippet}"*`;
    baseResponse.actions = [
      ...(baseResponse.actions || []),
      {
        label: `📖 Cita: ${pdfRef.bookTitle.split('(')[0].trim()} (${pdfRef.pages})`,
        actionType: 'info',
        payload: { pdfRef }
      }
    ];
  }

  return baseResponse;
}
