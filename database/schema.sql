-- ========================================================
-- DIGESTO UNSL - ESQUEMA DE BASE DE DATOS (PostgreSQL 18)
-- Crea la base, los tipos ENUM, las tablas, las relaciones y los índices. Datos: seed.sql
-- Ejecutar con: psql -U postgres -f database/schema.sql
-- ========================================================

-- Comillas dobles porque el nombre tiene mayúsculas
CREATE DATABASE "DigestoUNSL";

-- Conectarse a la base recién creada (comando de psql)
\c "DigestoUNSL"

-- Los archivos están en UTF-8 (psql en Windows usa otra codificación si no se aclara)
SET client_encoding = 'UTF8';

-- --------------------------------------------------------
-- 1. TIPOS ENUM
-- --------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE ciudad AS ENUM ('San Luis', 'Villa Mercedes', 'Merlo');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ambito AS ENUM ('universidad', 'facultad', 'escuela');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE modulo AS ENUM ('documentos', 'concursos');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE resultado_solicitud AS ENUM ('restablecida', 'rechazada');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- En plural, como los publica el feed. Los últimos valores de cada uno son históricos:
-- quedan para los llamados viejos y el formulario del panel no los ofrece.
DO $$ BEGIN
    CREATE TYPE cargo AS ENUM (
        'Profesores Titulares',
        'Profesores Asociados',
        'Profesores Adjuntos',
        'Jefes de Trabajos Practicos',
        'Auxiliares de Primera',
        'Auxiliares de Segunda',
        'Agregados Ad-Honorem Alumnos',
        'Agregados Ad-Honorem Diplomados',
        'Varios'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE dedicacion AS ENUM ('Exclusivos', 'Semiexclusivos', 'Simples', 'Completos', 'Varias');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE caracter AS ENUM (
        'Efectivos',
        'Interinos',
        'Suplentes',
        'Temporarios',
        'Reemplazantes',
        'Contratados',
        'Varios'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------
-- 2. CATÁLOGOS Y USUARIOS
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS dependencia (
    id SERIAL PRIMARY KEY,
    numero INT UNIQUE,
    codigo VARCHAR(10) UNIQUE,
    sigla VARCHAR(20) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    ubicacion ciudad,
    es_facultad BOOLEAN NOT NULL DEFAULT false,
    historica BOOLEAN NOT NULL DEFAULT false,
    fecha_baja TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipo_documento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    fecha_baja TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organo_emisor (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    fecha_baja TIMESTAMP
);

CREATE TABLE IF NOT EXISTS codificacion (
    prefijo VARCHAR(10) PRIMARY KEY,
    id_tipo INT NOT NULL,
    id_organo INT,
    ambito ambito,
    fecha_baja TIMESTAMP,
    CONSTRAINT fk_codificacion_tipo FOREIGN KEY (id_tipo) REFERENCES tipo_documento(id),
    CONSTRAINT fk_codificacion_organo FOREIGN KEY (id_organo) REFERENCES organo_emisor(id)
);

CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(30),
    dni VARCHAR(8),
    password_hash VARCHAR(255) NOT NULL,
    es_admin BOOLEAN NOT NULL DEFAULT false,
    fecha_alta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_baja TIMESTAMP
);

CREATE TABLE IF NOT EXISTS solicitud_restablecimiento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    dni VARCHAR(8) NOT NULL,
    fecha_solicitud TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resultado resultado_solicitud,
    fecha_baja TIMESTAMP,
    id_usuario_baja INT,
    CONSTRAINT fk_solicitud_user_baja FOREIGN KEY (id_usuario_baja) REFERENCES usuario(id),
    CONSTRAINT ck_solicitud_resultado CHECK ((fecha_baja IS NULL) = (resultado IS NULL))
);

CREATE TABLE IF NOT EXISTS permiso (
    id_usuario INT NOT NULL,
    id_dependencia INT NOT NULL,
    modulo modulo NOT NULL,
    fecha_baja TIMESTAMP,
    PRIMARY KEY (id_usuario, id_dependencia, modulo),
    CONSTRAINT fk_permiso_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    CONSTRAINT fk_permiso_dependencia FOREIGN KEY (id_dependencia) REFERENCES dependencia(id)
);

-- --------------------------------------------------------
-- 3. DOCUMENTOS
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS documento (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,
    prefijo VARCHAR(10) NOT NULL,
    id_dependencia_origen INT NOT NULL,
    numero VARCHAR(10) NOT NULL,
    anio SMALLINT NOT NULL,
    id_dependencia_emisora INT NOT NULL,
    fecha_emision DATE,
    descripcion TEXT,
    archivo_ruta VARCHAR(255),
    url_externa VARCHAR(255),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario_alta INT,
    fecha_modificacion TIMESTAMP,
    id_usuario_modificacion INT,
    fecha_baja TIMESTAMP,
    id_usuario_baja INT,
    CONSTRAINT fk_doc_prefijo FOREIGN KEY (prefijo) REFERENCES codificacion(prefijo),
    CONSTRAINT fk_doc_dep_origen FOREIGN KEY (id_dependencia_origen) REFERENCES dependencia(id),
    CONSTRAINT fk_doc_dep_emisora FOREIGN KEY (id_dependencia_emisora) REFERENCES dependencia(id),
    CONSTRAINT fk_doc_user_alta FOREIGN KEY (id_usuario_alta) REFERENCES usuario(id),
    CONSTRAINT fk_doc_user_mod FOREIGN KEY (id_usuario_modificacion) REFERENCES usuario(id),
    CONSTRAINT fk_doc_user_baja FOREIGN KEY (id_usuario_baja) REFERENCES usuario(id)
);

-- --------------------------------------------------------
-- 4. CONCURSOS DOCENTES
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS departamento (
    id SERIAL PRIMARY KEY,
    id_dependencia INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    fecha_baja TIMESTAMP,
    CONSTRAINT uq_departamento UNIQUE (id_dependencia, nombre),
    CONSTRAINT fk_departamento_dependencia FOREIGN KEY (id_dependencia) REFERENCES dependencia(id)
);

CREATE TABLE IF NOT EXISTS area (
    id SERIAL PRIMARY KEY,
    id_departamento INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    fecha_baja TIMESTAMP,
    CONSTRAINT uq_area UNIQUE (id_departamento, nombre),
    CONSTRAINT fk_area_departamento FOREIGN KEY (id_departamento) REFERENCES departamento(id)
);

CREATE TABLE IF NOT EXISTS llamado_concurso (
    id SERIAL PRIMARY KEY,
    id_documento INT NOT NULL,
    id_area INT NOT NULL,
    cargo cargo NOT NULL,
    dedicacion dedicacion,
    caracter caracter NOT NULL,
    inscripcion_desde DATE NOT NULL,
    inscripcion_hasta DATE NOT NULL,
    fecha_baja TIMESTAMP,
    id_usuario_baja INT,
    -- No duplicar al releer el feed (la dedicación puede venir vacía)
    CONSTRAINT uq_llamado UNIQUE NULLS NOT DISTINCT
        (id_documento, id_area, cargo, dedicacion, caracter, inscripcion_desde),
    CONSTRAINT fk_concurso_documento FOREIGN KEY (id_documento) REFERENCES documento(id),
    CONSTRAINT fk_concurso_area FOREIGN KEY (id_area) REFERENCES area(id),
    CONSTRAINT fk_concurso_user_baja FOREIGN KEY (id_usuario_baja) REFERENCES usuario(id)
);

-- --------------------------------------------------------
-- 5. PLANES DE ESTUDIO Y CARRERAS
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS carrera (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    fecha_baja TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carrera_dependencia (
    id_carrera INT NOT NULL,
    id_dependencia INT NOT NULL,
    fecha_baja TIMESTAMP,
    PRIMARY KEY (id_carrera, id_dependencia),
    CONSTRAINT fk_cardep_carrera FOREIGN KEY (id_carrera) REFERENCES carrera(id),
    CONSTRAINT fk_cardep_dependencia FOREIGN KEY (id_dependencia) REFERENCES dependencia(id)
);

CREATE TABLE IF NOT EXISTS plan_estudio (
    id SERIAL PRIMARY KEY,
    id_carrera INT NOT NULL,
    plan VARCHAR(20) NOT NULL,
    ordenanza VARCHAR(50) NOT NULL,
    anios SMALLINT NOT NULL,
    url_oficial VARCHAR(500) NOT NULL,
    version_id INT NOT NULL,
    sincronizado_en TIMESTAMP NOT NULL,
    fecha_baja TIMESTAMP,
    CONSTRAINT uq_plan UNIQUE (id_carrera, plan),
    CONSTRAINT fk_plan_carrera FOREIGN KEY (id_carrera) REFERENCES carrera(id)
);

CREATE TABLE IF NOT EXISTS materia (
    id SERIAL PRIMARY KEY,
    id_plan INT NOT NULL,
    anio SMALLINT NOT NULL,
    orden SMALLINT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    periodo VARCHAR(50),
    fecha_baja TIMESTAMP,
    CONSTRAINT uq_materia UNIQUE (id_plan, anio, codigo),
    CONSTRAINT fk_materia_plan FOREIGN KEY (id_plan) REFERENCES plan_estudio(id)
);

-- --------------------------------------------------------
-- 6. ESTADÍSTICAS
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS termino_buscado (
    termino VARCHAR(200) PRIMARY KEY,
    busquedas INT NOT NULL DEFAULT 0
);

-- --------------------------------------------------------
-- 7. ÍNDICES
-- --------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_documento_fecha_emision ON documento(fecha_emision);
CREATE INDEX IF NOT EXISTS idx_documento_fecha_registro ON documento(fecha_registro);
CREATE INDEX IF NOT EXISTS idx_documento_prefijo_numero_anio ON documento(prefijo, numero, anio);
CREATE INDEX IF NOT EXISTS idx_llamado_inscripcion_hasta ON llamado_concurso(inscripcion_hasta);
CREATE INDEX IF NOT EXISTS idx_documento_anio_id ON documento(anio, id);
CREATE INDEX IF NOT EXISTS idx_documento_dependencia_emisora ON documento(id_dependencia_emisora);
CREATE INDEX IF NOT EXISTS idx_documento_dependencia_origen ON documento(id_dependencia_origen);
CREATE UNIQUE INDEX IF NOT EXISTS uq_solicitud_pendiente_email ON solicitud_restablecimiento (lower(email)) WHERE fecha_baja IS NULL;
