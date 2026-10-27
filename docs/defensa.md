# Preparación de la defensa del laboratorio 1

No se entrega: se borra antes de hacer el zip.

El profe elige a uno de los dos al azar, así que los dos tenemos que saber contestar todo esto.

## Demo (unos 3 minutos)

1. `npm start` y abrir http://localhost:3000
2. Pasar por el menú: todas las páginas abren y la actual sale resaltada.
3. Cursos → "Ver detalle de Introducción a la programación": enseñar las migas de pan.
4. F12 → modo móvil: el menú se pliega en el botón de tres rayas.
5. Recargar y pulsar Tab: sale "Saltar al contenido".

## Estructura y navegación

**¿Qué páginas tenéis y cómo se llega a ellas?**
Nueve: inicio, cursos, detalle del curso, docentes, aulas, mis matrículas, perfil, accesibilidad y administración. Las ocho primeras salen en el menú. El detalle (`curso.html`) no tiene enlace propio en el menú: se llega desde Cursos con el botón "Ver detalle". Es como el índice de un libro: salen los capítulos, no cada página de dentro.

**¿Cómo se vuelve al inicio?**
Con el logo o con "Inicio" en el menú, y también con el primer nivel de las migas de pan.

**¿Por qué `header`, `nav`, `main` y `footer` y no `div`?**
Son etiquetas que ya vienen en HTML5, igual que `div` o `p`. La diferencia es que dicen qué contiene cada parte. Es como una mudanza: si todas las cajas pone "caja", hay que abrirlas para saber qué llevan; si pone "cocina" o "baño", lo sabes sin abrirlas.

```html
<!-- Con div todo es "caja" -->
<div> ...menú... </div>
<div> ...contenido... </div>

<!-- Con etiquetas semánticas cada parte dice lo que es -->
<header><nav> ...menú... </nav></header>
<main> ...contenido... </main>
<footer> ...pie... </footer>
```

Sirve sobre todo para los lectores de pantalla, el programa que lee la web en voz alta a una persona ciega. Ejemplo con NVDA (gratuito, Windows) en nuestra página de Cursos:
- Con todo `div`, el lector empieza por arriba y lee los 8 enlaces del menú en cada página antes de llegar al contenido.
- Con `main`, la persona pulsa la tecla D ("salta a la siguiente zona"), el lector dice "Principal" y empieza a leer en "Cursos, encabezado nivel 1". Se ha saltado el menú con una tecla.

**En Cursos, ¿por qué los títulos de las tarjetas son `h2` pero se ven pequeños?**
Los títulos son como el índice de un libro: `h1` es el título del libro y `h2` los capítulos. El número dice el nivel, no el tamaño. En Cursos, "Cursos" es el `h1` y cada curso va dentro, así que le toca `h2`. Como un `h2` se ve muy grande en una tarjeta, se le pone la clase `h5` de Bootstrap, que cambia solo el tamaño:

```html
<h5>Introducción a la programación</h5>              <!-- mal: eliges el nivel por el tamaño -->
<h2 class="h5">Introducción a la programación</h2>   <!-- bien: nivel 2 con tamaño de h5 -->
```

El PDF pide no usar etiquetas solo para cambiar cómo se ve algo.

## Cabecera

**¿Cómo conseguís que la cabecera sea igual en todas las páginas?**
El menú está escrito una sola vez en `components/navbar.html`. Cada página tiene un hueco vacío (`<div id="navbar">`) y `js/components.js` va a buscar el menú y lo mete ahí. Si cambiamos el menú, cambia en todas a la vez.

**¿Y si abro el HTML con doble clic?**
Sale sin menú. El navegador no deja que una página abierta desde el disco lea otros ficheros del disco, por seguridad. Por eso se abre con `npm start`.

**¿Y si el menú no se puede cargar?**
En su sitio sale un aviso rojo de Bootstrap: "No se ha podido cargar esta parte de la página".

**¿Cómo sabe el menú en qué página estás?**
`components.js` mira el nombre del fichero en la dirección (por ejemplo `docentes.html`) y le pone la clase `active` al enlace que apunta a ese fichero. En el detalle de un curso resalta "Cursos".

**¿Por qué el logo tiene `alt=""` vacío?**
Justo al lado ya pone "Centro de Formación". Si tuviera texto, el lector de pantalla lo diría dos veces.

**Si Bootstrap y `estilos.css` cambian lo mismo, ¿cuál gana?**
`estilos.css` se carga después de Bootstrap. Si las dos reglas son igual de concretas, gana la nuestra por ir la última. Si la de Bootstrap es más concreta (por ejemplo `.navbar .nav-link` contra solo `.nav-link`), gana la de Bootstrap aunque vaya antes.

## Migas de pan

**¿Por qué van dentro del `main` y no en la cabecera?**
Cambian en cada página y la cabecera es igual en todas. Además, el PDF lo pide así.

**¿Por qué el último nivel no es un enlace?**
Es la página en la que ya estás. Lleva `aria-current="page"` para que el lector de pantalla diga "página actual".

## Adaptación a móvil

**¿Qué pasa al estrechar la ventana?**
Por debajo de 992 px el menú se pliega en el botón de tres rayas (`navbar-expand-lg`). Las tarjetas de cursos pasan de 3 por fila a 2 y luego a 1 (`col-12 col-md-6 col-lg-4`). Probado a 375 px, el ancho de un móvil, sin que nada se salga por los lados.

## Accesibilidad

**¿Qué es el "Saltar al contenido"?**
Un enlace que no se ve hasta que pulsas Tab nada más entrar. Con Enter te lleva directo al contenido y te saltas el menú. Es para quien navega solo con teclado.
