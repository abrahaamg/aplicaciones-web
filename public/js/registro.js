

const formRegistro = document.getElementById('formulario-registro');

if(formRegistro) {
    // Obtener los campos
    const nombre = document.getElementById('nombre');
    const apellidos = document.getElementById('apellidos');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmar-password');

    // Mensaje de confirmación
    const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');

    // Validar nombre
    function validarNombre() {
        const invalido = nombre.value.trim() === '' || nombre.value.length > 50;
        nombre.classList.toggle('is-invalid', invalido);
        return !invalido;
    }

    // Validar apellidos
    function validarApellidos() {
        const invalido = apellidos.value.trim() === '' || apellidos.value.length > 50;
        apellidos.classList.toggle('is-invalid', invalido);
        return !invalido;
    }

    // Validar email
    function validarEmail() {
        const invalido = email.value.trim() === '' || !email.checkValidity();
        email.classList.toggle('is-invalid', invalido);
        return !invalido;
    }

    // Validar contraseña
    function validarPassword() {
        const invalido = password.value.length < 8;
        password.classList.toggle('is-invalid', invalido);
        return !invalido;
    }

    // Validar confirmación de contraseña
    function validarConfirmPassword() {
        const invalido = confirmPassword.value.length < 8 || confirmPassword.value !== password.value;

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
        validarConfirmPassword();
    });

    // Procesar el formulario
    formRegistro.addEventListener('submit', function (event) {
        event.preventDefault();

        const nombreValido = validarNombre();
        const apellidosValidos = validarApellidos();
        const emailValido = validarEmail();
        const passwordValida = validarPassword();
        const confirmPasswordValida = validarConfirmPassword();

        if (
            nombreValido &&
            apellidosValidos &&
            emailValido &&
            passwordValida &&
            confirmPasswordValida
        ) {
            // Mostrar confirmación sin abandonar la página
            mensajeConfirmacion.classList.remove('d-none');

            // Limpiar el formulario
            formRegistro.reset();

            // Quitar posibles estados de validación
            const campos = formRegistro.querySelectorAll('.form-control');
            campos.forEach(campo => campo.classList.remove('is-invalid'));
        }
    });
}