const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Paincorp';
pres.company = 'Paincorp';
pres.title = 'Paincorp · Pitch deck';

const W = 13.33, H = 7.5, M = 0.7;

const C = {
  ink:      '14303F',
  inkDark:  '0E2530',
  teal:     '2F7F8F',
  tealDeep: '1D5866',
  gold:     'C9A227',
  coral:    'C25E4A',
  muted:    '5B7683',
  mutedLt:  '93A9B4',
  line:     'DDE5E9',
  tint:     'F1F6F7',
  white:    'FFFFFF',
  soft:     'CFE1E5',
};
const F = { head: 'Cambria', body: 'Calibri' };

const shadow = () => ({ type:'outer', color:'14303F', blur:8, offset:1, angle:90, opacity:0.10 });

function darkBg(s) {
  s.background = { color: C.inkDark };
}

function title(s, text, opts) {
  const o = opts || {};
  s.addText(text, {
    x: M, y: o.y || 0.82, w: W - 2*M, h: o.h || 1.1,
    fontFace: F.head, fontSize: o.size || 30, bold: true,
    color: o.color || C.ink, margin: 0, valign: 'top', lineSpacing: 34,
  });
}

function kicker(s, text, color) {
  s.addText(text.toUpperCase(), {
    x: M, y: 0.36, w: W - 2*M, h: 0.3,
    fontFace: F.body, fontSize: 11, bold: true, charSpacing: 2,
    color: color || C.teal, margin: 0, valign: 'middle',
  });
}

function card(s, x, y, w, h, fill, lineColor) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: fill || C.tint },
    line: { color: lineColor || C.line, width: 1 },
    shadow: shadow(),
  });
}

function circleNum(s, label, x, y, d, fill, txtColor, size) {
  const dd = d || 0.46;
  s.addShape(pres.ShapeType.ellipse, { x, y, w: dd, h: dd, fill: { color: fill || C.teal } });
  s.addText(String(label), {
    x, y, w: dd, h: dd, align: 'center', valign: 'middle', margin: 0,
    fontFace: F.body, fontSize: size || 15, bold: true, color: txtColor || C.white,
  });
}

function foot(s, n, note) {
  if (note) {
    s.addText(note, {
      x: M, y: H - 0.52, w: W - 2*M - 0.8, h: 0.3,
      fontFace: F.body, fontSize: 9, color: C.muted, margin: 0, valign: 'middle',
    });
  }
  s.addText(String(n), {
    x: W - M - 0.5, y: H - 0.52, w: 0.5, h: 0.3, align: 'right',
    fontFace: F.body, fontSize: 9, color: C.muted, margin: 0, valign: 'middle',
  });
}

function footDark(s, n, note) {
  if (note) {
    s.addText(note, {
      x: M, y: H - 0.52, w: W - 2*M - 0.8, h: 0.3,
      fontFace: F.body, fontSize: 9, color: C.mutedLt, margin: 0, valign: 'middle',
    });
  }
  s.addText(String(n), {
    x: W - M - 0.5, y: H - 0.52, w: 0.5, h: 0.3, align: 'right',
    fontFace: F.body, fontSize: 9, color: C.mutedLt, margin: 0, valign: 'middle',
  });
}

/* ── 1 · Portada ──────────────────────────────────────────────────────── */
{
  const s = pres.addSlide();
  darkBg(s);
  s.addShape(pres.ShapeType.ellipse, { x: 9.1, y: -1.5, w: 6.2, h: 6.2, fill: { color: C.teal, transparency: 88 } });
  s.addShape(pres.ShapeType.ellipse, { x: 10.4, y: 2.6, w: 4.4, h: 4.4, fill: { color: C.tealDeep, transparency: 82 } });
  s.addShape(pres.ShapeType.ellipse, { x: 8.5, y: 4.6, w: 2.2, h: 2.2, fill: { color: C.gold, transparency: 88 } });

  s.addText('PAINCORP', {
    x: M, y: 2.15, w: 8.4, h: 1.25, fontFace: F.head, fontSize: 62, bold: true,
    color: C.white, margin: 0, valign: 'middle', charSpacing: 1,
  });
  s.addText('Infraestructura de contenidos para la educación en dolor', {
    x: M, y: 3.45, w: 7.6, h: 0.5, fontFace: F.head, fontSize: 21,
    color: C.soft, margin: 0, valign: 'middle',
  });
  s.addText('Un corpus experto que decide qué explicarle a esta persona,\nen qué orden y con qué prioridad. Y que enseña por qué lo ha decidido.', {
    x: M, y: 4.15, w: 7.2, h: 0.85, fontFace: F.body, fontSize: 15,
    color: C.mutedLt, margin: 0, valign: 'top', lineSpacing: 22,
  });
  s.addText('2.164 conceptos  ·  1.532 creencias catalogadas  ·  15 dominios', {
    x: M, y: 5.35, w: 7.6, h: 0.35, fontFace: F.body, fontSize: 13, bold: true,
    color: C.gold, margin: 0, valign: 'middle',
  });
  s.addText('Deck de presentación  ·  Agosto de 2026  ·  Documento confidencial', {
    x: M, y: H - 0.85, w: 8, h: 0.35, fontFace: F.body, fontSize: 10,
    color: C.mutedLt, margin: 0, valign: 'middle',
  });
  s.addNotes('Portada. Abrir con la frase: el conocimiento sobre dolor existe y es sólido; lo que falla es la última milla, que llegue a la persona con las palabras correctas. Paincorp es esa última milla.');
}

