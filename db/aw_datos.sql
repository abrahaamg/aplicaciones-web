-- Datos de prueba del grupo. Todos son inventados.
-- Se importa después de aw_practica.sql, sobre la base recién creada:
-- phpMyAdmin, base aw_practica, pestaña Importar.
-- Todos los usuarios tienen la contraseña Admin1234, guardada con hash de bcryptjs.
-- Hay tantos docentes, alumnos, aulas y cursos como imágenes en public/img/ (12, 12, 8 y 8).
-- docentes.foto y cursos.imagen guardan la ruta de la imagen dentro de public/.

USE aw_practica;

-- 1. USUARIOS (1 administrador y 12 alumnos; el último está desactivado)
INSERT INTO usuarios (id_usuario, nombre, email, password, rol, activo) VALUES
    (1, 'Admin Centro', 'admin@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'admin', TRUE),
    (2, 'Hugo Martín Díaz', 'alumno@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (3, 'Paula Sánchez Romero', 'paula.sanchez@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (4, 'Diego Ramírez Torres', 'diego.ramirez@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (5, 'Claudia Morales Vega', 'claudia.morales@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (6, 'Sofía Castro Núñez', 'sofia.castro@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (7, 'Mario Gil Herrera', 'mario.gil@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (8, 'Irene Domínguez Peña', 'irene.dominguez@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (9, 'Adrián Vázquez Ruiz', 'adrian.vazquez@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (10, 'Álvaro Reyes Molina', 'alvaro.reyes@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (11, 'Lucía Fernández Gil', 'lucia.fernandez@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (12, 'Daniel Ortiz Blanco', 'daniel.ortiz@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', TRUE),
    (13, 'Carla Jiménez Rubio', 'carla.jimenez@example.com', '$2b$10$Y7OAsfQS7Xta2AWsQn34hehxjTfSZoDBk0opsIQVqS78BzVfIXDvO', 'alumno', FALSE);

-- 2. DOCENTES (uno por foto; el 10 está desactivado)
INSERT INTO docentes (id_docente, nombre, email, especialidad, telefono, foto, activo) VALUES
    (1, 'Javier Ortega Ruiz', 'javier.ortega@example.com', 'Desarrollo web', '910000001', 'img/docentes/docente_01.png', TRUE),
    (2, 'Laura Gómez Prieto', 'laura.gomez@example.com', 'Bases de datos', '910000002', 'img/docentes/docente_02.png', TRUE),
    (3, 'Antonio Delgado Mora', 'antonio.delgado@example.com', 'Ofimática', NULL, 'img/docentes/docente_03.png', TRUE),
    (4, 'Elena Vidal Campos', 'elena.vidal@example.com', 'Diseño gráfico', '910000004', 'img/docentes/docente_04.png', TRUE),
    (5, 'Carmen Molina Herrero', 'carmen.molina@example.com', 'Análisis de datos', '910000005', 'img/docentes/docente_05.png', TRUE),
    (6, 'Daniel Romero Gil', 'daniel.romero@example.com', 'Ciberseguridad', NULL, 'img/docentes/docente_06.png', TRUE),
    (7, 'Marta Serrano Ibáñez', 'marta.serrano@example.com', 'Inteligencia artificial', '910000007', 'img/docentes/docente_07.png', TRUE),
    (8, 'Andrés Navarro Soto', 'andres.navarro@example.com', 'Programación', '910000008', 'img/docentes/docente_08.png', TRUE),
    (9, 'Lucía Herrera Campos', 'lucia.herrera@example.com', 'Marketing digital', '910000009', 'img/docentes/docente_09.png', TRUE),
    (10, 'José Luis Castillo León', 'joseluis.castillo@example.com', 'Redes y sistemas', NULL, 'img/docentes/docente_10.png', FALSE),
    (11, 'Raquel Fuentes Vega', 'raquel.fuentes@example.com', 'Accesibilidad web', '910000011', 'img/docentes/docente_11.png', TRUE),
    (12, 'Sergio Cano Medina', 'sergio.cano@example.com', 'Bases de datos', '910000012', 'img/docentes/docente_12.png', TRUE);

-- 3. AULAS (una por foto de img/aulas/, en el mismo orden; la sala de estudio está inactiva)
INSERT INTO aulas (id_aula, nombre, edificio, planta, capacidad, equipamiento, estado) VALUES
    (1, 'Aula 1.01', 'Principal', 'Primera', 30, 'Pantalla interactiva y pizarra blanca', 'activa'),
    (2, 'Laboratorio de informática', 'Principal', 'Baja', 24, '24 ordenadores y proyector', 'activa'),
    (3, 'Sala de seminarios', 'Anexo', 'Primera', 20, 'Proyector, rotafolio y sillas con pala', 'activa'),
    (4, 'Taller', 'Anexo', 'Baja', 12, 'Banco de trabajo y herramientas', 'activa'),
    (5, 'Aula colaborativa', 'Principal', 'Segunda', 28, 'Mesas en grupo y pantalla interactiva', 'activa'),
    (6, 'Salón de actos', 'Principal', 'Baja', 80, 'Proyector, micrófonos y atril', 'activa'),
    (7, 'Sala de estudio', 'Biblioteca', 'Primera', 16, 'Estanterías y mesas individuales', 'inactiva'),
    (8, 'Laboratorio de ciencias', 'Anexo', 'Segunda', 14, 'Microscopios y material de laboratorio', 'activa');

-- 4. CURSOS (uno por imagen; el 2 tiene 3 plazas y está lleno, el 7 y el 8 están inactivos)
INSERT INTO cursos (id_curso, id_docente, id_aula, nombre, descripcion, fecha_inicio, fecha_fin, horario, plazas, imagen, estado) VALUES
    (1, 1, 2, 'Desarrollo web con HTML, CSS y JavaScript', 'Páginas que se adaptan al móvil, con estilos propios y algo de interacción.', '2026-12-01', '2027-01-29', 'Lunes y miércoles, 16:00 a 18:00', 20, 'img/cursos/curso_01.png', 'activo'),
    (2, 2, 2, 'Bases de datos con MariaDB', 'Tablas, relaciones y consultas SQL desde cero.', '2027-01-11', '2027-02-12', 'Viernes, 09:00 a 13:00', 3, 'img/cursos/curso_02.png', 'activo'),
    (3, 6, 6, 'Ciberseguridad básica', 'Contraseñas, copias de seguridad y cómo detectar fraudes por correo.', '2027-01-18', '2027-02-26', 'Miércoles, 10:00 a 13:00', 60, 'img/cursos/curso_03.png', 'activo'),
    (4, 5, 5, 'Análisis de datos con Python', 'Leer, limpiar y representar datos en gráficos.', '2027-02-08', '2027-04-02', 'Lunes, 16:00 a 19:00', 25, 'img/cursos/curso_04.png', 'activo'),
    (5, 7, 1, 'Introducción a la inteligencia artificial', 'Qué es un modelo, cómo aprende y para qué se usa.', '2027-03-01', '2027-04-30', 'Jueves, 16:00 a 19:00', 30, 'img/cursos/curso_05.png', 'activo'),
    (6, 9, 3, 'Marketing digital y redes sociales', 'Campañas, contenidos y cómo medir sus resultados.', '2027-02-15', '2027-03-26', 'Martes y jueves, 10:00 a 12:00', 20, 'img/cursos/curso_06.png', 'activo'),
    (7, 4, 5, 'Diseño gráfico digital', 'Color, tipografía y composición con herramientas digitales.', '2026-09-14', '2026-10-30', 'Martes, 16:00 a 19:00', 20, 'img/cursos/curso_07.png', 'inactivo'),
    (8, 3, 7, 'Ofimática para el día a día', 'Documentos, hojas de cálculo y presentaciones.', '2027-04-05', '2027-05-14', 'Miércoles, 18:00 a 20:00', 16, 'img/cursos/curso_08.png', 'inactivo');

-- 5. MATRICULAS
INSERT INTO matriculas (id_matricula, id_usuario, id_curso, fecha_matricula, estado) VALUES
    (1, 2, 1, '2026-11-02 10:15:00', 'activa'),
    (2, 2, 2, '2026-11-10 18:40:00', 'activa'),
    (3, 2, 7, '2026-09-01 12:00:00', 'cancelada'),
    (4, 3, 2, '2026-11-11 09:30:00', 'activa'),
    (5, 4, 2, '2026-11-12 17:05:00', 'activa'),
    (6, 5, 2, '2026-11-09 16:45:00', 'cancelada'),
    (7, 3, 1, '2026-11-03 10:10:00', 'activa'),
    (8, 5, 3, '2026-11-14 20:30:00', 'activa'),
    (9, 6, 4, '2026-11-15 13:00:00', 'activa'),
    (10, 7, 5, '2026-11-16 19:25:00', 'activa'),
    (11, 8, 6, '2026-11-17 11:20:00', 'activa'),
    (12, 9, 1, '2026-11-05 08:50:00', 'cancelada'),
    (13, 10, 3, '2026-11-18 12:35:00', 'activa'),
    (14, 11, 7, '2026-09-10 09:00:00', 'activa'),
    (15, 12, 5, '2026-11-19 17:40:00', 'activa'),
    (16, 13, 1, '2026-11-01 12:35:00', 'activa');
