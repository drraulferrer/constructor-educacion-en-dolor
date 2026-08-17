# Esquema del backend

**Sistema:** Base de Conocimiento en Educación Terapéutica en Dolor
**Versión:** 1.0 · 17/08/2026

---

## 1. Punto de partida: no hay servidor, y es una decisión

El «backend» del proyecto es un **pipeline de compilación**: el corpus vive en
ficheros locales, un build en Python lo valida y lo compila a un JSON embebido
(`DATOS`) dentro de `index.html`, y GitHub Pages sirve el resultado como
estático. En tiempo de ejecución no existe servidor, base de datos ni API — por
privacidad (se describen casos reales), coste cero y mantenimiento mínimo.

Este documento especifica (a) el modelo de datos real de `DATOS`, que es el
contrato entre corpus y aplicación, y (b) el esquema de la fuente de verdad y
su evolución prevista.

## 2. Contrato de datos `DATOS` (instantánea 16/08/2026)

```jsonc
{
  "generado": "16/08/2026 13:58",   // sello de la instantánea
  "publico": true,                  // es la copia publicada (activa descargos)
  "conceptos": [ /* 2.164 × Concepto */ ],
  "errores":   [ /* 1.532 × Creencia (ficha ERR) */ ],
  "modulos":   { /* 223 × "D01.M01": "D01.M01 · Naturaleza y definición del dolor" */ },
  "rasgos":    { /* 5 × Rasgo */ },
  "encuadres": { /* 3 × Encuadre */ },
  "nucleo":    ["CPT-00586", "…-00587", "…-00588", "…-00589", "…-00590"],
  "partes":    [ /* 4 × Parte de la hoja */ ]
}
```

### 2.1 `Concepto` (entidad central)

| Campo | Tipo | Descripción | Valores observados |
|---|---|---|---|
| `id` | string | `CPT-#####`, único | CPT-00001… |
| `t` | string | Título del concepto | — |
| `m` | string | Módulo (`Dxx.Myy`) al que pertenece | 223 módulos, 12 dominios |
| `p` | enum | Prioridad editorial del dominio | `A`, `B` |
| `ce` | enum | Certeza de la evidencia | `consenso` (294), `alta` (478), `moderada` (736), `baja` (401), `muy_baja` (29), `no_aplica` (224), `mecanistico` (2) |
| `ma` | enum | Madurez editorial | `M4` (2.163), `M3` (1) |
| `niv` | int | Orden pedagógico dentro del módulo | 0–32 |
| `err` | string[] | IDs de creencias que este concepto corrige | 0..n |
| `pac` | string | Texto para paciente (Markdown mínimo, una frase por línea) | no vacío en 385 |
| `acc` | string | Acción concreta «para esta semana» | no vacío en 100 |
| `parte` | enum | Sección de la hoja donde encaja | `que_pasa` (82), `pruebas` (32), `dias` (97), `hacer` (1.953) |
| `ent` | bool | Entregable: tiene texto de paciente apto | `true` en 385 |
| `leg` | [int,int,int] | Recuentos INFLESZ `[palabras, frases, sílabas]`, precalculados en Python | solo si `ent` |

### 2.2 `Creencia` (ficha ERR)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | `ERR-####`, único |
| `enunciado` | string | La creencia formulada como se oye («Si no sale nada en las pruebas, no tengo nada») |
| `quien` | enum[] | Quién la sostiene: `paciente`, `profesional`, `entorno`, `docente`, `estudiante`, `gestor`, `investigador`, `ciudadania` (multivaluado; 288 fichas sin asignar) |
| `bolsa` | string | Bolsa de palabras de contexto para la búsqueda (indexada separada del enunciado, con peso menor) |

Relación N:M con conceptos, materializada en `Concepto.err` (el lado concepto
es el propietario).

### 2.3 `Rasgo`, `Encuadre`, `Parte`

```jsonc
// Rasgo: pregunta opcional del caso; cada opción activa módulos (+40 puntos)
"mecanismo": {
  "etiqueta": "Mecanismo dominante",
  "ayuda": "Hipótesis clínica, no hallazgo (CPT-00056).",   // cita al corpus
  "opciones": { "nociplastico": { "nombre": "Nociplástico",
                                  "modulos": ["D01.M04", "D02.M09"] }, … }
}
// Los cinco rasgos: mecanismo, tiempo, imagen, etapa, banderas (cribado)

// Encuadre: presupuesto de la sesión
"corto": { "nombre": "Tres sesiones", "tope": 18, "cabeza": 6 }
// unica: 8/3 · corto: 18/6 (defecto) · programa: 40/10

// Parte: sección narrativa de la hoja del paciente
{ "id": "que_pasa", "titulo": "Lo que te está pasando",
  "entrada": "Empecemos por lo más importante…",
  "modulos": ["D04.M05", "D01.M01", …] }   // informativo; el reparto usa Concepto.parte
```

### 2.4 Invariantes del contrato (deben validarse en el build)

1. Todo `Concepto.m` existe en `modulos`; todo id de `Concepto.err` existe en
   `errores`; todo id de `nucleo` existe en `conceptos`.
2. `ent = true` ⟺ `pac` no vacío; y solo entonces `leg` presente y con
   `palabras > 0` y `frases > 0`.
3. `parte` pertenece a los ids de `partes`; los módulos citados por rasgos y
   partes existen en `modulos`.
4. IDs únicos y con formato `CPT-\d{5}` / `ERR-\d{4}`.
5. El JSON es parseable de forma aislada (sin comentarios ni funciones): la
   documentación y las herramientas dependen de ello.

## 3. Fuente de verdad (repositorio del corpus, local)

```
corpus/
├── ontologia/
│   └── dominios.yaml        # 15 dominios (D01–D15), módulos, prioridades A/B,
│                            # presupuesto de conceptos por módulo (3.296 total)
├── conceptos/               # fichas CPT (y fichas ERR asociadas)
└── build/
    ├── servir.py            # panel local «Estado del corpus» (datos.json en vivo)
    └── (generador)          # valida, calcula INFLESZ y emite index.html
```

Métricas que el pipeline ya calcula y que no viajan al Constructor (solo al
panel): relaciones entre conceptos (769 el 28/07), referencias verificadas
(61), módulos cerrados frente a presupuesto.

## 4. Evolución prevista del esquema (sin romper el enfoque estático)

| Necesidad | Cambio de esquema propuesto | Fase (ver 07) |
|---|---|---|
| Cerrar el ciclo de «sin cubrir» | Exportación estructurada desde el cliente: `{fecha, frase, candidatasRechazadas[]}` copiable/descargable; ingesta manual o script en el corpus | F2 |
| Sello de validación | `Concepto.val`: `borrador → revision_externa → revisado_pacientes → publicado`; la UI muestra el sello y filtra la copia pública | F4 |
| Referencias citables | `Concepto.ref[]` (DOI/PMID) — ya existen «referencias verificadas» en el corpus; exponerlas en instantáneas profesionales | F4 |
| Caso compartible | Serialización del estado en el hash de la URL (ids ERR/CPT, rasgos, encuadre); sin datos personales, sin backend | F3 |
| Crecimiento del fichero | Separar `datos.js` del shell; o emitir dos instantáneas (completa / solo entregables) | F3 |
| Panel público de progreso | Publicar `datos.json` del panel junto al Constructor para que «Estado del corpus» deje de quedarse obsoleto | F2 |

**Criterio rector:** solo se introducirá un backend real (API + BD) si aparece
un requisito que el modelo estático no pueda cumplir (edición colaborativa
multi-editor, telemetría de uso consentida, cuentas). Ninguna de las
necesidades actuales lo exige.
