// Cada parte tiene su fichero en routes y se añade aquí asi
// router.use('/cursos', require('./cursos'));

const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth'));

module.exports = router;
