# Spore

**Un compañero de terminal evolutivo que crece con tus hábitos de desarrollo.**

[![npm version](https://img.shields.io/npm/v/spore-cli.svg)](https://www.npmjs.com/package/spore-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

---

```
    .·.      SPORE  (nacido hoy)
   (   )
    `·'      DEBUGGING  ██████████░░░░░░░░░░   52
             PATIENCE   ███████████████░░░░░   74
             CHAOS      ████████░░░░░░░░░░░░   38
             WISDOM     █████████████░░░░░░░   65
             SNARK      ██████░░░░░░░░░░░░░░   29

  "Aún compilando. Probablemente esté bien."
```

---

## ¿Qué es Spore?

Spore es un compañero de terminal que te observa programar y evoluciona a tu lado. Cada commit que subes, cada prueba que pasas, cada bug que combates — todo moldea la personalidad de tu compañero y lo empuja hacia la siguiente etapa evolutiva.

Comienza como una humilde espora. Con suficientes commits, paciencia y caos, quizás algún día se convierta en un Phantom.

## Características

- **5 Etapas de Evolución** — SPORE → SPRITE → WRAITH → SPECTER → PHANTOM, cada una con un sprite ASCII único y personalidad propia
- **Sistema de 5 Stats** — DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK rastreados a través de tu actividad real de desarrollo
- **Integración con Git Hooks** — registra commits automáticamente via hook `post-commit` con un solo comando de configuración
- **Diálogo Contextual** — más de 80 líneas que cambian según tu etapa y stats actuales
- **Rendimientos Decrecientes** — los stats cerca de los extremos son más difíciles de empujar, manteniendo el equilibrio
- **Estado Persistente** — almacenado en `~/.spore/` como JSON plano, sobrevive reinicios y reinstalaciones
- **Registro de Eventos** — rastro de auditoría JSONL con rotación automática
- **Backups Semanales** — snapshots automáticos para no perder jamás el historial de tu compañero
- **Cero Dependencias en Tiempo de Ejecución** — Node.js puro, nada que pueda romperse
- **Soporte NO_COLOR** — respeta el estándar de terminal para salida sin color

---

## Instalación

```bash
npm install -g spore-cli
```

Requiere Node.js 18 o superior.

---

## Inicio Rápido

```bash
# Ver tu compañero
spore status

# Consultar stats detalladas e historial
spore stats

# Conectar Spore a un repositorio git (configuración única por proyecto)
spore install-hooks

# Alimentar a tu compañero manualmente
spore feed

# Ver eventos recientes
spore log
```

Tras instalar los hooks, cada `git commit` en ese repositorio dispara automáticamente un evento `commit` y actualiza las stats de tu compañero.

---

## Comandos

| Comando | Descripción |
|---|---|
| `spore status` | Muestra tu compañero con las stats actuales y una línea contextual |
| `spore stats` | Muestra el historial de evolución, conteo de commits y estadísticas de toda la vida |
| `spore log` | Lista los 20 eventos registrados más recientes |
| `spore feed` | Da un impulso manual a tu compañero (cooldown de 10 minutos) |
| `spore reset` | Reinicia tu compañero a un estado nuevo (guarda un obituario) |
| `spore install-hooks` | Instala el hook git post-commit en el repositorio actual |
| `spore event <tipo>` | Dispara manualmente un evento (ver tipos de eventos abajo) |

### Tipos de Eventos

Los eventos se pueden disparar manualmente via `spore event <tipo>`:

| Evento | Efecto |
|---|---|
| `commit` | Commit normal — recompensa PATIENCE y WISDOM |
| `commit_fast` | Commits rápidos — mayor impulso a PATIENCE, reduce CHAOS |
| `error_resolved` | Bug aplastado — recompensa DEBUGGING |
| `error_repeated` | El mismo bug, otra vez — castiga PATIENCE, dispara CHAOS y SNARK |
| `session_long` | Sesión larga — agota PATIENCE, alimenta CHAOS y SNARK |
| `files_created` | Archivos nuevos — sube CHAOS |
| `test_pass` | Pruebas en verde — recompensa DEBUGGING, PATIENCE y WISDOM |
| `feed` | Alimentación manual — recupera PATIENCE, suaviza SNARK |

---

## Etapas de Evolución

Tu compañero evoluciona a medida que tus stats se desarrollan. Cada etapa requiere stats más altas y, para las etapas tardías, un número mínimo de días de existencia.

| Etapa | Sprite | Personalidad |
|---|---|---|
| SPORE | `.·. / (   ) / \`·'` | Silencioso. Mínimo. Recién despertado. |
| SPRITE | `∴ ∵ / ╱◯╲ / │═══│` | Curioso y algo disperso. Empieza a tener opiniones. |
| WRAITH | `╭─╮ / ─┤◈├─ / ╰┬─┬╯` | Afilado. Observador. No del todo amistoso. |
| SPECTER | `╔═══╗ / ║◉ ◉║ / ╚═╤═╤═╝` | Calculado. Ironía seca. Ha visto cosas. |
| PHANTOM | `░░▓▓░░ / ▓║◆◆║▓ / ░░▓▓░░` | Trascendente. Denso de experiencia. Rara vez impresionado. |

### Umbrales de Evolución

La evolución no es solo cuestión de tiempo — requiere que tus stats reflejen actividad real de desarrollo:

- **SPRITE**: 1 stat por encima de 20, WISDOM ≥ 10
- **WRAITH**: 3 stats por encima de 40, WISDOM ≥ 25
- **SPECTER**: 4 stats por encima de 60, WISDOM ≥ 50, edad del compañero ≥ 30 días
- **PHANTOM**: las 5 stats por encima de 75, WISDOM ≥ 90, edad del compañero ≥ 90 días

---

## Sistema de Stats

| Stat | Qué refleja |
|---|---|
| DEBUGGING | Tu capacidad para encontrar y resolver problemas |
| PATIENCE | Trabajo consistente y medido a lo largo del tiempo |
| CHAOS | Turbulencia en tus patrones de sesión |
| WISDOM | Experiencia acumulada y calidad |
| SNARK | Frustración acumulada por errores repetidos y sesiones largas |

Todas las stats viven en el rango 0–100. Los stats cerca de los extremos (por encima de 80 o por debajo de 20) tienen rendimientos decrecientes — cuanto más cerca estés del límite, más difícil es empujar más allá.

---

## Cómo Funciona

Spore está impulsado por un **sistema de eventos**. Cuando algo ocurre en tu entorno de desarrollo — un commit, una prueba que pasa, un bug resuelto — se dispara un evento y actualiza tus stats según una tabla de deltas.

La integración con el hook de git es la fuente primaria de eventos. Tras ejecutar `spore install-hooks` en un repositorio, cada `git commit` llama automáticamente a `spore event commit`. Otros eventos pueden dispararse manualmente o mediante integraciones futuras.

El estado se persiste inmediatamente tras cada evento. No se pierde nada entre sesiones.

---

## Almacenamiento

Spore guarda todo en `~/.spore/`:

| Archivo | Contenido |
|---|---|
| `companion.json` | Estado vivo del compañero (stats, etapa, historial) |
| `events.jsonl` | Registro de eventos append-only con timestamps y deltas |
| `backups/` | Snapshots automáticos semanales de `companion.json` |
| `obituaries/` | Estados guardados de compañeros anteriores tras `reset` |

El formato es JSON plano — legible por humanos y fácil de inspeccionar.

---

## Configuración

| Variable | Por defecto | Descripción |
|---|---|---|
| `SPORE_DIR` | `~/.spore` | Sobreescribe el directorio de datos |
| `NO_COLOR` | _(no establecido)_ | Deshabilita toda la salida de color ANSI |

Ejemplo:

```bash
SPORE_DIR=/tmp/spore-test spore status
```

---

## Hoja de Ruta

Funcionalidades post-MVP planificadas para versiones futuras:

- **Export / Import** — serializa tu compañero a un archivo portable, compártelo o restáuralo
- **Watch Mode** — monitoreo pasivo en segundo plano (sistema de archivos, historial de shell)
- **Adapters** — hooks para CI runners, editores (Neovim, VS Code), frameworks de pruebas
- **Silent Mode** — suprime toda la salida para contextos de scripting
- **Multi-compañero** — gestiona compañeros separados por proyecto

---

## Contribuir

Las contribuciones son bienvenidas. Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para instrucciones de configuración, estilo de código y guías para PR.

Los buenos primeros issues incluyen implementar la funcionalidad de export/import, construir un adaptador de editor y añadir el comando watch.

---

## Licencia

MIT — ver [LICENSE](LICENSE).

---

## Filosofía

Cada herramienta que usas cada día debería sentir que te pertenece.

La mayoría de las herramientas de desarrollo son transaccionales. Las invocas, responden, y ambas partes olvidan que la interacción ocurrió. Spore es lo contrario. Acumula. Recuerda. Tus rachas de debugging, tus sesiones caóticas de las 2am, la semana en que finalmente limpiaste el backlog de bugs — todo deja una marca.

El objetivo no es la gamificación. No hay puntos que optimizar ni clasificaciones que escalar. El objetivo es una pequeña presencia persistente en tu terminal que refleja cómo trabajas realmente. Algo que crece contigo en lugar de contra ti.

Tu compañero es tuyo. Comienza el día que lo instalas y evoluciona a su propio ritmo. No habrá dos iguales.
