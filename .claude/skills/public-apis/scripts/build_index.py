#!/usr/bin/env python3
"""Descarga el README de public-apis/public-apis y construye el índice local.

Uso:
    python3 .claude/skills/public-apis/scripts/build_index.py [--readme RUTA]

Sin --readme descarga la versión actual desde raw.githubusercontent.com.
Escribe data/apis.json junto al skill.
"""

import argparse
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

README_URL = "https://raw.githubusercontent.com/public-apis/public-apis/master/README.md"
SKILL_DIR = Path(__file__).resolve().parent.parent
OUT_PATH = SKILL_DIR / "data" / "apis.json"

HEADER_RE = re.compile(r"^\s*\|?\s*API\s*\|\s*Description\s*\|\s*Auth\s*\|\s*HTTPS\s*\|\s*CORS", re.I)
SECTION_RE = re.compile(r"^###\s+(.+?)\s*$")
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def clean(cell: str) -> str:
    return cell.replace("`", "").strip()


def parse(readme: str):
    lines = readme.splitlines()
    entries = []
    category = None
    in_table = False

    for i, line in enumerate(lines):
        section = SECTION_RE.match(line)
        if section:
            category = section.group(1).strip()
            in_table = False
            continue

        if HEADER_RE.match(line):
            # La cabecera va seguida de la fila de separación |:---|...
            in_table = category is not None
            continue

        if not in_table:
            continue

        stripped = line.strip()
        if not stripped:
            in_table = False
            continue
        if set(stripped) <= set("|:- "):  # fila separadora
            continue
        if not stripped.startswith("|"):
            in_table = False
            continue

        cells = [c for c in stripped.strip("|").split("|")]
        if len(cells) < 5:
            continue

        link = LINK_RE.search(cells[0])
        if not link:
            continue

        name = link.group(1).strip()
        url = link.group(2).strip()
        auth = clean(cells[2]) or "No"
        entries.append(
            {
                "name": name,
                "url": url,
                "description": clean(cells[1]),
                "auth": "No" if auth.lower() in ("no", "none", "-") else auth,
                "https": clean(cells[3]),
                "cors": clean(cells[4]),
                "category": category,
            }
        )

    return entries


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--readme", help="Ruta a un README.md local en lugar de descargarlo")
    args = ap.parse_args()

    if args.readme:
        readme = Path(args.readme).read_text(encoding="utf-8")
        source = str(args.readme)
    else:
        with urllib.request.urlopen(README_URL, timeout=60) as resp:
            readme = resp.read().decode("utf-8")
        source = README_URL

    entries = parse(readme)
    if len(entries) < 500:
        print(f"ERROR: solo se parsearon {len(entries)} entradas; el formato del README pudo cambiar.", file=sys.stderr)
        return 1

    entries.sort(key=lambda e: (e["category"].lower(), e["name"].lower()))
    categories = sorted({e["category"] for e in entries})

    payload = {
        "source": source,
        "license": "MIT (public-apis/public-apis)",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "count": len(entries),
        "categories": categories,
        "entries": entries,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"OK: {len(entries)} APIs en {len(categories)} categorías -> {OUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
