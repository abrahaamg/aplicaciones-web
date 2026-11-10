// Campo de horario de un curso: casillas con los días y dos horas.
// Se guarda como texto, igual que los cursos provisionales: 'Lunes y miércoles, 16:00 a 18:00'.

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// De 'Lunes y miércoles, 16:00 a 18:00' a { dias, inicio, fin }
function partirHorario(texto) {
    const partes = /^(.+), (\d{2}:\d{2}) a (\d{2}:\d{2})$/.exec(texto || '');
    if (!partes) return { dias: [], inicio: '', fin: '' };
    return { dias: partes[1].split(/, | y /), inicio: partes[2], fin: partes[3] };
}

// De { dias, inicio, fin } a 'Lunes y miércoles, 16:00 a 18:00'
function textoHorario(horario) {
    const dias = horario.dias.map(function (dia, i) {
        return i === 0 ? dia : dia.toLowerCase();
    });
    const lista = dias.length > 1
        ? dias.slice(0, -1).join(', ') + ' y ' + dias[dias.length - 1]
        : dias[0];
    return lista + ', ' + horario.inicio + ' a ' + horario.fin;
}

// El horario es válido con al menos un día y la hora de fin después de la de inicio
function horarioValido(horario) {
    return horario.dias.length > 0 && horario.inicio !== '' && horario.fin > horario.inicio;
}

// Una casilla para un día, marcada si ya estaba en el horario
function crearCasillaDia(prefijo, dia, diasMarcados) {
    const id = prefijo + '-' + dia.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    const caja = document.createElement('div');
    caja.className = 'form-check form-check-inline';

    const casilla = document.createElement('input');
    casilla.type = 'checkbox';
    casilla.className = 'form-check-input';
    casilla.id = id;
    casilla.value = dia;
    casilla.checked = diasMarcados.some(d => d.toLowerCase() === dia.toLowerCase());

    const etiqueta = document.createElement('label');
    etiqueta.className = 'form-check-label';
    etiqueta.htmlFor = id;
    etiqueta.textContent = dia;

    caja.append(casilla, etiqueta);
    return caja;
}

// Una hora con su etiqueta, en media fila
function crearCampoHora(id, texto, valor) {
    const columna = document.createElement('div');
    columna.className = 'col-6';

    const etiqueta = document.createElement('label');
    etiqueta.className = 'form-label';
    etiqueta.htmlFor = id;
    etiqueta.textContent = texto;

    const hora = document.createElement('input');
    hora.type = 'time';
    hora.className = 'form-control';
    hora.id = id;
    hora.value = valor;

    columna.append(etiqueta, hora);
    return columna;
}

// Crea el grupo entero. "campo" es el envoltorio que se marca en rojo si no es válido.
function crearCampoHorario(prefijo, horario) {
    const actual = partirHorario(horario);

    const grupo = document.createElement('fieldset');
    grupo.className = 'mb-3';

    const leyenda = document.createElement('legend');
    leyenda.className = 'form-label fs-6 mb-1';
    leyenda.textContent = 'Horario';

    const campo = document.createElement('div');
    DIAS.forEach(function (dia) {
        campo.appendChild(crearCasillaDia(prefijo, dia, actual.dias));
    });

    const horas = document.createElement('div');
    horas.className = 'row g-2 mt-1';
    horas.append(
        crearCampoHora(prefijo + '-inicio', 'Desde', actual.inicio),
        crearCampoHora(prefijo + '-fin', 'Hasta', actual.fin)
    );
    campo.appendChild(horas);

    const error = document.createElement('div');
    error.className = 'invalid-feedback';
    error.textContent = 'Marca al menos un día y una hora de fin posterior a la de inicio.';

    grupo.append(leyenda, campo, error);

    return { contenedor: grupo, campo };
}

// Lee lo marcado en un campo de horario
function leerHorario(campo) {
    const horas = campo.querySelectorAll('input[type="time"]');
    return {
        dias: Array.from(campo.querySelectorAll('input[type="checkbox"]:checked')).map(c => c.value),
        inicio: horas[0].value,
        fin: horas[1].value
    };
}
