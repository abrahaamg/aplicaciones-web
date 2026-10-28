# Directrices del proyecto

Normas para que los dos trabajemos igual. Si el profe publica su propia estructura o su especificación de la API, **mandan las suyas** y se adapta esto.

## 1. Estructura

Seguimos la misma estructura que la plantilla del profe (`recurso-bootstrap`): `index.js` en la raíz, `routes/`, `views/`, `public/` y `data/`.

```
aplicaciones-web/
├── index.js              arranque de Express
├── package.json
├── README.md             manual de instalación (entregable)
├── config/database.js    conexión a MariaDB (mysql2)        [bloque backend]
├── middlewares/          authRequire, adminAuth...          [bloque backend]
├── routes/               URL -> función del controlador     [bloque backend]
├── controllers/          valida datos y aplica reglas        [bloque backend]
├── models/               consultas SQL, una clase por tabla  [bloque backend]
├── views/                páginas EJS + partials/             [bloque backend]
├── data/                 JSON iniciales que dé el profe
├── db/aw_practica.sql    script SQL que dé el profe
├── docs/                 directrices, manual de usuario, decisiones
└── public/               todo lo que se sirve tal cual al navegador
    ├── *.html            páginas (fase estática y JS)
    ├── css/              bootstrap.min.css, bootstrap-icons.min.css, fonts/, estilos.css
    ├── components/       navbar.html y footer.html, escritos una sola vez
    ├── js/               bootstrap.bundle.min.js, comun.js, components.js, un JS por página
    └── img/              logo, cursos/, docentes/
```

Las carpetas marcadas `[bloque backend]` **no se crean hasta que toque**. No dejamos ficheros vacíos.

### Cómo evoluciona por fases

| Fase | Qué se hace | Dónde |
|---|---|---|
| 1. HTML + CSS | Páginas estáticas con Bootstrap. Navbar y footer en `components/`, cargados por `js/components.js`. | `public/*.html`, `public/components/`, `public/css/estilos.css` |
| 2. JS + DOM + formularios | Validación, eventos, accesibilidad, LocalStorage. | `public/js/<pagina>.js`, `public/js/comun.js` |
| 3. Fetch + JSON | Los datos se leen de JSON con `fetch`. | `public/js/`, `data/` |
| 4. Backend | Express + MariaDB. Las páginas pasan a `views/*.ejs` y navbar/footer a `views/partials/`. La API vive en `/api/...`. | `routes/`, `views/`, `config/`, `middleware/` |

## 2. Nombres e idioma

- **Todo en español**: código, comentarios, interfaz y commits. Sin tildes ni ñ en nombres de ficheros ni variables (`matriculas`, no `matrículas`).
- **Ficheros**: en minúsculas y con guiones: `mis-matriculas.html`. Su JS se llama igual: `js/mis-matriculas.js`.
- **Páginas de administrador**: prefijo `admin-`: `admin-cursos.html`, `admin-docentes.html`...
- **JS**: variables y funciones en camelCase (`cargarCursos`, `idCurso`). Constantes en MAYUSCULAS (`CLAVE_PREFERENCIAS`).
- **CSS e ids de HTML**: minúsculas con guiones (`tarjeta-curso`, `form-registro`).
- **Excepción**: `password` se queda en inglés, como el `type="password"` del campo (`password`, `confirmar-password`, `error-password`).
- **Base de datos y JSON de la API**: snake_case, igual que el modelo E/R (`id_curso`, `fecha_inicio`).

## 3. HTML y Bootstrap