/* ── 2 · El problema ──────────────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'El problema');
  title(s, 'El dolor crónico no escala.\nLa educación que sí funciona, tampoco.');

  const stats = [
    { big: '1 de cada 5', txt: 'adultos en Europa convive con dolor crónico de intensidad moderada o grave.', src: 'Breivik et al., 2006' },
    { big: 'Nº 1', txt: 'el dolor lumbar encabeza la lista mundial de años vividos con discapacidad.', src: 'Global Burden of Disease' },
    { big: 'Minutos', txt: 'es todo el tiempo que tiene el profesional para explicar algo que necesita horas.', src: 'Realidad de la consulta' },
  ];
  const cw = 3.71, gap = 0.4;
  stats.forEach((st, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.5, cw, 2.35, C.tint);
    s.addText(st.big, {
      x: x + 0.3, y: 2.72, w: cw - 0.6, h: 0.72, fontFace: F.head, fontSize: 34, bold: true,
      color: C.tealDeep, margin: 0, valign: 'middle',
    });
    s.addText(st.txt, {
      x: x + 0.3, y: 3.5, w: cw - 0.6, h: 0.95, fontFace: F.body, fontSize: 14,
      color: C.ink, margin: 0, valign: 'top', lineSpacing: 20,
    });
    s.addText(st.src, {
      x: x + 0.3, y: 4.45, w: cw - 0.6, h: 0.28, fontFace: F.body, fontSize: 9.5, italic: true,
      color: C.muted, margin: 0, valign: 'middle',
    });
  });

  s.addText([
    { text: 'Y el problema mayor no es lo que aún no se ha explicado. ', options: { color: C.ink } },
    { text: 'Es lo que ya se explicó mal.', options: { color: C.coral, bold: true } },
  ], {
    x: M, y: 5.25, w: W - 2*M, h: 0.5, fontFace: F.head, fontSize: 19,
    margin: 0, valign: 'middle',
  });
  s.addText('La persona llega a consulta con una frase que alguien le dijo, y esa frase organiza todo su dolor: cómo se mueve, qué evita, qué espera.', {
    x: M, y: 5.78, w: 10.8, h: 0.5, fontFace: F.body, fontSize: 14,
    color: C.muted, margin: 0, valign: 'top',
  });
  foot(s, 2);
  s.addNotes('El problema tiene dos caras: prevalencia enorme y tiempo clínico mínimo. Pero la palanca real es la tercera: las creencias erróneas ya instaladas. Corregirlas es más eficiente que enseñar de cero.');
}

/* ── 3 · Por qué falla ────────────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'Por qué falla hoy');
  title(s, 'Tres fallos que se repiten en cada consulta');

  const rows = [
    { n: '1', h: 'El material es genérico', t: 'El folleto sirve para cualquiera y, justo por eso, no le habla a nadie. Nadie se reconoce en él.' },
    { n: '2', h: 'El tiempo no da', t: 'Explicar bien lleva más minutos de los que hay. Se recorta, y se recorta por donde no se debe.' },
    { n: '3', h: 'El mito ya está dentro', t: 'La persona no llega vacía. Llega con una creencia instalada que hay que localizar antes de poder corregir.' },
  ];
  rows.forEach((r, i) => {
    const y = 2.15 + i * 1.42;
    circleNum(s, r.n, M, y + 0.1, 0.46);
    s.addText(r.h, {
      x: M + 0.68, y: y, w: 6.3, h: 0.38, fontFace: F.head, fontSize: 17, bold: true,
      color: C.tealDeep, margin: 0, valign: 'middle',
    });
    s.addText(r.t, {
      x: M + 0.68, y: y + 0.42, w: 6.3, h: 0.8, fontFace: F.body, fontSize: 14,
      color: C.ink, margin: 0, valign: 'top', lineSpacing: 20,
    });
  });

  card(s, 8.05, 2.05, 4.58, 4.25, C.tint);
  s.addText('LO QUE SE OYE EN CONSULTA', {
    x: 8.4, y: 2.32, w: 3.9, h: 0.3, fontFace: F.body, fontSize: 10.5, bold: true, charSpacing: 1.5,
    color: C.teal, margin: 0, valign: 'middle',
  });
  const quotes = [
    { q: '«Si no sale nada en las pruebas, no tengo nada.»', id: 'ERR-0001' },
    { q: '«Me han dicho que tengo la espalda hecha polvo.»', id: 'ERR-0016' },
    { q: '«Si duele, algo se está rompiendo.»', id: 'Concepto del corpus' },
  ];
  quotes.forEach((qq, i) => {
    const y = 2.9 + i * 0.98;
    s.addText(qq.q, {
      x: 8.4, y: y, w: 3.9, h: 0.5, fontFace: F.head, fontSize: 14, italic: true,
      color: C.ink, margin: 0, valign: 'top', lineSpacing: 19,
    });
    s.addText(qq.id, {
      x: 8.4, y: y + 0.5, w: 3.9, h: 0.24, fontFace: F.body, fontSize: 9.5,
      color: C.muted, margin: 0, valign: 'middle',
    });
  });
  s.addText('1.532 creencias como estas, catalogadas una a una.', {
    x: 8.4, y: 5.9, w: 3.9, h: 0.28, fontFace: F.body, fontSize: 11, bold: true,
    color: C.tealDeep, margin: 0, valign: 'middle',
  });
  foot(s, 3);
  s.addNotes('Las frases de la derecha son literales del corpus, con su identificador. Sirven para demostrar granularidad: no es una lista de temas, es un catálogo de lo que la gente realmente cree.');
}

/* ── 4 · La solución ──────────────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'La solución');
  title(s, 'Del corpus experto al papel que se lleva\nla persona, en una sola operación');

  s.addText('Describes el caso con las palabras que ha usado la persona, tal cual las dijo. El sistema busca a qué creencia registrada se parece, decide qué conceptos hay que tocar según el mecanismo, el tiempo de evolución, las pruebas de imagen y la etapa vital, y devuelve una hoja escrita en lenguaje de paciente. Lista para imprimir y entregar.', {
    x: M, y: 2.3, w: 6.35, h: 1.9, fontFace: F.body, fontSize: 15,
    color: C.ink, margin: 0, valign: 'top', lineSpacing: 23,
  });

  const tags = ['Sin plantillas que rellenar', 'Sin redactar de cero', 'Sin improvisar en la consulta'];
  tags.forEach((t, i) => {
    const y = 4.35 + i * 0.6;
    s.addShape(pres.ShapeType.ellipse, { x: M + 0.03, y: y + 0.11, w: 0.16, h: 0.16, fill: { color: C.gold } });
    s.addText(t, {
      x: M + 0.38, y: y, w: 5.9, h: 0.4, fontFace: F.head, fontSize: 16, bold: true,
      color: C.tealDeep, margin: 0, valign: 'middle',
    });
  });

  /* Maqueta del producto */
  const px = 7.45, py = 2.15, pw = 5.18, ph = 4.15;
  s.addShape(pres.ShapeType.roundRect, {
    x: px, y: py, w: pw, h: ph, rectRadius: 0.06,
    fill: { color: C.white }, line: { color: C.line, width: 1 }, shadow: shadow(),
  });
  s.addText('Constructor de contenidos', {
    x: px + 0.22, y: py + 0.16, w: 3.2, h: 0.28, fontFace: F.body, fontSize: 11, bold: true,
    color: C.ink, margin: 0, valign: 'middle',
  });
  s.addText('Educación en Dolor', {
    x: px + pw - 1.5, y: py + 0.16, w: 1.28, h: 0.28, fontFace: F.body, fontSize: 8.5,
    color: C.muted, margin: 0, align: 'right', valign: 'middle',
  });

  // columna izquierda: entrada + candidatas
  s.addShape(pres.ShapeType.roundRect, {
    x: px + 0.22, y: py + 0.58, w: 2.05, h: 0.3, rectRadius: 0.04,
    fill: { color: C.tint }, line: { color: C.line, width: 0.75 },
  });
  s.addText('«me han dicho que tengo…»', {
    x: px + 0.3, y: py + 0.58, w: 1.9, h: 0.3, fontFace: F.body, fontSize: 7.5,
    color: C.muted, margin: 0, valign: 'middle',
  });
  const cands = [['Espalda hecha polvo', 0.78], ['El desgaste explica…', 0.61], ['Hernia = dolor', 0.34]];
  cands.forEach((cd, i) => {
    const y = py + 1.02 + i * 0.56;
    s.addShape(pres.ShapeType.roundRect, {
      x: px + 0.22, y: y, w: 2.05, h: 0.46, rectRadius: 0.04,
      fill: { color: C.white }, line: { color: C.line, width: 0.75 },
    });
    s.addText(cd[0], {
      x: px + 0.3, y: y + 0.03, w: 1.9, h: 0.2, fontFace: F.body, fontSize: 7.5,
      color: C.ink, margin: 0, valign: 'middle',
    });
    s.addShape(pres.ShapeType.rect, { x: px + 0.3, y: y + 0.27, w: 1.86, h: 0.055, fill: { color: C.line } });
    s.addShape(pres.ShapeType.rect, {
      x: px + 0.3, y: y + 0.27, w: 1.86 * cd[1], h: 0.055,
      fill: { color: cd[1] < 0.4 ? C.gold : C.teal },
    });
    s.addText(Math.round(cd[1] * 100) + ' %', {
      x: px + 0.3, y: y + 0.33, w: 1.9, h: 0.14, fontFace: F.body, fontSize: 6.5,
      color: C.muted, margin: 0, valign: 'middle',
    });
  });

  // columna derecha: resultados
  s.addText('QUÉ ABORDAR', {
    x: px + 2.5, y: py + 0.58, w: 2.4, h: 0.3, fontFace: F.body, fontSize: 8, bold: true, charSpacing: 1,
    color: C.teal, margin: 0, valign: 'middle',
  });
  const res = [
    ['Núcleo', 'Tu dolor es real y no mide el daño', C.tealDeep],
    ['Imprescindible', 'Lo que dicen y no dicen las pruebas', C.coral],
    ['Recomendado', 'Moverte es seguro', C.teal],
    ['Si hay tiempo', 'La mejoría no es una línea recta', C.muted],
  ];
  res.forEach((r, i) => {
    const y = py + 0.98 + i * 0.62;
    s.addShape(pres.ShapeType.roundRect, {
      x: px + 2.5, y: y, w: 2.42, h: 0.52, rectRadius: 0.04,
      fill: { color: C.white }, line: { color: C.line, width: 0.75 },
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: px + 2.58, y: y + 0.07, w: 0.78, h: 0.16, rectRadius: 0.06, fill: { color: r[2] },
    });
    s.addText(r[0], {
      x: px + 2.58, y: y + 0.07, w: 0.78, h: 0.16, fontFace: F.body, fontSize: 5.5, bold: true,
      color: C.white, margin: 0, align: 'center', valign: 'middle',
    });
    s.addText(r[1], {
      x: px + 2.58, y: y + 0.26, w: 2.26, h: 0.22, fontFace: F.body, fontSize: 7.5,
      color: C.ink, margin: 0, valign: 'middle',
    });
  });
  s.addShape(pres.ShapeType.roundRect, {
    x: px + 2.5, y: py + 3.5, w: 1.55, h: 0.32, rectRadius: 0.05, fill: { color: C.teal },
  });
  s.addText('Hoja para el paciente', {
    x: px + 2.5, y: py + 3.5, w: 1.55, h: 0.32, fontFace: F.body, fontSize: 7.5, bold: true,
    color: C.white, margin: 0, align: 'center', valign: 'middle',
  });
  foot(s, 4, 'Interfaz real del constructor, en funcionamiento hoy.');
  s.addNotes('Aquí conviene abrir la herramienta en vivo si la reunión lo permite: escribir una frase de paciente y enseñar cómo cambia la salida. La demo vale más que la diapositiva.');
}

