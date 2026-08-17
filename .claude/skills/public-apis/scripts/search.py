#!/usr/bin/env python3
"""Busca en el índice local de public-apis.

Ejemplos:
    python3 .claude/skills/public-apis/scripts/search.py salud
    python3 .claude/skills/public-apis/scripts/search.py "ejercicio fitness" --no-auth
    python3 .claude/skills/public-apis/scripts/search.py --category Health
    python3 .claude/skills/public-apis/scripts/search.py --list-categories
    python3 .claude/skills/public-apis/scripts/search.py imagenes --no-auth --cors --json
"""

import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "apis.json"

# Sinónimos ES -> EN (la lista original está en inglés).
SYNONYMS = {
    "salud": ["health", "medical", "medicine", "clinical"],
    "sanitario": ["health", "medical"],
    "medicina": ["medicine", "medical", "drug", "health"],
    "medico": ["medical", "doctor", "health"],
    "dolor": ["pain", "health", "medical"],
    "farmaco": ["drug", "medicine", "pharma"],
    "farmacos": ["drug", "medicine", "pharma"],
    "medicamento": ["drug", "medicine"],
    "medicamentos": ["drug", "medicine"],
    "enfermedad": ["disease", "health"],
    "enfermedades": ["disease", "health"],
    "nutricion": ["nutrition", "food", "diet"],
    "alimentacion": ["food", "nutrition", "diet"],
    "comida": ["food"],
    "ejercicio": ["exercise", "workout", "fitness"],
    "deporte": ["sports", "fitness"],
    "deportes": ["sports"],
    "sueno": ["sleep"],
    "ciencia": ["science", "scientific"],
    "cientifico": ["science", "scientific"],
    "articulo": ["article", "paper", "publication"],
    "articulos": ["article", "paper", "publication"],
    "investigacion": ["research", "science"],
    "libro": ["book"],
    "libros": ["books"],
    "cita": ["quote", "citation"],
    "citas": ["quotes", "citation"],
    "imagen": ["image", "photo", "picture"],
    "imagenes": ["images", "photos", "pictures"],
    "foto": ["photo", "image"],
    "fotos": ["photos", "images"],
    "video": ["video"],
    "videos": ["video"],
    "musica": ["music", "audio"],
    "audio": ["audio", "sound"],
    "traduccion": ["translation", "translate"],
    "traducir": ["translate", "translation"],
    "idioma": ["language"],
    "idiomas": ["language", "languages"],
    "diccionario": ["dictionary"],
    "texto": ["text"],
    "noticias": ["news"],
    "clima": ["weather", "climate"],
    "tiempo": ["weather", "time"],
    "mapa": ["map", "maps", "geocoding"],
    "mapas": ["maps", "geocoding"],
    "geografia": ["geocoding", "geography", "location"],
    "ubicacion": ["location", "geocoding"],
    "pais": ["country", "countries"],
    "paises": ["countries", "country"],
    "moneda": ["currency"],
    "divisa": ["currency", "exchange"],
    "correo": ["email", "mail"],
    "email": ["email", "mail"],
    "calendario": ["calendar"],
    "encuesta": ["survey", "form"],
    "formulario": ["form", "forms"],
    "documento": ["document", "documents", "pdf"],
    "documentos": ["documents", "document", "pdf"],
    "archivo": ["file", "storage"],
    "archivos": ["files", "storage"],
    "almacenamiento": ["storage"],
    "educacion": ["education", "learning"],
    "aprendizaje": ["learning", "education"],
    "universidad": ["university", "education"],
    "gobierno": ["government", "open data"],
    "datos abiertos": ["open data", "government"],
    "anatomia": ["anatomy", "medical"],
    "cerebro": ["brain", "neuro"],
    "psicologia": ["psychology", "mental"],
    "juego": ["game", "games"],
    "juegos": ["games", "game"],
    "azar": ["random"],
    "aleatorio": ["random"],
    "color": ["color", "colors"],
    "colores": ["colors", "color"],
    "icono": ["icon", "icons"],
    "iconos": ["icons", "icon"],
    "fuente": ["font", "fonts"],
    "qr": ["qr", "barcode"],
    "url": ["url", "shortener", "link"],
    "acortador": ["shortener", "url"],
    "captura": ["screenshot"],
    "pantalla": ["screen", "screenshot"],
    "correo temporal": ["temporary mail", "email"],
    "pago": ["payment", "payments"],
    "pagos": ["payments", "payment"],
    "transporte": ["transport", "transportation"],
    "vuelo": ["flight", "aviation"],
    "vuelos": ["flights", "aviation"],
    "animal": ["animal", "animals"],
    "animales": ["animals", "animal"],
    "arte": ["art", "design"],
    "museo": ["museum", "art"],
    "cine": ["movie", "movies", "film"],
    "pelicula": ["movie", "film"],
    "peliculas": ["movies", "film"],
    "hora": ["time", "clock"],
    "fecha": ["date", "time"],
    "festivo": ["holiday", "holidays"],
    "festivos": ["holidays", "holiday"],
    "noticia": ["news"],
    "criptomoneda": ["cryptocurrency", "crypto"],
    "seguridad": ["security"],
    "correo electronico": ["email"],
}


