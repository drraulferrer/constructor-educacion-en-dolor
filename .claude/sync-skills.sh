#!/usr/bin/env bash
# Sincroniza las Agent Skills de terceros dentro de .claude/skills/.
#
# Las skills se guardan (vendorizan) en el repo a proposito: las sesiones de
# Claude Code on the web corren en contenedores efimeros, asi que cualquier cosa
# instalada en ~/.claude se pierde. Solo lo que esta commiteado en .claude/skills/
# carga de forma garantizada en todas las sesiones, sin red y sin latencia de
# arranque.
#
# Uso:  bash .claude/sync-skills.sh
#
# Volver a ejecutarlo actualiza las skills a la ultima version upstream.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$REPO_ROOT/.claude/skills"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

clone() { # <owner/repo> <destino>
  git clone --depth 1 --quiet "https://github.com/$1.git" "$WORK/$2"
}

# Copia cada subdirectorio que contenga un SKILL.md hacia .claude/skills/<nombre>
copy_skill_dirs() { # <directorio padre>
  local parent="$1" d name
  for d in "$parent"/*/; do
    [ -f "$d/SKILL.md" ] || continue
    name="$(basename "$d")"
    rm -rf "${DEST:?}/$name"
    cp -r "$d" "$DEST/$name"
    echo "  + $name"
  done
}

echo "==> Limpiando $DEST"
rm -rf "$DEST"
mkdir -p "$DEST"

echo "==> anthropics/skills (solo frontend-design)"
clone anthropics/skills anthropics
cp -r "$WORK/anthropics/skills/frontend-design" "$DEST/frontend-design"
echo "  + frontend-design"

echo "==> wondelai/skills"
clone wondelai/skills wondelai
copy_skill_dirs "$WORK/wondelai"

echo "==> coreyhaines31/marketingskills"
clone coreyhaines31/marketingskills marketingskills
copy_skill_dirs "$WORK/marketingskills/skills"

echo "==> diegosouzapw/OmniRoute"
clone diegosouzapw/OmniRoute omniroute
copy_skill_dirs "$WORK/omniroute/skills"

echo "==> rebelytics/one-skill-to-rule-them-all"
clone rebelytics/one-skill-to-rule-them-all rebelytics
# El repo es una unica skill en la raiz; las PNG de marca no se copian.
mkdir -p "$DEST/task-observer"
cp "$WORK/rebelytics/SKILL.md" "$WORK/rebelytics/USER-GUIDE.md" \
   "$WORK/rebelytics/LICENSE.txt" "$DEST/task-observer/"
cp -r "$WORK/rebelytics/references" "$DEST/task-observer/references"
echo "  + task-observer"

# headroomlabs-ai/headroom no aporta skills: su plugin son hooks de sesion que
# invocan el binario `headroom`. Se declara en .claude/settings.json como
# marketplace + plugin; ver .claude/skills/README.md.

echo
echo "==> $(find "$DEST" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l) skills en $DEST"