/* ── 5 · Cómo funciona ────────────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'Cómo funciona');
  title(s, 'Tres pasos, sin salir de la consulta');

  const steps = [
    { n: '1', h: 'Entra el caso', t: 'La frase del paciente, tal cual la dijo. Más cinco rasgos clínicos: mecanismo, tiempo de evolución, pruebas de imagen, etapa vital y cribado.' },
    { n: '2', h: 'El corpus decide', t: 'Ordena 2.164 conceptos por prioridad, nivel de certeza y profundidad. Cada elección lleva su porqué escrito al lado, y se puede discutir.' },
    { n: '3', h: 'Sale la hoja', t: 'Cuatro partes en lenguaje de paciente, del tamaño que cabe en el encuadre elegido. Se guarda en PDF y se entrega.' },
  ];
  const cw = 3.71, gap = 0.4;
  steps.forEach((st, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.15, cw, 3.05, C.white);
    circleNum(s, st.n, x + 0.32, 2.45, 0.5, C.teal, C.white, 16);
    s.addText(st.h, {
      x: x + 0.32, y: 3.1, w: cw - 0.64, h: 0.4, fontFace: F.head, fontSize: 19, bold: true,
      color: C.tealDeep, margin: 0, valign: 'middle',
    });
    s.addText(st.t, {
      x: x + 0.32, y: 3.57, w: cw - 0.64, h: 1.5, fontFace: F.body, fontSize: 13.5,
      color: C.ink, margin: 0, valign: 'top', lineSpacing: 19,
    });
  });

  card(s, M, 5.5, W - 2*M, 1.05, C.tint);
  s.addText('Tres encuadres, y el corpus recorta solo', {
    x: M + 0.35, y: 5.65, w: 5.2, h: 0.32, fontFace: F.head, fontSize: 15, bold: true,
    color: C.tealDeep, margin: 0, valign: 'middle',
  });
  s.addText('Consulta única (~10 min, 8 conceptos)  ·  Tres sesiones (18)  ·  Programa completo (40). Un currículum se define por lo que se repite, no por lo que cubre.', {
    x: M + 0.35, y: 6.0, w: W - 2*M - 0.7, h: 0.4, fontFace: F.body, fontSize: 13,
    color: C.ink, margin: 0, valign: 'top',
  });
  foot(s, 5);
  s.addNotes('El punto de venta del paso 2 es la transparencia: no es una caja negra que escupe texto, es un criterio editorial explícito que el profesional puede auditar y rebatir.');
}

/* ── 6 · El corpus en cifras ──────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'El activo');
  title(s, 'Lo que ya está construido');

  const stats = [
    { n: '2.164', l: 'conceptos catalogados', d: 'con prioridad, certeza y nivel de profundidad' },
    { n: '1.532', l: 'creencias erróneas con ficha', d: 'cada una con su corrección redactada' },
    { n: '223', l: 'módulos en 15 dominios', d: 'de neurofisiología a determinantes sociales' },
    { n: '385', l: 'fichas listas para paciente', d: 'texto final, no esquemas ni guiones' },
  ];
  const cw = 2.83, gap = 0.32;
  stats.forEach((st, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.25, cw, 2.5, C.tint);
    s.addText(st.n, {
      x: x + 0.26, y: 2.5, w: cw - 0.52, h: 0.85, fontFace: F.head, fontSize: 42, bold: true,
      color: C.tealDeep, margin: 0, valign: 'middle',
    });
    s.addText(st.l, {
      x: x + 0.26, y: 3.4, w: cw - 0.52, h: 0.6, fontFace: F.body, fontSize: 14, bold: true,
      color: C.ink, margin: 0, valign: 'top', lineSpacing: 18,
    });
    s.addText(st.d, {
      x: x + 0.26, y: 4.02, w: cw - 0.52, h: 0.6, fontFace: F.body, fontSize: 11,
      color: C.muted, margin: 0, valign: 'top', lineSpacing: 15,
    });
  });

  s.addText('No es una base de datos de artículos. Es contenido editado, decidido y escrito.', {
    x: M, y: 5.2, w: W - 2*M, h: 0.45, fontFace: F.head, fontSize: 19, bold: true,
    color: C.ink, margin: 0, valign: 'middle',
  });
  s.addText('Cada concepto sabe a qué creencias responde, en qué parte de la explicación entra y si es entregable a paciente o material de profesional. Esa red de relaciones es lo que no se replica leyendo la misma bibliografía.', {
    x: M, y: 5.68, w: 11.4, h: 0.7, fontFace: F.body, fontSize: 14,
    color: C.muted, margin: 0, valign: 'top', lineSpacing: 19,
  });
  foot(s, 6, 'Instantánea del 16/08/2026. El corpus crece a diario y cada versión queda registrada.');
  s.addNotes('Insistir en la diferencia entre acumular referencias y tomar decisiones editoriales. Lo segundo es lo caro, lo lento y lo defendible.');
}

/* ── 7 · Cobertura por dominio ────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'Cobertura');
  title(s, 'Dónde está la profundidad');

  const labels = ['Neurofisiología del dolor','Educación en dolor','Evaluación clínica','Emoción y dolor',
                  'Ejercicio y movimiento','Naturaleza del dolor','Comunicación clínica','Cambio de conducta',
                  'Determinantes sociales','Cuadros clínicos','Autogestión','Práctica basada en evidencia'];
  const values = [271, 266, 252, 234, 234, 217, 190, 184, 168, 96, 38, 14];

  s.addChart(pres.ChartType.bar, [{
    name: 'Conceptos', labels: labels.slice().reverse(), values: values.slice().reverse(),
  }], {
    x: M - 0.1, y: 2.1, w: 7.9, h: 4.35,
    barDir: 'bar', barGapWidthPct: 45,
    chartColors: [C.teal],
    showValue: true, dataLabelPosition: 'outEnd',
    dataLabelColor: C.muted, dataLabelFontSize: 10, dataLabelFontFace: F.body,
    catAxisLabelColor: C.ink, catAxisLabelFontSize: 11, catAxisLabelFontFace: F.body,
    valAxisLabelColor: C.muted, valAxisLabelFontSize: 9, valAxisLabelFontFace: F.body,
    valAxisMinVal: 0, valAxisMaxVal: 320,
    valGridLine: { color: C.line, size: 1 },
    catGridLine: { style: 'none' },
    catAxisLineShow: false, valAxisLineShow: false,
    showLegend: false, showTitle: false,
  });

  card(s, 8.9, 2.1, 3.73, 3.55, C.tint);
  s.addText('CÓMO LEER ESTO', {
    x: 9.2, y: 2.32, w: 3.15, h: 0.28, fontFace: F.body, fontSize: 10.5, bold: true, charSpacing: 1.5,
    color: C.teal, margin: 0, valign: 'middle',
  });
  s.addText([
    { text: 'El peso está donde se explica el porqué', options: { bold: true, color: C.tealDeep, breakLine: true } },
    { text: 'Neurofisiología, educación y evaluación son más de un tercio del corpus: la parte que el profesional no puede improvisar.', options: { color: C.ink, breakLine: true, paraSpaceAfter: 12 } },
    { text: 'Los huecos también son mapa', options: { bold: true, color: C.tealDeep, breakLine: true } },
    { text: 'Cuadros clínicos y autogestión son la frontera de crecimiento declarada, no un olvido.', options: { color: C.ink } },
  ], {
    x: 9.2, y: 2.7, w: 3.15, h: 2.8, fontFace: F.body, fontSize: 12.5,
    margin: 0, valign: 'top', lineSpacing: 17,
  });

  s.addText('385 de esos conceptos ya tienen su versión escrita para paciente, palabra por palabra.', {
    x: 8.9, y: 5.82, w: 3.73, h: 0.8, fontFace: F.head, fontSize: 13.5, italic: true,
    color: C.tealDeep, margin: 0, valign: 'top', lineSpacing: 18,
  });
  foot(s, 7, 'Conceptos por dominio. Total: 2.164.');
  s.addNotes('Si preguntan por los dominios pequeños: la estrategia fue construir primero el tronco explicativo, y los cuadros clínicos concretos se cuelgan de él después.');
}

/* ── 8 · Los cinco mensajes (oscura) ──────────────────────────────────── */
{
  const s = pres.addSlide();
  darkBg(s);
  s.addShape(pres.ShapeType.ellipse, { x: 10.3, y: -1.2, w: 5.4, h: 5.4, fill: { color: C.teal, transparency: 90 } });
  kicker(s, 'El núcleo editorial', C.gold);
  title(s, 'Todo el corpus converge en cinco mensajes', { color: C.white });

  const msgs = [
    'Tu dolor es real y es protector, y no mide el daño.',
    'El sistema es sensible, y lo sensible se puede reentrenar.',
    'Muchas cosas influyen en tu dolor, y eso no lo hace psicológico.',
    'Moverte es seguro, y hacer forma parte del tratamiento.',
    'La mejoría existe, y no es una línea recta.',
  ];
  msgs.forEach((m, i) => {
    const y = 2.15 + i * 0.72;
    circleNum(s, i + 1, M, y, 0.44, C.gold, C.inkDark, 14);
    s.addText(m, {
      x: M + 0.68, y: y, w: 9.2, h: 0.44, fontFace: F.head, fontSize: 20,
      color: C.white, margin: 0, valign: 'middle',
    });
  });

  s.addText('Se repiten en cada salida, cambie lo que cambie alrededor.', {
    x: M, y: 5.95, w: 11.4, h: 0.35, fontFace: F.head, fontSize: 16, bold: true,
    color: C.gold, margin: 0, valign: 'middle',
  });
  s.addText('El resto del corpus existe para sostener estos cinco mensajes en el caso concreto que tienes delante.', {
    x: M, y: 6.32, w: 11.4, h: 0.35, fontFace: F.body, fontSize: 13,
    color: C.mutedLt, margin: 0, valign: 'middle',
  });
  footDark(s, 8);
  s.addNotes('Esta es la diapositiva que más se recuerda. Leerla despacio, en voz alta, sin añadir nada. Son los cinco mensajes núcleo del corpus (CPT-00586 a CPT-00590).');
}

