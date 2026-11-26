const docentes = require('../datos/docentes');

// Cada docente con su lista de cursos
async function listarConCursos() {
    const [listaDocentes, cursos] = await Promise.all([
        docentes.listar(),
        docentes.listarCursosDeDocentes()
    ]);

    return listaDocentes.map(docente => ({
        ...docente,
        activo: Boolean(docente.activo),
        cursos: cursos.filter(curso => curso.id_docente === docente.id_docente)
    }));
}

module.exports = { listarConCursos };
