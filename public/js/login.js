
const form_login = document.getElementById('form-login');

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

if(form_login) {
    form_login.addEventListener('submit', function (event) {
        // Evita el envío del formulario por defecto
        event.preventDefault();

        // Limpiar mensajes de error
        document.getElementById('error-login-email').style.display = 'none';
        document.getElementById('error-login-password').style.display = 'none';

        let hayErrores = false;
        
        // Login Email
        if(loginEmail.value.trim() === '' || !loginEmail.checkValidity()) {
            document.getElementById('error-login-email').style.display = 'block';
            hayErrores = true;
        }

        // Login Password
        if(loginPassword.value.trim() === '' || loginPassword.value.length < 8) {
            document.getElementById('error-login-password').style.display = 'block';
            hayErrores = true;
        }

        if(!hayErrores) {
            // Si no hay errores, enviar el formulario
            form_login.submit();
        }
    });
}


