// Se comprueba el correo y la contraseña en POST /api/auth/login y se guarda la sesión

const formularioLogin = document.getElementById('formulario-login');
const botonEntrar = formularioLogin.querySelector('button[type="submit"]');

// Página a la que volver después de entrar (?volver=admin.html). Solo se acepta el nombre
// de una página de la web, para no mandar a nadie a otro sitio. Devuelve null si no hay.
function paginaDeVuelta() {
    const volver = new URLSearchParams(location.search).get('volver');
    if (volver && /^[\w-]+\.html$/.test(volver) && volver !== 'login.html') {
        return volver;
    }
    return null;
}

// Con la sesión ya iniciada no tiene sentido el login
sincronizarSesion().then(function (usuario) {
    if (usuario) {
        location.replace(paginaDeVuelta() || 'index.html');
    }
});

formularioLogin.addEventListener('submit', async function (event) {
    event.preventDefault();

    const correo = document.getElementById('correo');
    const clave = document.getElementById('clave');

    correo.classList.toggle('is-invalid', !correo.checkValidity());
    clave.classList.toggle('is-invalid', clave.value === '');
    if (!correo.checkValidity() || clave.value === '') return;

    botonEntrar.disabled = true;
    try {
        const respuesta = await pedirApi('/api/auth/login', {
            metodo: 'POST',
            datos: { correo: correo.value.trim(), clave: clave.value }
        });
        iniciarSesion(respuesta.usuario);
        location.href = paginaDeVuelta() || respuesta.destino;
    } catch {
        clave.value = '';
        clave.focus();
        botonEntrar.disabled = false;
    }
});
