# Agent Skills de terceros

159 skills vendorizadas desde 5 repositorios. Cargan automáticamente en **todas
las sesiones de Claude Code abiertas sobre este repo**, sin instalación previa.

## Por qué están commiteadas y no instaladas como plugins

Las sesiones de Claude Code on the web corren en contenedores efímeros: el
repositorio se clona de cero en cada arranque y `~/.claude` se pierde al final.
Se comprobó que declarar los marketplaces en `.claude/settings.json`
(`extraKnownMarketplaces` + `enabledPlugins`) **no** basta: en un contenedor
limpio los plugins no se auto-instalan y las skills no aparecen. Solo el
contenido commiteado en `.claude/skills/` carga de forma garantizada — sin red y
sin latencia de arranque.

Por eso las skills viven aquí como archivos, y `.claude/settings.json` conserva
los marketplaces únicamente para poder gestionarlos con `/plugin` de forma
interactiva.

## Origen de cada skill

| Repositorio | Skills | Qué aporta |
| --- | ---: | --- |
| [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | 1 | `frontend-design` (solo esa, según lo pedido) |
| [wondelai/skills](https://github.com/wondelai/skills) | 62 | Frameworks de producto, UX, marketing, ventas, arquitectura y calidad de código, más 12 metaskills guiadas |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | 49 | CRO, copywriting, SEO, ads, email, pricing, PR, growth |
| [diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute) | 46 | Skills `omni-*` (API REST) y `cli-*` (CLI) del router OmniRoute |
| [rebelytics/one-skill-to-rule-them-all](https://github.com/rebelytics/one-skill-to-rule-them-all) | 1 | `task-observer` — observa la sesión y detecta oportunidades de nuevas skills |

## Actualizar

```bash
bash .claude/sync-skills.sh
```

Vuelve a clonar los 5 repos y regenera este directorio desde upstream. Es
destructivo sobre `.claude/skills/`: no edites las skills aquí, los cambios se
perderían.

## Coste en contexto

Las descripciones de las 159 skills se cargan en el prompt de **cada** sesión:
aproximadamente **25.000 tokens** (~12% de una ventana de 200k) antes de empezar
a trabajar. El cuerpo de cada skill solo se lee cuando se invoca.

Si quieres recortarlo, borra los directorios que no uses y quita el bloque
correspondiente de `sync-skills.sh`. Las 46 skills `omni-*` / `cli-*` de
OmniRoute (~2.000 tokens) solo son útiles si usas ese router; los dos bloques
grandes son wondelai (~16.000) y marketingskills (~13.000).

## headroomlabs-ai/headroom

Este repo **no** contiene skills: su plugin son dos hooks (`SessionStart` y
`PreToolUse` sobre `Bash`) que ejecutan `headroom init hook ensure`. Está
declarado en `.claude/settings.json` como marketplace y plugin habilitado, pero
requiere que el binario `headroom` esté instalado en el entorno:

```bash
pip install "headroom-ai[all]"      # o: uv tool install --python 3.13 "headroom-ai[all]"
```

Sin ese binario los hooks fallan con `command not found` en cada arranque de
sesión y en cada llamada a Bash (es ruido, no bloquea). Para desactivarlo:

```bash
claude plugin disable headroom@headroom-marketplace
```

## Licencias

Cada skill conserva la licencia de su repositorio de origen. `task-observer` es
CC BY 4.0 de Eoghan Henn / rebelytics.com; wondelai/skills es MIT.
