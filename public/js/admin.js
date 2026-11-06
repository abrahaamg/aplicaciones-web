
// Obtener elementos principales
const formularioCurso = document.getElementById('formulario-curso');
const listaCursos = document.getElementById('lista-cursos');

if (formularioCurso) {

    // Obtener campos del formulario
    const camposFormulario = {
        nombre: document.getElementById('nombre'),
        descripcion: document.getElementById('descripcion'),
        docente: document.getElementById('docente'),
        aula: document.getElementById('aula'),
        fechaInicio: document.getElementById('fecha-inicio'),
        fechaFin: document.getElementById('fecha-fin'),
        horario: document.getElementById('horario'),
        plazas: document.getElementById('plazas'),
        imagen: document.getElementById('imagen'),
        estado: document.getElementById('estado')
    };

    // Rellenar desplegables del formulario
    DOCENTES.forEach(function (d) {
        camposFormulario.docente.add(new Option(
            d.nombre + ' ' + d.apellidos, d.id_docente
        ));
    });

    AULAS.forEach(function (a) {
        camposFormulario.aula.add(new Option(a.nombre, a.id_aula));
    });


    // Obtener los valores de un conjunto de campos
    function obtenerValores(campos) {
        const valores = {};

        Object.keys(campos).forEach(function (clave) {
            valores[clave] = campos[clave].value;
        });

        return valores;
    }


    // Validar los campos de un curso
    function validarCurso(valores, campos) {
        const valido = {
            nombre: valores.nombre.trim() !== '',
            descripcion: valores.descripcion.trim() !== '',
            docente: DOCENTES.some(d => d.id_docente === Number(valores.docente)),
            aula: AULAS.some(a => a.id_aula === Number(valores.aula)),
            fechaInicio: valores.fechaInicio !== '',
            fechaFin: valores.fechaFin !== '' &&
                valores.fechaInicio !== '' &&
                valores.fechaFin > valores.fechaInicio,
            horario: valores.horario.trim() !== '',
            plazas: valores.plazas !== '' &&
                Number.isFinite(Number(valores.plazas)) &&
                Number(valores.plazas) > 0,
            estado: ['activo', 'inactivo'].includes(valores.estado)
        };

        Object.keys(valido).forEach(function (clave) {
            campos[clave].classList.toggle('is-invalid', !valido[clave]);
        });

        return Object.values(valido).every(Boolean);
    }


    // Construir un objeto curso con los valores recibidos
    function crearCurso(valores, id) {
        return {
            id_curso: id,
            nombre: valores.nombre.trim(),
            descripcion: valores.descripcion.trim(),
            id_docente: Number(valores.docente),
            id_aula: Number(valores.aula),
            fecha_inicio: valores.fechaInicio,
            fecha_fin: valores.fechaFin,
            horario: valores.horario.trim(),
            plazas: Number(valores.plazas),
            imagen: valores.imagen.trim(),
            estado: valores.estado
        };
    }


    // Añadir un curso
    formularioCurso.addEventListener('submit', function (event) {
        event.preventDefault();

        const valores = obtenerValores(camposFormulario);

        if (!validarCurso(valores, camposFormulario)) return;

        let cursos;

        try {
            cursos = cargarCursos();
        } catch (error) {
            alert('No se pudieron cargar los cursos.');
            return;
        }

        const nuevoId = cursos.reduce(function (maximo, curso) {
            return Math.max(maximo, Number(curso.id_curso) || 0);
        }, 0) + 1;

        cursos.push(crearCurso(valores, nuevoId));

        if (guardarCursos(cursos)) {
            alert('¡Curso añadido correctamente!');
            formularioCurso.reset();

            Object.values(camposFormulario).forEach(function (campo) {
                campo.classList.remove('is-invalid');
            });

            mostrarCursos();
        } else {
            alert('No se pudo guardar el curso.');
        }
    });


    // Crear un campo editable
    function crearCampo(titulo, tipo, valor, opciones = [], mensajeError = '') {
        const contenedor = document.createElement('div');
        contenedor.className = 'mb-3';

        const etiqueta = document.createElement('label');
        etiqueta.className = 'form-label';
        etiqueta.textContent = titulo;

        const campo = document.createElement(
            tipo === 'textarea' ? 'textarea' : tipo === 'select' ? 'select' : 'input'
        );

        campo.className = tipo === 'select' ? 'form-select' : 'form-control';

        if (tipo === 'textarea') campo.rows = 2;
        else if (tipo !== 'select') campo.type = tipo;

        opciones.forEach(function (opcion) {
            campo.add(new Option(opcion.texto, opcion.value));
        });

        campo.value = valor ?? '';

        if (tipo === 'number') campo.min = 1;

        const error = document.createElement('div');
        error.className = 'invalid-feedback';
        error.textContent = mensajeError;

        contenedor.append(etiqueta, campo, error);

        return { contenedor, campo };
    }


    // Crear una tarjeta de curso
    function crearTarjetaCurso(curso, modoEdicion = false) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'col-md-6 col-lg-4';

        const cuerpo = document.createElement('div');
        cuerpo.className = 'card h-100';

        const contenido = document.createElement('div');
        contenido.className = 'card-body';

        cuerpo.appendChild(contenido);
        tarjeta.appendChild(cuerpo);

        if (modoEdicion) {

            // Configuración de los campos editables
            const configuracion = {
                nombre: ['Nombre', 'text', curso.nombre, [], 'Introduce el nombre del curso.'],
                descripcion: ['Descripción', 'textarea', curso.descripcion, [], 'Introduce una descripción.'],
                docente: ['Docente', 'select', curso.id_docente,
                    DOCENTES.map(d => ({ value: d.id_docente, texto: d.nombre + ' ' + d.apellidos })),
                    'Selecciona un docente.'],
                aula: ['Aula', 'select', curso.id_aula,
                    AULAS.map(a => ({ value: a.id_aula, texto: a.nombre })),
                    'Selecciona un aula.'],
                fechaInicio: ['Fecha de inicio', 'date', curso.fecha_inicio, [], 'Introduce una fecha de inicio válida.'],
                fechaFin: ['Fecha de fin', 'date', curso.fecha_fin, [], 'La fecha de fin debe ser posterior a la de inicio.'],
                horario: ['Horario', 'text', curso.horario, [], 'Introduce el horario del curso.'],
                plazas: ['Plazas', 'number', curso.plazas, [], 'Introduce un número de plazas mayor que 0.'],
                imagen: ['Imagen (ruta)', 'text', curso.imagen || ''],
                estado: ['Estado', 'select', curso.estado,
                    [
                        { value: 'activo', texto: 'Activo' },
                        { value: 'inactivo', texto: 'Inactivo' }
                    ],
                    'Selecciona un estado.']
            };

            const campos = {};

            Object.entries(configuracion).forEach(function ([clave, datos]) {
                campos[clave] = crearCampo(...datos);
                contenido.appendChild(campos[clave].contenedor);
            });

            // Obtener los campos HTML para validar y guardar
            const camposHTML = {};

            Object.keys(campos).forEach(function (clave) {
                camposHTML[clave] = campos[clave].campo;
            });

            // Botón cancelar
            const cancelar = document.createElement('button');
            cancelar.type = 'button';
            cancelar.className = 'btn btn-secondary me-2';
            cancelar.textContent = 'Cancelar';

            cancelar.addEventListener('click', function () {
                tarjeta.replaceWith(crearTarjetaCurso(curso));
            });

            // Botón confirmar
            const confirmar = document.createElement('button');
            confirmar.type = 'button';
            confirmar.className = 'btn btn-success';
            confirmar.textContent = 'Confirmar';

            confirmar.addEventListener('click', function () {
                confirmarEdicion(curso, camposHTML);
            });

            contenido.append(cancelar, confirmar);

        } else {

            // Mostrar información del curso
            const titulo = document.createElement('h5');
            titulo.className = 'card-title';
            titulo.textContent = curso.nombre;
            contenido.appendChild(titulo);

            function agregarDato(etiqueta, valor) {
                const parrafo = document.createElement('p');
                parrafo.className = 'card-text';

                const negrita = document.createElement('strong');
                negrita.textContent = etiqueta + ': ';

                const texto = document.createElement('span');
                texto.textContent = valor ?? '';

                parrafo.append(negrita, texto);
                contenido.appendChild(parrafo);
            }

            agregarDato('Descripción', curso.descripcion);
            agregarDato('Docente', nombreDocente(Number(curso.id_docente)));
            agregarDato('Aula', nombreAula(Number(curso.id_aula)));
            agregarDato('Fechas', curso.fecha_inicio + ' - ' + curso.fecha_fin);
            agregarDato('Horario', curso.horario);
            agregarDato('Plazas', curso.plazas);
            agregarDato('Imagen', curso.imagen || 'Sin imagen');
            agregarDato('Estado', curso.estado);

            // Botón editar
            const editar = document.createElement('button');
            editar.type = 'button';
            editar.className = 'btn btn-primary';
            editar.textContent = 'Editar';

            editar.addEventListener('click', function () {
                tarjeta.replaceWith(crearTarjetaCurso(curso, true));
            });

            contenido.appendChild(editar);
        }

        return tarjeta;
    }


    // Confirmar la edición de un curso
    function confirmarEdicion(cursoOriginal, campos) {
        const valores = obtenerValores(campos);

        if (!validarCurso(valores, campos)) return;

        let cursos;

        try {
            cursos = cargarCursos();
        } catch (error) {
            alert('No se pudieron cargar los cursos.');
            return;
        }

        const indice = cursos.findIndex(function (c) {
            return Number(c.id_curso) === Number(cursoOriginal.id_curso);
        });

        if (indice === -1) {
            alert('No se ha encontrado el curso que quieres editar.');
            return;
        }

        cursos[indice] = {
            ...cursos[indice],
            ...crearCurso(valores, cursos[indice].id_curso)
        };

        if (guardarCursos(cursos)) {
            alert('¡Curso actualizado correctamente!');
            mostrarCursos();
        } else {
            alert('No se pudieron guardar los cambios.');
        }
    }


    // Mostrar todos los cursos
    function mostrarCursos() {
        let cursos;

        try {
            cursos = cargarCursos();
        } catch (error) {
            alert('No se pudieron cargar los cursos.');
            return;
        }

        listaCursos.innerHTML = '';

        cursos.forEach(function (curso) {
            listaCursos.appendChild(crearTarjetaCurso(curso));
        });
    }

    // Mostrar cursos al cargar la página
    mostrarCursos();
}
