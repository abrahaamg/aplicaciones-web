// Panel del modo desarrollo: atajos para probar sin pasar por los formularios.
// Solo se carga si el modo está encendido (ver cargarModoDev en js/components.js).

const ATAJOS_DEV = [
    ['Entrar como admin', function () {
        iniciarSesion({ correo: 'admin@example.com', nombre: 'Administración', rol: 'admin' });
    }],
    ['Entrar como alumno', function () {
        iniciarSesion({ correo: 'alumno@example.com', nombre: 'Alumno de prueba', rol: 'alumno' });
    }],
    ['Cerrar sesión', function () {
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
        boton.addEventListener('click', function () {
            accion();
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
