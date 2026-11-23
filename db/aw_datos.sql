-- Datos de prueba del grupo. Todos son inventados.
-- Se importa después de aw_practica.sql, sobre la base recién creada:
-- phpMyAdmin, base aw_practica, pestaña Importar.
-- Todos los usuarios tienen la contraseña Admin1234, guardada con hash de bcryptjs.

USE aw_practica;

-- 1. USUARIOS
INSERT INTO usuarios (id_usuario, nombre, email, password, rol, activo) VALUES
    (1, 'Admin Centro', 'admin@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'admin', TRUE),
    (2, 'Ana López Martín', 'alumno@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (3, 'Carlos Ruiz Sanz', 'carlos.ruiz@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (4, 'Lucía Fernández Gil', 'lucia.fernandez@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (5, 'Javier Moreno Díaz', 'javier.moreno@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (6, 'Sara Navarro Rey', 'sara.navarro@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (7, 'Pablo Ortega Vela', 'pablo.ortega@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', FALSE);

-- 2. DOCENTES
INSERT INTO docentes (id_docente, nombre, email, especialidad, telefono, foto, activo) VALUES
    (1, 'Laura Gómez Ruiz', 'laura.gomez@example.com', 'Programación', '910000001', NULL, TRUE),
    (2, 'Marcos Peña Soler', 'marcos.pena@example.com', 'Diseño web', '910000002', NULL, TRUE),
    (3, 'Elena Vidal Mora', 'elena.vidal@example.com', 'Bases de datos', '910000003', NULL, TRUE),
    (4, 'David Romero Gil', 'david.romero@example.com', 'Ciberseguridad', NULL, NULL, TRUE),
    (5, 'Marta Serrano Ibáñez', 'marta.serrano@example.com', 'Inteligencia artificial', '910000005', NULL, TRUE),
    (6, 'Jorge Castillo León', 'jorge.castillo@example.com', 'Ofimática', NULL, NULL, FALSE);

-- 3. AULAS
INSERT INTO aulas (id_aula, nombre, edificio, planta, capacidad, equipamiento, estado) VALUES
    (1, 'Aula 1', 'Principal', 'Baja', 25, 'Proyector', 'activa'),
    (2, 'Aula 2', 'Principal', 'Primera', 30, 'Proyector y pizarra digital', 'activa'),
    (3, 'Laboratorio', 'Anexo', 'Baja', 15, 'Ordenadores', 'activa'),
    (4, 'Aula Magna', 'Principal', 'Segunda', 60, 'Proyector, micrófonos y altavoces', 'activa'),
    (5, 'Aula 3', 'Anexo', 'Primera', 20, 'Pizarra', 'inactiva');

-- 4. CURSOS
INSERT INTO cursos (id_curso, id_docente, id_aula, nombre, descripcion, fecha_inicio, fecha_fin, horario, plazas, imagen, estado) VALUES
    (1, 1, 2, 'Introducción a la programación', 'Primeros pasos con variables, condiciones y bucles.', '2026-11-16', '2026-12-18', 'Lunes y miércoles, 16:00 a 18:00', 20, NULL, 'activo'),
    (2, 2, 1, 'Diseño web con Bootstrap', 'Páginas que se adaptan al móvil con rejilla, tarjetas y formularios.', '2026-11-17', '2026-12-15', 'Martes y jueves, 10:00 a 12:00', 15, NULL, 'activo'),
    (3, 3, 3, 'Bases de datos con MariaDB', 'Tablas, relaciones y consultas SQL desde cero.', '2027-01-11', '2027-02-12', 'Viernes, 09:00 a 13:00', 12, NULL, 'inactivo'),
    (4, 1, 3, 'JavaScript desde cero', 'El lenguaje de la web: funciones, arrays, objetos y eventos.', '2026-12-01', '2027-01-29', 'Lunes y miércoles, 18:00 a 20:00', 15, NULL, 'activo'),
    (5, 1, 3, 'Node.js y Express', 'Servidores web con rutas, formularios y conexión a una base de datos.', '2027-02-01', '2027-03-19', 'Martes y jueves, 18:00 a 20:00', 3, NULL, 'activo'),
    (6, 4, 4, 'Ciberseguridad básica', 'Contraseñas, copias de seguridad y cómo detectar fraudes por correo.', '2027-01-18', '2027-02-26', 'Miércoles, 10:00 a 13:00', 40, NULL, 'activo'),
    (7, 5, 2, 'Python para análisis de datos', 'Leer, limpiar y representar datos con Python.', '2027-02-08', '2027-04-02', 'Lunes, 16:00 a 19:00', 25, NULL, 'activo'),
    (8, 5, 4, 'Introducción a la inteligencia artificial', 'Qué es un modelo, cómo aprende y para qué se usa.', '2027-03-01', '2027-04-30', 'Jueves, 16:00 a 19:00', 50, NULL, 'activo'),
    (9, 2, 1, 'Accesibilidad web', 'Páginas que se pueden usar con teclado, lector de pantalla y alto contraste.', '2026-10-05', '2026-10-30', 'Viernes, 10:00 a 13:00', 20, NULL, 'inactivo'),
    (10, 3, 2, 'SQL avanzado', 'Subconsultas, agrupaciones y vistas.', '2027-04-05', '2027-05-14', 'Martes, 09:00 a 12:00', 20, NULL, 'activo');

-- 5. MATRICULAS
INSERT INTO matriculas (id_matricula, id_usuario, id_curso, fecha_matricula, estado) VALUES
    (1, 2, 1, '2026-11-02 10:15:00', 'activa'),
    (2, 2, 4, '2026-11-10 18:40:00', 'activa'),
    (3, 2, 9, '2026-09-20 12:00:00', 'cancelada'),
    (4, 3, 1, '2026-11-03 09:30:00', 'activa'),
    (5, 3, 5, '2026-11-12 17:05:00', 'activa'),
    (6, 3, 9, '2026-09-21 11:20:00', 'activa'),
    (7, 4, 2, '2026-11-04 16:45:00', 'activa'),
    (8, 4, 5, '2026-11-13 10:10:00', 'activa'),
    (9, 5, 5, '2026-11-14 20:30:00', 'activa'),
    (10, 5, 6, '2026-11-15 13:00:00', 'activa'),
    (11, 6, 1, '2026-11-05 08:50:00', 'cancelada'),
    (12, 6, 7, '2026-11-16 19:25:00', 'activa'),
    (13, 7, 2, '2026-11-01 12:35:00', 'activa');
