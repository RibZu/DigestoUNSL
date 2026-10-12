-- ========================================================
-- DIGESTO UNSL - SCRIPT COMPLETO DE BASE DE DATOS (PostgreSQL)
-- Genera: Tipos ENUM, Tablas, Relaciones, Índices y Datos Semilla
-- ========================================================

-- --------------------------------------------------------
-- 1. TIPOS ENUM PERSONALIZADOS
-- --------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE enum_ambito AS ENUM ('universidad', 'facultad', 'escuela');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enum_modulo AS ENUM ('concursos', 'normativas', 'planes');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enum_cargo AS ENUM (
        'Profesor Titular', 
        'Profesor Asociado', 
        'Profesor Adjunto', 
        'Jefe de Trabajos Prácticos', 
        'Auxiliar de Primera', 
        'Auxiliar de Segunda'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enum_dedicacion AS ENUM ('Exclusiva', 'Semiexclusiva', 'Simple');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enum_caracter AS ENUM ('Efectivo', 'Interino', 'Suplente');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------
-- 2. TABLAS BASE / CATÁLOGOS INSTITUCIONALES
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS dependencia (
    id SERIAL PRIMARY KEY,
    numero INT UNIQUE NOT NULL,
    codigo VARCHAR(20) UNIQUE,
    sigla VARCHAR(20),
    nombre VARCHAR(150) NOT NULL,
    ubicacion VARCHAR(100),
    es_facultad BOOLEAN DEFAULT true,
    historica BOOLEAN DEFAULT false,
    fecha_baja TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipo_documento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    fecha_baja TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organo_emisor (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) UNIQUE NOT NULL,
    fecha_baja TIMESTAMP
);

CREATE TABLE IF NOT EXISTS codificacion (
    prefijo VARCHAR(20) PRIMARY KEY,
    id_tipo INT NOT NULL,
    id_organo INT,
    ambito enum_ambito NOT NULL DEFAULT 'universidad',
    fecha_baja TIMESTAMP,
    CONSTRAINT fk_codificacion_tipo FOREIGN KEY (id_tipo) REFERENCES tipo_documento(id),
    CONSTRAINT fk_codificacion_organo FOREIGN KEY (id_organo) REFERENCES organo_emisor(id)
);

CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    es_admin BOOLEAN DEFAULT false,
    fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_baja TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permiso (
    id_usuario INT NOT NULL,
    id_dependencia INT NOT NULL,
    modulo enum_modulo NOT NULL,
    fecha_baja TIMESTAMP,
    PRIMARY KEY (id_usuario, id_dependencia, modulo),
    CONSTRAINT fk_permiso_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_permiso_dependencia FOREIGN KEY (id_dependencia) REFERENCES dependencia(id)
);

-- --------------------------------------------------------
-- 3. MÓDULO DIGESTO / DOCUMENTOS
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS documento (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    prefijo VARCHAR(20) NOT NULL,
    id_dependencia_origen INT NOT NULL,
    numero VARCHAR(20),
    anio SMALLINT,
    id_dependencia_emisora INT NOT NULL,
    fecha_emision DATE NOT NULL,
    descripcion TEXT NOT NULL,
    archivo_ruta VARCHAR(500),
    url_externa VARCHAR(500),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario_alta INT,
    fecha_modificacion TIMESTAMP,
    id_usuario_modificacion INT,
    fecha_baja TIMESTAMP,
    id_usuario_baja INT,
    CONSTRAINT fk_doc_prefijo FOREIGN KEY (prefijo) REFERENCES codificacion(prefijo),
    CONSTRAINT fk_doc_dep_origen FOREIGN KEY (id_dependencia_origen) REFERENCES dependencia(id),
    CONSTRAINT fk_doc_dep_emisora FOREIGN KEY (id_dependencia_emisora) REFERENCES dependencia(id),
    CONSTRAINT fk_doc_user_alta FOREIGN KEY (id_usuario_alta) REFERENCES usuario(id) ON DELETE SET NULL,
    CONSTRAINT fk_doc_user_mod FOREIGN KEY (id_usuario_modificacion) REFERENCES usuario(id) ON DELETE SET NULL,
    CONSTRAINT fk_doc_user_baja FOREIGN KEY (id_usuario_baja) REFERENCES usuario(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- 4. MÓDULO CONCURSOS DOCENTES
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS departamento (
    id SERIAL PRIMARY KEY,
    id_dependencia INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    fecha_baja TIMESTAMP,
    CONSTRAINT fk_departamento_dependencia FOREIGN KEY (id_dependencia) REFERENCES dependencia(id)
);

CREATE TABLE IF NOT EXISTS area (
    id SERIAL PRIMARY KEY,
    id_departamento INT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    fecha_baja TIMESTAMP,
    CONSTRAINT fk_area_departamento FOREIGN KEY (id_departamento) REFERENCES departamento(id)
);

CREATE TABLE IF NOT EXISTS llamado_concurso (
    id SERIAL PRIMARY KEY,
    id_documento INT NOT NULL,
    id_area INT NOT NULL,
    cargo enum_cargo NOT NULL,
    dedicacion enum_dedicacion NOT NULL,
    caracter enum_caracter NOT NULL,
    inscripcion_desde DATE NOT NULL,
    inscripcion_hasta DATE NOT NULL,
    fecha_baja TIMESTAMP,
    id_usuario_baja INT,
    CONSTRAINT fk_concurso_documento FOREIGN KEY (id_documento) REFERENCES documento(id),
    CONSTRAINT fk_concurso_area FOREIGN KEY (id_area) REFERENCES area(id),
    CONSTRAINT fk_concurso_user_baja FOREIGN KEY (id_usuario_baja) REFERENCES usuario(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- 5. MÓDULO PLANES DE ESTUDIO Y CARRERAS
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS carrera (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    fecha_baja TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carrera_dependencia (
    id_carrera INT NOT NULL,
    id_dependencia INT NOT NULL,
    fecha_baja TIMESTAMP,
    PRIMARY KEY (id_carrera, id_dependencia),
    CONSTRAINT fk_cardep_carrera FOREIGN KEY (id_carrera) REFERENCES carrera(id) ON DELETE CASCADE,
    CONSTRAINT fk_cardep_dependencia FOREIGN KEY (id_dependencia) REFERENCES dependencia(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plan_estudio (
    id SERIAL PRIMARY KEY,
    id_carrera INT NOT NULL,
    plan VARCHAR(20) NOT NULL,
    ordenanza VARCHAR(50) NOT NULL,
    anios SMALLINT NOT NULL,
    url_oficial VARCHAR(500),
    version_id INT,
    sincronizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_baja TIMESTAMP,
    CONSTRAINT fk_plan_carrera FOREIGN KEY (id_carrera) REFERENCES carrera(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS materia (
    id SERIAL PRIMARY KEY,
    id_plan INT NOT NULL,
    anio SMALLINT NOT NULL,
    orden SMALLINT NOT NULL,
    codigo VARCHAR(30) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    periodo VARCHAR(50),
    fecha_baja TIMESTAMP,
    CONSTRAINT fk_materia_plan FOREIGN KEY (id_plan) REFERENCES plan_estudio(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- 6. ESTADÍSTICAS
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS termino_buscado (
    termino VARCHAR(150) PRIMARY KEY,
    busquedas INT DEFAULT 1
);

-- --------------------------------------------------------
-- 7. ÍNDICES
-- --------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_documento_fecha ON documento(fecha_emision);
CREATE INDEX IF NOT EXISTS idx_documento_emisora ON documento(id_dependencia_emisora);
CREATE INDEX IF NOT EXISTS idx_concurso_vigencia ON llamado_concurso(inscripcion_hasta);
CREATE INDEX IF NOT EXISTS idx_plan_estudio_carrera ON plan_estudio(id_carrera);
CREATE INDEX IF NOT EXISTS idx_materia_plan ON materia(id_plan);

-- ========================================================
-- 8. DATOS INICIALES Y DE PRUEBA (SEED)
-- ========================================================

-- Dependencias principales
INSERT INTO dependencia (id, numero, codigo, sigla, nombre, ubicacion, es_facultad, historica)
VALUES 
    (1, 1, 'REC', 'Rectorado', 'Rectorado', 'San Luis', false, false),
    (2, 2, 'FQByF', 'FQByF', 'Facultad de Química, Bioquímica y Farmacia', 'San Luis', true, false),
    (3, 3, 'FCFMyN', 'FCFMyN', 'Facultad de Ciencias Físico-Matemáticas y Naturales', 'San Luis', true, false),
    (4, 4, 'FCH', 'FCH', 'Facultad de Ciencias Humanas', 'San Luis', true, false),
    (5, 5, 'FICES', 'FICES', 'Facultad de Ingeniería y Ciencias Económico-Sociales', 'Villa Mercedes', true, true),
    (10, 10, 'FCS', 'FCS', 'Facultad de Ciencias de la Salud', 'San Luis', true, false),
    (11, 11, 'FTU', 'FTU', 'Facultad de Turismo y Urbanismo', 'Merlo', true, false),
    (12, 12, 'FaPsi', 'FaPsi', 'Facultad de Psicología', 'San Luis', true, false),
    (14, 14, 'FICA', 'FICA', 'Facultad de Ingeniería y Ciencias Agropecuarias', 'Villa Mercedes', true, false),
    (15, 15, 'FCEJS', 'FCEJS', 'Facultad de Ciencias Económicas, Jurídicas y Sociales', 'Villa Mercedes', true, false)
ON CONFLICT (id) DO NOTHING;

-- Tipos de documentos
INSERT INTO tipo_documento (id, nombre)
VALUES 
    (1, 'Resolución'),
    (2, 'Ordenanza'),
    (3, 'Decreto'),
    (4, 'Acta'),
    (5, 'Circular'),
    (6, 'Convenio')
ON CONFLICT (id) DO NOTHING;

-- Órganos emisores
INSERT INTO organo_emisor (id, nombre)
VALUES 
    (1, 'Rectorado'),
    (2, 'Consejo Superior'),
    (3, 'Consejo Directivo'),
    (4, 'Decanato')
ON CONFLICT (id) DO NOTHING;

-- Prefijos de codificación
INSERT INTO codificacion (prefijo, id_tipo, id_organo, ambito)
VALUES 
    ('RR', 1, 1, 'universidad'),
    ('RCS', 1, 2, 'universidad'),
    ('OCS', 2, 2, 'universidad'),
    ('RCD', 1, 3, 'facultad'),
    ('RD', 1, 4, 'facultad'),
    ('DEC', 3, 1, 'universidad'),
    ('CO', 6, 1, 'universidad')
ON CONFLICT (prefijo) DO NOTHING;

-- Documentos de prueba
INSERT INTO documento (
    codigo,
    prefijo,
    id_dependencia_origen,
    numero,
    anio,
    id_dependencia_emisora,
    fecha_emision,
    descripcion,
    archivo_ruta,
    url_externa
) VALUES 
(
    'RR-1-145/26',
    'RR',
    1,
    '145',
    2026,
    1,
    '2026-09-18',
    'Aprobación del calendario de actividades académicas e institucionales para el ciclo lectivo 2026/2027 en la Universidad Nacional de San Luis.',
    'Resolucion_RR_145_2026.pdf',
    'http://digesto.unsl.edu.ar/busca_codigo.php3?var=RR-1-145/26'
),
(
    'OCS-1-12/26',
    'OCS',
    3,
    '12',
    2026,
    1,
    '2026-09-15',
    'Modificación y actualización del régimen de regularidad y correlatividades para las carreras de grado de la Facultad de Ciencias Físico-Matemáticas y Naturales.',
    'Ordenanza_CS_012_2026.pdf',
    'http://digesto.unsl.edu.ar/busca_codigo.php3?var=OCS-1-12/26'
),
(
    'RR-1-140/26',
    'RR',
    15,
    '140',
    2026,
    1,
    '2026-09-10',
    'Llamado a inscripción de aspirantes para cubrir cargos docentes interinos en la Facultad de Ciencias Económicas, Jurídicas y Sociales.',
    'Resolucion_RR_140_2026.pdf',
    'http://digesto.unsl.edu.ar/busca_codigo.php3?var=RR-1-140/26'
)
ON CONFLICT (codigo) DO NOTHING;

-- Sincronizar secuencias seriales en PostgreSQL
SELECT setval('dependencia_id_seq', (SELECT COALESCE(MAX(id), 1) FROM dependencia));
SELECT setval('tipo_documento_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tipo_documento));
SELECT setval('organo_emisor_id_seq', (SELECT COALESCE(MAX(id), 1) FROM organo_emisor));
SELECT setval('documento_id_seq', (SELECT COALESCE(MAX(id), 1) FROM documento));
