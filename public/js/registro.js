// Registro de alumnos: el servidor vuelve a validar los datos
// Guarda al alumno en POST /api/auth/registro con la contraseña cifrada y deja la sesión iniciada

// Con la sesión ya iniciada no te puedes registrar otra vez
sincronizarSesion().then(function (usuario) {
    if (usuario) {
        location.replace('index.html');
    }
});

const formRegistro = document.getElementById('formulario-registro');
const botonRegistrarse = formRegistro.querySelector('button[type="submit"]');
const nombre = document.getElementById('nombre');
const apellidos = document.getElementById('apellidos');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const errorConfirmPassword = document.getElementById('error-confirm-password');

// Un nombre tiene que llevar alguna letra: "12345" o solo espacios no valen
function textoConLetras(campo, maximo) {
    const valor = campo.value.trim();
    const invalido = !/\p{L}/u.test(valor) || valor.length > maximo;
    campo.classList.toggle('is-invalid', invalido);
    return !invalido;
}

function validarNombre() {
    return textoConLetras(nombre, 50);
}

function validarApellidos() {
    return textoConLetras(apellidos, 50);
}

// El navegador da por bueno "a@b"; aquí se pide además un punto en el dominio
function validarEmail() {
    const valor = email.value.trim();
    const invalido = !email.checkValidity() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    email.classList.toggle('is-invalid', invalido);
    return !invalido;
}

// Mínimo 8 caracteres sin contar los espacios de los extremos
function validarPassword() {
    const invalido = password.value.trim().length < 8;
    password.classList.toggle('is-invalid', invalido);
    return !invalido;
}

function validarConfirmPassword() {
    const vacio = confirmPassword.value === '';
    const invalido = vacio || confirmPassword.value !== password.value;

    errorConfirmPassword.textContent = vacio
        ? 'Por favor, confirme su contraseña.'
        : 'Las contraseñas no coinciden.';

    confirmPassword.classList.toggle('is-invalid', invalido);
    return !invalido;
}

// Validar mientras se escriben los datos
nombre.addEventListener('input', validarNombre);
apellidos.addEventListener('input', validarApellidos);
email.addEventListener('input', validarEmail);
confirmPassword.addEventListener('input', validarConfirmPassword);
password.addEventListener('input', () => {
    validarPassword();
    // Solo se comprueba si el usuario ya ha escrito algo en la confirmación
    if (confirmPassword.value !== '') {
        validarConfirmPassword();
    }
});

formRegistro.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Se validan todos para marcar a la vez todos los campos con error
    const resultados = [
        validarNombre(),
        validarApellidos(),
        validarEmail(),
        validarPassword(),
        validarConfirmPassword()
    ];
    if (resultados.includes(false)) {
        return;
    }

    // Desactivado mientras se envía, para no crear la cuenta dos veces
    botonRegistrarse.disabled = true;
    try {
        const respuesta = await pedirApi('/api/auth/registro', {
            metodo: 'POST',
            datos: {
                nombre: nombre.value.trim(),
                apellidos: apellidos.value.trim(),
                email: email.value.trim(),
                password: password.value,
                confirm_password: confirmPassword.value
            }
        });

        iniciarSesion(respuesta.usuario);
        location.href = respuesta.destino;
    } catch {
        botonRegistrarse.disabled = false;
    }
});
