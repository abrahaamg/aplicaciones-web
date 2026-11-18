-- Base de datos del centro de formación.
-- Se importa desde phpMyAdmin (pestaña Importar) o con: mysql -u root < db/aw_practica.sql
-- Borra la base de datos si ya existe, así que sirve también para empezar de cero.
-- Solo crea las tablas vacías. Los datos se cargan después con: npm run datos

DROP DATABASE IF EXISTS aw_practica;
CREATE DATABASE aw_practica CHARACTER SET utf8mb4 COLLATE utf8mb4_spanish_ci;
USE aw_practica;

-- Alumnos y administradores. Las preferencias de accesibilidad usan los mismos
-- valores que js/comun.js: tema claro u oscuro, tamaño de letra y alto contraste.
CREATE TABLE usuarios (
    id_usuario   INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(50)  NOT NULL,
    apellidos    VARCHAR(100) NOT NULL,
    correo       VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    telefono     VARCHAR(20),
    rol          ENUM('alumno', 'admin') NOT NULL DEFAULT 'alumno',
    fecha_alta   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado       ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    tema         ENUM('claro', 'oscuro') NOT NULL DEFAULT 'claro',
    fuente       ENUM('normal', 'grande', 'muy-grande') NOT NULL DEFAULT 'normal',
    contraste    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE docentes (
    id_docente   INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(50)  NOT NULL,
    apellidos    VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    correo       VARCHAR(100) NOT NULL UNIQUE,
    telefono     VARCHAR(20),
    foto         VARCHAR(255),
    estado       ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo'
);

CREATE TABLE aulas (
    id_aula      INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(50) NOT NULL UNIQUE,
    edificio     VARCHAR(50),
    planta       VARCHAR(20),
    capacidad    INT NOT NULL,
    equipamiento VARCHAR(255),
    estado       ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    CONSTRAINT chk_aula_capacidad CHECK (capacidad > 0)
);

-- RESTRICT: la base de datos no deja borrar un docente o un aula que tenga cursos.
-- Las reglas más finas (reasignar los cursos, aula con curso activo) van en el servidor.
CREATE TABLE cursos (
    id_curso     INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL UNIQUE,
    descripcion  TEXT,
    id_docente   INT NOT NULL,
    id_aula      INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin    DATE NOT NULL,
    horario      VARCHAR(100),
    plazas       INT NOT NULL,
    imagen       VARCHAR(255),
    estado       ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    CONSTRAINT fk_curso_docente FOREIGN KEY (id_docente) REFERENCES docentes (id_docente) ON DELETE RESTRICT,
    CONSTRAINT fk_curso_aula FOREIGN KEY (id_aula) REFERENCES aulas (id_aula) ON DELETE RESTRICT,
    CONSTRAINT chk_curso_plazas CHECK (plazas > 0),
    CONSTRAINT chk_curso_fechas CHECK (fecha_fin >= fecha_inicio)
);

-- Cancelar no borra la fila: pasa a 'cancelada' y se queda en el historial.
-- matricula_activa vale 1 en las activas y NULL en las canceladas. Como un índice
-- UNIQUE admite varios NULL, un alumno solo puede tener una matrícula activa por curso,
-- pero sí puede volver a matricularse después de cancelar.
CREATE TABLE matriculas (
    id_matricula     INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario       INT NOT NULL,
    id_curso         INT NOT NULL,
    fecha_matricula  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado           ENUM('activa', 'cancelada') NOT NULL DEFAULT 'activa',
    matricula_activa TINYINT AS (IF(estado = 'activa', 1, NULL)) PERSISTENT,
    CONSTRAINT fk_matricula_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON DELETE RESTRICT,
    CONSTRAINT fk_matricula_curso FOREIGN KEY (id_curso) REFERENCES cursos (id_curso) ON DELETE RESTRICT,
    CONSTRAINT uq_matricula_activa UNIQUE (id_usuario, id_curso, matricula_activa)
);
