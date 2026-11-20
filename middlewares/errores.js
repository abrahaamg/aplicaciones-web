// Errores de la API. Todos acaban en una respuesta con su código.

// Crea un error con el código HTTP que hay que contestar. Lo usan los servicios:
//     throw errorHttp(409, 'No quedan plazas en este curso.');
function errorHttp(estado, mensaje) {
    const error = new Error(mensaje);
    error.estado = estado;
    return error;
}

// Va el último en index.js. Express sabe que es de errores porque tiene cuatro parámetros.
// Los errores sin código (un fallo de MariaDB, un error de programación) son un 500: el detalle
// sale en la terminal y el usuario solo ve un mensaje general.
function manejarErrores(error, req, res, next) {
    // express.json() no ha podido leer el cuerpo de la petición
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Los datos enviados no son un JSON válido.' });
    }

    if (!error.estado || error.estado >= 500) {
        console.error(error);
        return res.status(500).json({ error: 'Ha ocurrido un error en el servidor. Inténtalo más tarde.' });
    }

    res.status(error.estado).json({ error: error.message });
}

module.exports = { errorHttp, manejarErrores };
