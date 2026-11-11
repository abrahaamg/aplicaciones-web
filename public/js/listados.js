// Listados de docentes y de aulas: una tarjeta por cada uno con los cursos que tiene.
// La página dice qué listado quiere con data-listado="docentes" o "aulas" en el contenedor.

const contenedorListado = document.getElementById('listado');

// Crea un elemento con su clase y su texto
function crearElementoListado(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    elemento.className = clase;
    elemento.textContent = texto;
    return elemento;
}

// Tarjeta con un título y la lista de cursos asociados
function crearTarjetaListado(titulo, cursos) {
    const columna = crearElementoListado('div', 'col-12 col-md-6 col-lg-4', '');
    const tarjeta = crearElementoListado('article', 'card h-100', '');
    const cuerpo = crearElementoListado('div', 'card-body', '');

    cuerpo.appendChild(crearElementoListado('h2', 'card-title h5', titulo));

    if (cursos.length === 0) {
        cuerpo.appendChild(crearElementoListado('p', 'card-text text-muted', 'Sin cursos asignados.'));
    } else {
        cuerpo.appendChild(crearElementoListado('p', 'card-text mb-1', 'Cursos:'));
        const lista = crearElementoListado('ul', 'mb-0', '');
        cursos.forEach(function (curso) {
            lista.appendChild(crearElementoListado('li', '', curso.nombre));
        });
        cuerpo.appendChild(lista);
    }

    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);
    return columna;
}

function mostrarListado() {
    let cursos;
    try {
        cursos = cargarCursos();
    } catch {
        mostrarAlerta('No se han podido cargar los cursos. Recarga la página para intentarlo de nuevo.');
        cursos = [];
    }

    const esDocentes = contenedorListado.dataset.listado === 'docentes';
    const elementos = esDocentes ? DOCENTES : AULAS;

    elementos.forEach(function (elemento) {
        const titulo = esDocentes ? elemento.nombre + ' ' + elemento.apellidos : elemento.nombre;
        const suyos = cursos.filter(function (curso) {
            return esDocentes
                ? Number(curso.id_docente) === elemento.id_docente
                : Number(curso.id_aula) === elemento.id_aula;
        });
        contenedorListado.appendChild(crearTarjetaListado(titulo, suyos));
    });
}

mostrarListado();
