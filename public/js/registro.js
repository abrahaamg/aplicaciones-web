

const form_registro = document.getElementById('formulario-registro');

if(form_registro) {
    form_registro.addEventListener('submit', function (event) {
    // Evita el envío del formulario por defecto
    event.preventDefault();

    // Limpiar mensajes de error
    document.getElementById('error-nombre').style.display = 'none';
    document.getElementById('error-apellidos').style.display = 'none';
    document.getElementById('error-email').style.display = 'none';
    document.getElementById('error-password').style.display = 'none';
    document.getElementById('error-confirm_password').style.display = 'none';
    document.getElementById('error-login-email').style.display = 'none';
    document.getElementById('error-login-password').style.display = 'none';

    let hayErrores = false;

    // Nombre
    if(nombre.value.trim() === '' || nombre.value.length > 50) {
        document.getElementById('error-nombre').style.display = 'block';
        hayErrores = true;
    }

    // Apellidos
    if(apellidos.value.trim() === '' || apellidos.value.length > 50) {
        document.getElementById('error-apellidos').style.display = 'block';
        hayErrores = true;
    }

    // Email
    if(email.value.trim() === '' || !email.checkValidity()) {
        document.getElementById('error-email').style.display = 'block';
        hayErrores = true;
    }

    // Login Email
    if(loginEmail.value.trim() === '' || !loginEmail.checkValidity()) {
        document.getElementById('error-login-email').style.display = 'block';
        hayErrores = true;
    }

    // Password
    if(password.value.trim() === '' || password.value.length < 8) {
        document.getElementById('error-password').style.display = 'block';
        hayErrores = true;
    }

    // Confirm Password
    if(confirm_password.value.trim() === '' || confirm_password.value.length < 8) {
        document.getElementById('error-confirm_password').style.display = 'block';
        hayErrores = true;
    }

    // Verificar si las contraseñas coinciden
    if(document.getElementById('password').value !== document.getElementById('confirm_password').value) {
        document.getElementById('error-confirm_password').textContent = 'Las contraseñas no coinciden.';
        document.getElementById('error-confirm_password').style.display = 'block';
        hayErrores = true;
    }

    // Login Password
    if(loginPassword.value.trim() === '' || loginPassword.value.length < 8) {
        document.getElementById('error-login-password').style.display = 'block';
        hayErrores = true;
    }

    if(!hayErrores) {
        // Si no hay errores, enviar el formulario
        formulario.submit();
    }
});
}