- Se parte siempre de `public/index.html` como plantilla: copiarla y cambiar solo el `<title>` y el `<main>`.
- El menú y el pie **no se copian**: están una sola vez en `components/navbar.html` y `components/footer.html`. Cada página solo lleva sus huecos, `<div id="navbar"></div>` y `<div id="footer"></div>`, y el script `js/components.js`, que los rellena y resalta en el menú la página actual. Para cambiar el menú se toca solo `navbar.html`.
- Como el menú se carga con `fetch`, hay que abrir la web con `npm start` (http://localhost:3000). Con doble clic en el HTML sale sin menú.
- Bootstrap es la **5.1.3** (la del profe), en local. Nada de CDN. Ojo: la documentación de la 5.3 trae cosas que aquí no existen (`data-bs-theme`, `bg-body-tertiary`).
- No se toca `bootstrap.min.css`. Lo nuestro va en `css/estilos.css`.
- Etiquetas semánticas: `header`, `nav`, `main`, `footer`. Un solo `h1` por página.
- Migas de pan (`breadcrumb`) dentro del `<main>`, no en la cabecera.
- Usar componentes de Bootstrap: grid, cards, tablas, formularios, alertas, **modales** (para altas, ediciones y confirmaciones) e iconos (`<i class="bi bi-..." aria-hidden="true"></i>`).

## 4. JavaScript de cliente

- Orden de scripts al final del `body`: `bootstrap.bundle.min.js`, luego `comun.js`, luego `components.js`, luego el de la página.
- `comun.js` solo lleva lo que usan todas las páginas (preferencias de accesibilidad, mostrar alertas, confirmar con modal, llamar a la API).
- `const` y `let`, nunca `var`.
- Eventos con `addEventListener`. Nada de `onclick` en el HTML.
- Para pintar datos del usuario, `textContent` o `createElement`, no `innerHTML`.
- Cada `fetch` dentro de `try/catch`, y el error se enseña con una alerta de Bootstrap.

## 5. Formularios

1. Primero los atributos HTML5: `required`, `type="email"`, `minlength`...
2. Después validación en JS en el `submit` con `preventDefault()`. El error se pone junto al campo (`is-invalid` + `invalid-feedback`), con texto, no solo con color.

   El mensaje va justo debajo de su campo, con la clase `invalid-feedback` y sin `style`. Bootstrap lo esconde solo:

   ```html
   <input type="text" id="nombre" class="form-control" maxlength="50" required>
   <div class="invalid-feedback">Escribe tu nombre (máximo 50 caracteres).</div>
   ```

   En el JS no se toca el mensaje, solo el campo. Si el campo tiene la clase `is-invalid`, Bootstrap enseña el mensaje y pone el borde rojo:

   ```js
   const nombre = document.getElementById('nombre');
   if (nombre.value.trim() === '' || nombre.value.length > 50) {
       nombre.classList.add('is-invalid');     // sale el mensaje
   } else {
       nombre.classList.remove('is-invalid');  // se esconde
   }
   ```
3. Y **se vuelve a validar en el servidor**, siempre.
- Cada campo con su `<label for="...">`.
- Las contraseñas nunca se guardan en `localStorage` ni `sessionStorage`.

## 6. Accesibilidad

- Panel con tema claro/oscuro, tamaño de fuente y alto contraste.
- Se guarda en `localStorage` con la clave `preferencias`, por ejemplo `{ "tema": "oscuro", "fuente": "grande", "contraste": true }`. `comun.js` lo aplica al cargar cada página poniendo clases en `<html>` (`tema-oscuro`, `alto-contraste`, `fuente-grande`).
- Todo usable con teclado y con el foco visible.
- `alt` en todas las imágenes (vacío si es decorativa).
- Enlace "Saltar al contenido" al principio de cada página.

## 7. API REST (bloque backend)

Respuestas en JSON. Errores con la forma `{ "error": "mensaje" }`.
Códigos: 200/201 ok, 400 datos mal, 401 sin sesión, 403 sin permiso, 404 no existe, 409 rompe una regla de negocio.

| Recurso | Endpoints | Quién |
|---|---|---|
| Auth | `POST /api/auth/registro`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/sesion` | público / con sesión |
| Perfil | `GET /api/perfil`, `PUT /api/perfil` (el email no se cambia) | con sesión |
| Usuarios | `GET /api/usuarios`, `GET /api/usuarios/:id`, `PUT /api/usuarios/:id`, `PATCH /api/usuarios/:id/estado` | admin |
| Cursos | `GET /api/cursos`, `GET /api/cursos/:id`, `POST`, `PUT /:id`, `DELETE /:id` | GET todos, resto admin |
| Docentes | igual que cursos. `DELETE` da 409 si tiene cursos | igual |
| Aulas | igual que cursos. `DELETE` da 409 si tiene un curso activo | igual |
| Matrículas | `GET /api/matriculas/mias`, `POST /api/matriculas`, `PATCH /api/matriculas/:id/cancelar`, `GET /api/matriculas` | alumno las suyas / admin todas |
| Importar | `POST /api/importar/:entidad` (docentes, aulas, cursos), devuelve `{ insertados, actualizados, descartados, errores }` | admin |
| Estadísticas | `GET /api/estadisticas` | admin |

- Cada recurso se reparte en tres ficheros, cada uno con un trabajo:
  - `routes/cursos.routes.js`: solo dice qué URL llama a qué función. Sin lógica.
  - `controllers/curso.controller.js`: lee lo que llega, lo valida, aplica las reglas y responde.
  - `models/Curso.model.js`: las consultas SQL a la tabla. Nada más.
- Las reglas de negocio se comprueban en el controlador: plazas, matrícula duplicada, curso activo, usuario inactivo no entra.
- Cancelar una matrícula **no la borra**: pone `estado = 'cancelada'`.
- Contraseñas con hash (`bcryptjs`), nunca en claro.

## 8. Tablero de tareas

Todo el trabajo está en el tablero: https://github.com/users/abrahaamg/projects/1 (vista **Board**). Cada tarjeta es una tarea (issue) con su responsable.

| Columna | Significa | Quién la mueve |
|---|---|---|
| **Por hacer** | Nadie ha empezado | Sola, al crear la tarea |
| **En curso** | La estoy haciendo | **Tú, a mano**, al empezar |
| **Hecho** | Terminada y con PR abierto, falta que el otro la revise | Sola, al abrir el PR con `Closes #N` |
| **Validado** | El otro la ha revisado y está en `main` | Sola, al fusionar el PR |

El flujo de una tarea, por ejemplo la #5:

1. Mueve la tarjeta a **En curso**.
2. Crea tu rama: `git checkout -b feat/registro`.
3. Trabaja y haz commits.
4. Sube la rama (`git push -u origin feat/registro`) y abre el PR en GitHub. En la descripción escribe `Closes #5`. La tarjeta pasa sola a **Hecho**.
5. El otro revisa el PR. Si está bien, lo fusiona y la tarjeta pasa sola a **Validado**.

Lo único que se mueve a mano es **En curso**. Si se te olvida, el otro no sabe que estás con ello.

## 9. Git

- `main` siempre tiene que arrancar.
- Una rama por funcionalidad: `feat/catalogo-cursos`, `fix/validacion-registro`.
- Antes de empezar: `git pull`.
- Se fusiona a `main` con un Pull Request que **revisa el otro**. En la defensa el profe elige a uno de los dos al azar, así que los dos tenemos que conocer todo el código.
- Commits pequeños, en español y en imperativo, con prefijo: `feat: añade filtro por estado en el catálogo`, `fix: corrige validación del email`, `style: ajusta tarjetas de cursos`, `docs: actualiza manual`.
- En cada microhito, una etiqueta: `git tag hito-1` y `git push --tags`.
- Nunca se sube `node_modules` (ya está en `.gitignore`).

## 10. Pendiente de decidir

- **E/R vs enunciado**: la tabla `usuarios` del diagrama no tiene apellidos, teléfono ni preferencias, y `docentes` no tiene apellidos. Esperamos al `aw_practica.sql` del profe; si faltan, los añadimos y lo justificamos en la defensa.
- **Imágenes de cursos y docentes**: de momento se guarda solo la ruta en la base de datos.
- **Borrar docentes/aulas o marcarlos inactivos**: el modelo tiene campo de estado, hay que decidir cuál usamos.
