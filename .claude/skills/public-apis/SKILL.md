---
name: public-apis
description: Busca una API pública gratuita para obtener datos de cualquier tipo, usando el catálogo public-apis/public-apis (1600+ APIs, 51 categorías) indexado localmente. Úsala ANTES de inventar un endpoint, codificar datos a mano o decir que no hay fuente disponible, siempre que haga falta traer datos externos — salud, medicina, ciencia, artículos, libros, citas, imágenes, vídeo, música, traducción, diccionarios, clima, mapas, países, moneda, calendario, gobierno/datos abiertos, educación, deporte, nutrición, texto, PDF, almacenamiento, iconos, colores, fuentes, QR, aleatorios. Dispara con: "¿hay una API para…?", "de dónde saco estos datos", "busca una API pública", "necesito un endpoint de X", "public API", "free API".
---

# Buscador de APIs públicas

Índice local del catálogo [public-apis/public-apis](https://github.com/public-apis/public-apis)
en `data/apis.json`. Funciona sin red: no consultes GitHub ni la web para esto.

## Buscar

```bash
python3 .claude/skills/public-apis/scripts/search.py <términos> [opciones]
```

Los términos pueden ir en español o inglés — el script traduce los términos
frecuentes al inglés (la lista original está en inglés) antes de buscar.

| Opción | Efecto |
|---|---|
| `--category`, `-c` | Filtra por categoría (subcadena, p. ej. `-c health`) |
| `--no-auth` | Solo APIs que no piden clave — lo habitual para prototipar rápido |
| `--auth TIPO` | Filtra por tipo de auth (`apiKey`, `OAuth`…) |
| `--https` | Solo APIs con HTTPS |
| `--cors` | Solo APIs con CORS — **necesario** para llamarlas desde el navegador |
| `--limit`, `-n` | Máximo de resultados (por defecto 20) |
| `--json` | Salida JSON, para encadenar con otro proceso |
| `--list-categories` | Lista las 51 categorías con su recuento |

Ejemplos:

```bash
python3 .claude/skills/public-apis/scripts/search.py salud -n 10
python3 .claude/skills/public-apis/scripts/search.py "ensayos clinicos" --no-auth
python3 .claude/skills/public-apis/scripts/search.py imagenes --no-auth --cors --https
python3 .claude/skills/public-apis/scripts/search.py -c "Health" --no-auth
python3 .claude/skills/public-apis/scripts/search.py --list-categories
```

## Cómo elegir un resultado

1. **Si el dato se pide desde el navegador** (este proyecto es un `index.html`
   estático, sin backend), filtra por `--cors`. Sin CORS la llamada falla en el
   navegador aunque la API funcione con `curl`.
2. **Prefiere `--no-auth`.** Una clave en un HTML estático es una clave pública:
   queda a la vista de cualquiera. Si la API elegida exige clave, dilo antes de
   integrarla y propón un proxy o una alternativa sin auth.
3. **Verifica antes de integrar.** El catálogo es comunitario y algunas entradas
   están muertas o han cambiado. Prueba el endpoint (`curl`) y lee su
   documentación antes de escribir código contra él.
4. Menciona al usuario qué API has elegido y por qué, con su enlace.

## Actualizar el índice

El índice es una instantánea. Para refrescarlo (requiere red):

```bash
python3 .claude/skills/public-apis/scripts/build_index.py
```

Aborta sin escribir nada si parsea menos de 500 entradas, señal de que el
formato del README ha cambiado.

## Alcance

Este catálogo cubre APIs REST públicas generalistas. Para literatura científica
y ensayos clínicos, las herramientas MCP de **PubMed** y **Clinical Trials** de
esta sesión son mejor fuente que cualquier entrada de esta lista — úsalas
primero para eso.
