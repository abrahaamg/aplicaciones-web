// Datos de la aplicación y su guardado en localStorage.
// Se carga después de comun.js y antes del JS de cada página que use cursos.

const CLAVE_CURSOS = 'cursos';

// Datos inventados. Los campos son los mismos que tendrá la API (snake_case).
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

// Cursos con los que arranca la app. La imagen queda vacía hasta que haya fotos en img/cursos/.
const CURSOS_INICIALES = [
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

// Devuelve los cursos guardados. Si no hay nada o lo guardado está roto, los iniciales.
function cargarCursos() {
    try {
        const guardados = JSON.parse(localStorage.getItem(CLAVE_CURSOS));
        if (Array.isArray(guardados)) {
            return guardados;
        }
    } catch {
        // Lo guardado está roto o el navegador no deja leerlo: se usan los iniciales
    }
    return structuredClone(CURSOS_INICIALES);
}

// Guarda la lista de cursos. Devuelve false si el navegador no ha dejado guardarla.
function guardarCursos(cursos) {
    try {
        localStorage.setItem(CLAVE_CURSOS, JSON.stringify(cursos));
        return true;
    } catch (error) {
        console.error('No se pudieron guardar los cursos', error);
        return false;
    }
}
