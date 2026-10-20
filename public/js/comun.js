// Código compartido por todas las páginas. Se carga después de Bootstrap
// y antes del JS propio de cada página.

const CLAVE_PREFERENCIAS = 'preferencias';

// Lee las preferencias de accesibilidad guardadas y las aplica a <html>
function aplicarPreferencias() {
    let preferencias = {};
    try {
        preferencias = JSON.parse(localStorage.getItem(CLAVE_PREFERENCIAS)) || {};
    } catch (error) {
        preferencias = {};
    }

    const html = document.documentElement;
    html.classList.toggle('tema-oscuro', preferencias.tema === 'oscuro');
    html.classList.toggle('alto-contraste', preferencias.contraste === true);
    html.classList.toggle('fuente-grande', preferencias.fuente === 'grande');
    html.classList.toggle('fuente-muy-grande', preferencias.fuente === 'muy-grande');
}

aplicarPreferencias();
