# WORLD COMMAND

Simulador geopolítico de mundos ficticios con historia dinámica. Se genera un mundo a partir de una **semilla**, los países actúan solos mediante reglas y probabilidades (sin IA externa, sin APIs, sin servicios de pago) y la historia emerge de sus interacciones. Puedes observar como **Dios** o tomar el mando de cualquier país como **gobernante**.

Estética de centro de mando militar / atlas geopolítico. Todo funciona en el navegador, sin dependencias.

## Ejecutar

Requisitos: un navegador moderno. Node.js ≥ 18 es opcional (servidor y tests).

```bash
# Opción A: abrir index.html directamente en el navegador (doble clic)

# Opción B: servidor local
npm start            # http://localhost:8080
```

No hay `npm install` porque el proyecto no tiene dependencias. Para ejecutar la batería de comprobaciones:

```bash
npm test
```

## Cómo se usa

- **Velocidad** (barra superior): `II` pausa, x1…x100 años. Barra espaciadora = pausa/continuar.
- **Mapa**: arrastra para moverte, rueda o botones +/− para el zoom, clic para seleccionar provincia y país. Selector de **capas**: político, provincial, población, economía, cultural, religioso, ideologías, diplomático, estabilidad, conflictos, relieve y organizaciones. El selector «Hoy» muestra las fronteras históricas (instantáneas cada 10 años). Las provincias **reclamadas** se ven rayadas con el color del reclamante.
- **Panel derecho**: ficha del país (gobierno, economía, diplomacia, sociedad, opinión pública, reivindicaciones, sanciones, prensa, banderas, dinastía) y de la provincia.
- **Modo Dios** (sin gobernar ningún país): cambiar gobierno, renombrar, nueva bandera, declarar guerras o paz, crear alianzas, unificar países, entregar provincias, declarar independencias, golpe de Estado.
- **Modo gobernante** («Gobernar este país»): invertir, propaganda, impuestos, servicios públicos, anticorrupción, reformas de gobierno, convocar elecciones, declarar guerra o pedir paz, alianzas y acuerdos comerciales, sanciones, reivindicar provincias, fundar ciudades, cambiar la capital.
- **Historia**, **Organizaciones** y **Noticias**: cronología consultable por año, listado de organizaciones con bandera, miembros y mapa, y prensa nacional + agencia neutral.
- **Guardado**: autoguardado cada año en el navegador (`localStorage`), Guardar/Cargar manual y Exportar/Importar el mundo completo en JSON (copiar y pegar).

## Sistemas

| Sistema | Resumen |
|---|---|
| Mundo | Provincias irregulares (Voronoi) generadas con semilla reproducible; 12 países iniciales |
| Política | 8 sistemas de gobierno que evolucionan; elecciones, parlamento de 120 escaños y coaliciones |
| Conflictos | Rebeliones, independencias, revoluciones, golpes, guerras civiles, guerras internacionales y tratados de paz |
| Diplomacia | Relaciones −100…+100 entre todos los países, tratados y organizaciones (alianzas, uniones, confederaciones), llamada a aliados con decisión propia |
| Organizaciones | Nombre, siglas, bandera, fundador, objetivos, condiciones de entrada, nivel de cooperación; admiten, expulsan, se renombran y se disuelven |
| Dinastías | Casas con apellido, reglas de sucesión (agnática/cognaticia), herederos, crisis sucesorias, árbol genealógico e historial de monarcas |
| Opinión pública | Seis factores + libertades y estabilidad; opinión por provincia; protestas y reformas |
| Prensa | Medios nacionales con línea editorial y neutralidad; la agencia mundial (AMN) informa de forma neutral; titulares basados en hechos reales |
| Banderas | Generador SVG procedural (franjas, cruces, símbolos, bordes), sin duplicados; cambian con revoluciones, uniones, etc. y se conserva el historial |
| Reivindicaciones y sanciones | Reclamos territoriales que afectan a las relaciones y pueden acabar en guerra; embargos y rupturas, incluidas sanciones colectivas |
| Cansancio de guerra | Crece con la duración y las derrotas; provoca protestas, caída de gobiernos y presión por la paz |

## Estructura

```
index.html         Interfaz
css/style.css      Estilos
js/core.js         Constantes, utilidades y registro de historia
js/world.js        Generación del mundo y geografía
js/flags.js        Generador de banderas
js/dynasty.js      Dinastías y sucesiones
js/society.js      Opinión pública, reivindicaciones, sanciones
js/press.js        Prensa y noticias
js/diplomacy.js    Relaciones, tratados y organizaciones
js/war.js          Guerras
js/sim.js          Bucle de simulación, revoluciones, eventos
js/render.js       Mapa y capas
js/ui.js           Paneles y ventanas
js/storage.js      Guardado y carga
js/main.js         Eventos de la interfaz y arranque
tests/             Pruebas de coherencia (npm test)
server.js          Servidor estático opcional
```

Los scripts se cargan como scripts clásicos (sin módulos ES) para que `index.html` funcione abierto directamente desde el disco.

## Publicar en GitHub

Sube el contenido de esta carpeta tal cual. Para GitHub Pages: *Settings → Pages → Deploy from branch → `main` / root*.

## Limitaciones conocidas

Editor de fronteras, eventos personalizados en texto libre, ramas temporales, estados satélite y protectorados, y eventos con decisiones aún no están implementados.

## Licencia

MIT.
