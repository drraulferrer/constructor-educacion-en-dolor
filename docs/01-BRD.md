# BRD · Documento de Requisitos de Negocio

**Proyecto:** Base de Conocimiento en Educación Terapéutica en Dolor
**Versión:** 1.0 · 17/08/2026 · cruzado con el PMD integrado ([00-PMD-integracion.md](00-PMD-integracion.md))

---

## 1. Contexto y problema de negocio

La educación terapéutica en dolor es una intervención con buena evidencia y
bajo coste, pero en la práctica se imparte de forma improvisada: cada
profesional decide sobre la marcha qué explicar, con qué palabras y en qué
orden, sin trazabilidad de fuentes, sin control de legibilidad y sin manera de
saber qué creencias del paciente quedaron sin abordar. Los materiales que
circulan mezclan niveles de certeza, repiten mitos con otra envoltura o exigen
un nivel lector que el paciente medio no tiene.

El proyecto construye una **base de conocimiento estructurada y con gobernanza
editorial** (taxonomía de 15 dominios, 227 módulos presupuestados y ~3.300
conceptos previstos) y, sobre ella, herramientas que convierten ese
conocimiento en producto: la primera es el **Constructor de contenidos**, que a
partir de un caso descrito en consulta selecciona qué explicar, en qué orden y
con qué prioridad, y genera una hoja para el paciente con legibilidad medida.

## 2. Promotor y encaje institucional

- **Promotor:** Dr. Raúl Ferrer Peña, fisioterapeuta e investigador (Atención
  Primaria, SERMAS; Fundación Paincorp).
- **Proyectos hermanos que consumirán el corpus:** programa de EPS grupal en
  dolor crónico del CS Entrevías (SERMAS), docencia universitaria y formación
  continuada, materiales de la Fundación Paincorp, líneas de investigación en
  educación en dolor (p. ej. INDOCLIN, GAP-421).
- **Titularidad del contenido:** el autor; el corpus está en estado borrador y
  nada se ha `publicado` formalmente todavía.

## 3. Objetivos de negocio

| ID | Objetivo | Indicador de éxito |
|---|---|---|
| ON-1 | Una única fuente de verdad para todo el contenido de educación en dolor del ecosistema (consulta, docencia, EPS, Fundación) | Todo material nuevo se genera desde el corpus y cita IDs (CPT-/ERR-); cero materiales «sueltos» nuevos |
| ON-2 | Reducir el tiempo de preparación de material educativo individualizado | De horas a minutos: una hoja de paciente por caso en < 5 min de interacción |
| ON-3 | Garantizar calidad y trazabilidad | 100 % de conceptos con módulo, prioridad, certeza y madurez; legibilidad INFLESZ visible en cada hoja generada |
| ON-4 | Detectar sistemáticamente lo que el corpus no cubre | Toda frase de consulta sin correspondencia queda anotada como candidata a ficha ERR nueva |
| ON-5 | Habilitar las verticales de formación y publicación | Dominios D12 (docencia) y D14 (producción) desarrollados; contenido validado apto para publicar |

## 4. Interesados

Los públicos están codificados en el propio modelo de datos (campo `quien` de
las fichas de creencia):

| Interesado | Interés | Relación con el producto |
|---|---|---|
| Profesionales sanitarios (fisioterapia, medicina, enfermería, psicología) | Preparar y dar educación en dolor con rigor y rapidez | Usuario primario del Constructor |
| Pacientes y su entorno | Recibir explicaciones comprensibles y accionables | Receptores de la hoja «Sobre tu dolor»; futura fuente de validación |
| Docentes y estudiantes | Material curricular estructurado por dominios y niveles | Consumidores del corpus (vertical de formación) |
| Gestores sanitarios | Estandarización y eficiencia de la intervención educativa | Interesados en indicadores y escalabilidad |
| Investigadores | Corpus citable, con certezas y referencias verificadas | Base para estudios (fidelidad de la intervención) |
| Sociedades científicas / Fundación Paincorp | Materiales de calidad con marca | Canal de difusión futuro |

## 5. Alcance

**Dentro del alcance (fase actual):**
- Corpus estructurado con taxonomía, fichas de concepto y fichas de creencia.
- Constructor de contenidos estático publicado (GitHub Pages, no indexado).
- Generación de hoja de paciente con legibilidad medida (INFLESZ).
- Captura de creencias no cubiertas como retroalimentación al corpus.

**Fuera del alcance (explícitamente):**
- Ayuda a la decisión clínica: no diagnostica, no clasifica pacientes, no
  propone tratamiento.
- Almacenamiento de datos de pacientes: el caso descrito no se guarda ni se
  transmite (todo ocurre en el navegador).
- Publicación abierta del contenido antes de la validación (revisión experta
  externa + revisión por personas con dolor).
- Monetización: no hay modelo de ingresos definido en esta fase.

## 6. Restricciones de negocio

- **Equipo de una persona** con dedicación parcial: el diseño técnico debe
  minimizar mantenimiento (de ahí la página estática sin dependencias).
- **Coste de infraestructura ≈ 0:** GitHub Pages; sin servidores ni APIs.
- **Contenido sanitario no validado:** obligación de descargos visibles en
  producto y en cada hoja generada hasta completar la validación.
- **Privacidad:** al describirse casos reales en consulta, ninguna entrada del
  usuario puede salir del dispositivo (requisito legal y ético; RGPD).
- **Idioma:** español; la legibilidad se mide con una fórmula validada para
  español (INFLESZ).

## 7. Riesgos de negocio

| Riesgo | Prob. | Impacto | Mitigación |
|---|---|---|---|
| Dependencia de una sola persona (bus factor 1) | Alta | Alto | Documentación (esta carpeta), pipeline reproducible, datos en texto plano |
| Uso del material no validado como si lo estuviera | Media | Alto | Descargos en cabecera y pie de cada hoja; `noindex`; nada marcado `publicado` |
| El corpus crece más rápido que su calidad (2.164 conceptos, solo 385 entregables) | Alta | Medio | Fase de consolidación antes que expansión (ver 07-plan) |
| Desactualización científica (caducidad de la evidencia) | Media | Medio | Campo de certeza por concepto; D13 define el proceso de revisión |
| Percepción de intrusismo entre profesiones | Baja | Medio | D07 delimita competencias; lenguaje de límites profesional explícito |

## 8. Criterios de éxito de la fase actual

1. Documentación de proyecto completa y en el repositorio (este entregable).
2. Brecha de entregabilidad en descenso: % de conceptos priorizados A con texto
   de paciente creciendo mes a mes.
3. Primer pilotaje real del Constructor en consulta/EPS con registro de frases
   «sin cubrir».
4. Plan de validación aprobado (quién revisa, con qué criterios, en qué orden).
