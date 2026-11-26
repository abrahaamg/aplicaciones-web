// Listados de docentes y de aulas: una tarjeta por cada uno con los cursos que tiene.
// La página dice qué listado quiere con data-listado="docentes" o "aulas" en el contenedor.

const contenedorListado = document.getElementById('listado');

function crearElementoListado(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    elemento.className = clase;
    elemento.textContent = texto;
    return elemento;
}

// Mensaje para cuando esta cargando o vacio
function mostrarMensajeListado(texto) {
    contenedorListado.replaceChildren(crearElementoListado('p', 'col-12 text-muted', texto));
}

function crearTarjetaVacia() {
    const columna = crearElementoListado('div', 'col-12 col-md-6 col-lg-4', '');
    const tarjeta = crearElementoListado('article', 'card h-100', '');
    const cuerpo = crearElementoListado('div', 'card-body', '');
    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);
    return { columna, cuerpo };
}

function crearListaCursos(titulo, cursos) {
    const bloque = document.createElement('div');
    bloque.appendChild(crearElementoListado('h3', 'h6 mb-1', titulo));

    if (cursos.length === 0) {
        bloque.appendChild(crearElementoListado('p', 'card-text text-muted mb-0', 'Ningún curso asignado'));
        return bloque;
    }

    const lista = crearElementoListado('ul', 'mb-0', '');
    cursos.forEach(function (curso) {
        const inactivo = curso.estado !== 'activo';
        const elemento = crearElementoListado('li', inactivo ? 'curso-inactivo' : '', '');
        const enlace = crearElementoListado('a', '', curso.nombre + (inactivo ? ' (inactivo)' : ''));
        enlace.href = 'curso.html?id=' + encodeURIComponent(curso.id_curso);
        elemento.appendChild(enlace);
        lista.appendChild(elemento);
    });
    bloque.appendChild(lista);
    return bloque;
}

function crearTarjetaAula(aula) {
    const { columna, cuerpo } = crearTarjetaVacia();

    const cabecera = crearElementoListado('div', 'd-flex justify-content-between align-items-start gap-2 mb-2', '');
    cabecera.appendChild(crearElementoListado('h2', 'card-title h5 mb-0', aula.nombre));
    cabecera.appendChild(aula.estado === 'activa'
        ? crearElementoListado('span', 'badge bg-success', 'Activa')
        : crearElementoListado('span', 'badge bg-secondary', 'Inactiva'));
    cuerpo.appendChild(cabecera);

    const datos = crearElementoListado('dl', 'row small mb-2', '');
    [
        ['Edificio', aula.edificio],
        ['Planta', aula.planta || '—'],
        ['Capacidad', aula.capacidad + ' personas'],
        ['Equipamiento', aula.equipamiento || '—']
    ].forEach(function ([nombre, valor]) {
        datos.appendChild(crearElementoListado('dt', 'col-5', nombre));
        datos.appendChild(crearElementoListado('dd', 'col-7 mb-1', valor));
    });
    cuerpo.appendChild(datos);

    cuerpo.appendChild(crearListaCursos('Cursos en esta aula', aula.cursos));
    return columna;
}

function crearTarjetaDocente(docente, cursos) {
    const { columna, cuerpo } = crearTarjetaVacia();
    cuerpo.appendChild(crearElementoListado('h2', 'card-title h5', docente.nombre + ' ' + docente.apellidos));
    cuerpo.appendChild(crearListaCursos('Cursos que imparte', cursos));
    return columna;
}

// GET /api/aulas trae los cursos de cada una
async function mostrarAulas() {
    mostrarMensajeListado('Cargando aulas…');

    let aulas;
    try {
        aulas = await pedirApi('/api/aulas');
    } catch {
        contenedorListado.replaceChildren();
        return;
    }

    if (aulas.length === 0) {
        mostrarMensajeListado('Todavía no hay aulas.');
        return;
    }

    contenedorListado.replaceChildren(...aulas.map(crearTarjetaAula));
}

// Docentes todavía con los datos provisionales de datos.js
function mostrarDocentes() {
    let cursos;
    try {
        cursos = cargarCursos();
    } catch {
        mostrarAlerta('No se han podido cargar los cursos. Recarga la página para intentarlo de nuevo.');
        return;
    }

    DOCENTES.forEach(function (docente) {
        contenedorListado.appendChild(crearTarjetaDocente(docente, cursos.filter(function (curso) {
            return Number(curso.id_docente) === docente.id_docente;
        })));
    });
}

if (contenedorListado.dataset.listado === 'docentes') {
    mostrarDocentes();
} else {
    mostrarAulas();
}
