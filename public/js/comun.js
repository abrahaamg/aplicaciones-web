// Código compartido por todas las páginas. Se carga después de Bootstrap
// y antes del JS propio de cada página.

const CLAVE_PREFERENCIAS = 'preferencias';
// El inicio de sesión guarda aquí al usuario; al cerrar sesión se borra
const CLAVE_SESION = 'sesion';

// true si hay alguien con la sesión iniciada
function haySesion() {
    try {
        return localStorage.getItem(CLAVE_SESION) !== null;
    } catch {
        // Si el navegador no deja leer, se trata como sin sesión
        return false;
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
