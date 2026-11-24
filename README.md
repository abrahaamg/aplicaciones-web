# Centro de Formación

Práctica obligatoria de Aplicaciones Web, curso 2026/27. Plataforma web para gestionar los cursos, docentes, aulas y matrículas de un centro de formación.

**Stack:** HTML5, CSS3, JavaScript, Bootstrap 5.1.3 y Bootstrap Icons · Node.js + Express · MariaDB (XAMPP).

Las normas de trabajo del equipo están en [docs/DIRECTRICES.md](docs/DIRECTRICES.md).

## Estructura del proyecto

```
aplicaciones-web/
├── index.js           servidor (Node.js + Express)
├── config/database.js conexión a MariaDB, la usa todo el servidor
├── .env.example       datos de conexión a MariaDB; se copia como .env
├── db/                aw_practica.sql (tablas, script oficial del profe) y aw_datos.sql (datos de prueba)
├── public/            lo que se manda al navegador: HTML, CSS, JS e imágenes
├── docs/              normas del equipo y notas de los laboratorios
├── package.json       nombre del proyecto, librerías y comandos (npm start, npm run dev)
└── package-lock.json  versión exacta de cada librería instalada
```

Sigue la plantilla del profe (`recurso-bootstrap`): el código del servidor va en la raíz, y el del navegador en `public/`.

## Manual de instalación

### Requisitos

- Node.js 20.6 o superior (para leer el fichero `.env`)
- XAMPP con MariaDB arrancado

### Pasos

1. Clonar el repositorio y entrar en la carpeta.
2. Instalar dependencias: `npm install`
3. Copiar `.env.example` como `.env`. Lleva los datos de conexión a MariaDB (los de XAMPP: `root` sin contraseña). Si tu MariaDB usa otros, se cambian ahí. El `.env` no se sube a GitHub.
4. Con MySQL arrancado en XAMPP, importar en phpMyAdmin (pestaña Importar), en este orden:
   1. `db/aw_practica.sql`: el script oficial del profe. Crea la base `aw_practica` y sus tablas. No se modifica.
   2. `db/aw_datos.sql`: nuestros datos de prueba.

   Para empezar de cero, se borra la base `aw_practica` en phpMyAdmin y se vuelven a importar los dos.
5. Arrancar el servidor: `npm start` (o `npm run dev` para que se reinicie solo al guardar).
6. Abrir http://localhost:3000

### Usuarios de prueba

Los carga `db/aw_datos.sql`, el fichero de datos oficial del profe, junto con 12 docentes, 8 aulas, 8 cursos y 20 matrículas. Todos los usuarios tienen la contraseña `Aula2026!`.

| Rol | Correo |
|---|---|
| Administración | `laura.mendez@cforma.test` |
| Alumno | `daniel.ruiz@cforma.test` |
