# Notas de los laboratorios

## Laboratorio 1: estructura y navegación

### Páginas conectadas

Todas se abren desde el menú común, y el logo y "Inicio" llevan a la portada.

| Página | Fichero | Migas de pan |
|---|---|---|
| Inicio | `index.html` | No (es la portada) |
| Cursos | `cursos.html` | Inicio > Cursos |
| Detalle del curso | `curso.html` (desde "Ver detalle" en Cursos) | Inicio > Cursos > Detalle del curso |
| Docentes | `docentes.html` | Inicio > Docentes |
| Aulas | `aulas.html` | Inicio > Aulas |
| Mis matrículas | `mis-matriculas.html` | Inicio > Mis matrículas |
| Perfil | `perfil.html` | Inicio > Perfil |
| Accesibilidad | `accesibilidad.html` | Inicio > Accesibilidad |
| Administración | `admin.html` | Inicio > Administración |

La cabecera y el pie se escriben una sola vez en `public/components/` y `js/components.js` los mete en cada página. El menú resalta la página en la que estás.

### Comprobación

| Aspecto | Resultado |
|---|---|
| Se puede acceder a las páginas principales desde el menú | Revisado |
| La cabecera muestra el logotipo y el nombre del sitio | Revisado |
| Se utilizan etiquetas semánticas y una hoja `estilos.css` propia | Revisado |
| Una página interior incorpora migas de pan en el contenido | Revisado |
| La navegación y la cabecera siguen siendo utilizables al estrechar la ventana | Revisado (probado a 375 px, sin desbordamiento horizontal) |

### Pendiente

- Contenido real de cada página: de momento los cursos y el detalle son de ejemplo. Llegará con los JSON y después con la base de datos.
- Registro y login (laboratorio 2).
- Panel de accesibilidad y preferencias guardadas (laboratorio 3).
- Páginas de administración separadas por entidad (`admin-cursos.html`, `admin-docentes.html`...).
