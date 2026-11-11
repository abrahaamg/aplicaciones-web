// Obtener elementos principales
const formularioCurso = document.getElementById('formulario-curso');
const listaCursos = document.getElementById('lista-cursos');

// Mensajes de error comunes a los dos formularios
// Límites de los campos (también van como maxlength y max en el HTML)
const LIMITES = { nombre: 100, descripcion: 500, plazas: 200 };

const MENSAJES = {
    nombre: 'Introduce un nombre con letras, no solo números (máximo 100 caracteres).',
    descripcion: 'Introduce una descripción (máximo 500 caracteres).',
    plazas: 'Introduce un número entero de plazas entre 1 y 200.',
    fechaInicio: 'La fecha de inicio no puede ser anterior a hoy.',
    imagen: 'Pon la ruta de una imagen dentro de la web (.jpg, .png, .webp o .svg), por ejemplo img/curso.jpg.'
};

// Administración es solo para el administrador: sin sesión de admin se va al login
const accesoPermitido = esAdmin();
if (!accesoPermitido) {
    // Sin sesión, al login. Con sesión de alumno, a la portada (volver al login sería un bucle)
    if (leerSesion() === null) {
        irAlLogin();
    } else {
        location.replace('index.html');
    }
}

if (formularioCurso && accesoPermitido) {

    // Fecha de hoy en el mismo formato que los campos de fecha: '2026-11-10'
    function fechaDeHoy() {
        const hoy = new Date();
        return hoy.getFullYear() + '-' +
            String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
            String(hoy.getDate()).padStart(2, '0');
    }


    // Ventana de confirmación de borrado y curso que se va a borrar
    const modalBorrar = new bootstrap.Modal(document.getElementById('modal-borrar'));
    let idCursoABorrar = null;

    // Obtener campos del formulario
    const camposFormulario = {
        nombre: document.getElementById('nombre'),
        descripcion: document.getElementById('descripcion'),
        docente: document.getElementById('docente'),
        aula: document.getElementById('aula'),
        fechaInicio: document.getElementById('fecha-inicio'),
        fechaFin: document.getElementById('fecha-fin'),
        horario: null,
        plazas: document.getElementById('plazas'),
        imagen: document.getElementById('imagen'),
        estado: document.getElementById('estado')
    };

    // El horario del alta se monta igual que el de editar
    const horarioAlta = crearCampoHorario('alta-horario', '');
    document.getElementById('hueco-horario').replaceWith(horarioAlta.contenedor);
    camposFormulario.horario = horarioAlta.campo;

    // En el alta no se puede elegir una fecha pasada
    camposFormulario.fechaInicio.min = fechaDeHoy();

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
            valores[clave] = clave === 'horario' ? leerHorario(campos[clave]) : campos[clave].value;
        });

        return valores;
    }


    // Dice si ya hay otro curso con ese nombre (sin fijarse en mayúsculas ni tildes).
    // Al editar, el propio curso no cuenta. Si no se pueden leer los cursos, no se comprueba.
    function nombreRepetido(nombre, original) {
        const cursos = leerCursos();
        if (!cursos) return false;

        const buscado = normalizarTexto(nombre.trim());
        return cursos.some(function (curso) {
            return (original === null || Number(curso.id_curso) !== Number(original.id_curso))
                && normalizarTexto(curso.nombre.trim()) === buscado;
        });
    }


    // Validar los campos de un curso. Al editar, se deja la fecha de inicio que ya tenía.
    function validarCurso(valores, campos, original = null) {
        const horario = valores.horario;
        const imagen = valores.imagen.trim();
        const repetido = nombreRepetido(valores.nombre, original);

        const valido = {
            nombre: /\p{L}/u.test(valores.nombre) && valores.nombre.trim().length <= LIMITES.nombre && !repetido,
            descripcion: valores.descripcion.trim() !== '' && valores.descripcion.trim().length <= LIMITES.descripcion,
            docente: DOCENTES.some(d => d.id_docente === Number(valores.docente)),
            aula: AULAS.some(a => a.id_aula === Number(valores.aula)),
            fechaInicio: valores.fechaInicio !== '' &&
                (valores.fechaInicio >= fechaDeHoy() ||
                    (original !== null && valores.fechaInicio === original.fecha_inicio)),
            fechaFin: valores.fechaFin !== '' &&
                valores.fechaInicio !== '' &&
                valores.fechaFin > valores.fechaInicio,
            horario: mensajeHorario(horario) === '',
            plazas: valores.plazas !== '' &&
                Number.isInteger(Number(valores.plazas)) &&
                Number(valores.plazas) > 0 &&
                Number(valores.plazas) <= LIMITES.plazas,
            // Ruta dentro de la web: carpetas y fichero, sin '..', sin '/' al principio y sin otra web
            imagen: imagen === '' || /^[\w-]+(\/[\w-]+)*\.(jpe?g|png|webp|svg)$/i.test(imagen),
            estado: ['activo', 'inactivo'].includes(valores.estado)
        };

        Object.keys(valido).forEach(function (clave) {
            campos[clave].classList.toggle('is-invalid', !valido[clave]);
        });

        // El aviso del horario dice qué falta en concreto
        campos.horario.nextElementSibling.textContent = mensajeHorario(horario);

        if (repetido) {
            mostrarAlerta('Ya existe un curso con el nombre "' + valores.nombre.trim() + '".');
        }

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
            horario: textoHorario(valores.horario),
            plazas: Number(valores.plazas),
            imagen: valores.imagen.trim(),
            estado: valores.estado
        };
    }


    // Leer los cursos guardados; si fallan, avisa en pantalla y devuelve null
    function leerCursos() {
        try {
            return cargarCursos();
        } catch {
            mostrarAlerta('No se pudieron cargar los cursos.');
            return null;
        }
    }


    // Añadir un curso
    formularioCurso.addEventListener('submit', function (event) {
        event.preventDefault();

        const valores = obtenerValores(camposFormulario);

        if (!validarCurso(valores, camposFormulario)) return;

        const cursos = leerCursos();
        if (!cursos) return;

        const nuevoId = cursos.reduce(function (maximo, curso) {
            return Math.max(maximo, Number(curso.id_curso) || 0);
        }, 0) + 1;

        cursos.push(crearCurso(valores, nuevoId));

        if (guardarCursos(cursos)) {
            mostrarAlerta('Curso añadido correctamente.', 'success');
            formularioCurso.reset();

            Object.values(camposFormulario).forEach(function (campo) {
                campo.classList.remove('is-invalid');
            });

            mostrarCursos();
        } else {
            mostrarAlerta('No se pudo guardar el curso.');
        }
    });


    // Crear un campo editable con su etiqueta unida por id
    function crearCampo(id, titulo, tipo, valor, opciones = [], mensajeError = '') {
        const contenedor = document.createElement('div');
        contenedor.className = 'mb-3';

        const etiqueta = document.createElement('label');
        etiqueta.className = 'form-label';
        etiqueta.htmlFor = id;
        etiqueta.textContent = titulo;

        const campo = document.createElement(
            tipo === 'textarea' ? 'textarea' : tipo === 'select' ? 'select' : 'input'
        );

        campo.id = id;
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


    // Crear el hueco de la tarjeta (columna, tarjeta y cuerpo)
    function crearMarcoTarjeta() {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'col-md-6 col-lg-4';

        const cuerpo = document.createElement('div');
        cuerpo.className = 'card h-100';

        const contenido = document.createElement('div');
        contenido.className = 'card-body';

        cuerpo.appendChild(contenido);
        tarjeta.appendChild(cuerpo);

        return { tarjeta, contenido };
    }


    // Crear un botón con su acción
    function crearBoton(texto, clase, accion) {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = clase;
        boton.textContent = texto;
        boton.addEventListener('click', accion);
        return boton;
    }


    // Tarjeta con el formulario para editar un curso
    function crearTarjetaEdicion(curso) {
        const { tarjeta, contenido } = crearMarcoTarjeta();

        // Es un formulario de verdad: así Enter también envía la edición
        const formulario = document.createElement('form');
        formulario.noValidate = true;
        contenido.appendChild(formulario);

        const leyenda = document.createElement('p');
        leyenda.className = 'small text-muted';
        leyenda.append('Los campos con ', crearAsterisco(), ' son obligatorios.');
        formulario.appendChild(leyenda);

        // Configuración de los campos editables (el horario va aparte)
        const configuracion = {
            nombre: ['Nombre', 'text', curso.nombre, [], MENSAJES.nombre],
            descripcion: ['Descripción', 'textarea', curso.descripcion, [], MENSAJES.descripcion],
            docente: ['Docente', 'select', curso.id_docente,
                DOCENTES.map(d => ({ value: d.id_docente, texto: d.nombre + ' ' + d.apellidos })),
                'Selecciona un docente.'],
            aula: ['Aula', 'select', curso.id_aula,
                AULAS.map(a => ({ value: a.id_aula, texto: a.nombre })),
                'Selecciona un aula.'],
            fechaInicio: ['Fecha de inicio', 'date', curso.fecha_inicio, [], MENSAJES.fechaInicio],
            fechaFin: ['Fecha de fin', 'date', curso.fecha_fin, [], 'La fecha de fin debe ser posterior a la de inicio.'],
            horario: null,
            plazas: ['Plazas', 'number', curso.plazas, [], MENSAJES.plazas],
            imagen: ['Imagen (ruta)', 'text', curso.imagen || '', [], MENSAJES.imagen],
            estado: ['Estado', 'select', curso.estado,
                [
                    { value: 'activo', texto: 'Activo' },
                    { value: 'inactivo', texto: 'Inactivo' }
                ],
                'Selecciona un estado.']
        };

        // Campos HTML para validar y guardar
        const campos = {};

        Object.entries(configuracion).forEach(function ([clave, datos]) {
            const id = 'editar-' + curso.id_curso + '-' + clave;
            const { contenedor, campo } = datos === null
                ? crearCampoHorario(id, curso.horario)
                : crearCampo(id, ...datos);
            campos[clave] = campo;

            // Todo es obligatorio menos la imagen
            if (datos !== null && clave !== 'imagen') {
                campo.required = true;
                contenedor.querySelector('label').append(' ', crearAsterisco());
            }

            // Los mismos límites que en el formulario de alta
            if (clave === 'plazas') campo.max = LIMITES.plazas;
            else if (LIMITES[clave]) campo.maxLength = LIMITES[clave];
            formulario.appendChild(contenedor);
        });

        const confirmar = document.createElement('button');
        confirmar.type = 'submit';
        confirmar.className = 'btn btn-success';
        confirmar.textContent = 'Confirmar';

        formulario.append(
            crearBoton('Cancelar', 'btn btn-secondary me-2', function () {
                tarjeta.replaceWith(crearTarjetaCurso(curso));
            }),
            confirmar
        );

        formulario.addEventListener('submit', function (event) {
            event.preventDefault();
            confirmarEdicion(curso, campos);
        });

        return tarjeta;
    }


    // Tarjeta con los datos de un curso y el botón de editar
    function crearTarjetaCurso(curso) {
        const { tarjeta, contenido } = crearMarcoTarjeta();

        const titulo = document.createElement('h3');
        titulo.className = 'card-title h5';
        titulo.textContent = curso.nombre;
        contenido.appendChild(titulo);

        // Inactivo: tarjeta más apagada y la misma etiqueta que en el catálogo
        if (curso.estado !== 'activo') {
            contenido.parentElement.classList.add('tarjeta-inactiva');
            const insignia = document.createElement('span');
            insignia.className = 'badge bg-secondary mb-2';
            insignia.textContent = 'Inactivo';
            contenido.appendChild(insignia);
        }

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
        agregarDato('Fechas', formatearFecha(curso.fecha_inicio) + ' a ' + formatearFecha(curso.fecha_fin));
        agregarDato('Horario', curso.horario);
        agregarDato('Plazas', curso.plazas);
        agregarDato('Imagen', curso.imagen || 'Sin imagen');

        contenido.appendChild(crearBoton('Editar', 'btn btn-primary', function () {
            tarjeta.replaceWith(crearTarjetaEdicion(curso));
        }));

        const botonBorrar = crearBoton('', 'btn btn-outline-danger ms-2', function () {
            pedirConfirmacionBorrar(curso);
        });
        const icono = document.createElement('i');
        icono.className = 'bi bi-trash';
        icono.setAttribute('aria-hidden', 'true');
        const textoBorrar = document.createElement('span');
        textoBorrar.className = 'visually-hidden';
        textoBorrar.textContent = 'Borrar ' + curso.nombre;
        botonBorrar.append(icono, textoBorrar);
        contenido.appendChild(botonBorrar);

        return tarjeta;
    }


    // Borrar: la papelera abre el modal y solo se borra al confirmar
    function pedirConfirmacionBorrar(curso) {
        idCursoABorrar = curso.id_curso;
        document.getElementById('nombre-curso-borrar').textContent = curso.nombre;
        modalBorrar.show();
    }

    document.getElementById('confirmar-borrar').addEventListener('click', function () {
        modalBorrar.hide();

        const cursos = leerCursos();
        if (!cursos) return;

        const curso = cursos.find(function (c) { return Number(c.id_curso) === Number(idCursoABorrar); });
        if (!curso) {
            mostrarAlerta('No se ha encontrado el curso que quieres borrar.');
            return;
        }

        const restantes = cursos.filter(function (c) { return c !== curso; });
        if (guardarCursos(restantes)) {
            mostrarAlerta('Curso "' + curso.nombre + '" borrado.', 'success');
            mostrarCursos();
        } else {
            mostrarAlerta('No se ha podido borrar el curso. Inténtalo de nuevo.');
        }
    });


    // Confirmar la edición de un curso
    function confirmarEdicion(cursoOriginal, campos) {
        const valores = obtenerValores(campos);

        if (!validarCurso(valores, campos, cursoOriginal)) return;

        const cursos = leerCursos();
        if (!cursos) return;

        const indice = cursos.findIndex(function (c) {
            return Number(c.id_curso) === Number(cursoOriginal.id_curso);
        });

        if (indice === -1) {
            mostrarAlerta('No se ha encontrado el curso que quieres editar.');
            return;
        }

        cursos[indice] = {
            ...cursos[indice],
            ...crearCurso(valores, cursos[indice].id_curso)
        };

        if (guardarCursos(cursos)) {
            mostrarAlerta('Curso actualizado correctamente.', 'success');
            mostrarCursos();
        } else {
            mostrarAlerta('No se pudieron guardar los cambios.');
        }
    }


    // Mostrar todos los cursos
    function mostrarCursos() {
        const cursos = leerCursos();
        if (!cursos) return;

        listaCursos.innerHTML = '';

        cursos.forEach(function (curso) {
            listaCursos.appendChild(crearTarjetaCurso(curso));
        });
    }

    // Mostrar cursos al cargar la página
    mostrarCursos();
}