/* ── 9 · Defensibilidad ───────────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'Por qué es difícil de copiar');
  title(s, 'Cuatro cosas que no se consiguen leyendo la misma bibliografía');

  const items = [
    { n: '1', h: 'Corpus propietario y trazable', t: 'Cada afirmación lleva identificador, módulo, nivel de certeza y las creencias concretas que corrige. Se puede auditar entera.' },
    { n: '2', h: 'Motor local, sin dependencias', t: 'La búsqueda semántica corre en el propio navegador. Sin red, sin API, sin coste por uso y sin que ningún dato del paciente salga de la consulta.' },
    { n: '3', h: 'Los criterios están a la vista', t: 'El sistema explica por qué ha elegido cada cosa. Es discutible, y precisamente por eso un servicio clínico puede adoptarlo.' },
    { n: '4', h: 'El límite clínico, escrito', t: 'No diagnostica, no clasifica a la persona y no propone tratamiento. Selecciona contenido educativo, y lo dice en cada pantalla.' },
  ];
  const cw = 5.86, ch = 1.85, gx = 0.4, gy = 0.35;
  items.forEach((it, i) => {
    const x = M + (i % 2) * (cw + gx);
    const y = 2.2 + Math.floor(i / 2) * (ch + gy);
    card(s, x, y, cw, ch, C.tint);
    circleNum(s, it.n, x + 0.3, y + 0.32, 0.42, C.teal, C.white, 14);
    s.addText(it.h, {
      x: x + 0.86, y: y + 0.28, w: cw - 1.2, h: 0.42, fontFace: F.head, fontSize: 17, bold: true,
      color: C.tealDeep, margin: 0, valign: 'middle',
    });
    s.addText(it.t, {
      x: x + 0.3, y: y + 0.82, w: cw - 0.6, h: 0.85, fontFace: F.body, fontSize: 13,
      color: C.ink, margin: 0, valign: 'top', lineSpacing: 18,
    });
  });
  foot(s, 9, 'La ventaja no es el algoritmo: es el trabajo editorial acumulado y la manera de exponerlo.');
  s.addNotes('El punto 2 es el que más pesa en instituciones sanitarias: cero transferencia de datos resuelve de entrada la conversación de privacidad.');
}

/* ── 10 · Mercado y segmentos ─────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'Mercado');
  title(s, 'Cuatro compradores, un mismo corpus');

  const segs = [
    { n: '1', h: 'Profesional individual', t: 'Fisioterapia, medicina, enfermería, psicología. Compra tiempo y seguridad: deja de improvisar la explicación.', tag: 'Suscripción' },
    { n: '2', h: 'Institución sanitaria', t: 'Hospitales, unidades del dolor, atención primaria, mutuas y aseguradoras. Compran homogeneidad del mensaje.', tag: 'Licencia anual' },
    { n: '3', h: 'Formación reglada', t: 'Universidades, sociedades científicas y colegios profesionales. Compran currículum y material docente.', tag: 'Programa' },
    { n: '4', h: 'Persona con dolor', t: 'Material directo, llegue por su profesional o por su cuenta. Es el destinatario final de todo lo demás.', tag: 'Vía prescriptor' },
  ];
  const cw = 2.83, gap = 0.32;
  segs.forEach((sg, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.15, cw, 3.3, C.white);
    circleNum(s, sg.n, x + 0.26, 2.42, 0.44, C.teal, C.white, 14);
    s.addText(sg.h, {
      x: x + 0.26, y: 3.0, w: cw - 0.52, h: 0.6, fontFace: F.head, fontSize: 16, bold: true,
      color: C.tealDeep, margin: 0, valign: 'top', lineSpacing: 20,
    });
    s.addText(sg.t, {
      x: x + 0.26, y: 3.65, w: cw - 0.52, h: 1.35, fontFace: F.body, fontSize: 12.5,
      color: C.ink, margin: 0, valign: 'top', lineSpacing: 17,
    });
    s.addText(sg.tag, {
      x: x + 0.26, y: 5.08, w: cw - 0.52, h: 0.24, fontFace: F.body, fontSize: 10.5, bold: true,
      color: C.gold, margin: 0, valign: 'middle',
    });
  });

  card(s, M, 5.68, W - 2*M, 0.95, C.tint);
  s.addText('El profesional individual valida el producto; la institución lo compra a escala.', {
    x: M + 0.35, y: 5.8, w: W - 2*M - 0.7, h: 0.32, fontFace: F.head, fontSize: 15, bold: true,
    color: C.tealDeep, margin: 0, valign: 'middle',
  });
  s.addText('El tamaño de cada segmento está por cuantificar con datos de la geografía objetivo: colegiados, servicios de dolor y presupuesto formativo.', {
    x: M + 0.35, y: 6.16, w: W - 2*M - 0.7, h: 0.35, fontFace: F.body, fontSize: 12.5,
    color: C.muted, margin: 0, valign: 'middle',
  });
  foot(s, 10);
  s.addNotes('Diapositiva pendiente de cifras propias: colegiados de fisioterapia y medicina en el mercado objetivo, número de unidades del dolor, gasto anual en formación continuada. Sin esas cifras, no llevar este deck a inversores.');
}

/* ── 11 · Modelo de negocio ───────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'Modelo de negocio');
  title(s, 'Tres líneas de ingreso sobre un único activo');

  const lines = [
    { h: 'Suscripción profesional', p: 'Precio por definir', t: 'Acceso al constructor, hojas ilimitadas y actualizaciones del corpus. Mensual o anual, por usuario.', b: 'Volumen y validación' },
    { h: 'Licencia institucional', p: 'Contrato anual', t: 'Despliegue por servicio o centro, con biblioteca propia, marca del servicio y material homogéneo para todo el equipo.', b: 'Margen y permanencia' },
    { h: 'Formación y certificación', p: 'Por programa', t: 'Cursos y certificación con el corpus como currículum. Alimenta la venta institucional y da autoridad a la marca.', b: 'Autoridad y captación' },
  ];
  const cw = 3.71, gap = 0.4;
  lines.forEach((ln, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.2, cw, 3.15, i === 1 ? C.tint : C.white);
    s.addText(ln.h, {
      x: x + 0.3, y: 2.45, w: cw - 0.6, h: 0.6, fontFace: F.head, fontSize: 18, bold: true,
      color: C.tealDeep, margin: 0, valign: 'top', lineSpacing: 22,
    });
    s.addText(ln.p, {
      x: x + 0.3, y: 3.12, w: cw - 0.6, h: 0.3, fontFace: F.body, fontSize: 12, bold: true,
      color: C.gold, margin: 0, valign: 'middle',
    });
    s.addText(ln.t, {
      x: x + 0.3, y: 3.55, w: cw - 0.6, h: 1.2, fontFace: F.body, fontSize: 13,
      color: C.ink, margin: 0, valign: 'top', lineSpacing: 18,
    });
    s.addText('Aporta: ' + ln.b, {
      x: x + 0.3, y: 4.85, w: cw - 0.6, h: 0.3, fontFace: F.body, fontSize: 11, italic: true,
      color: C.muted, margin: 0, valign: 'middle',
    });
  });

  s.addText('Servir a un cliente más cuesta prácticamente cero: el motor corre en su navegador.', {
    x: M, y: 5.65, w: 11.4, h: 0.4, fontFace: F.head, fontSize: 17, bold: true,
    color: C.ink, margin: 0, valign: 'middle',
  });
  s.addText('El gasto real está en mantener y ampliar el corpus, que es exactamente lo que también construye la barrera de entrada.', {
    x: M, y: 6.08, w: 11.4, h: 0.35, fontFace: F.body, fontSize: 13.5,
    color: C.muted, margin: 0, valign: 'middle',
  });
  foot(s, 11, 'Precios y proyección financiera por fijar antes de una conversación de inversión.');
  s.addNotes('Precios pendientes. Referencias útiles para fijarlos: cuota anual de colegiación, precio de formación continuada en el sector y coste de las plataformas de material clínico que ya usan los servicios.');
}

/* ── 12 · Posicionamiento ─────────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'Posicionamiento');
  title(s, 'Frente a lo que ya se usa');

  const cols = ['Folleto o PDF', 'App genérica', 'IA sin corpus', 'Paincorp'];
  const rows = [
    ['Se adapta al caso concreto', 'No', 'Poco', 'Sí', 'Sí'],
    ['Trazable hasta la fuente', 'No', 'No', 'No', 'Sí'],
    ['Criterio editorial experto', 'Sí', 'Variable', 'No', 'Sí'],
    ['Ningún dato sale del centro', 'Sí', 'No', 'No', 'Sí'],
  ];
  const x0 = M, labelW = 3.5, colW = 1.98, rowH = 0.72, y0 = 2.35;

  cols.forEach((c, i) => {
    const x = x0 + labelW + i * colW;
    if (i === 3) {
      s.addShape(pres.ShapeType.roundRect, {
        x: x - 0.06, y: y0 - 0.42, w: colW - 0.06, h: rowH * rows.length + 0.5,
        rectRadius: 0.05, fill: { color: C.tint }, line: { color: C.teal, width: 1.25 },
      });
    }
    s.addText(c, {
      x, y: y0 - 0.4, w: colW - 0.18, h: 0.36, fontFace: F.body, fontSize: 12,
      bold: true, color: i === 3 ? C.tealDeep : C.muted, margin: 0, align: 'center', valign: 'middle',
    });
  });

  rows.forEach((r, ri) => {
    const y = y0 + ri * rowH;
    s.addText(r[0], {
      x: x0, y, w: labelW - 0.2, h: rowH, fontFace: F.body, fontSize: 13.5,
      color: C.ink, margin: 0, valign: 'middle',
    });
    for (let ci = 1; ci <= 4; ci++) {
      const val = r[ci];
      const x = x0 + labelW + (ci - 1) * colW;
      const strong = val === 'Sí';
      s.addText(val, {
        x, y, w: colW - 0.18, h: rowH, fontFace: F.body, fontSize: 13.5,
        bold: strong, color: strong ? C.tealDeep : (val === 'No' ? C.coral : C.muted),
        margin: 0, align: 'center', valign: 'middle',
      });
    }
    if (ri < rows.length - 1) {
      s.addShape(pres.ShapeType.rect, {
        x: x0, y: y + rowH - 0.01, w: labelW - 0.3, h: 0.012, fill: { color: C.line },
      });
    }
  });

  card(s, M, 5.55, W - 2*M, 1.0, C.tint);
  s.addText('El competidor real no es otra herramienta: es el folleto de siempre y el «ya se lo explico yo».', {
    x: M + 0.35, y: 5.68, w: W - 2*M - 0.7, h: 0.32, fontFace: F.head, fontSize: 15, bold: true,
    color: C.tealDeep, margin: 0, valign: 'middle',
  });
  s.addText('Un modelo de lenguaje genérico redacta bien y no puede demostrar de dónde sale lo que dice. En salud, eso no es un detalle: es lo que decide si un servicio clínico lo adopta o no.', {
    x: M + 0.35, y: 6.03, w: W - 2*M - 0.7, h: 0.35, fontFace: F.body, fontSize: 12.5,
    color: C.muted, margin: 0, valign: 'middle',
  });
  foot(s, 12);
  s.addNotes('Si preguntan «¿y esto no lo hace ya ChatGPT?»: la respuesta es la fila de trazabilidad. Redactar es barato; responder de lo que se afirma, no.');
}

/* ── 13 · Estado actual ───────────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'Estado actual');
  title(s, 'Dónde estamos, dicho sin adornos');

  const done = [
    'Corpus de 2.164 conceptos operativo y en crecimiento diario',
    'Constructor funcionando y publicado, usable hoy',
    'Motor de búsqueda calibrado y medido contra frases reales',
    '385 fichas ya redactadas en lenguaje de paciente',
  ];
  const todo = [
    'Revisión por panel experto externo',
    'Revisión con personas con dolor',
    'Medición de resultados en uso clínico real',
    'Empaquetado comercial: cuentas, versiones y facturación',
  ];

  card(s, M, 2.2, 5.86, 3.05, C.tint);
  s.addText('LO QUE YA EXISTE', {
    x: M + 0.32, y: 2.45, w: 5.2, h: 0.3, fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.5,
    color: C.teal, margin: 0, valign: 'middle',
  });
  done.forEach((d, i) => {
    const y = 2.88 + i * 0.55;
    s.addShape(pres.ShapeType.ellipse, { x: M + 0.34, y: y + 0.13, w: 0.15, h: 0.15, fill: { color: C.teal } });
    s.addText(d, {
      x: M + 0.68, y: y, w: 5.0, h: 0.45, fontFace: F.body, fontSize: 13.5,
      color: C.ink, margin: 0, valign: 'middle',
    });
  });

  card(s, M + 6.26, 2.2, 5.86, 3.05, C.white);
  s.addText('LO QUE FALTA', {
    x: M + 6.58, y: 2.45, w: 5.2, h: 0.3, fontFace: F.body, fontSize: 11, bold: true, charSpacing: 1.5,
    color: C.coral, margin: 0, valign: 'middle',
  });
  todo.forEach((d, i) => {
    const y = 2.88 + i * 0.55;
    s.addShape(pres.ShapeType.ellipse, { x: M + 6.60, y: y + 0.13, w: 0.15, h: 0.15, fill: { color: C.coral } });
    s.addText(d, {
      x: M + 6.94, y: y, w: 5.0, h: 0.45, fontFace: F.body, fontSize: 13.5,
      color: C.ink, margin: 0, valign: 'middle',
    });
  });

  s.addText('Hoy el corpus es material de trabajo, y este deck lo dice antes de que lo pregunten.', {
    x: M, y: 5.5, w: 11.4, h: 0.4, fontFace: F.head, fontSize: 17, bold: true,
    color: C.ink, margin: 0, valign: 'middle',
  });
  s.addText('Nada está publicado como validado: el texto no ha pasado revisión experta externa ni revisión por personas con dolor, y no debe entregarse como material validado. Esa honestidad es parte del producto, no una salvedad legal.', {
    x: M, y: 5.95, w: 11.4, h: 0.7, fontFace: F.body, fontSize: 13,
    color: C.muted, margin: 0, valign: 'top', lineSpacing: 18,
  });
  foot(s, 13);
  s.addNotes('No esconder esta diapositiva. En salud, decir con precisión lo que aún no está validado genera más confianza que cualquier promesa. Es además la que justifica la petición de la última diapositiva.');
}

/* ── 14 · Roadmap ─────────────────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'Plan');
  title(s, 'De material de trabajo a producto validado');

  const phases = [
    { n: '1', t: '0 – 6 meses', h: 'Revisión', d: 'Panel experto externo, revisión con personas con dolor y cierre de las primeras 500 fichas entregables.' },
    { n: '2', t: '6 – 12 meses', h: 'Piloto clínico', d: 'Despliegue en servicios socios. Medición de uso, de encaje en consulta y de comprensión por parte del paciente.' },
    { n: '3', t: '12 – 18 meses', h: 'Producto', d: 'Cuentas, versiones, biblioteca institucional y facturación. Primeras licencias de pago.' },
    { n: '4', t: '18 – 24 meses', h: 'Escala', d: 'Segunda lengua, integración con historia clínica y contratos institucionales a volumen.' },
  ];
  const cw = 2.83, gap = 0.32;
  phases.forEach((p, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 2.3, cw, 3.1, i === 0 ? C.tint : C.white);
    circleNum(s, p.n, x + 0.26, 2.58, 0.46, i === 0 ? C.gold : C.teal, i === 0 ? C.inkDark : C.white, 15);
    s.addText(p.t, {
      x: x + 0.26, y: 3.18, w: cw - 0.52, h: 0.28, fontFace: F.body, fontSize: 11, bold: true, charSpacing: 0.8,
      color: C.muted, margin: 0, valign: 'middle',
    });
    s.addText(p.h, {
      x: x + 0.26, y: 3.48, w: cw - 0.52, h: 0.42, fontFace: F.head, fontSize: 19, bold: true,
      color: C.tealDeep, margin: 0, valign: 'middle',
    });
    s.addText(p.d, {
      x: x + 0.26, y: 3.98, w: cw - 0.52, h: 1.25, fontFace: F.body, fontSize: 12.5,
      color: C.ink, margin: 0, valign: 'top', lineSpacing: 17,
    });
  });

  s.addText('La secuencia no es negociable: primero se valida, después se vende.', {
    x: M, y: 5.72, w: 11.4, h: 0.4, fontFace: F.head, fontSize: 17, bold: true,
    color: C.ink, margin: 0, valign: 'middle',
  });
  s.addText('Vender material educativo en salud sin revisión externa quema la credibilidad una sola vez, y de forma irreversible.', {
    x: M, y: 6.15, w: 11.4, h: 0.35, fontFace: F.body, fontSize: 13,
    color: C.muted, margin: 0, valign: 'middle',
  });
  foot(s, 14, 'Plazos orientativos, por ajustar según recursos y socios que se incorporen.');
  s.addNotes('Ajustar plazos a los recursos reales antes de presentar. Si hay financiación, la fase 1 puede solaparse con la 2 en los servicios que ya estén dispuestos a pilotar.');
}

/* ── 15 · Equipo ──────────────────────────────────────────────────────── */
{
  const s = pres.addSlide();
  kicker(s, 'Equipo');
  title(s, 'Nace de la consulta, no de un plan de negocio');

  s.addText('El corpus lo escribe alguien que ha tenido que explicar el dolor delante de una persona con dolor, y que ha visto qué frases funcionan y cuáles empeoran las cosas. Esa es la materia prima que ninguna ronda de financiación compra hecha.', {
    x: M, y: 2.2, w: 11.4, h: 0.85, fontFace: F.body, fontSize: 15,
    color: C.ink, margin: 0, valign: 'top', lineSpacing: 22,
  });

  const roles = [
    { h: 'Dirección clínica y editorial', t: 'Autoría del corpus, criterio editorial y validación del contenido.', st: 'Cubierto' },
    { h: 'Producto e ingeniería', t: 'Constructor, motor de búsqueda y plataforma de despliegue.', st: 'Por completar' },
    { h: 'Validación científica', t: 'Panel externo, revisión con pacientes y medición de resultados.', st: 'Por completar' },
    { h: 'Comercial e instituciones', t: 'Entrada en servicios de salud, mutuas y sociedades científicas.', st: 'Por completar' },
  ];
  const cw = 2.83, gap = 0.32;
  roles.forEach((r, i) => {
    const x = M + i * (cw + gap);
    const cubierto = r.st === 'Cubierto';
    card(s, x, 3.3, cw, 2.55, cubierto ? C.tint : C.white);
    s.addText(r.h, {
      x: x + 0.26, y: 3.55, w: cw - 0.52, h: 0.75, fontFace: F.head, fontSize: 16, bold: true,
      color: C.tealDeep, margin: 0, valign: 'top', lineSpacing: 20,
    });
    s.addText(r.t, {
      x: x + 0.26, y: 4.35, w: cw - 0.52, h: 0.95, fontFace: F.body, fontSize: 12.5,
      color: C.ink, margin: 0, valign: 'top', lineSpacing: 17,
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: x + 0.26, y: 5.34, w: cubierto ? 0.95 : 1.25, h: 0.28, rectRadius: 0.05,
      fill: { color: cubierto ? C.teal : C.white }, line: { color: cubierto ? C.teal : C.line, width: 1 },
    });
    s.addText(r.st, {
      x: x + 0.26, y: 5.34, w: cubierto ? 0.95 : 1.25, h: 0.28, fontFace: F.body, fontSize: 9.5, bold: true,
      color: cubierto ? C.white : C.muted, margin: 0, align: 'center', valign: 'middle',
    });
  });

  s.addText('Sustituye este bloque por los nombres, credenciales y fotografías reales antes de presentar.', {
    x: M, y: 6.15, w: 11.4, h: 0.35, fontFace: F.body, fontSize: 12.5, italic: true,
    color: C.muted, margin: 0, valign: 'middle',
  });
  foot(s, 15);
  s.addNotes('Rellenar con nombres y credenciales reales. En sanidad, la credencial del autor del corpus es un activo de venta en sí mismo: publicaciones, docencia y años de consulta.');
}

