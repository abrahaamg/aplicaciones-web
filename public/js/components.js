// Mete la cabecera y el pie comunes en cada página.
// Necesita servidor (npm start): abriendo el HTML con doble clic, fetch no puede leer los ficheros.

// Trae un trozo de HTML de components/ y lo pone dentro del contenedor indicado.
// Devuelve true si se cargó y false si no (en ese caso deja un aviso en su sitio).
async function cargarComponente(idContenedor, ruta) {
    const contenedor = document.getElementById(idContenedor);
    try {
        const respuesta = await fetch(ruta);
        if (!respuesta.ok) {
            throw new Error('Respuesta ' + respuesta.status);
        }
        contenedor.innerHTML = await respuesta.text();
        return true;
    } catch (error) {
        console.error('No se pudo cargar ' + ruta, error);
        const aviso = document.createElement('div');
        aviso.className = 'alert alert-danger m-0 rounded-0';
        aviso.setAttribute('role', 'alert');
        aviso.textContent = 'No se ha podido cargar esta parte de la página. Recarga para intentarlo de nuevo.';
        contenedor.replaceChildren(aviso);
        return false;
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

// Enseña u oculta las partes del menú según haya sesión y según el rol
function mostrarEnlacesDeSesion() {
    const sesion = leerSesion();
    const visibles = {
        '[data-sin-sesion]': sesion === null,
        '[data-requiere-sesion]': sesion !== null,
        '[data-requiere-admin]': sesion !== null && sesion.rol === 'admin'
    };

    Object.entries(visibles).forEach(function ([selector, visible]) {
        document.querySelectorAll('#navbar ' + selector).forEach(function (elemento) {
            elemento.classList.toggle('d-none', !visible);
        });
    });

    const botonCerrarSesion = document.getElementById('boton-cerrar-sesion');
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener('click', function () {
            cerrarSesion();
            location.href = 'index.html';
        });
    }
}

// Modo desarrollo: se enciende con ?dev=1 en la dirección y se apaga con ?dev=0.
// Mientras está encendido, cada página carga js/dev.js con atajos para probar.
function cargarModoDev() {
    const parametro = new URLSearchParams(location.search).get('dev');
    try {
        if (parametro === '1') localStorage.setItem('dev', '1');
        if (parametro === '0') localStorage.removeItem('dev');
        if (localStorage.getItem('dev') !== '1') return;
    } catch {
        return;
    }

    const script = document.createElement('script');
    script.src = 'js/dev.js';
    document.body.append(script);
}

cargarComponente('navbar', 'components/navbar.html').then(function (cargado) {
    if (!cargado) return;
    marcarPaginaActual();
    mostrarEnlacesDeSesion();
});
cargarComponente('footer', 'components/footer.html');
cargarModoDev();
