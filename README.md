# Centro de Formación

Práctica obligatoria de Aplicaciones Web, curso 2026/27. Plataforma web para gestionar los cursos, docentes, aulas y matrículas de un centro de formación.

**Stack:** HTML5, CSS3, JavaScript, Bootstrap 5.1.3 y Bootstrap Icons · Node.js + Express + EJS · MariaDB (XAMPP).

Las normas de trabajo del equipo están en [docs/DIRECTRICES.md](docs/DIRECTRICES.md).

## Estructura del proyecto

```
aplicaciones-web/
├── index.js           servidor (Node.js + Express)
├── listar-cursos.js   script de Node que lista los cursos en la terminal
├── data/              datos que usa el servidor (cursos.json)
├── public/            lo que se manda al navegador: HTML, CSS, JS e imágenes
├── docs/              normas del equipo y notas de los laboratorios
├── package.json       nombre del proyecto, librerías y comandos (npm start, npm run cursos)
└── package-lock.json  versión exacta de cada librería instalada
```

Sigue la plantilla del profe (`recurso-bootstrap`): el código del servidor va en la raíz y en `data/`, y el del navegador en `public/`.

## Manual de instalación

### Requisitos

- Node.js 18 o superior
- XAMPP con MariaDB arrancado

### Pasos

1. Clonar el repositorio y entrar en la carpeta.
2. Instalar dependencias: `npm install`
3. Crear la base de datos importando `db/aw_practica.sql` desde phpMyAdmin *(cuando esté disponible)*.
4. Arrancar el servidor: `npm start` (o `npm run dev` para que se reinicie solo al guardar).
5. Abrir http://localhost:3000
6. Para ver los cursos en la terminal, sin servidor ni navegador: `npm run cursos`

### Usuarios de prueba

*(Pendiente: se añadirán cuando exista la base de datos.)*
