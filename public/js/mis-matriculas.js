// Mis matrículas: solo con sesión. Las matrículas llegan con el backend (microhito 3);
// mientras tanto se avisa de que no hay ninguna y se enlaza al catálogo.

if (exigirSesion()) {
    const aviso = document.createElement('p');
    aviso.className = 'alert alert-info';
    aviso.append('Todavía no tienes matrículas. ');

    const enlace = document.createElement('a');
    enlace.href = 'cursos.html';
    enlace.textContent = 'Ver los cursos';
    aviso.appendChild(enlace);

    document.getElementById('lista-matriculas').appendChild(aviso);
}
