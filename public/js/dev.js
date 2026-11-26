// Panel del modo desarrollo: atajos para probar sin pasar por los formularios.
// Solo se carga si el modo está encendido (ver cargarModoDev en js/components.js).

// Entra de verdad con un usuario de db/aw_datos.sql (la contraseña de todos está en el README)
async function entrarComo(correo) {
    const respuesta = await pedirApi('/api/auth/login', {
        metodo: 'POST',
        datos: { correo, clave: 'Aula2026!' }
    });
    iniciarSesion(respuesta.usuario);
}

const ATAJOS_DEV = [
    ['Entrar como admin', function () {
        return entrarComo('laura.mendez@cforma.test');
    }],
    ['Entrar como alumno', function () {
        return entrarComo('daniel.ruiz@cforma.test');
    }],
    ['Cerrar sesión', async function () {
        await pedirApi('/api/auth/logout', { metodo: 'POST' });
        cerrarSesion();
    }],
    ['Apagar modo dev', function () {
        localStorage.removeItem('dev');
    }]
];

function crearPanelDev() {
    const panel = document.createElement('aside');
    panel.className = 'panel-dev card shadow';
    panel.setAttribute('aria-label', 'Modo desarrollo');

    const cuerpo = document.createElement('div');
    cuerpo.className = 'card-body p-2 d-grid gap-1';

    const titulo = document.createElement('p');
    titulo.className = 'small fw-bold mb-1';
    const sesion = leerSesion();
    titulo.textContent = 'DEV · ' + (sesion ? sesion.correo : 'sin sesión');
    cuerpo.appendChild(titulo);

    ATAJOS_DEV.forEach(function ([texto, accion]) {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'btn btn-sm btn-outline-secondary';
        boton.textContent = texto;
        // Recarga sin ?dev=1 en la dirección: si no, "Apagar modo dev" lo volvería a encender
        boton.addEventListener('click', async function () {
            try {
                await accion();
            } catch {
                return; // pedirApi ya ha enseñado el error
            }
            const direccion = new URL(location.href);
            direccion.searchParams.delete('dev');
            location.replace(direccion);
        });
        cuerpo.appendChild(boton);
    });

    panel.appendChild(cuerpo);
    document.body.appendChild(panel);
}

crearPanelDev();
