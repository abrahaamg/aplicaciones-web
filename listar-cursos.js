// Lista los cursos de data/cursos.json en la terminal.
// Se ejecuta con Node, sin servidor ni navegador: npm run cursos

const fs = require('fs');
const path = require('path');

const RUTA_CURSOS = path.join(__dirname, 'data', 'cursos.json');

// De '2026-11-16' a '16/11/2026'
function formatearFecha(texto) {
    return texto.split('-').reverse().join('/');
}

let cursos;
try {
    cursos = JSON.parse(fs.readFileSync(RUTA_CURSOS, 'utf8'));
} catch (error) {
    console.error('No se han podido leer los cursos de ' + RUTA_CURSOS + ': ' + error.message);
    process.exit(1);
}

console.log('Cursos del centro (' + cursos.length + '):');
cursos.forEach(function (curso) {
    console.log('- ' + curso.nombre + ', del ' + formatearFecha(curso.fecha_inicio) +
        ' al ' + formatearFecha(curso.fecha_fin) + ' (' + curso.estado + ')');
});
