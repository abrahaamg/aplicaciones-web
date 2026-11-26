const aulas = require('../datos/aulas');

// Cada aula tiene su lista de cursos
async function listarConCursos() {
    const [listaAulas, cursos] = await Promise.all([
        aulas.listar(),
        aulas.listarCursosDeAulas()
    ]);

    return listaAulas.map(aula => ({
        ...aula,
        cursos: cursos.filter(curso => curso.id_aula === aula.id_aula)
    }));
}

module.exports = { listarConCursos };
