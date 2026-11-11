// Detalle de un curso: lee el ?id= de la dirección y pinta ese curso con sus datos.

const contenedorDetalle = document.getElementById('detalle-curso');

// Añade una fila "dato: valor" a la lista de datos del curso
function agregarFilaDetalle(lista, etiqueta, valor) {
    const termino = document.createElement('dt');
    termino.className = 'col-sm-3';
    termino.textContent = etiqueta;

    const descripcion = document.createElement('dd');
    descripcion.className = 'col-sm-9';
    descripcion.textContent = valor;

    lista.append(termino, descripcion);
}

function mostrarDetalleCurso() {
    const id = Number(new URLSearchParams(location.search).get('id'));

    let cursos;
    try {
        cursos = cargarCursos();
    } catch {
        mostrarAlerta('No se han podido cargar los cursos. Recarga la página para intentarlo de nuevo.');
        return;
    }

    const curso = cursos.find(function (c) { return Number(c.id_curso) === id; });
    if (!curso) {
        const titulo = document.createElement('h1');
        titulo.textContent = 'Curso no encontrado';
        const texto = document.createElement('p');
        texto.textContent = 'Este curso no existe o se ha borrado.';
        contenedorDetalle.append(titulo, texto);
        return;
    }

    document.title = curso.nombre + ' | Centro de Formación';

    const titulo = document.createElement('h1');
    titulo.textContent = curso.nombre;
    contenedorDetalle.appendChild(titulo);

    if (curso.estado !== 'activo') {
        const insignia = document.createElement('span');
        insignia.className = 'badge bg-secondary mb-2';
        insignia.textContent = 'Inactivo';
        contenedorDetalle.appendChild(insignia);
    }

    const descripcion = document.createElement('p');
    descripcion.textContent = curso.descripcion;
    contenedorDetalle.appendChild(descripcion);

    const lista = document.createElement('dl');
    lista.className = 'row';
    agregarFilaDetalle(lista, 'Docente', nombreDocente(Number(curso.id_docente)));
    agregarFilaDetalle(lista, 'Aula', nombreAula(Number(curso.id_aula)));
    agregarFilaDetalle(lista, 'Fechas', 'Del ' + formatearFecha(curso.fecha_inicio) + ' al ' + formatearFecha(curso.fecha_fin));
    agregarFilaDetalle(lista, 'Horario', curso.horario);
    agregarFilaDetalle(lista, 'Plazas', curso.plazas);
    contenedorDetalle.appendChild(lista);
}

mostrarDetalleCurso();
