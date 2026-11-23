function noEncontrado(req, res) {
    res.status(404).json({ error: 'No existe la ruta ' + req.method + ' ' + req.originalUrl + '.' });
}

module.exports = noEncontrado;
