// Código compartido por todas las páginas. Se carga después de Bootstrap
// y antes del JS propio de cada página.

const CLAVE_PREFERENCIAS = 'preferencias';
// El inicio de sesión guarda aquí al usuario; al cerrar sesión se borra
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
