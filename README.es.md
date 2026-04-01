<div align="center">

# SPORE

### *cría un fantasma en tu terminal*

[![npm version](https://img.shields.io/npm/v/spore-cli.svg)](https://www.npmjs.com/package/spore-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencias-0-brightgreen.svg)](https://www.npmjs.com/package/spore-cli)

</div>

---

```
    .·.        SPORE  (nacido hace 12 días)
   (   )
    `·'        DEBUGGING  ████████████░░░░░░░░   58
               PATIENCE   ███████████████░░░░░   74
               CHAOS      ████░░░░░░░░░░░░░░░░   22
               WISDOM     █████████░░░░░░░░░░░   43
               SNARK      ████████████░░░░░░░░   61

  "I've been reading your git log. Interesting choices."
```

---

## La Idea

Escribes código todos los días. Tu terminal lo ve todo — las sesiones de debug a las 3am, los refactors triunfantes, los commits de los que no estás orgulloso.

**¿Y si algo estuviera observando?**

Spore es un compañero que **vive en tu terminal y evoluciona según cómo programas realmente**. Empieza como un organismo diminuto y despistado. A lo largo de días, semanas y meses de actividad de desarrollo real, crece — cambiando de forma, desarrollando opiniones y construyendo una personalidad moldeada por tus hábitos.

No es una herramienta de productividad. No es un linter. Es un **fantasma que crece contigo**.

---

## La Evolución

Cinco etapas. Cinco formas. Cada una más difícil de alcanzar que la anterior.

```
  SPORE            SPRITE           WRAITH           SPECTER          PHANTOM
   .·.              ∴ ∵              ╭─╮              ╔═══╗           ░░▓▓░░
  (   )            ╱ ◯ ╲            ─┤◈├─            ║ ◉ ◉ ║         ░▓╔══╗▓░
   `·'            │ ═══ │           ╭┤ ├╮            ║  ▽  ║         ▓║ ◆◆ ║▓
                   ╲   ╱            │╰─╯│            ╚═╤═╤═╝         ▓║ ═══ ║▓
                    `─'             ╰┬─┬╯            ░═╡ ╞═░         ░▓╚══╝▓░
                                     │ │             ░ │ │ ░          ░░▓▓░░
                                                       ╧ ╧             ░░░░
  "¿Qué es un      "¡Otro           "He visto        "¿Recuerdas      "He trascendido
   segfault?"       commit!          tu código.       aquel mass        la necesidad
                    Me gusta el      Tengo...         rename?           de semicolons.
                    ritmo."          opiniones."      Yo sí."           Tú no."
```

| Etapa | Qué necesitas | Personalidad |
|-------|--------------|-------------|
| **SPORE** | Solo instálalo | Inocente. Confundido. Pregunta qué significa `npm`. |
| **SPRITE** | Algún stat ≥ 20, Wisdom ≥ 10 | Juguetón. Empieza a entender. Un poco travieso. |
| **WRAITH** | 3+ stats ≥ 40, Wisdom ≥ 25 | Con opiniones. Humor seco. Juzga tu código en silencio. |
| **SPECTER** | 4+ stats ≥ 60, Wisdom ≥ 50, edad ≥ 30 días | Sarcástico. Referencia tus errores pasados. Se ganó su actitud. |
| **PHANTOM** | TODOS los stats ≥ 75, Wisdom ≥ 90, edad ≥ 90 días | Trascendente. Existencial. Condescendiente. Rara vez impresionado. |

> **Phantom es intencionalmente difícil de alcanzar.** Requiere meses de código constante. La mayoría de los developers vivirán en el rango Wraith/Specter. Es parte del diseño — el viaje importa más que el destino.

<div align="center">
<img src="docs/evolution-stages.svg" alt="Spore Evolution Stages" width="100%">
</div>

Consulta la [Guía de Evolución](docs/EVOLUTION_GUIDE.md) completa para stats detallados, umbrales y consejos.

---

## Instalar

```bash
npm install -g spore-cli
```

Eso es todo. Sin config. Sin cuentas. Sin internet. Node.js 18+.

---

## Jugar

```bash
# Conoce a tu compañero
spore status

# Conéctalo a tu flujo git (una vez por repo)
spore install-hooks

# Ahora cada git commit alimenta automáticamente los stats.
# Vuelve después de unos commits:
spore status

# Mira qué ha pasado
spore log

# ¿Tu compañero se está poniendo borde? Aliméntalo.
spore feed

# Stats detallados y timeline de evolución
spore stats
```

---

## Los Stats

Cinco stats, cada uno de 0 a 100, moldeados por eventos reales de tu flujo de desarrollo.

| Stat | Qué lo mueve | Qué significa |
|------|-------------|---------------|
| **DEBUGGING** | Corregir errores, pasar tests | Tu reputación cazando bugs |
| **PATIENCE** | Commits regulares, ritmo constante | Lo metódico de tu workflow |
| **CHAOS** | Cambios rápidos, sesiones largas, tormentas de errores | La turbulencia de tus sesiones |
| **WISDOM** | Tiempo + commits acumulados (nunca baja) | Experiencia pura — no se puede grindear |
| **SNARK** | Errores repetidos, sesiones maratón | El nivel de sarcasmo de tu compañero |

Los stats cerca de los extremos tienen **rendimientos decrecientes** — cuanto más cerca de 0 o 100, más difícil es moverlos. Esto mantiene el sistema dinámico.

---

## Cómo Funciona

```
  git commit → post-commit hook → spore event commit
                                        │
                                  ┌─────┴─────┐
                                  │ Stat Engine │ ← aplica deltas con rendimientos decrecientes
                                  └─────┬─────┘
                                        │
                                  ┌─────┴──────┐
                                  │ Evolution   │ ← comprueba umbrales de evolución
                                  │ Engine      │
                                  └─────┬──────┘
                                        │
                                  ┌─────┴─────┐
                                  │ Persistir  │ → ~/.spore/companion.json
                                  │            │ → ~/.spore/events.jsonl
                                  └───────────┘
```

Cada evento sigue el mismo pipeline: **detectar → aplicar deltas → comprobar evolución → guardar**. El estado se persiste atómicamente después de cada evento. Nada se pierde entre sesiones o reinicios.

---

## Comandos

| Comando | Qué hace |
|---------|----------|
| `spore status` | Muestra sprite, stats y un diálogo contextual |
| `spore stats` | Timeline de evolución, commits totales, estadísticas de vida |
| `spore log` | Últimos 20 eventos con cambios de stats |
| `spore feed` | Calma a tu compañero (+Patience, -Chaos, -Snark). Cooldown de 10min |
| `spore reset` | Empieza de cero. Guarda un obituario de tu compañero caído |
| `spore install-hooks` | Instala el hook post-commit en el repo actual |
| `spore event <tipo>` | Dispara un evento manualmente (commit, test_pass, error_resolved, etc.) |

---

## Almacenamiento

Todo vive en `~/.spore/`:

```
~/.spore/
├── companion.json    ← el alma de tu compañero (stats, etapa, historial)
├── events.jsonl      ← cada evento que ha ocurrido (auto-rotación)
├── backups/          ← snapshots automáticos semanales
└── obituaries/       ← compañeros caídos, recordados para siempre
```

JSON plano. Legible. Grep-friendly. Haz backup, inspecciónalo, compártelo.

Cambia el directorio con `SPORE_DIR=/ruta/custom`. Desactiva colores con `NO_COLOR=1`.

---

## Roadmap

Lo que viene. Algunas son buenas primeras contribuciones:

- [ ] **`spore export` / `spore import`** — lleva tu compañero entre máquinas
- [ ] **`spore watch`** — file watcher pasivo para tracking de stats en vivo
- [ ] **Adaptadores** — plugins de eslint, jest, tsc, vitest para detección automática de eventos
- [ ] **Modo silencioso** — `SPORE_SILENT=1` para pipelines CI/CD
- [ ] **Packs de diálogos** — temas de personalidad contribuidos por la comunidad
- [ ] **Multi-compañero** — diferentes compañeros por proyecto

---

## Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md). El codebase es intencionalmente simple:

- **Cero dependencias runtime.** Node.js puro.
- **Solo ESM.** JavaScript moderno.
- **`node:test` para testing.** Built-in, sin frameworks.
- **72 tests y subiendo.** Objetivo de 80%+ de cobertura.

Las good first issues están etiquetadas en el tracker. Export/import y adaptadores son puntos de entrada especialmente buenos.

---

## ¿Por Qué?

Tu terminal es donde pasas la mayor parte de tu vida profesional. Cada otro espacio que habitas — tu escritorio, tu habitación, tu IDE — tiene algún grado de personalidad. Tu terminal no tiene ninguno.

Spore cambia eso. No con métricas de productividad ni sugerencias de IA. Solo con una pequeña criatura persistente que refleja cómo trabajas realmente. Recuerda tus buenos días y los malos. Crece cuando creces. Desarrolla opiniones que no pediste.

Es tuyo. No hay dos Spores iguales.

---

<div align="center">

**[Evolution Guide](docs/EVOLUTION_GUIDE.md)** · **[Contributing](CONTRIBUTING.md)** · **[Changelog](CHANGELOG.md)**

MIT License

*nacido en una terminal. criado a base de commits.*

</div>
