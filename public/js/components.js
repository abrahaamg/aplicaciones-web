// Mete la cabecera y el pie comunes en cada página.
// Necesita servidor (npm start): abriendo el HTML con doble clic, fetch no puede leer los ficheros.

// Trae un trozo de HTML de components/ y lo pone dentro del contenedor indicado
async function cargarComponente(idContenedor, ruta) {
    try {
        const respuesta = await fetch(ruta);
        if (!respuesta.ok) {
            throw new Error('Respuesta ' + respuesta.status);
        }
        document.getElementById(idContenedor).innerHTML = await respuesta.text();
    } catch (error) {
        console.error('No se pudo cargar ' + ruta, error);
    }
}

// Resalta en el menú la página en la que estamos
function marcarPaginaActual() {
    let paginaActual = location.pathname.split('/').pop() || 'index.html';

    // El detalle de un curso no está en el menú: se resalta "Cursos"
    if (paginaActual === 'curso.html') {
        paginaActual = 'cursos.html';
    }

    document.querySelectorAll('#navbar .nav-link').forEach(function (enlace) {
        if (enlace.getAttribute('href') === paginaActual) {
            enlace.classList.add('active');
            enlace.setAttribute('aria-current', 'page');
        }
    });
}

cargarComponente('navbar', 'components/navbar.html').then(marcarPaginaActual);
cargarComponente('footer', 'components/footer.html');