def strip_accents(text: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", text) if unicodedata.category(c) != "Mn")


def norm(text: str) -> str:
    return strip_accents(text.lower())


STOPWORDS = {
    "de", "la", "el", "los", "las", "un", "una", "unos", "unas", "y", "o", "para",
    "con", "sin", "del", "al", "en", "que", "por", "sobre", "the", "a", "an", "of",
    "for", "and", "or", "to", "in", "on", "with",
}


def tokenize(raw: str):
    """Convierte la consulta en términos: palabras sueltas + bigramas conocidos."""
    words = re.findall(r"[a-z0-9+#.\-]+", norm(raw))
    words = [w for w in words if w not in STOPWORDS]
    terms = list(words)
    for first, second in zip(words, words[1:]):
        bigram = f"{first} {second}"
        if bigram in SYNONYMS:
            terms.append(bigram)
    return terms


def expand(terms):
    """Añade sinónimos en inglés a los términos en español."""
    out = []
    for t in terms:
        out.append(t)
        out.extend(SYNONYMS.get(t, []))
    seen, uniq = set(), []
    for t in out:
        if t not in seen:
            seen.add(t)
            uniq.append(t)
    return uniq


def score(entry, terms):
    name = norm(entry["name"])
    desc = norm(entry["description"])
    cat = norm(entry["category"])
    total = 0
    matched = 0

    for term in terms:
        # Los términos cortos exigen palabra completa; los largos admiten prefijo
        # (así "book" encuentra "books" sin que "de" encuentre "detect").
        suffix = "" if len(term) >= 4 else r"\b"
        word = re.compile(rf"\b{re.escape(term)}{suffix}", re.I)
        hit = 0
        if word.search(name):
            hit = max(hit, 10)
        elif term in name:
            hit = max(hit, 6)
        if word.search(cat):
            hit = max(hit, 8)
        if word.search(desc):
            hit = max(hit, 5)
        elif term in desc:
            hit = max(hit, 2)
        if hit:
            matched += 1
            total += hit

    if not matched:
        return 0
    # Prioriza entradas que cubren varios términos de la consulta.
    return total + matched * 3


def yes(value: str) -> bool:
    return value.strip().lower() == "yes"


def main() -> int:
    ap = argparse.ArgumentParser(description="Busca APIs públicas en el índice local.")
    ap.add_argument("query", nargs="*", help="Términos de búsqueda (ES o EN)")
    ap.add_argument("--category", "-c", help="Filtra por categoría (subcadena, sin distinguir mayúsculas)")
    ap.add_argument("--no-auth", action="store_true", help="Solo APIs sin autenticación")
    ap.add_argument("--auth", help="Filtra por tipo de auth: apiKey, OAuth, X-Mashape-Key, User-Agent...")
    ap.add_argument("--https", action="store_true", help="Solo APIs con HTTPS")
    ap.add_argument("--cors", action="store_true", help="Solo APIs con CORS habilitado (uso directo desde el navegador)")
    ap.add_argument("--limit", "-n", type=int, default=20, help="Máximo de resultados (por defecto 20)")
    ap.add_argument("--json", action="store_true", help="Salida en JSON")
    ap.add_argument("--list-categories", action="store_true", help="Lista las categorías disponibles")
    args = ap.parse_args()

    if not DATA_PATH.exists():
        print(f"No existe el índice ({DATA_PATH}). Ejecuta build_index.py primero.", file=sys.stderr)
        return 1

    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    entries = data["entries"]

    if args.list_categories:
        counts = {}
        for e in entries:
            counts[e["category"]] = counts.get(e["category"], 0) + 1
        for cat in sorted(counts):
            print(f"{counts[cat]:4d}  {cat}")
        print(f"\nTotal: {len(entries)} APIs · índice del {data['generated_at']}")
        return 0

    if args.category:
        needle = norm(args.category)
        entries = [e for e in entries if needle in norm(e["category"])]
    if args.no_auth:
        entries = [e for e in entries if e["auth"].lower() == "no"]
    if args.auth:
        needle = norm(args.auth)
        entries = [e for e in entries if needle in norm(e["auth"])]
    if args.https:
        entries = [e for e in entries if yes(e["https"])]
    if args.cors:
        entries = [e for e in entries if yes(e["cors"])]

    terms = expand(tokenize(" ".join(args.query))) if args.query else []
    if terms:
        scored = [(score(e, terms), e) for e in entries]
        scored = [(s, e) for s, e in scored if s > 0]
        scored.sort(key=lambda pair: (-pair[0], pair[1]["name"].lower()))
        results = [e for _, e in scored]
    else:
        results = sorted(entries, key=lambda e: (e["category"].lower(), e["name"].lower()))

    total = len(results)
    results = results[: args.limit]

    if args.json:
        print(json.dumps({"total": total, "shown": len(results), "results": results}, ensure_ascii=False, indent=1))
        return 0

    if not results:
        print("Sin resultados. Prueba con otros términos o --list-categories.")
        return 0

    for e in results:
        auth = "sin auth" if e["auth"].lower() == "no" else f"auth: {e['auth']}"
        flags = [auth]
        flags.append("HTTPS" if yes(e["https"]) else "sin HTTPS")
        if yes(e["cors"]):
            flags.append("CORS")
        print(f"\n{e['name']}  [{e['category']}]")
        print(f"  {e['description']}")
        print(f"  {e['url']}")
        print(f"  {' · '.join(flags)}")

    print(f"\n— {len(results)} de {total} coincidencias · índice del {data['generated_at']}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except BrokenPipeError:  # p. ej. al encadenar con `head`
        sys.stderr.close()
        raise SystemExit(0)
