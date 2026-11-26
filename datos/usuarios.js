// Consultas SQL tabla usuarios

const { pool } = require('../config/database');

async function buscarPorEmail(email) {
    const usuarios = await pool.query(
        `SELECT id_usuario, nombre, email, password, rol, activo
        FROM usuarios
        WHERE email = ?
        LIMIT 1`,
        [email]
    );

    return usuarios[0] || null;
}

async function crearAlumno({ nombre, email, passwordHash }) {
    const resultado = await pool.query(
        `INSERT INTO usuarios (nombre, email, password, rol)
        VALUES (?, ?, ?, 'alumno')`,
        [nombre, email, passwordHash]
    );

    return resultado.insertId;
}

async function actualizarPassword(idUsuario, passwordHash) {
    await pool.query(
        'UPDATE usuarios SET password = ? WHERE id_usuario = ?',
        [passwordHash, idUsuario]
    );
}

module.exports = { buscarPorEmail, crearAlumno, actualizarPassword };