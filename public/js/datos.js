// Datos de la aplicación y su guardado en localStorage.
// Se carga después de comun.js y antes del JS de cada página que use cursos.

const CLAVE_CURSOS = 'cursos';

// Provisionales: el profe dará los JSON reales de docentes y aulas en el bloque de backend.
// Un curso guarda solo el id (id_docente, id_aula); con estas listas se saca el nombre.
const DOCENTES = [
    { id_docente: 1, nombre: 'Laura', apellidos: 'Gómez Ruiz' },
    { id_docente: 2, nombre: 'Marcos', apellidos: 'Peña Soler' },
    { id_docente: 3, nombre: 'Elena', apellidos: 'Vidal Mora' }
];

const AULAS = [
    { id_aula: 1, nombre: 'Aula 1' },
    { id_aula: 2, nombre: 'Aula 2' },
    { id_aula: 3, nombre: 'Laboratorio' }
];

// Provisionales: cursos de prueba para ver el catálogo hasta que el profe dé el JSON real.
// Solo se usan si todavía no hay nada guardado en localStorage.
const CURSOS_PROVISIONALES = [
    {
        id_curso: 1,
        nombre: 'Introducción a la programación',
        descripcion: 'Primeros pasos con variables, condiciones y bucles.',
        id_docente: 1,
        id_aula: 2,
        fecha_inicio: '2026-11-16',
        fecha_fin: '2026-12-18',
        horario: 'Lunes y miércoles, 16:00 a 18:00',
        plazas: 20,
        imagen: '',
        estado: 'activo'
    },
    {
        id_curso: 2,
        nombre: 'Diseño web con Bootstrap',
        descripcion: 'Páginas que se adaptan al móvil con rejilla, tarjetas y formularios.',
        id_docente: 2,
        id_aula: 1,
        fecha_inicio: '2026-11-17',
        fecha_fin: '2026-12-15',
        horario: 'Martes y jueves, 10:00 a 12:00',
        plazas: 15,
        imagen: '',
        estado: 'activo'
    },
    {
        id_curso: 3,
        nombre: 'Bases de datos con MariaDB',
        descripcion: 'Tablas, relaciones y consultas SQL desde cero.',
        id_docente: 3,
        id_aula: 3,
        fecha_inicio: '2027-01-11',
        fecha_fin: '2027-02-12',
        horario: 'Viernes, 09:00 a 13:00',
        plazas: 12,
        imagen: '',
        estado: 'inactivo'
    }
];

// Devuelve los cursos guardados. Si todavía no se ha guardado ninguno, los provisionales.
// Si lo guardado está roto o no es una lista, escribe el error en consola y lo lanza:
// quien llame tiene que cogerlo con try/catch y avisar al usuario.
function cargarCursos() {
    try {
        const texto = localStorage.getItem(CLAVE_CURSOS);
        if (texto === null) {
            return structuredClone(CURSOS_PROVISIONALES);
        }
        const cursos = JSON.parse(texto);
        if (!Array.isArray(cursos)) {
            throw new Error('Lo guardado en "' + CLAVE_CURSOS + '" no es una lista de cursos');
        }
        return cursos;
    } catch (error) {
        console.error('No se pudieron cargar los cursos', error);
        throw error;
    }
}

// Guarda la lista de cursos. Devuelve false (y escribe el error en consola)
// si el navegador no ha dejado guardarla.
function guardarCursos(cursos) {
    try {
        localStorage.setItem(CLAVE_CURSOS, JSON.stringify(cursos));
        return true;
    } catch (error) {
        console.error('No se pudieron guardar los cursos', error);
        return false;
    }
}

// De '2026-11-16' a '16/11/2026'
function formatearFecha(texto) {
    return texto.split('-').reverse().join('/');
}

// Nombre completo del docente con ese id, o un texto si no se encuentra.
function nombreDocente(idDocente) {
    const docente = DOCENTES.find(function (d) { return d.id_docente === idDocente; });
    return docente ? docente.nombre + ' ' + docente.apellidos : 'Sin docente';
}

// Nombre del aula con ese id, o un texto si no se encuentra.
function nombreAula(idAula) {
    const aula = AULAS.find(function (a) { return a.id_aula === idAula; });
    return aula ? aula.nombre : 'Sin aula';
}
