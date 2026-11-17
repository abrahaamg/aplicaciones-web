# Centro de Formación

Práctica obligatoria de Aplicaciones Web, curso 2026/27. Plataforma web para gestionar los cursos, docentes, aulas y matrículas de un centro de formación.

**Stack:** HTML5, CSS3, JavaScript, Bootstrap 5.1.3 y Bootstrap Icons · Node.js + Express + EJS · MariaDB (XAMPP).

Las normas de trabajo del equipo están en [docs/DIRECTRICES.md](docs/DIRECTRICES.md).

## Estructura del proyecto

```
aplicaciones-web/
├── index.js           servidor (Node.js + Express)
├── listar-cursos.js   script de Node que lista los cursos en la terminal
├── config/database.js conexión a MariaDB, la usa todo el servidor
├── db/                script SQL que crea las tablas y cargar-datos.js (npm run datos)
├── data/              datos de prueba en JSON, uno por tabla
├── public/            lo que se manda al navegador: HTML, CSS, JS e imágenes
├── docs/              normas del equipo y notas de los laboratorios
├── package.json       nombre del proyecto, librerías y comandos (npm start, npm run datos, npm run cursos)
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
3. Con MySQL arrancado en XAMPP, crear la base de datos importando `db/aw_practica.sql` desde phpMyAdmin (pestaña Importar). El script borra la base `aw_practica` si ya existe, así que sirve también para empezar de cero. Si MariaDB no usa `root` sin contraseña, se cambia con las variables `DB_USER` y `DB_PASSWORD`.
4. Cargar los datos: `npm run datos`. Vacía las tablas y las rellena con `data/usuarios.json`, `docentes.json`, `aulas.json`, `cursos.json` y `matriculas.json`. Cada JSON es una lista de objetos con las claves iguales a las columnas de su tabla. Para usar otros datos basta con cambiar esos ficheros, sin tocar código. Si algo falla, no se carga nada y las tablas se quedan como estaban.
5. Arrancar el servidor: `npm start` (o `npm run dev` para que se reinicie solo al guardar).
6. Abrir http://localhost:3000
7. Para ver los cursos en la terminal, sin servidor ni navegador: `npm run cursos`

### Usuarios de prueba

Los carga `npm run datos` desde `data/usuarios.json`, junto con más alumnos, docentes, aulas, cursos y matrículas inventados. Todos tienen la contraseña `Admin1234`.

| Rol | Correo |
|---|---|
| Administración | `admin@example.com` |
| Alumno | `alumno@example.com` |
