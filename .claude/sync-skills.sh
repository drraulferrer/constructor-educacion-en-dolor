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
#
# Solo toca las skills que este script gestiona, listadas en
# .claude/synced-skills.txt. Las skills propias del repo (p. ej. public-apis)
# no se tocan.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$REPO_ROOT/.claude/skills"
MANIFEST="$REPO_ROOT/.claude/synced-skills.txt"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

INSTALLED=()

clone() { # <owner/repo> <destino>
  git clone --depth 1 --quiet "https://github.com/$1.git" "$WORK/$2"
}

install_skill() { # <directorio origen> <nombre>
  rm -rf "${DEST:?}/$2"
  cp -r "$1" "$DEST/$2"
  INSTALLED+=("$2")
  echo "  + $2"
}

# Copia cada subdirectorio que contenga un SKILL.md hacia .claude/skills/<nombre>
copy_skill_dirs() { # <directorio padre>
  local d
  for d in "$1"/*/; do
    [ -f "$d/SKILL.md" ] || continue
    install_skill "$d" "$(basename "$d")"
  done
}

mkdir -p "$DEST"

# Borra solo lo que gestiona este script, para no tocar las skills del repo.
if [ -f "$MANIFEST" ]; then
  echo "==> Limpiando skills gestionadas por este script"
  while IFS= read -r name; do
    [ -n "$name" ] || continue
    rm -rf "${DEST:?}/$name"
  done < "$MANIFEST"
fi

echo "==> anthropics/skills (solo frontend-design)"
clone anthropics/skills anthropics
install_skill "$WORK/anthropics/skills/frontend-design" frontend-design

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
mkdir -p "$WORK/task-observer"
cp "$WORK/rebelytics/SKILL.md" "$WORK/rebelytics/USER-GUIDE.md" \
   "$WORK/rebelytics/LICENSE.txt" "$WORK/task-observer/"
cp -r "$WORK/rebelytics/references" "$WORK/task-observer/references"
install_skill "$WORK/task-observer" task-observer

# headroomlabs-ai/headroom no aporta skills: su plugin son hooks de sesion que
# invocan el binario `headroom`. Se declara en .claude/settings.json como
# marketplace + plugin; ver .claude/skills/README.md.

printf '%s\n' "${INSTALLED[@]}" | sort > "$MANIFEST"

echo
echo "==> ${#INSTALLED[@]} skills sincronizadas en $DEST (manifiesto: $MANIFEST)"
