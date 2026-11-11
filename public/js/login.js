// Inicio de sesión de prueba. Los usuarios están escritos aquí hasta que haya
// servidor y base de datos (microhito 3); entonces se comprobará en POST /api/auth/login.

const USUARIOS_PRUEBA = [
    { correo: 'admin@example.com', clave: 'admin123', nombre: 'Administración', rol: 'admin' },
    { correo: 'alumno@example.com', clave: 'alumno123', nombre: 'Alumno de prueba', rol: 'alumno' }
];

const formularioLogin = document.getElementById('formulario-login');

// Página a la que volver después de entrar (?volver=admin.html). Solo se acepta el nombre
// de una página de la web, para no mandar a nadie a otro sitio.
function paginaDeVuelta() {
    const volver = new URLSearchParams(location.search).get('volver');
    if (volver && /^[\w-]+\.html$/.test(volver) && volver !== 'login.html') {
        return volver;
    }
    return 'index.html';
}

// Con la sesión ya iniciada no tiene sentido el login
if (leerSesion() !== null) {
    location.replace(paginaDeVuelta());
}

formularioLogin.addEventListener('submit', function (event) {
    event.preventDefault();

    const correo = document.getElementById('correo');
    const clave = document.getElementById('clave');

    correo.classList.toggle('is-invalid', !correo.checkValidity());
    clave.classList.toggle('is-invalid', clave.value === '');
    if (!correo.checkValidity() || clave.value === '') return;

    const usuario = USUARIOS_PRUEBA.find(function (u) {
        return u.correo === correo.value.trim().toLowerCase() && u.clave === clave.value;
    });

    if (!usuario) {
        mostrarAlerta('El correo o la contraseña no son correctos.');
        return;
    }

    if (iniciarSesion(usuario)) {
        location.href = paginaDeVuelta();
    } else {
        mostrarAlerta('No se pudo iniciar la sesión. Inténtalo de nuevo.');
    }
});
