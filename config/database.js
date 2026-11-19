// Conexión a MariaDB. Todo el servidor usa este pool: cada consulta coge una conexión
// libre y la devuelve al terminar, sin abrir una nueva cada vez.
// Los datos de conexión vienen del fichero .env (copia de .env.example), que no se sube a GitHub.

const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dateStrings: true,
    bigIntAsNumber: true,
    insertIdAsNumber: true,
    connectionLimit: 10
});

// Se llama al arrancar para avisar en la terminal si MariaDB no está encendido
async function comprobarConexion() {
    try {
        await pool.query('SELECT 1');
        console.log('Conectado a MariaDB');
    } catch (error) {
        console.error('No se pudo conectar a MariaDB: ' + error.message);
        console.error('Revisa que XAMPP tenga MySQL arrancado, que db/aw_practica.sql y db/aw_datos.sql estén importados y los datos de .env.');
    }
}

module.exports = { pool, comprobarConexion };
