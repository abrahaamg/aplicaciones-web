// Consultas SQL tabla aulas

const { pool } = require('../config/database');

async function listar() {
    return pool.query(
        `SELECT id_aula, nombre, edificio, planta, capacidad, equipamiento, estado
        FROM aulas
        ORDER BY nombre`
    );
}

async function listarCursosDeAulas() {
    return pool.query(
        `SELECT id_curso, id_aula, nombre, estado
        FROM cursos
        ORDER BY nombre`
    );
}

module.exports = { listar, listarCursosDeAulas };
