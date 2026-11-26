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

function crearListaCursos(titulo, cursos, textoSinCursos) {
    const bloque = document.createElement('div');
    bloque.appendChild(crearElementoListado('h3', 'h6 mb-1', titulo));

    if (cursos.length === 0) {
        bloque.appendChild(crearElementoListado('p', 'card-text text-muted mb-0', textoSinCursos));
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

    cuerpo.appendChild(crearListaCursos('Cursos en esta aula', aula.cursos, 'Ningún curso asignado'));
    return columna;
}

function crearTarjetaDocente(docente) {
    const { columna, cuerpo } = crearTarjetaVacia();

    const cabecera = crearElementoListado('div', 'd-flex align-items-center gap-3 mb-2', '');
    cabecera.appendChild(crearFotoDocente(docente));
    const nombre = crearElementoListado('div', 'flex-grow-1', '');
    nombre.appendChild(crearElementoListado('h2', 'card-title h5 mb-0', docente.nombre));
    nombre.appendChild(crearElementoListado('p', 'text-muted small mb-0', docente.especialidad));
    cabecera.appendChild(nombre);
    cabecera.appendChild(docente.activo
        ? crearElementoListado('span', 'badge bg-success align-self-start', 'Activo')
        : crearElementoListado('span', 'badge bg-secondary align-self-start', 'Inactivo'));
    cuerpo.appendChild(cabecera);

    const contacto = crearElementoListado('ul', 'list-unstyled small mb-2', '');
    contacto.appendChild(crearDatoContacto('bi-envelope', docente.email));
    if (docente.telefono) {
        contacto.appendChild(crearDatoContacto('bi-telephone', docente.telefono));
    }
    cuerpo.appendChild(contacto);

    cuerpo.appendChild(crearListaCursos('Cursos que imparte', docente.cursos, 'No imparte ningún curso'));
    return columna;
}

// Sin foto sale el tipico icono de persona
function crearFotoDocente(docente) {
    const icono = crearElementoListado('i', 'bi bi-person-circle fs-1 text-secondary', '');
    icono.setAttribute('aria-hidden', 'true');
    if (!docente.foto) {
        return icono;
    }

    const foto = crearElementoListado('img', 'rounded-circle foto-docente', '');
    foto.src = docente.foto;
    foto.alt = 'Foto de ' + docente.nombre;
    foto.addEventListener('error', function () {
        foto.replaceWith(icono);
    });
    return foto;
}

function crearDatoContacto(icono, texto) {
    const elemento = crearElementoListado('li', 'text-break', '');
    const simbolo = crearElementoListado('i', 'bi ' + icono + ' me-1', '');
    simbolo.setAttribute('aria-hidden', 'true');
    elemento.append(simbolo, texto);
    return elemento;
}

async function mostrarListado(url, textos, crearTarjeta) {
    mostrarMensajeListado(textos.cargando);

    let elementos;
    try {
        elementos = await pedirApi(url);
    } catch {
        contenedorListado.replaceChildren();
        return;
    }

    if (elementos.length === 0) {
        mostrarMensajeListado(textos.vacio);
        return;
    }

    contenedorListado.replaceChildren(...elementos.map(crearTarjeta));
}

if (contenedorListado.dataset.listado === 'docentes') {
    mostrarListado('/api/docentes', { cargando: 'Cargando docentes…', vacio: 'Todavía no hay docentes.' }, crearTarjetaDocente);
} else {
    mostrarListado('/api/aulas', { cargando: 'Cargando aulas…', vacio: 'Todavía no hay aulas.' }, crearTarjetaAula);
}
