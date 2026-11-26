// Rutas docentes: consulta de los docentes con sus cursos

const express = require('express');
const servicioDocentes = require('../servicios/docentes');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        res.json(await servicioDocentes.listarConCursos());
    } catch (error) {
        next(error);
    }
});

module.exports = router;
