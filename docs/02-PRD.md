# PRD · Documento de Requisitos de Producto

**Producto:** Constructor de contenidos · Educación en Dolor (sobre la Base de Conocimiento)
**Versión:** 1.0 · 17/08/2026 · estado observado: instantánea del 16/08/2026

---

## 1. Definición del producto

Un **selector de contenidos educativos**: el profesional describe el caso (lo
que la persona ha dicho, rasgos del cuadro, tiempo disponible) y el corpus
responde qué explicaría, en qué orden y con qué prioridad — con los criterios a
la vista — y lo convierte en una hoja imprimible para el paciente.

**Lo que NO es (no-objetivos, vinculantes):**
- No es una ayuda a la decisión clínica: no diagnostica, no clasifica a la
  persona, no propone tratamiento.
- No es un chatbot ni usa IA en tiempo de ejecución: todo es local y
  determinista.
- No es un repositorio público: la copia publicada es material de trabajo, no
  indexada, sin validar.

## 2. Personas de usuario

| Persona | Escenario | Necesidad |
|---|---|---|
| **Fisioterapeuta de AP** (primaria) | Consulta de ~10 min, paciente con lumbalgia persistente que dice «tengo la espalda hecha polvo» | Encontrar en segundos qué creencia es, qué conceptos la corrigen y salir con una hoja de ≤ 8 conceptos |
| **Profesional en programa EPS** | Programa grupal de varias sesiones | Encuadre «programa completo»: currículum de hasta 40 conceptos priorizados |
| **Editor del corpus** (el autor) | Revisión de cobertura | Ver qué frases reales no casan con ninguna ficha ERR y crear fichas nuevas |
| **Docente** (futuro) | Preparar clase por dominios/módulos | Navegar el corpus por taxonomía (aún no soportado en el Constructor) |

## 3. Requisitos funcionales

### RF-1 · Entrada del caso: creencias
1. **Búsqueda por frase del paciente** («con sus palabras, tal cual»): el
   sistema propone hasta 5 creencias registradas (fichas ERR) ordenadas por
   parecido semántico-léxico, con barra y porcentaje.
   - Parecido < 40 %: se marca «parecido flojo, comprueba que sea esto».
   - Además, hasta 3 conceptos (CPT) cuyo título casa con la frase y que no
     estén ya representados por una ERR mostrada, etiquetados «candidato a
     ficha ERR nueva».
2. **Lista completa navegable** cuando no hay frase: todas las creencias,
   ordenadas primero las de paciente/entorno (las que se oyen en consulta),
   con etiqueta de quién la sostiene.
3. **Sin cubrir:** si nada encaja, la frase se anota como candidata a ficha
   ERR nueva y queda listada en el panel («buscar y no encontrar es un
   resultado»). Debe poder quitarse.

### RF-2 · Entrada del caso: rasgos
Cinco selectores opcionales, cada uno con ayuda que cita el concepto que lo
justifica: **mecanismo dominante** (nociceptivo/neuropático/nociplástico/
mixto/sin clasificar), **tiempo de evolución** (agudo/subagudo/persistente),
**prueba de imagen** (con hallazgos/sin hallazgos/no hecha/la pide),
**etapa vital** (infancia→deterioro cognitivo) y **cribado** (pendiente/hecho/
sospecha). Cada opción activa módulos concretos de la taxonomía.

### RF-3 · Encuadre temporal
Tres encuadres que fijan tope de conceptos y tamaño de la «cabeza»
imprescindible: consulta única (~10 min, 8/3), tres sesiones (18/6, por
defecto), programa completo (40/10).

### RF-4 · Resultado priorizado
1. Puntuación transparente por concepto: +100 por creencia marcada que
   corrige (+100 si se señaló directo desde la frase), +40 por módulo activado
   por rasgo, +15 prioridad A / +7 B, −25 certeza baja o muy baja, −40 sin
   texto entregable. Cada ítem muestra su «porqué» y sus puntos.
