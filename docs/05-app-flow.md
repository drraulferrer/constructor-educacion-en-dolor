# App Flow · Flujo de la aplicación

**Producto:** Constructor de contenidos · Educación en Dolor
**Versión:** 1.0 · 17/08/2026

---

## 1. Flujo principal: de la frase del paciente a la hoja impresa

```mermaid
flowchart TD
    A[Profesional abre el Constructor] --> B{¿Tiene una frase\ndel paciente?}
    B -- Sí --> C[Escribe la frase tal cual\n«me han dicho que tengo\nla espalda hecha polvo»]
    C --> D{¿Alguna candidata\nse parece?}
    D -- Sí --> E[Marca la creencia ERR\no el concepto CPT directo\nbarra + % de parecido]
    D -- No --> F[«Anotarla» → lista\n«Sin cubrir por el corpus»\ncandidata a ficha ERR nueva]
    B -- No --> G[Recorre la lista completa\nde creencias, paciente/entorno primero]
    G --> E
    F --> H
    E --> H[Opcional: rasgos del caso\nmecanismo · tiempo · imagen\netapa vital · cribado]
    H --> I[Elige encuadre\núnica 8/3 · tres sesiones 18/6\nprograma 40/10]
    I --> J[Motor: puntúa 2.164 conceptos\ny reparte en tramos]
    J --> K[Resultado con criterios visibles\nNúcleo · Imprescindible ·\nRecomendado · Si hay tiempo]
    K --> L{¿Ajustes?}
    L -- Marca/desmarca conceptos --> K
    L -- Cambia caso/encuadre --> J
    L -- Conforme --> M[«Hoja para el paciente →»]
    M --> N[Hoja «Sobre tu dolor»\n≤4 partes narrativas +\ncajas «Para esta semana»\n+ INFLESZ del documento]
    N --> O{¿Legibilidad ok?\nINFLESZ ≥ 65 verde}
    O -- No --> L
    O -- Sí --> P[Guardar como PDF / imprimir A4]
    P --> Q[Entrega al paciente\npie con IDs + descargo]
```

## 2. Lógica interna por interacción

Cada cambio de entrada dispara `calcular()`, que re-puntúa todo el corpus:

```mermaid
flowchart LR
    subgraph Entrada
      cre[creencias marcadas ERR]
      dir[conceptos directos CPT]
      ras[rasgos → módulos activos]
      enc[encuadre → tope y cabeza]
    end
    subgraph Puntuación por concepto
      p1["+100 × creencia corregida"]
      p2["+100 si señalado directo"]
      p3["+40 módulo activado"]
      p4["+15 prioridad A · +7 B"]
      p5["−25 certeza baja/muy baja"]
      p6["−40 sin texto de paciente"]
    end
    subgraph Tramos por rango
      nuc[Núcleo: 5 fijos D04.M05,\nfuera de concurso]
      imp[Imprescindible: ≥100 puntos,\nmáx cabeza]
      rec[Recomendado: mitad del hueco]
      sht[Si hay tiempo: resto hasta tope]
      des[Descartados: se cuenta cuántos]
    end
    Entrada --> Puntuación_por_concepto --> Tramos_por_rango
```

Desempates: puntos ↓, luego `niv` ↑ (orden pedagógico dentro del módulo),
luego ID. La selección manual (`decidido`) solo guarda lo que el usuario tocó;
lo demás sigue el defecto de su tramo (núcleo e imprescindible entran, el
resto no).

## 3. Flujo de la búsqueda por frase

```mermaid
flowchart TD
    F[Frase ≥ 3 caracteres] --> N[normalizar: minúsculas,\nsin tildes, stopwords fuera,\nlematizado ligero]
    N --> S1[solapamiento IDF\ncontra enunciado ERR]
    N --> S2[Dice de trigramas\ncontra enunciado]
    N --> S3[solapamiento IDF\ncontra bolsa de contexto]
    S1 & S2 & S3 --> W["0,65·enun + 0,25·tri + 0,10·ctx"]
    W --> U{similitud ≥ 0,25}
    U -- No --> X[no se muestra]
    U -- Sí --> V{≥ 0,40}
    V -- Sí --> R1[candidata normal, barra teal]
    V -- No --> R2[«parecido flojo», barra ámbar]
    R1 & R2 --> T[top 5 ERR + top 3 CPT\nno cubiertos ya por esas ERR]
```

## 4. Flujo de datos del proyecto (ciclo editorial completo)

```mermaid
flowchart LR
    subgraph Local[Máquina del autor — fuente de verdad]
      ont[ontologia/dominios.yaml]
      cpt[conceptos/ fichas CPT y ERR]
      build[build Python:\nINFLESZ por concepto,\nrelaciones, DATOS JSON]
      panel[Panel Estado del corpus\nbuild/servir.py]
      ont --> build
      cpt --> build
      build --> panel
    end
    build --> html[index.html autocontenido]
    html --> commit[commit: chore constructor\n· N conceptos · N creencias]
    commit --> pages[GitHub Pages\nnoindex + robots.txt]
    pages --> uso[Uso en consulta]
    uso -. frases sin cubrir\n(hoy: manual, se pierden\nal recargar) .-> cpt
```

La línea discontinua es el eslabón débil del ciclo: la señal «sin cubrir»
—la retroalimentación más valiosa del uso real— no tiene hoy camino de vuelta
al corpus (ver P1 del [PRD](02-PRD.md) y fase 2 del
[plan](07-plan-implementacion.md)).

## 5. Estados y casos borde

| Situación | Comportamiento |
|---|---|
| Nada marcado | Mensaje guía; el núcleo se muestra igualmente (entra siempre) |
| Frase sin candidatas | Oferta de anotarla como sin cubrir |
| Concepto sin `pac` | Visible pero deshabilitado, etiquetado, penalizado −40 |
| Más conceptos que tope | Se cortan por rango y se informa del nº de descartados |
| Parte de la hoja sin conceptos | La sección no se pinta (mejor 3 llenas que 5 vacías) |
| Recarga de página | Estado perdido por diseño (sin persistencia); «Limpiar» equivale |
| Impresión | Solo se imprime la hoja; UI oculta; colores fijados para papel |
