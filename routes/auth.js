// Rutas auth: registro, inicio y cierre de sesion
// La sesión del servidor guarda { id_usuario, nombre, correo, rol }

const express = require('express');
const servicioAuth = require('../servicios/auth');

const router = express.Router();

function guardarUsuarioEnSesion(req, usuario) {
    return new Promise((resolve, reject) => {
        req.session.regenerate((error) => {
            if (error) {
                return reject(error);
            }

            req.session.usuario = {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.email,
                rol: usuario.rol
            };

            req.session.save((error) => {
                if (error) {
                    return reject(error);
                }
                resolve(req.session.usuario);
            });
        });
    });
}

function destinoPorRol(rol) {
    return rol === 'admin' ? 'admin.html' : 'mis-matriculas.html';
}

router.post('/registro', async (req, res, next) => {
    try {
        const usuario = await servicioAuth.registrar(req.body);
        const sesion = await guardarUsuarioEnSesion(req, usuario);

        res.status(201).json({
            usuario: sesion,
            destino: destinoPorRol(sesion.rol)
        });
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const usuario = await servicioAuth.iniciarSesion(req.body);
        const sesion = await guardarUsuarioEnSesion(req, usuario);

        res.json({
            usuario: sesion,
            destino: destinoPorRol(sesion.rol)
        });
    } catch (error) {
        next(error);
    }
});

router.post('/logout', (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie('connect.sid');
        res.status(200).json({ mensaje: 'Sesión cerrada.' });
    });
});

router.get('/sesion', (req, res) => {
    res.json({ usuario: req.session.usuario || null });
});

module.exports = router;