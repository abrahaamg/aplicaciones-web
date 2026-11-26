// Consultas SQL tabla docentes

const { pool } = require('../config/database');

async function listar() {
    return pool.query(
        `SELECT id_docente, nombre, email, especialidad, telefono, foto, activo
        FROM docentes
        ORDER BY nombre`
    );
}

async function listarCursosDeDocentes() {
    return pool.query(
        `SELECT id_curso, id_docente, nombre, estado
        FROM cursos
        ORDER BY nombre`
    );
}

module.exports = { listar, listarCursosDeDocentes };
