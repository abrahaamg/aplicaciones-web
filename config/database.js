// Conexión a MariaDB. Todo el servidor usa este pool: cada consulta coge una conexión
// libre y la devuelve al terminar, sin abrir una nueva cada vez.
// Los valores por defecto son los de XAMPP (usuario root sin contraseña).

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'aw_practica',
    dateStrings: true,
    connectionLimit: 10
});

// Se llama al arrancar para avisar en la terminal si MariaDB no está encendido
async function comprobarConexion() {
    try {
        await pool.query('SELECT 1');
        console.log('Conectado a MariaDB');
    } catch (error) {
        console.error('No se pudo conectar a MariaDB: ' + error.message);
        console.error('Revisa que XAMPP tenga MySQL arrancado y que db/aw_practica.sql esté importado.');
    }
}

module.exports = { pool, comprobarConexion };
