// Rutas aulas: consulta de las aulas con sus cursos

const express = require('express');
const servicioAulas = require('../servicios/aulas');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.json(await servicioAulas.listarConCursos());
    } catch (error) {
        next(error);
    }
});

module.exports = router;
