-- ========================================================
-- DIGESTO UNSL - DATOS INICIALES Y DE PRUEBA (PostgreSQL)
-- Se ejecuta después de schema.sql
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
