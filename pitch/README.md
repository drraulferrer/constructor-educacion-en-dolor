# Pitch deck de Paincorp

`build-deck.js` genera `Paincorp-pitch-deck.pptx`: 16 diapositivas en español,
formato versátil (sirve para inversores, instituciones y socios académicos
cambiando el énfasis de la exposición, no las diapositivas).

El `.pptx` generado **no se versiona aquí** — este repositorio es público y el
deck lleva marca de documento confidencial. Se regenera cuando hace falta.

## Regenerar

```sh
cd pitch
npm install pptxgenjs
node build-deck.js
```

Sale `Paincorp-pitch-deck.pptx` en el directorio actual.

## Qué contiene

Portada · problema · por qué falla hoy · solución · cómo funciona · el corpus en
cifras · cobertura por dominio · los cinco mensajes núcleo · defensibilidad ·
mercado · modelo de negocio · posicionamiento · estado actual · plan · equipo ·
petición de cierre.

Las cifras del corpus (2.164 conceptos, 1.532 creencias, 223 módulos, 385 fichas
entregables y el reparto por dominio de la diapositiva 7) están tomadas de la
instantánea del constructor del 16/08/2026. Al actualizar el corpus conviene
recalcularlas antes de volver a presentar.

## Pendiente de completar antes de presentar

- Diapositiva 10 — tamaño de mercado por segmento con datos de la geografía objetivo.
- Diapositiva 11 — precios y proyección financiera.
- Diapositiva 15 — nombres, credenciales y fotografías del equipo.
- Diapositiva 16 — datos de contacto y, si aplica, importe de la ronda.

Cada diapositiva lleva notas del ponente en el propio `.pptx`.
