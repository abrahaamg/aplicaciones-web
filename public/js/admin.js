
// Obtener el formulario
const formularioCurso = document.getElementById('formulario-curso');

// Comprobar que estamos en la página de administración
if (formularioCurso) {

    // Obtener los campos del formulario
    const nombre = document.getElementById('nombre');
    const descripcion = document.getElementById('descripcion');
    const docente = document.getElementById('docente');
    const aula = document.getElementById('aula');
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');
    const horario = document.getElementById('horario');
    const plazas = document.getElementById('plazas');
    const imagen = document.getElementById('imagen');
    const estado = document.getElementById('estado');

    // Obtener el contenedor de los cursos
    const listaCursos = document.getElementById('lista-cursos');

    // Rellenar el desplegable de docentes
    DOCENTES.forEach(function (d) {
        const opcion = document.createElement('option');
        opcion.value = d.id_docente;
        opcion.textContent = d.nombre + ' ' + d.apellidos;
        docente.appendChild(opcion);
    });

    // Rellenar el desplegable de aulas
    AULAS.forEach(function (a) {
        const opcion = document.createElement('option');
        opcion.value = a.id_aula;
        opcion.textContent = a.nombre;
        aula.appendChild(opcion);
    });

    // Validar el formulario al enviarlo
    formularioCurso.addEventListener('submit', function (event) {
        event.preventDefault();

        // Comprobar cada campo
        const nombreValido = nombre.value.trim() !== '';
        const descripcionValida = descripcion.value.trim() !== '';
        const docenteValido = DOCENTES.some(function (d) {
            return d.id_docente === Number(docente.value);
        });
        const aulaValida = AULAS.some(function (a) {
            return a.id_aula === Number(aula.value);
        });
        const fechaInicioValida = fechaInicio.value !== '';
        const fechaFinValida = fechaFin.value !== '' &&
            fechaInicioValida &&
            fechaFin.value > fechaInicio.value;
        const horarioValido = horario.value.trim() !== '';
        const plazasValidas = plazas.value !== '' &&
            Number.isFinite(Number(plazas.value)) &&
            Number(plazas.value) > 0;
        const estadoValido = estado.value === 'activo' ||
            estado.value === 'inactivo';

        // Gestionar los errores
        nombre.classList.toggle('is-invalid', !nombreValido);
        descripcion.classList.toggle('is-invalid', !descripcionValida);
        docente.classList.toggle('is-invalid', !docenteValido);
        aula.classList.toggle('is-invalid', !aulaValida);
        fechaInicio.classList.toggle('is-invalid', !fechaInicioValida);
        fechaFin.classList.toggle('is-invalid', !fechaFinValida);
        horario.classList.toggle('is-invalid', !horarioValido);
        plazas.classList.toggle('is-invalid', !plazasValidas);
        estado.classList.toggle('is-invalid', !estadoValido);

        // Si hay algún campo incorrecto, no guardar
        if (
            !nombreValido ||
            !descripcionValida ||
            !docenteValido ||
            !aulaValida ||
            !fechaInicioValida ||
            !fechaFinValida ||
            !horarioValido ||
            !plazasValidas ||
            !estadoValido
        ) {
            return;
        }

        // Cargar los cursos existentes
        let cursos;

        try {
            cursos = cargarCursos();
        } catch (error) {
            alert('No se pudieron cargar los cursos.');
            return;
        }

        // Calcular el siguiente identificador
        const nuevoId = cursos.reduce(function (maximo, curso) {
            return Math.max(maximo, Number(curso.id_curso) || 0);
        }, 0) + 1;

        // Crear el nuevo curso
        const nuevoCurso = {
            id_curso: nuevoId,
            nombre: nombre.value.trim(),
            descripcion: descripcion.value.trim(),
            id_docente: Number(docente.value),
            id_aula: Number(aula.value),
            fecha_inicio: fechaInicio.value,
            fecha_fin: fechaFin.value,
            horario: horario.value.trim(),
            plazas: Number(plazas.value),
            imagen: imagen.value.trim(),
            estado: estado.value
        };

        // Añadir el curso y guardar los cambios
        cursos.push(nuevoCurso);

        if (guardarCursos(cursos)) {
            alert('¡Curso añadido correctamente!');
            formularioCurso.reset();

            // Quitar los estados de error
            formularioCurso.querySelectorAll('.is-invalid').forEach(function (campo) {
                campo.classList.remove('is-invalid');
            });
            mostrarCursos();
        } else {
            alert('No se pudo guardar el curso.');
        }
    });

    // Mostrar los cursos existentes
    function mostrarCursos() {
        let cursos;

        try {
            cursos = cargarCursos();
        } catch (error) {
            alert('No se pudieron cargar los cursos.');
            return;
        }

        // Limpiar la lista
        listaCursos.innerHTML = '';

        // Crear una tarjeta para cada curso
        cursos.forEach(function (curso) {

            const tarjeta = document.createElement('div');
            tarjeta.className = 'col-md-6 col-lg-4';

            tarjeta.innerHTML = `
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${curso.nombre}</h5>

                        <p class="card-text">${curso.descripcion}</p>

                        <p class="card-text">
                            <strong>Docente:</strong> ${nombreDocente(curso.id_docente)}
                        </p>

                        <p class="card-text">
                            <strong>Aula:</strong> ${nombreAula(curso.id_aula)}
                        </p>

                        <p class="card-text">
                            <strong>Fechas:</strong> ${curso.fecha_inicio} - ${curso.fecha_fin}
                        </p>

                        <p class="card-text">
                            <strong>Plazas:</strong> ${curso.plazas}
                        </p>

                        <p class="card-text">
                            <strong>Estado:</strong> ${curso.estado}
                        </p>

                        <button type="button" class="btn btn-primary btn-editar">
                            Editar
                        </button>
                    </div>
                </div>
            `;

            listaCursos.appendChild(tarjeta);
        });
    }

    // Mostrar los cursos al cargar la página
    mostrarCursos();
}

