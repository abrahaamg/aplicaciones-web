// Perfil: solo con sesión. Enseña los datos de quien ha iniciado sesión.

if (exigirSesion()) {
    const sesion = leerSesion();
    const datosPerfil = document.getElementById('datos-perfil');

    [
        ['Nombre', sesion.nombre || '-'],
        ['Correo', sesion.correo || '-'],
        ['Tipo de cuenta', sesion.rol === 'admin' ? 'Administración' : 'Alumno']
    ].forEach(function ([etiqueta, valor]) {
        const termino = document.createElement('dt');
        termino.className = 'col-sm-3';
        termino.textContent = etiqueta;

        const descripcion = document.createElement('dd');
        descripcion.className = 'col-sm-9';
        descripcion.textContent = valor;

        datosPerfil.append(termino, descripcion);
    });
}
