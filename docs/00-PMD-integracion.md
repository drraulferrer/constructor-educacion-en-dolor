# PMD · Documento Maestro del Proyecto — Cruce e integración

**Proyecto:** Base de Conocimiento en Educación Terapéutica en Dolor
**Fecha de este cruce:** 17/08/2026
**Responsable:** Dr. Raúl Ferrer Peña

---

## 1. Situación del PMD

No existe (o no es accesible desde este repositorio, Google Drive ni Notion) un
fichero PMD independiente. La función de documento maestro la cumplen hoy, de
facto, dos fuentes:

| Fuente | Fecha | Qué aporta |
|---|---|---|
| Artefacto «Estado del corpus · Educación en Dolor» | 28/07/2026 | Taxonomía completa: 15 dominios, 227 módulos, 3.296 conceptos presupuestados, prioridades A/B, objetivo de cada dominio |
| Instantánea embebida en el Constructor (`index.html`, este repo) | 16/08/2026 | Estado real del corpus publicado: 2.164 conceptos, 1.532 creencias (fichas ERR), 223 módulos, reglas editoriales operativas |

Los documentos 01–07 de esta carpeta se han redactado cruzando ambas fuentes.
Este fichero registra el resultado del cruce y queda como **PMD integrado**: si
en el futuro aparece o se crea un PMD canónico, debe reconciliarse contra esta
tabla de discrepancias.

## 2. Arquitectura del proyecto (dos piezas)

1. **El corpus (fuente de verdad, local).** Repositorio de trabajo en la máquina
   del autor: `ontologia/dominios.yaml` + `conceptos/`, con un pipeline en
   Python (`build/servir.py` y proceso de construcción) que calcula métricas
   (recuentos INFLESZ por concepto, relaciones, referencias verificadas) y
   genera instantáneas.
2. **El Constructor de contenidos (este repositorio, publicado).** Página
   estática autocontenida (`index.html`, ~1,7 MB) desplegada en GitHub Pages
   con `noindex` y `robots.txt Disallow: /`. Cada instantánea del corpus se
   publica con un commit automatizado
   (`chore: constructor · N conceptos · N creencias · fecha`).

## 3. Tabla de discrepancias detectadas (28/07 → 16/08)

| # | Punto | Estado del corpus (28/07) | Constructor (16/08) | Resolución adoptada en los docs |
|---|---|---|---|---|
| 1 | Conceptos escritos | 215 | 2.164 | El artefacto está desactualizado; se toma la instantánea del constructor como estado vigente. La taxonomía (dominios, presupuestos) del artefacto sigue siendo válida como plan. |
| 2 | Módulos totales | 227 | 223 con nombre en `DATOS.modulos` | Se documentan ambas cifras; pendiente de confirmar si 4 módulos se fusionaron o aún no tienen contenido publicado. |
| 3 | Escala de madurez | M2/M3 | M4 (2.163) + M3 (1) | La escala evolucionó; los docs usan la escala observada (M3 = en redacción, M4 = redactado). Debe definirse formalmente en el corpus. |
| 4 | Dominios con contenido | 3 iniciados (D01, D02, D03) | 12 con conceptos (D01–D11 y D13) | Vigente lo del constructor. Sin contenido publicado: **D12** (Docencia), **D14** (Recursos y producción), **D15** (Salud digital e IA). D10 (38), D11 (96) y D13 (14) están iniciados pero lejos del presupuesto. |
| 5 | Creencias / fichas ERR | 769 «relaciones», sin cifra de creencias | 1.532 fichas ERR | Las fichas ERR se consolidan como entidad de primer nivel del modelo de datos (ver 06-esquema-backend). |
| 6 | Material entregable a paciente | — (no se medía) | Solo 385/2.164 conceptos con texto de paciente (`ent:true`); 100 con acción semanal (`acc`) | Es la brecha principal del producto. El plan de implementación (07) la trata como prioridad 1. |
| 7 | Validación | «referencias verificadas: 61» | Descargo explícito en la UI: sin revisión experta externa ni revisión por personas con dolor; nada `publicado` | Coherente en ambas fuentes: el corpus completo está en estado borrador. La validación es fase propia del plan (07). |

## 4. Decisiones editoriales vigentes (extraídas del código y sus comentarios)

Estas reglas están operativas en el constructor y se asumen como parte del PMD:

- **El corpus se cita a sí mismo.** La interfaz justifica sus criterios con IDs
  de concepto (p. ej. CPT-00593: «un currículum se define por lo que se repite,
  no por lo que cubre»; CPT-00591: el núcleo entra siempre y en orden).
- **Núcleo fijo:** los cinco mensajes de D04.M05 (CPT-00586–00590) entran en
  toda hoja, en su orden, sin competir por puntuación.
- **Buscar y no encontrar es un resultado** («regla 8»): las frases de paciente
  que no casan con ninguna creencia se anotan como candidatas a ficha ERR nueva
  («sin cubrir por el corpus»).
- **No es ayuda a la decisión clínica:** el constructor selecciona contenidos
  educativos; no diagnostica, no clasifica personas, no propone tratamiento.
- **Criterios a la vista:** cada resultado muestra por qué puntúa lo que puntúa.
- **Todo local y determinista:** sin red, sin modelo, sin API; la página debe
  funcionar abierta con doble clic y publicada en Pages por igual.
- **Honestidad sobre la incertidumbre:** los parecidos flojos se marcan como
  tales en lugar de disimularse; la certeza baja penaliza la puntuación.

## 5. Índice de la documentación

| Doc | Contenido |
|---|---|
| [01-BRD](01-BRD.md) | Requisitos de negocio: propósito, interesados, alcance, riesgos |
| [02-PRD](02-PRD.md) | Requisitos de producto: personas, funcionalidades, no-objetivos |
| [03-TRD](03-TRD.md) | Requisitos técnicos: arquitectura, restricciones, algoritmos |
| [04-diseno-ui-ux](04-diseno-ui-ux.md) | Sistema visual, componentes, accesibilidad, impresión |
| [05-app-flow](05-app-flow.md) | Flujos de usuario y de datos, con diagramas |
| [06-esquema-backend](06-esquema-backend.md) | Modelo de datos completo y pipeline de publicación |
| [07-plan-implementacion](07-plan-implementacion.md) | Fases, hitos y criterios de cierre |
| [08-flujo-edicion-contenido](08-flujo-edicion-contenido.md) | Submódulo OpenMontage: producción de vídeo derivado del corpus |

## 6. Acciones derivadas del cruce

1. Actualizar el artefacto «Estado del corpus» o regenerarlo desde
   `build/servir.py` (las cifras de julio inducen a error).
2. Aclarar la diferencia 227 vs. 223 módulos en `ontologia/dominios.yaml`.
3. Documentar formalmente la escala de madurez (M1–M4 y qué significa cada una).
4. Si se crea un PMD canónico como fichero, ubicarlo en el repositorio del
   corpus (fuente de verdad) y enlazarlo desde esta carpeta, no al revés.
