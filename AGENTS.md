# Squad Multi-Agente — D&D T Editions

Este proyecto cuenta con un **Squad Multi-Agente** configurado localmente en `.agents/agents/` listo para su ejecución coordinada:

- **Orchestrator (Tech Lead)** (`.agents/agents/orchestrator.md`): Coordina la arquitectura técnica global, lidera la toma de decisiones y delega la ejecución paso a paso a los especialistas.
- **Product Owner (PO)** (`.agents/agents/product-owner.md`): Define requerimientos, redacta historias de usuario con criterios de aceptación Gherkin (`documentacion/backlog/`) y prioriza el backlog del producto.
- **Scrum Master (SM)** (`.agents/agents/scrum-master.md`): Desglosa historias en tareas técnicas accionables, define el Definition of Done (DoD) y gestiona el flujo de trabajo.
- **DB Specialist** (`.agents/agents/db-specialist.md`): Modela esquemas relacionales y NoSQL, migraciones, scripts de seed y optimización de consultas.
- **Backend Specialist** (`.agents/agents/backend-specialist.md`): Diseña arquitecturas de servidor, endpoints y contratos de API, lógica de negocio y seguridad.
- **Frontend Specialist** (`.agents/agents/frontend-specialist.md`): Desarrolla la interfaz de usuario con diseño premium, componentes atómicos, reactividad y accesibilidad.
- **QA Specialist** (`.agents/agents/qa-specialist.md`): Diseña y ejecuta de forma autónoma suites de pruebas automatizadas (unitarias, integración y e2e).
- **Data Scientist / AI Specialist** (`.agents/agents/data-scientist.md`): Modela algoritmos, pipelines de datos, integración con modelos LLM/IA y analítica de uso.

## Flujo de Trabajo y Colaboración
1. **Definición**: PO redacta historias de usuario en `documentacion/backlog/`.
2. **Planificación**: SM desglosa tareas y dependencias; Tech Lead diseña arquitectura en `documentacion/arquitectura/`.
3. **Construcción**: Especialistas de DB, Backend, Frontend y Data/AI construyen sus módulos coordinados por el Tech Lead.
4. **Validación**: QA Specialist ejecuta y certifica suites de pruebas con cero regresiones.
