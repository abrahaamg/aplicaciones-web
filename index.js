const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');

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

// Vistas EJS (se activan en el bloque de backend)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Rutas
// app.use('/', require('./routes/index'));
// app.use('/api/cursos', require('./routes/cursos'));

// Servidor
app.listen(PORT, () => {
    console.log(`Centro de Formación en http://localhost:${PORT}`);
});
