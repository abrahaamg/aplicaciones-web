const bcrypt = require('bcryptjs');
const usuarios = require('../datos/usuarios');
const { errorHttp } = require('../middlewares/errores');

// Registro e inicio de sesion 
// Aqui van las validaciones y reglas aunque se hayan hecho tambien en el formulario (por seguridad)

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COSTE_BCRYPT = 10;

function validarRegistro(datos) {
    if (datos === null || typeof datos !== 'object' || Array.isArray(datos)) {
        throw errorHttp(400, 'Revisa los datos introducidos.');
    }

    const { nombre, apellidos, email, password, confirm_password } = datos;
    const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
    const apellidosLimpios = typeof apellidos === 'string' ? apellidos.trim() : '';
    const emailLimpio = typeof email === 'string' ? email.trim().toLowerCase() : '';

    const nombreValido = /\p{L}/u.test(nombreLimpio) && nombreLimpio.length <= 50;
    const apellidosValidos = /\p{L}/u.test(apellidosLimpios) && apellidosLimpios.length <= 50;
    const emailValido = emailLimpio.length <= 150 && FORMATO_EMAIL.test(emailLimpio);
    const passwordValido = typeof password === 'string' && password.trim().length >= 8;
    const confirmacionValida = typeof confirm_password === 'string' && confirm_password === password;

    if (!nombreValido || !apellidosValidos || !emailValido || !passwordValido || !confirmacionValida) {
        throw errorHttp(400, 'Revisa los datos introducidos.');
    }

    return {
        nombre: nombreLimpio + ' ' + apellidosLimpios,
        email: emailLimpio,
        password
    };
}

function validarLogin(datos) {
    if (datos === null || typeof datos !== 'object' || Array.isArray(datos)) {
        throw errorHttp(400, 'Introduce un correo y una contraseña válidos.');
    }

    const email = typeof datos.correo === 'string' ? datos.correo.trim().toLowerCase() : '';
    if (!FORMATO_EMAIL.test(email)) {
        throw errorHttp(400, 'Introduce un correo válido.');
    }

    const password = datos.clave;
    if (typeof password !== 'string' || password === '') {
        throw errorHttp(400, 'Introduce la contraseña.');
    }

    return { email, password };
}

async function registrar(datos) {
    const datosValidados = validarRegistro(datos);
    const usuarioExistente = await usuarios.buscarPorEmail(datosValidados.email);

    if (usuarioExistente) {
        throw errorHttp(409, 'Ese correo ya está registrado.');
    }

    const passwordHash = await bcrypt.hash(datosValidados.password, COSTE_BCRYPT);

    let idUsuario;
    try {
        idUsuario = await usuarios.crearAlumno({
            nombre: datosValidados.nombre,
            email: datosValidados.email,
            passwordHash
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            throw errorHttp(409, 'Ese correo ya está registrado.');
        }
        throw error;
    }

    return {
        id_usuario: idUsuario,
        nombre: datosValidados.nombre,
        email: datosValidados.email,
        rol: 'alumno'
    };
}

// ============== REVISAR =================
// Hash de relleno: cuando no hay un hash de verdad que comparar se compara igualmente contra
// este, para que todas las respuestas tarden lo mismo y no se pueda adivinar por el tiempo
// qué correos están registrados.
const HASH_RELLENO = bcrypt.hashSync('relleno-sin-usuario', COSTE_BCRYPT);

async function comprobarPassword(usuario, password) {
    if (usuario.password.startsWith('$2')) {
        return bcrypt.compare(password, usuario.password);
    }

    if (password !== usuario.password) {
        await bcrypt.compare(password, HASH_RELLENO);
        return false;
    }

    const passwordHash = await bcrypt.hash(password, COSTE_BCRYPT);
    await usuarios.actualizarPassword(usuario.id_usuario, passwordHash);
    return true;
}

async function iniciarSesion(datos) {
    const datosValidados = validarLogin(datos);
    const usuario = await usuarios.buscarPorEmail(datosValidados.email);

    let passwordCorrecta = false;
    if (usuario) {
        passwordCorrecta = await comprobarPassword(usuario, datosValidados.password);
    } else {
        await bcrypt.compare(datosValidados.password, HASH_RELLENO);
    }

    if (!passwordCorrecta) {
        throw errorHttp(401, 'El correo o la contraseña no son correctos.');
    }

    if (!usuario.activo) {
        throw errorHttp(403, 'Tu cuenta está desactivada.');
    }

    return {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
    };
}

module.exports = { registrar, iniciarSesion };