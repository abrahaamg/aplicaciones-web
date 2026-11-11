// Cifras de la portada: se cuentan a partir de los datos, no se escriben a mano.

function mostrarCifras() {
    document.getElementById('cifra-docentes').textContent = DOCENTES.length;
    document.getElementById('cifra-aulas').textContent = AULAS.length;

    let cursos;
    try {
        cursos = cargarCursos();
    } catch {
        mostrarAlerta('No se han podido cargar los cursos. Recarga la página para intentarlo de nuevo.');
        return;
    }

    const abiertos = cursos.filter(function (curso) { return curso.estado === 'activo'; });
    const plazas = abiertos.reduce(function (total, curso) { return total + (Number(curso.plazas) || 0); }, 0);

    document.getElementById('cifra-cursos').textContent = abiertos.length;
    document.getElementById('cifra-plazas').textContent = plazas;
}

mostrarCifras();