2. Cuatro tramos: **Núcleo** (5 mensajes fijos de D04.M05, siempre y en
   orden), **Imprescindible** (corrigen creencia marcada, hasta `cabeza`),
   **Recomendado** y **Si hay tiempo** (reparto por rango hasta el tope).
   Se informa cuántos conceptos puntuaron y quedaron fuera por el tope.
3. El profesional puede marcar/desmarcar cada concepto; por defecto entran
   núcleo e imprescindible. Los conceptos sin texto de paciente aparecen
   deshabilitados y señalados.

### RF-5 · Hoja para el paciente
1. Documento «Sobre tu dolor» montado con los conceptos marcados, organizado
   en hasta 4 partes narrativas (qué te pasa / las pruebas / por qué unos días
   duele más / qué puedes hacer), cada una con texto de entrada. Partes vacías
   no se pintan.
2. Las acciones (`acc`) de los conceptos se agrupan en cajas «Para esta
   semana» por parte, sin duplicados.
3. **Legibilidad INFLESZ exacta del documento** (suma de recuentos por
   concepto, no promedio de índices), visible en la barra con banda
   (muy difícil → muy fácil) y recuento de palabras; en verde si ≥ 65.
4. Pie obligatorio: IDs de los conceptos usados, aviso de material no validado
   y de que no sustituye al profesional.
5. Impresión A4 limpia vía `window.print()` (guardar como PDF): colores
   fijados, cortes de página controlados.

### RF-6 · Gestión de la sesión
Botón «Limpiar» que restaura todo el estado (creencias, rasgos, decisiones,
frases sin cubrir). No hay persistencia entre recargas (ver brechas).

## 4. Requisitos no funcionales

| RNF | Requisito |
|---|---|
| Privacidad | Ninguna entrada del usuario sale del navegador; sin red, sin analítica, sin cookies |
| Portabilidad | Un solo fichero HTML; funciona con doble clic y en GitHub Pages por igual |
| Determinismo | Mismo caso ⇒ mismo resultado; sin aleatoriedad ni modelos |
| Rendimiento | Interacción instantánea con 2.164 conceptos y 1.532 creencias en memoria |
| Accesibilidad | Modo oscuro automático; controles nativos (checkbox, select); tipografía del sistema |
| Transparencia | Todo criterio editorial visible en el resultado; descargos permanentes en cabecera |

## 5. Estado actual y brechas conocidas

| Área | Estado | Brecha |
|---|---|---|
| Corpus | 2.164 conceptos, 12/15 dominios con contenido | D12, D14, D15 a cero; D10, D11, D13 incipientes |
| Entregabilidad | 385 conceptos con texto de paciente; 100 con acción | El 82 % del corpus no puede entrar en una hoja (penalizado −40) |
| Sin cubrir | Se capturan en sesión | **Se pierden al recargar**: no hay exportación ni envío al editor |
| Persistencia de caso | No existe | No se puede guardar/compartir un caso ni retomarlo |
| Navegación por taxonomía | No existe | El docente no puede explorar por dominio/módulo |
| Validación | Sin iniciar | Sin revisión experta externa ni por personas con dolor |

## 6. Priorización de evolución (propuesta)

1. **P1 — Cerrar el circuito de retroalimentación:** exportar/copiar las
   frases «sin cubrir» (y opcionalmente el caso) para que lleguen al editor
   del corpus. Es la funcionalidad con más valor por esfuerzo.
2. **P2 — Elevar entregabilidad:** priorizar redacción de `pac`/`acc` en los
   conceptos que más puntúan en casos típicos (los que hoy salen deshabilitados).
3. **P3 — Permalink de caso:** serializar la selección en la URL (hash) para
   guardar/compartir sin backend y sin datos personales.
4. **P4 — Vista de taxonomía:** exploración por dominio/módulo para docencia.
5. **P5 — Validación y sello:** flujo de revisión y distintivo `publicado` por
   concepto, reflejado en la UI.

Trazabilidad con negocio: P1–P2 sirven ON-2/ON-4; P4 sirve ON-5; P5 sirve ON-3
y desbloquea la publicación abierta (ver [01-BRD.md](01-BRD.md)).
