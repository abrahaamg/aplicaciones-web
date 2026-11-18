// Vacía las tablas y las rellena con los JSON de data/. Se ejecuta con: npm run datos
//
// Cada tabla lee su fichero: data/usuarios.json, data/docentes.json, data/aulas.json,
// data/cursos.json y data/matriculas.json. Cada fichero es una lista de objetos cuyas
// claves se llaman igual que las columnas de la tabla. Para cambiar los datos basta con
// cambiar los JSON: este script no sabe qué columnas hay, se las pregunta a la base de datos.
// Las claves que no son columnas se ignoran (con aviso) y los ficheros que no existen se saltan.

const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

// En este orden por las claves ajenas: un curso necesita su docente y su aula,
// y una matrícula, su usuario y su curso. Para vaciar se recorre al revés.
const TABLAS = ['usuarios', 'docentes', 'aulas', 'cursos', 'matriculas'];

function leerJson(tabla) {
    const ruta = path.join(__dirname, '..', 'data', tabla + '.json');
    if (!fs.existsSync(ruta)) {
        return null;
    }
    const datos = JSON.parse(fs.readFileSync(ruta, 'utf8'));
    if (!Array.isArray(datos)) {
        throw new Error(ruta + ' tiene que ser una lista de objetos');
    }
    return datos;
}

// Columnas en las que se puede escribir (las calculadas, como matricula_activa, no)
async function columnasDe(conexion, tabla) {
    const columnas = await conexion.query('SHOW COLUMNS FROM ' + conexion.escapeId(tabla));
    return columnas
        .filter(function (columna) { return !columna.Extra.includes('GENERATED') && !columna.Extra.includes('PERSISTENT'); })
        .map(function (columna) { return columna.Field; });
}

async function insertarFilas(conexion, tabla, filas) {
    const columnas = await columnasDe(conexion, tabla);
    const ignoradas = new Set();

    for (const fila of filas) {
        const claves = Object.keys(fila).filter(function (clave) {
            if (columnas.includes(clave)) {
                return true;
            }
            ignoradas.add(clave);
            return false;
        });
        const valores = claves.map(function (clave) { return fila[clave]; });
        const nombres = claves.map(function (clave) { return conexion.escapeId(clave); }).join(', ');
        const huecos = claves.map(function () { return '?'; }).join(', ');
        await conexion.query('INSERT INTO ' + conexion.escapeId(tabla) + ' (' + nombres + ') VALUES (' + huecos + ')', valores);
    }

    if (ignoradas.size > 0) {
        console.warn('  ' + tabla + ': no son columnas y se ignoran: ' + [...ignoradas].join(', '));
    }
}

async function cargarDatos() {
    const conexion = await pool.getConnection();
    try {
        await conexion.beginTransaction();

        // DELETE y no TRUNCATE ni ALTER TABLE: esos confirman la transacción por su cuenta
        // y, si algo fallara después, las tablas se quedarían vacías.
        for (const tabla of [...TABLAS].reverse()) {
            await conexion.query('DELETE FROM ' + conexion.escapeId(tabla));
        }

        for (const tabla of TABLAS) {
            const filas = leerJson(tabla);
            if (filas === null) {
                console.warn('  ' + tabla + ': no hay data/' + tabla + '.json, se queda vacía');
                continue;
            }
            try {
                await insertarFilas(conexion, tabla, filas);
            } catch (error) {
                throw new Error(tabla + ': ' + error.message);
            }
            console.info('  ' + tabla + ': ' + filas.length + ' filas');
        }

        await conexion.commit();
        console.info('Datos cargados.');
    } catch (error) {
        await conexion.rollback();
        console.error('No se ha cargado nada. ' + error.message);
        process.exitCode = 1;
    } finally {
        conexion.release();
        await pool.end();
    }
}

cargarDatos();
