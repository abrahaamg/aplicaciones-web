// Mete la cabecera y el pie comunes en cada página.
// Necesita servidor (npm start): abriendo el HTML con doble clic, fetch no puede leer los ficheros.

// Trae un trozo de HTML de components/ y lo pone dentro del contenedor indicado
async function cargarComponente(idContenedor, ruta) {
    const contenedor = document.getElementById(idContenedor);
    try {
        const respuesta = await fetch(ruta);
        if (!respuesta.ok) {
            throw new Error('Respuesta ' + respuesta.status);
        }
        contenedor.innerHTML = await respuesta.text();
    } catch (error) {
        console.error('No se pudo cargar ' + ruta, error);
        const aviso = document.createElement('div');
        aviso.className = 'alert alert-danger m-0 rounded-0';
        aviso.setAttribute('role', 'alert');
        aviso.textContent = 'No se ha podido cargar esta parte de la página. Recarga para intentarlo de nuevo.';
        contenedor.replaceChildren(aviso);
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

// Enseña los enlaces del menú que solo tienen sentido con la sesión iniciada
function mostrarEnlacesDeSesion() {
    if (!haySesion()) {
        return;
    }
    document.querySelectorAll('#navbar [data-requiere-sesion]').forEach(function (elemento) {
        elemento.classList.remove('d-none');
    });
}

cargarComponente('navbar', 'components/navbar.html').then(function () {
    marcarPaginaActual();
    mostrarEnlacesDeSesion();
});
cargarComponente('footer', 'components/footer.html');
