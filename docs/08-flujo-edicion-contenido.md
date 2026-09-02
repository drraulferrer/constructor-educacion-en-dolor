# Flujo de edición de contenido — OpenMontage

**Proyecto:** Base de Conocimiento en Educación Terapéutica en Dolor
**Versión:** 1.0 · 22/08/2026
**Se apoya en:** [00-PMD-integracion](00-PMD-integracion.md) · [06-esquema-backend](06-esquema-backend.md) · [07-plan-implementacion](07-plan-implementacion.md)

---

## 1. Qué es esto y qué no es

`tools/openmontage` es un submódulo git que apunta a
[drraulferrer/OpenMontage](https://github.com/drraulferrer/OpenMontage): un
sistema agéntico de producción de vídeo, de código abierto, pensado para que
un asistente de código (Claude Code, Cursor, Codex…) lo opere como su propio
equipo de producción — investiga, escribe guion, genera o busca
imágenes/vídeo, narra, musicaliza, monta y renderiza un vídeo final.

No es un editor del corpus. No sustituye ni modifica `index.html`,
`ontologia/` ni las fichas CPT/ERR. Es una pieza aparte que **consume**
contenido ya redactado en el corpus para producir material derivado
(vídeo). El corpus sigue siendo la única fuente de verdad para texto; este
submódulo es el "flujo de edición" para el vídeo que se pueda construir a
partir de él.

## 2. Por qué un submódulo y no una copia

OpenMontage se publica bajo licencia **AGPLv3** (ver su `LICENSE`); este
repositorio no declara licencia propia. Copiar su código dentro de la
historia de este repo mezclaría dos licencias sin necesidad. Un submódulo
referencia el commit exacto de un repositorio ajeno sin fusionar su historia
ni su código con el nuestro — se mantiene separado a propósito.

```bash
git submodule update --init --recursive   # trae tools/openmontage la primera vez
git -C tools/openmontage log -1           # commit exacto que se está usando
```

Actualizar a una versión más reciente es explícito y queda en el historial:

```bash
cd tools/openmontage && git fetch origin && git checkout origin/main && cd ../..
git add tools/openmontage
git commit -m "chore: actualizar OpenMontage"
```

**Antes de publicar vídeos generados con una copia modificada de
OpenMontage desplegada como servicio en red**, revisar las obligaciones de
la AGPLv3 (código fuente disponible para quien use ese servicio). Usarlo en
local como herramienta de producción no las activa; ofrecerlo como servicio
sí podría hacerlo.

## 3. Diferencia con la regla «todo local y determinista»

La regla editorial vigente del Constructor (ver [00 §4](00-PMD-integracion.md))
dice: *sin red, sin modelo, sin API; la página debe funcionar abierta con
doble clic*. Esa regla es de `index.html` y no cambia con esto.

OpenMontage es lo contrario cuando hay claves de API configuradas: busca en
la web y llama a proveedores de pago de imagen/vídeo/voz. Vive fuera del
árbol publicado, no se referencia desde `index.html`, y el `robots.txt`/
`noindex` del sitio no lo exponen ni lo necesitan. Con cero claves configuradas
funciona en modo gratuito/local (voz Piper, bancos de Archive.org, NASA,
Wikimedia Commons, Pexels, Pixabay, montaje con Remotion/FFmpeg) — detalle en
la tabla «What You Get With Zero API Keys» de su README.

## 4. Instalación

Requisitos (detalle completo en `tools/openmontage/README.md`):

| Herramienta | Mínimo | Verificado en este entorno |
|---|---|---|
| Python | 3.10+ | 3.11.15 ✓ |
| Node.js | 18+ | 22.x ✓ |
| FFmpeg | reciente | no instalado aquí — `apt install ffmpeg` / `brew install ffmpeg` |
| Git | reciente | 2.43 ✓ |

```bash
git submodule update --init --recursive
cd tools/openmontage
make setup            # crea .venv, instala dependencias Python + Remotion (npm), voz Piper
cp .env.example .env  # opcional: añadir claves de proveedores de pago
```

`make setup` no se ha ejecutado como parte de este cambio: crea entorno
virtual, `node_modules/` y modelos de voz — todo cubierto por el
`.gitignore` propio de OpenMontage y sin motivo para versionarse aquí.

## 5. Cómo usarlo con el contenido de este corpus

OpenMontage no conoce el modelo de datos `DATOS` (conceptos, creencias,
módulos) de este proyecto — el puente es manual y deliberado. Se eligen
conceptos ya `ent:true` (con `pac` redactado; ver
[06 §2.1](06-esquema-backend.md)) y su texto se entrega como guion base al
pedir la producción, por ejemplo:

```text
Quiero un explicador de 45 segundos para pacientes sobre por qué el reposo
prolongado empeora el dolor. Usa este texto como guion base: «<pac de
CPT-00xxx>». Tono cercano, sin tecnicismos, sin narrador alarmista.
```

Reglas editoriales que se mantienen también en el material derivado (ver
[00 §4](00-PMD-integracion.md)):

- No es ayuda a la decisión clínica: ningún vídeo diagnostica ni prescribe.
- El núcleo fijo (CPT-00586–00590) no se contradice en ningún guion.
- Nada de lo producido aquí es `publicado`: el corpus completo sigue en
  borrador (ver el campo `val` previsto en [06 §4](06-esquema-backend.md)).

## 6. Dónde encaja en el plan

[07-plan-implementacion, Fase 5](07-plan-implementacion.md) ya preveía
«materiales derivados con marca (Fundación Paincorp) generados desde el
corpus, nunca a mano» — pero **después** de la validación (Fase 4). Este
submódulo adelanta la *herramienta*, no el *criterio de cierre*: sirve para
explorar y prototipar ya, pero ningún vídeo producido con él debe
presentarse como contenido validado o listo para publicación hasta que el
corpus fuente alcance ese estado.
