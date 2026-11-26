// Código compartido por todas las páginas. Se carga después de Bootstrap
// y antes del JS propio de cada página.

const CLAVE_PREFERENCIAS = 'preferencias';
// Copia de la sesión del servidor ({ correo, nombre, rol }) para pintar el menú sin esperar.
// Solo sirve para enseñar u ocultar cosas: quien decide de verdad es la sesión del servidor.
const CLAVE_SESION = 'sesion';

// Usuario con la sesión iniciada ({ correo, nombre, rol }) o null si no hay nadie
function leerSesion() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION));
    } catch {
        return null;
    }
}

// Manda al login y le dice a qué página volver después de entrar
function irAlLogin() {
    const pagina = location.pathname.split('/').pop() || 'index.html';
    location.replace('login.html?volver=' + encodeURIComponent(pagina));
}

// Para las páginas que necesitan sesión: si no la hay, al login. Devuelve true si se puede seguir.
function exigirSesion() {
    if (leerSesion() === null) {
        irAlLogin();
        return false;
    }
    return true;
}

// true si quien tiene la sesión iniciada es administrador
function esAdmin() {
    const sesion = leerSesion();
    return sesion !== null && sesion.rol === 'admin';
}

// Guarda al usuario como sesión iniciada (sin la contraseña). Devuelve false si no se pudo.
function iniciarSesion(usuario) {
    try {
        localStorage.setItem(CLAVE_SESION, JSON.stringify({
            correo: usuario.correo,
            nombre: usuario.nombre,
            rol: usuario.rol
        }));
        return true;
    } catch (error) {
        console.error('No se pudo guardar la sesión', error);
        return false;
    }
}

function cerrarSesion() {
    try {
        localStorage.removeItem(CLAVE_SESION);
    } catch (error) {
        console.error('No se pudo cerrar la sesión', error);
    }
}

// Pregunta al servidor quien tiene la sesion iniciada y actualiza localStorage
async function sincronizarSesion() {
    try {
        const respuesta = await fetch('/api/auth/sesion', { headers: { Accept: 'application/json' } });
        if (!respuesta.ok) {
            return leerSesion();
        }
        const { usuario } = await respuesta.json();
        if (usuario) {
            iniciarSesion(usuario);
        } else {
            cerrarSesion();
        }
        return usuario;
    } catch {
        return leerSesion();
    }
}

// Lee las preferencias de accesibilidad guardadas y las aplica a <html>
function aplicarPreferencias() {
    let preferencias = {};
    try {
        preferencias = JSON.parse(localStorage.getItem(CLAVE_PREFERENCIAS)) || {};
    } catch {
        // Si lo guardado está roto o el navegador no deja leerlo, se quedan las de por defecto
    }

    const html = document.documentElement;
    html.classList.toggle('tema-oscuro', preferencias.tema === 'oscuro');
    html.classList.toggle('alto-contraste', preferencias.contraste === true);
    html.classList.toggle('fuente-grande', preferencias.fuente === 'grande');
    html.classList.toggle('fuente-muy-grande', preferencias.fuente === 'muy-grande');
}

aplicarPreferencias();

// Enseña un aviso de Bootstrap flotando sobre la página, arriba y centrado,
// para verlo aunque se haya bajado con el scroll. No oscurece el resto.
// tipo: 'danger' (por defecto), 'success', 'warning' o 'info'.
// Los de éxito se quitan solos a los 5 segundos; los demás esperan a que se cierren.
function mostrarAlerta(mensaje, tipo = 'danger') {
    let contenedor = document.getElementById('avisos');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'avisos';
        contenedor.className = 'avisos-flotantes';
        document.body.append(contenedor);
    }

    const alerta = document.createElement('div');
    alerta.className = 'alert alert-' + tipo + ' alert-dismissible shadow';
    alerta.setAttribute('role', 'alert');
    alerta.textContent = mensaje;

    const cerrar = document.createElement('button');
    cerrar.type = 'button';
    cerrar.className = 'btn-close';
    cerrar.setAttribute('data-bs-dismiss', 'alert');
    cerrar.setAttribute('aria-label', 'Cerrar');
    alerta.append(cerrar);

    contenedor.append(alerta);

    if (tipo === 'success') {
        setTimeout(function () {
            alerta.remove();
        }, 5000);
    }
}

// Pide datos a la API del servidor. Todas las páginas usan esta función en vez de su propio fetch.
// Manda y recibe JSON. Devuelve lo que conteste el servidor (null si no contesta nada).
// Si algo falla, enseña el mensaje con mostrarAlerta y lanza el error, para que la página
// pueda reaccionar (volver a activar un botón, por ejemplo). error.estado lleva el código HTTP.
//     const cursos = await pedirApi('/api/cursos');
//     await pedirApi('/api/matriculas', { metodo: 'POST', datos: { id_curso: 3 } });
async function pedirApi(url, { metodo = 'GET', datos } = {}) {
    const opciones = { method: metodo, headers: { Accept: 'application/json' } };
    if (datos !== undefined) {
        opciones.headers['Content-Type'] = 'application/json';
        opciones.body = JSON.stringify(datos);
    }

    let respuesta;
    try {
        respuesta = await fetch(url, opciones);
    } catch (error) {
        mostrarAlerta('No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.');
        throw error;
    }

    // Si la respuesta no es en JSON se queda en null
    let cuerpo = null;
    try {
        cuerpo = await respuesta.json();
    } catch {
        // No era JSON
    }

    if (!respuesta.ok) {
        const mensaje = cuerpo && cuerpo.error ? cuerpo.error : 'Ha ocurrido un error (' + respuesta.status + '). Inténtalo de nuevo.';
        mostrarAlerta(mensaje);
        const error = new Error(mensaje);
        error.estado = respuesta.status;
        throw error;
    }

    return cuerpo;
}
