# TRD · Documento de Requisitos Técnicos

**Sistema:** Constructor de contenidos + pipeline de la Base de Conocimiento
**Versión:** 1.0 · 17/08/2026 · basado en el código real de `index.html` (instantánea 16/08/2026)

---

## 1. Arquitectura general

```
[Repositorio del corpus — local, fuente de verdad]
  ontologia/dominios.yaml      taxonomía: 15 dominios, módulos, prioridades
  conceptos/                   fichas CPT (texto, certeza, madurez, relaciones)
        │
        ▼  build (Python)
  · calcula recuentos INFLESZ por concepto (palabras, frases, sílabas)
  · resuelve relaciones CPT↔ERR y módulos
  · genera DATOS (JSON) e index.html autocontenido
  · panel local "Estado del corpus" (build/servir.py, datos.json en vivo)
        │
        ▼  commit automatizado ("chore: constructor · N conceptos · N creencias · fecha")
[Este repositorio — publicación]
  index.html  (~1,7 MB, todo embebido)   robots.txt (Disallow: /)
        │
        ▼  GitHub Pages
[Navegador del profesional]  — sin red, sin API, sin almacenamiento
```

Decisión de arquitectura central (documentada en el propio código): **todo
local y determinista; sin red, sin modelo y sin API**. La página debe funcionar
abierta con doble clic y publicada en Pages por igual. Esto elimina servidores,
costes, dependencia de terceros y cualquier riesgo de fuga de datos de
pacientes.

## 2. Requisitos técnicos

### RT-1 · Empaquetado y despliegue
- Un único `index.html` con CSS, JS y datos embebidos; cero dependencias
  externas (ni fuentes, ni CDN, ni frameworks).
- `<meta name="robots" content="noindex, nofollow">` + `robots.txt` con
  `Disallow: /`: la copia publicada no debe indexarse.
- Despliegue = push a `main`; GitHub Pages sirve el fichero tal cual.

### RT-2 · Datos embebidos
- `const DATOS = {...}` JSON válido con: `generado`, `publico`, `conceptos`
  (2.164), `errores` (1.532), `modulos` (223), `rasgos` (5), `encuadres` (3),
  `nucleo` (5 IDs), `partes` (4). Esquema completo en
  [06-esquema-backend.md](06-esquema-backend.md).
- El JSON lo genera el pipeline Python; el HTML no debe editarse a mano.

### RT-3 · Buscador de creencias (léxico, local)
Tres señales combinadas, con índice precomputado al cargar:
1. **Solapamiento de palabras pesado por IDF** — las palabras raras
   («resonancia») distinguen; las ubicuas («dolor») no. IDF calculado sobre
   enunciados ERR + títulos CPT; palabra fuera de vocabulario pesa `log 2`.
2. **Lematizado ligero** — recorte de sufijos españoles frecuentes
   (`mente`, `ciones`, `ando`…, mínimo 4 letras de raíz); stopwords españolas
   filtradas; normalización sin tildes (NFD).
3. **Dice sobre trigramas de caracteres** — tolera erratas y variantes que el
   lematizado no cubre.

Fórmula: `0,65·(enunciado/techo) + 0,25·dice(trigramas) + 0,10·(contexto/techo)`.
El enunciado y la bolsa de contexto se indexan **separados**: un parecido
apoyado solo en contexto puntúa bajo (lección aprendida y comentada en código).
Umbral de corte `LISTON = 0,25`; aviso de parecido flojo bajo `FLOJO = 0,40`
(se probó IDF² para eliminar flojos y empeoró: se avisa en vez de disimular).
Resultados: top 5 ERR + top 3 CPT no ya cubiertos por esas ERR.

### RT-4 · Motor de puntuación y tramos
- Puntuación aditiva y explicable (ver PRD RF-4); empates se rompen por nivel
  (`niv` ascendente) y después por ID.
