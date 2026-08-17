# Diseño UI/UX

**Producto:** Constructor de contenidos · Educación en Dolor
**Versión:** 1.0 · 17/08/2026 · describe el diseño implementado y sus principios

---

## 1. Principios de diseño

1. **Los criterios, a la vista.** Cada resultado muestra por qué está ahí
   (qué creencia corrige, qué rasgo lo activó, cuántos puntos). La confianza
   se gana enseñando el mecanismo, no escondiéndolo.
2. **Honestidad tipográfica de la incertidumbre.** Parecidos flojos en ámbar
   con aviso textual; conceptos sin texto entregable atenuados y deshabilitados;
   certeza visible en cada ítem. Nunca se disimula una limitación.
3. **El corpus habla de sí mismo.** Los microtextos citan conceptos
   (CPT-00593, CPT-00591…) — la interfaz es un ejemplo de uso del corpus.
4. **Vocabulario del dominio, no de la informática.** «Lo que la persona
   trae», «Cuánto tiempo hay», «Hoja para el paciente», «Sin cubrir por el
   corpus». Nada de "queries", "matches" ni "scores" de cara al usuario.
5. **Dos documentos, dos registros.** La UI de trabajo es densa y para el
   profesional; la hoja del paciente es serena, narrativa y en segunda persona.

## 2. Estructura de pantalla

```
┌────────────────────────────────────────────────────────────┐
│ Cabecera: título + descargo permanente (borde dorado)      │
├───────────────────┬────────────────────────────────────────┤
│ EL CASO (360 px,  │ LA SALIDA                              │
│ sticky, scroll    │  · resumen del caso (nº creencias,     │
│ propio)           │    rasgos, encuadre, descartados)      │
│  · frase / lista  │  · Núcleo        [badge teal oscuro]   │
│    de creencias   │  · Imprescindible[badge coral]         │
│  · candidatas con │  · Recomendado   [badge teal]          │
│    barra de       │  · Si hay tiempo [badge gris]          │
│    parecido       │    cada ítem: checkbox · título ·      │
│  · sin cubrir     │    meta (ID·módulo·madurez·certeza) ·  │
│  · 5 rasgos       │    porqué + puntos                     │
│  · encuadre       │                                        │
│  · [Hoja →]       │                                        │
│    [Limpiar]      │                                        │
└───────────────────┴────────────────────────────────────────┘
   < 900 px: una columna, panel del caso arriba (no sticky)
```

La **hoja del paciente** es una capa a pantalla completa (`#hoja.abierta`) con
barra superior (medida INFLESZ + «Guardar como PDF» + «Volver») y documento
centrado a 640 px de ancho de lectura.

## 3. Sistema visual

### Paleta (variables CSS, doble tema)

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--ground` | `#f7f9fa` | `#0f171b` | fondo de página |
| `--panel` | `#fff` | `#16232a` | tarjetas y paneles |
| `--ink` / `--ink-2` | `#14303f` / `#5b7683` | `#e4edf1` / `#93a9b4` | texto / secundario |
| `--teal` / `--teal-deep` | `#2f7f8f` / `#1d5866` | `#5aa9b8` / `#8ecad6` | acción, barras, badges |
| `--gold` | `#c9a227` | — | avisos, parecido flojo, caja de acciones |
| `--coral` | `#c25e4a` | — | imprescindible, sin cubrir, INFLESZ insuficiente |

Tema oscuro automático (`prefers-color-scheme`), sin conmutador manual.
Tipografía del sistema (`-apple-system … sans-serif`); la hoja usa la misma
familia con cuerpo 15,5 px/1,75 para lectura sostenida.

### Componentes

- **Candidata de creencia:** checkbox + enunciado entrecomillado + barra de
  parecido (teal; ámbar si < 40 %) + porcentaje e ID. El enunciado va en
  comillas angulares «» — es literalmente lo que se oye.
- **Ítem de resultado:** tarjeta con sombra suave; checkbox deshabilitado y
  opacidad 0,68 si no es entregable, con etiqueta «sin texto de paciente».
- **Badges de tramo:** píldoras mayúsculas (NÚCLEO teal oscuro, IMPRESCINDIBLE
  coral, RECOMENDADO teal, SI HAY TIEMPO gris) con contador.
- **Pastilla INFLESZ:** verde (`ok`) si ≥ 65, coral (`ko`) si no — el umbral
  de legibilidad «normal» es un objetivo de producto visible.

## 4. La hoja «Sobre tu dolor»

- **Portada:** título, propósito («lo que hemos hablado hoy, por escrito, para
  que puedas releerlo con calma») y fecha en español.
- **Estructura narrativa fija** (hasta 4 partes numeradas): 1. Lo que te está
  pasando · 2. Lo que dicen (y lo que no dicen) las pruebas · 3. Por qué unos
  días duele más que otros · 4. Qué puedes hacer con todo esto. Cada parte
  abre con una frase de entrada en cursiva con borde lateral. Partes sin
  contenido no aparecen.
- **Caja «Para esta semana»:** fondo suave, borde dorado, lista de acciones
  concretas (primera letra en mayúscula al pasar a lista).
- **Registro del texto:** segunda persona, frases cortas (el corpus escribe a
  una frase por línea; la hoja las reagrupa en párrafos de ≤ 3 frases / ≤ 45
  palabras sin tocar el contenido), validación emocional antes que dato
  («Tu dolor es real. Siempre lo es…»).
- **Pie obligatorio:** INFLESZ + palabras, IDs de conceptos usados,
  descargo de material en revisión.
- **Impresión A4:** colores esenciales fijados para papel, cortes de página
  que evitan partir títulos y cajas, márgenes 18/16 mm.

## 5. Accesibilidad

- Controles nativos del navegador (checkbox, select, button): teclado y
  lectores de pantalla sin trabajo extra.
- Contraste AA en ambos temas para texto principal; la información de las
  barras de parecido se duplica siempre en texto (porcentaje).
- Objetivo de legibilidad del contenido: INFLESZ ≥ 65 («normal» o mejor),
  medido y mostrado, no estimado.
- Pendiente (ver plan): revisión formal WCAG 2.2 AA (focus visible en todos
  los interactivos, `aria-live` para el recálculo del resultado, etiquetas de
  los selectores de rasgo).

## 6. Momentos clave del flujo (microcopy)

| Momento | Texto (real) | Función |
|---|---|---|
| Vacío inicial | «Marca alguna creencia o algún rasgo del caso a la izquierda. El núcleo de cinco mensajes entra siempre.» | Enseña el modelo mental |
| Sin resultados de búsqueda | «Nada del corpus se parece a esa frase. [Anotarla]» | Convierte el fallo en dato |
| Parecido flojo | «parecido flojo, comprueba que sea esto» | Traslada la duda al humano |
| Concepto no entregable | «sin texto de paciente» | Explica por qué no puede entrar en la hoja |
| Fuera de tope | «N conceptos puntuaron y quedaron fuera por el tope» | Hace visible el coste del encuadre |
