const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const { comprobarConexion } = require('./config/database');
const noEncontrado = require('./middlewares/no-encontrado');
const { manejarErrores } = require('./middlewares/errores');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'centro-formacion',
    resave: false,
    saveUninitialized: false
}));

// Ficheros estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// API contesta en JSON
app.use('/api', require('./routes'));

// Errores al final
app.use(noEncontrado);
app.use(manejarErrores);

// Servidor
app.listen(PORT, () => {
    console.log(`Centro de Formación en http://localhost:${PORT}`);
    comprobarConexion();
});