- Tramos por **rango, no por puntuación absoluta**: `imprescindible` exige
  ≥ 100 puntos y se limita a `cabeza`; el resto llena `recomendado` (mitad del
  hueco, redondeo arriba) y `sihaytiempo` hasta `tope`. Motivo documentado:
  con corte absoluto, tres creencias metían 18 conceptos en imprescindible y
  vaciaban el resto.
- El núcleo (`DATOS.nucleo`) se antepone fuera de concurso y se excluye de la
  ordenación.

### RT-5 · Estado de sesión
- Objeto `seleccion` en memoria: `creencias:Set`, `directos:Set`,
  `rasgos:{}`, `encuadre`, `decidido:Map` (solo lo tocado a mano; lo demás usa
  el defecto del tramo), `sinCubrir:Set`.
- Sin `localStorage`, sin cookies, sin envío de datos. La recarga borra todo
  (limitación aceptada hoy; ver plan P1/P3).

### RT-6 · Generación de la hoja
- Conversión Markdown mínima propia (escape HTML primero, luego `**`/`*`);
  orden de operaciones crítico y comentado.
- Reagrupado tipográfico de párrafos (≤ 3 frases o ≤ 45 palabras por párrafo)
  sin tocar palabras ni orden — no altera el INFLESZ.
- **INFLESZ exacto del documento**: se suman los recuentos `leg = [palabras,
  frases, sílabas]` que trae cada concepto desde Python y se aplica
  `206,835 − 62,3·(sílabas/palabras) − (palabras/frases)` al total. Bandas:
  <40 muy difícil · <55 algo difícil · <65 normal · <80 bastante fácil ·
  ≥80 muy fácil.
- Impresión: CSS `@media print` con colores fijados (`print-color-adjust`),
  `@page A4 margin 18mm 16mm`, cortes de página controlados; la UI se oculta y
  solo se imprime la hoja.

### RT-7 · Compatibilidad y rendimiento
- Navegadores evergreen (Chrome/Edge/Safari/Firefox); sin transpilación.
- Carga: parseo de ~1,6 MB de JSON embebido + construcción de índices
  (IDF, trigramas) en el hilo principal una sola vez; interacción posterior
  O(n) sobre arrays en memoria — aceptable en hardware modesto.
- Tema oscuro por `prefers-color-scheme` con variables CSS.

## 3. Restricciones técnicas (vinculantes)

1. **Prohibido** añadir dependencias de red en tiempo de ejecución (fuentes,
   analítica, APIs): rompería privacidad y el modo doble-clic.
2. **Prohibido** persistir texto libre del caso fuera del dispositivo.
3. El HTML publicado es un artefacto de build: los cambios de contenido se
   hacen en el corpus local, nunca en `index.html`.
4. Cualquier cambio en la fórmula de búsqueda o puntuación debe ser
   determinista, explicable en la UI y anotado con su porqué (el código actual
   documenta cada decisión y sus experimentos fallidos; mantener ese estándar).

## 4. Deuda técnica y riesgos

| Ítem | Riesgo | Propuesta |
|---|---|---|
| Fichero único de 1,7 MB creciendo con el corpus (~×5 previsto al completar 3.296 conceptos) | Carga inicial lenta en móvil | Separar `datos.js` del shell HTML manteniendo el modo doble-clic; o instantánea «solo entregables» para consulta |
| Sin tests del motor (búsqueda, puntuación, tramos, INFLESZ) | Regresiones silenciosas al regenerar | Suite mínima de casos dorados ejecutable en el pipeline Python/Node |
| Pipeline de build solo en la máquina del autor | Bus factor 1 | Versionar el generador junto al corpus; documentar el comando de build |
| `sinCubrir` volátil | Pérdida de la señal más valiosa | Export/copiado (P1 del PRD) |
| Escala de madurez sin definición formal (M3/M4 observados) | Ambigüedad editorial | Definir M1–M4 en la ontología |
