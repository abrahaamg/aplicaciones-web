// Catálogo de cursos: pinta una tarjeta por cada curso guardado.

const contenedorCursos = document.getElementById('lista-cursos');
const cajaBusqueda = document.getElementById('buscar-curso');
let cursos = [];

// Crea un elemento con su clase y su texto
function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    elemento.className = clase;
    elemento.textContent = texto;
    return elemento;
}

function crearTarjeta(curso) {
    const columna = document.createElement('div');
    columna.className = 'col-12 col-md-6 col-lg-4';

    const tarjeta = document.createElement('article');
    tarjeta.className = 'card h-100';

    // Sin imagen no se pinta nada: un src vacío saldría como imagen rota
    if (curso.imagen) {
        const imagen = document.createElement('img');
        imagen.className = 'card-img-top';
        imagen.src = curso.imagen;
        imagen.alt = '';
        // Si el fichero no existe, se quita la imagen en vez de enseñarla rota
        imagen.addEventListener('error', function () {
            imagen.remove();
        });
        tarjeta.append(imagen);
    }

    const cuerpo = document.createElement('div');
    cuerpo.className = 'card-body';
    cuerpo.append(crearElemento('h2', 'card-title h5', curso.nombre));
    if (curso.estado !== 'activo') {
        tarjeta.classList.add('tarjeta-inactiva');
        cuerpo.append(crearElemento('span', 'badge bg-secondary mb-2', 'Inactivo'));
    }
    cuerpo.append(crearElemento('p', 'card-text', curso.descripcion));

    const datos = document.createElement('ul');
    datos.className = 'list-unstyled small';
    [
        'Docente: ' + nombreDocente(curso.id_docente),
        'Aula: ' + nombreAula(curso.id_aula),
        'Del ' + formatearFecha(curso.fecha_inicio) + ' al ' + formatearFecha(curso.fecha_fin),
        'Plazas: ' + curso.plazas
    ].forEach(function (linea) {
        datos.append(crearElemento('li', '', linea));
    });
    cuerpo.append(datos);

    const enlace = crearElemento('a', 'btn btn-primary', 'Ver detalle');
    enlace.href = 'curso.html?id=' + curso.id_curso;
    enlace.append(crearElemento('span', 'visually-hidden', ' de ' + curso.nombre));
    cuerpo.append(enlace);

    tarjeta.append(cuerpo);
    columna.append(tarjeta);
    return columna;
}

// Vacía el contenedor y pinta la lista que se le pase
function pintarCursos(lista, mensajeVacio = 'Todavía no hay cursos.') {
    if (lista.length === 0) {
        const aviso = crearElemento('p', 'alert alert-info', mensajeVacio);
        contenedorCursos.replaceChildren(aviso);
        return;
    }
    contenedorCursos.replaceChildren(...lista.map(crearTarjeta));
}

// Si no se pueden cargar, solo sale el aviso: no se dice "no hay cursos" porque no se sabe
try {
    cursos = cargarCursos();
    pintarCursos(cursos);
} catch {
    mostrarAlerta('No se han podido cargar los cursos. Recarga la página para intentarlo de nuevo.');
    cajaBusqueda.disabled = true;
}

// Buscador: pinta solo los cursos cuyo nombre o descripción contienen lo escrito
function filtrarCursos() {
    const texto = normalizarTexto(cajaBusqueda.value.trim());
    if (texto === '') {
        pintarCursos(cursos);
        return;
    }
    const encontrados = cursos.filter(function (curso) {
        return normalizarTexto(curso.nombre).includes(texto)
            || normalizarTexto(curso.descripcion).includes(texto);
    });
    pintarCursos(encontrados, 'No hay cursos que coincidan con la búsqueda.');
}

cajaBusqueda.addEventListener('input', filtrarCursos);