/* ── 16 · Cierre / petición ───────────────────────────────────────────── */
{
  const s = pres.addSlide();
  darkBg(s);
  s.addShape(pres.ShapeType.ellipse, { x: 9.6, y: 3.3, w: 5.6, h: 5.6, fill: { color: C.teal, transparency: 88 } });
  s.addShape(pres.ShapeType.ellipse, { x: 11.4, y: -1.0, w: 3.4, h: 3.4, fill: { color: C.gold, transparency: 90 } });

  kicker(s, 'Lo que buscamos', C.gold);
  title(s, 'Tres cosas, y en este orden', { color: C.white });

  const asks = [
    { n: '1', h: 'Panel revisor', t: 'Profesionales y personas con dolor que revisen el corpus y lo hagan defendible.' },
    { n: '2', h: 'Servicios piloto', t: 'Dos o tres equipos dispuestos a usarlo en consulta real y a contarnos qué falla.' },
    { n: '3', h: 'Financiación', t: 'Para cerrar la revisión, construir el producto y llegar a las primeras licencias.' },
  ];
  asks.forEach((a, i) => {
    const y = 2.25 + i * 1.02;
    circleNum(s, a.n, M, y + 0.12, 0.44, C.gold, C.inkDark, 14);
    s.addText(a.h, {
      x: M + 0.68, y: y, w: 7.6, h: 0.36, fontFace: F.head, fontSize: 19, bold: true,
      color: C.white, margin: 0, valign: 'middle',
    });
    s.addText(a.t, {
      x: M + 0.68, y: y + 0.38, w: 7.6, h: 0.4, fontFace: F.body, fontSize: 13.5,
      color: C.mutedLt, margin: 0, valign: 'middle',
    });
  });

  s.addText('El conocimiento sobre el dolor ya existe, y es sólido. Lo que falta es que llegue\na la persona correcta, con las palabras correctas, el día que lo necesita.', {
    x: M, y: 5.45, w: 9.6, h: 0.9, fontFace: F.head, fontSize: 17, italic: true,
    color: C.soft, margin: 0, valign: 'top', lineSpacing: 25,
  });
  s.addText('PAINCORP', {
    x: M, y: 6.5, w: 4, h: 0.4, fontFace: F.head, fontSize: 17, bold: true, charSpacing: 2,
    color: C.white, margin: 0, valign: 'middle',
  });
  s.addText('Datos de contacto por completar', {
    x: W - M - 5, y: 6.55, w: 5, h: 0.4, fontFace: F.body, fontSize: 11,
    color: C.mutedLt, margin: 0, align: 'right', valign: 'middle',
  });
  s.addNotes('Cerrar pidiendo el paso concreto que le toca a quien tienes delante: al clínico, revisar; al gestor, pilotar; al inversor, financiar. No pedir las tres cosas a la misma persona.');
}

pres.writeFile({ fileName: 'Paincorp-pitch-deck.pptx' }).then(f => console.log('Escrito:', f));
