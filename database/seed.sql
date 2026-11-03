-- ========================================================
-- DIGESTO UNSL - DATOS INICIALES Y DE PRUEBA (PostgreSQL 18)
-- Se ejecuta después de schema.sql: psql -U postgres -d DigestoUNSL -f database/seed.sql
-- ========================================================

-- Los archivos están en UTF-8 (psql en Windows usa otra codificación si no se aclara)
SET client_encoding = 'UTF8';

-- --------------------------------------------------------
-- 1. DATOS FIJOS: los catálogos reales, sacados del Digesto actual
-- --------------------------------------------------------

-- Dependencias: las 15 de la codificación del Digesto
INSERT INTO dependencia (id, numero, codigo, sigla, nombre, ubicacion, es_facultad, historica, fecha_baja)
VALUES
    (1, 0, null, 'Org. Nac.', 'Organismos Nacionales', null, false, false, null),
    (2, 1, null, 'Rectorado', 'Rectorado', 'San Luis', false, false, null),
    (3, 2, 'fqbf', 'FQByF', 'Facultad de Química Bioquímica y Farmacia', 'San Luis', true, false, null),
    (4, 3, 'fcfmn', 'FCFMyN', 'Facultad de Ciencias Físicas Matemáticas y Naturales', 'San Luis', true, false, null),
    (5, 4, 'fch', 'FCH', 'Facultad de Ciencias Humanas', 'San Luis', true, false, null),
    (6, 5, 'fices', 'FICES', 'Facultad de Ingeniería y Ciencias Económico-Sociales', 'Villa Mercedes', true, true, null),
    (7, 6, null, 'ENJPP', 'Escuela Normal Juan Pascual Pringles', 'San Luis', false, false, null),
    (8, 8, 'ipau', 'IPAU', 'Instituto Politécnico y Artístico Universitario', 'San Luis', false, false, null),
    (9, 9, null, 'DOSPU', 'DOSPU', null, false, false, null),
    (10, null, null, 'DEDA', 'Departamento de Educación a Distancia', 'San Luis', false, false, null),
    (11, 10, 'fcs', 'FCS', 'Facultad de Ciencias de la Salud', 'San Luis', true, false, null),
    (12, 11, 'ftu', 'FTU', 'Facultad de Turismo y Urbanismo', 'Merlo', true, false, null),
    (13, 12, 'fapsi', 'FaPsi', 'Facultad de Psicología', 'San Luis', true, false, null),
    (14, 14, 'fica', 'FICA', 'Facultad de Ingeniería y Ciencias Agropecuarias', 'Villa Mercedes', true, false, null),
    (15, 15, 'fcejs', 'FCEJS', 'Facultad de Ciencias Económicas, Jurídicas y Sociales', 'Villa Mercedes', true, false, null)
ON CONFLICT DO NOTHING;

-- Tipos de documento: los 8 del Digesto
INSERT INTO tipo_documento (id, nombre, fecha_baja)
VALUES
    (1, 'Actas', null),
    (2, 'Circulares', null),
    (3, 'Convenios', null),
    (4, 'Decretos', null),
    (5, 'Órdenes del día', null),
    (6, 'Ordenanzas', null),
    (7, 'Proveídos', null),
    (8, 'Resoluciones', null)
ON CONFLICT DO NOTHING;

-- Órganos emisores: los 37 del buscador del sitio actual, más 2 de la codificación oficial
INSERT INTO organo_emisor (id, nombre, fecha_baja)
VALUES
    (1, 'Asamblea Universitaria', null),
    (2, 'Auditoría Interna', null),
    (3, 'Consejo de Escuela', null),
    (4, 'Consejo Consultivo', null),
    (5, 'Consejo Directivo', null),
    (6, 'Consejo Superior', null),
    (7, 'Consejo de Posgrado', null),
    (8, 'Secretaría de Vinculación Tecnológica y Social', null),
    (9, 'Actas de Comité Académico', null),
    (10, 'Decanato', null),
    (11, 'DEDA', null),
    (12, 'IPAU', null),
    (13, 'DOSPU', null),
    (14, 'Rectorado', null),
    (15, 'Rectoría', null),
    (16, 'Secretaría Académica', null),
    (17, 'Secretaría Administrativa', null),
    (18, 'Secretaría de Asuntos Estudiantiles y Bienestar', null),
    (19, 'Secretaría de Ciencia y Técnica', null),
    (20, 'Secretaría de Extensión Universitaria', null),
    (21, 'Secretaría General', null),
    (22, 'Secretaría de Hacienda', null),
    (23, 'Secretaría de Postgrado', null),
    (24, 'Secretaría de Planeamiento', null),
    (25, 'Dirección General de Administración', null),
    (26, 'Departamento de Física-FCFMN', null),
    (27, 'Departamento de Matemáticas-FCFMN', null),
    (28, 'Departamento de Informática-FCFMN', null),
    (29, 'Departamento de Geología-FCFMN', null),
    (30, 'Departamento de Minería-FCFMN', null),
    (31, 'CONEAU', null),
    (32, 'Ministerio de Ciencia y Tecnología', null),
    (33, 'Ministerio de Educación', null),
    (34, 'Junta Electoral-UNSL', null),
    (35, 'Departamento de Electrónica-FCFMN', null),
    (36, 'Junta Electoral-Facultad', null),
    (37, 'Secretaría de Imagen y Comunicación Institucional', null),
    (38, 'Dirección de Personal', null),
    (39, 'Secretaría de Postgrado y Extensión', null)
ON CONFLICT DO NOTHING;

-- Codificación oficial: los 65 prefijos (digesto.unsl.edu.ar/codigos.html)
INSERT INTO codificacion (prefijo, id_tipo, id_organo, ambito, fecha_baja)
VALUES
    ('AAU', 1, 1, 'universidad', null),
    ('ACE', 1, 3, 'escuela', null),
    ('ACD', 1, 5, 'facultad', null),
    ('ACS', 1, 6, 'universidad', null),
    ('ACC', 1, null, 'universidad', null),
    ('ACCD', 1, null, 'facultad', null),
    ('ACCE', 1, null, 'escuela', null),
    ('ACCo', 1, 4, 'facultad', null),
    ('ACVTS', 1, 8, null, null),
    ('ACA', 1, 9, null, null),
    ('ACP', 1, 7, null, null),
    ('CISA', 2, 16, 'universidad', null),
    ('CISH', 2, 22, 'universidad', null),
    ('CISG', 2, 21, 'universidad', null),
    ('CISE', 2, 20, 'universidad', null),
    ('CISC', 2, 19, 'universidad', null),
    ('CISB', 2, 18, 'universidad', null),
    ('CIDP', 2, 38, 'universidad', null),
    ('CID', 2, 10, 'facultad', null),
    ('CIR', 2, 14, 'universidad', null),
    ('CICS', 2, 6, 'universidad', null),
    ('CICD', 2, 5, 'facultad', null),
    ('CIAI', 2, 2, 'universidad', null),
    ('CIRE', 2, 15, 'escuela', null),
    ('CISAD', 2, 17, 'universidad', null),
    ('CIIE', 2, 12, 'universidad', null),
    ('CIDE', 2, 11, 'universidad', null),
    ('CIDO', 2, 13, 'universidad', null),
    ('CISEP', 2, 39, 'universidad', null),
    ('CISP', 2, 24, 'universidad', null),
    ('CO', 3, null, 'universidad', null),
    ('COE', 3, null, 'escuela', null),
    ('DR', 4, 14, 'universidad', null),
    ('DD', 4, 10, 'facultad', null),
    ('DE', 4, 15, 'escuela', null),
    ('ODCE', 5, 3, 'escuela', null),
    ('ODCD', 5, 5, 'facultad', null),
    ('ODCS', 5, 6, 'universidad', null),
    ('OAU', 6, 1, 'universidad', null),
    ('OCE', 6, 3, 'escuela', null),
    ('OCD', 6, 5, 'facultad', null),
    ('OCS', 6, 6, 'universidad', null),
    ('OD', 6, 10, 'facultad', null),
    ('OR', 6, 14, 'universidad', null),
    ('ORE', 6, 15, 'escuela', null),
    ('PCPDGA', 7, 25, 'universidad', null),
    ('PCPSA', 7, 17, 'universidad', null),
    ('PCDDGA', 7, 25, 'universidad', null),
    ('PCDSA', 7, 17, 'universidad', null),
    ('RAU', 8, 1, 'universidad', null),
    ('RCE', 8, 3, 'escuela', null),
    ('RCD', 8, 5, 'facultad', null),
    ('RCS', 8, 6, 'universidad', null),
    ('RD', 8, 10, 'facultad', null),
    ('RR', 8, 14, 'universidad', null),
    ('RRE', 8, 15, 'escuela', null),
    ('RSA', 8, 16, 'universidad', null),
    ('RDFis', 8, 26, 'facultad', null),
    ('RDMat', 8, 27, 'facultad', null),
    ('RDInf', 8, 28, 'facultad', null),
    ('RDMin', 8, 30, 'facultad', null),
    ('RDGeo', 8, 29, 'facultad', null),
    ('RDEle', 8, 35, 'facultad', null),
    ('RJE', 8, 34, 'universidad', null),
    ('RSE', 8, 20, 'universidad', null)
ON CONFLICT DO NOTHING;

-- Departamentos: los 40 de los llamados a concurso desde 2000 (los que no tuvieron llamados desde 2024, dados de baja)
INSERT INTO departamento (id, id_dependencia, nombre, fecha_baja)
VALUES
    (1, 3, 'Departamento de Biologia', null),
    (2, 3, 'Departamento de Bioquimica', null),
    (3, 3, 'Departamento de Bioquimica y Ciencias Biologicas', '2026-10-07 00:00:00'),
    (4, 3, 'Departamento de Farmacia', null),
    (5, 3, 'Departamento de Quimica', null),
    (6, 3, 'Varios', '2026-10-07 00:00:00'),
    (7, 4, 'Departamento de Electronica', null),
    (8, 4, 'Departamento de Fisica', null),
    (9, 4, 'Departamento de Geologia', null),
    (10, 4, 'Departamento de Informatica', null),
    (11, 4, 'Departamento de Matematica', null),
    (12, 4, 'Departamento de Mineria', null),
    (13, 4, 'Varios', '2026-10-07 00:00:00'),
    (14, 5, 'Decanato', '2026-10-07 00:00:00'),
    (15, 5, 'Departamento de Artes', null),
    (16, 5, 'Departamento de Comunicacion', null),
    (17, 5, 'Departamento de Educacion y Formacion Docente', null),
    (18, 5, 'Departamento de Fonoaudiologia y Comunicacion', '2026-10-07 00:00:00'),
    (19, 5, 'Departamento de Psicologia', '2026-10-07 00:00:00'),
    (20, 6, 'Departamento de Ciencias Agropecuarias', '2026-10-07 00:00:00'),
    (21, 6, 'Departamento de Ciencias Basicas', '2026-10-07 00:00:00'),
    (22, 6, 'Departamento de Ciencias Economico-Sociales', '2026-10-07 00:00:00'),
    (23, 6, 'Departamento de Ingenieria', '2026-10-07 00:00:00'),
    (24, 11, 'Departamento de Ciencias de la Nutricion', null),
    (25, 11, 'Departamento de Enfermeria', null),
    (26, 11, 'Departamento de Fonoaudiologia', null),
    (27, 11, 'Departamento de Kinesiologia y Fisiatria', null),
    (28, 12, 'Departamento de Aromaticas y Jardineria', null),
    (29, 12, 'Departamento de Turismo', null),
    (30, 13, 'Departamento de Formacion Basica General y Complementaria', null),
    (31, 13, 'Departamento de Formacion Profesional', null),
    (32, 13, 'Departamento de Psicologia', '2026-10-07 00:00:00'),
    (33, 14, 'Departamento de Ciencias Agropecuarias', null),
    (34, 14, 'Departamento de Ciencias Basicas', null),
    (35, 14, 'Departamento de Ingenieria', null),
    (36, 14, 'Departamento de Ingenieria de Procesos', null),
    (37, 15, 'Departamento de Ciencias Economicas', null),
    (38, 15, 'Departamento de Ciencias Juridicas', '2026-10-07 00:00:00'),
    (39, 15, 'Departamento de Ciencias Juridicas y Politicas', null),
    (40, 15, 'Departamento de Ciencias Sociales', null)
ON CONFLICT DO NOTHING;

-- Áreas: las 221 de los llamados a concurso desde 2000 (las que no tuvieron llamados desde 2024, dadas de baja)
INSERT INTO area (id, id_departamento, nombre, fecha_baja)
VALUES
    (1, 1, 'Area Biologia', null),
    (2, 1, 'Area Biologia Molecular', null),
    (3, 1, 'Area Ecologia', null),
    (4, 1, 'Area Educacion en Ciencias Naturales', null),
    (5, 1, 'Area Zoologia', null),
    (6, 2, 'Area Analisis Clinicos', null),
    (7, 2, 'Area Ciencias Exactas Aplicadas', null),
    (8, 2, 'Area Fisiologia', null),
    (9, 2, 'Area Microbiologia', null),
    (10, 2, 'Area Morfologia', null),
    (11, 2, 'Area Quimica Biologica', null),
    (12, 3, 'Area de Analisis Clinicos', '2026-10-07 00:00:00'),
    (13, 3, 'Area de Biologia', '2026-10-07 00:00:00'),
    (14, 3, 'Area de Biologia Molecular', '2026-10-07 00:00:00'),
    (15, 3, 'Area de Ecologia', '2026-10-07 00:00:00'),
    (16, 3, 'Area de Educacion y Bioestadistica', '2026-10-07 00:00:00'),
    (17, 3, 'Area de Fisiologia', '2026-10-07 00:00:00'),
    (18, 3, 'Area de Microbiologia', '2026-10-07 00:00:00'),
    (19, 3, 'Area de Morfologia', '2026-10-07 00:00:00'),
    (20, 3, 'Area de Zoologia', '2026-10-07 00:00:00'),
    (21, 3, 'Area Quimica Biologica', '2026-10-07 00:00:00'),
    (22, 3, 'Varias', '2026-10-07 00:00:00'),
    (23, 4, 'Area de Bromatologia y Ensayo de Medicamentos', null),
    (24, 4, 'Area de Farmacia y Toxicologia', null),
    (25, 4, 'Area de Farmacognoscia', null),
    (26, 4, 'Area de Farmacotecnia', null),
    (27, 4, 'Carrera de Enfermeria', '2026-10-07 00:00:00'),
    (28, 4, 'Varias', null),
    (29, 5, 'Area de Quimica Analitica', null),
    (30, 5, 'Area de Quimica General e Inorganica', null),
    (31, 5, 'Area de Quimica Organica', null),
    (32, 5, 'Area de Quimica-Fisica', null),
    (33, 5, 'Area de Tecnologia Quimica y Biotecnologia', null),
    (34, 5, 'Area Higiene y Seguridad - Gestión Industrial', null),
    (35, 6, 'Varias', '2026-10-07 00:00:00'),
    (36, 7, 'Area Unica de Electronica', null),
    (37, 7, 'Varias', '2026-10-07 00:00:00'),
    (38, 8, 'Area Basica', '2026-10-07 00:00:00'),
    (39, 8, 'Area de Electronica', '2026-10-07 00:00:00'),
    (40, 8, 'Area de Fisica Teorica', '2026-10-07 00:00:00'),
    (41, 8, 'Area de Servicio', '2026-10-07 00:00:00'),
    (42, 8, 'Area de Transferencia Educativa', '2026-10-07 00:00:00'),
    (43, 8, 'Area de Unica de Fisica', null),
    (44, 8, 'Varias', '2026-10-07 00:00:00'),
    (45, 9, 'Area Geologica', '2026-10-07 00:00:00'),
    (46, 9, 'Area Unica de Geologia', null),
    (47, 9, 'Varias', '2026-10-07 00:00:00'),
    (48, 10, 'Area de Automatas y Lenguajes', null),
    (49, 10, 'Area de Datos', null),
    (50, 10, 'Area de Formacion Inicial en Informatica', null),
    (51, 10, 'Area de Informatica Educativa', null),
    (52, 10, 'Area de Programacion y Metodologia del Desarrollo de Software', null),
    (53, 10, 'Area de Servicios', null),
    (54, 10, 'Area de Sistemas de Computacion', null),
    (55, 10, 'Area del Profesorado', '2026-10-07 00:00:00'),
    (56, 10, 'Areas del Departamento de Informatica', '2026-10-07 00:00:00'),
    (57, 10, 'Varias', '2026-10-07 00:00:00'),
    (58, 11, 'Area Matematica', '2026-10-07 00:00:00'),
    (59, 11, 'Area Unica de Matematica', null),
    (60, 11, 'Varias', '2026-10-07 00:00:00'),
    (61, 12, 'Area Civil y Vial', null),
    (62, 12, 'Area de Mineria', null),
    (63, 12, 'Area Mineria', '2026-10-07 00:00:00'),
    (64, 12, 'Varias', '2026-10-07 00:00:00'),
    (65, 13, 'Varias', '2026-10-07 00:00:00'),
    (66, 14, 'Jardin Maternal', '2026-10-07 00:00:00'),
    (67, 15, 'Area 12-Musica', null),
    (68, 15, 'Area 13-Literatura', null),
    (69, 15, 'Area 14-Teatro', null),
    (70, 15, 'Area de Literatura', '2026-10-07 00:00:00'),
    (71, 15, 'Varias', '2026-10-07 00:00:00'),
    (72, 16, 'Area 3-Lenguajes y Discursos', null),
    (73, 16, 'Area 5-Arte y Estetica', null),
    (74, 16, 'Area 7-Estrategias de Produccion', null),
    (75, 16, 'Area 8-Integracion y Praxis', null),
    (76, 16, 'Area 9-Politica e Instituciones', null),
    (77, 16, 'Area Formacion en Medios', '2026-10-07 00:00:00'),
    (78, 16, 'Area Formacion General en Comunicacion', '2026-10-07 00:00:00'),
    (79, 16, 'Varias', '2026-10-07 00:00:00'),
    (80, 17, 'Area 1-Formacion Basica I-II', null),
    (81, 17, 'Area 10-Lenguas Extranjeras', null),
    (82, 17, 'Area 11-Formacion en Linguistica', null),
    (83, 17, 'Area 2-Pedagogica', null),
    (84, 17, 'Area 4-Curriculum y Didactica', '2026-10-07 00:00:00'),
    (85, 17, 'Area 4-I-Curriculum y Didactica', null),
    (86, 17, 'Area 4-II-Sujetos y Contextos', null),
    (87, 17, 'Area 6-Metodologica', null),
    (88, 17, 'Varias', '2026-10-07 00:00:00'),
    (89, 18, 'Area 11-Foniatrica', '2026-10-07 00:00:00'),
    (90, 18, 'Area 12-Rehabilitacion', '2026-10-07 00:00:00'),
    (91, 18, 'Area 13-Formacion en Medios', '2026-10-07 00:00:00'),
    (92, 18, 'Area 15-Formacion General en Comunicacion', '2026-10-07 00:00:00'),
    (93, 18, 'Area 7-Linguistica', '2026-10-07 00:00:00'),
    (94, 18, 'Area 8-Audiologia', '2026-10-07 00:00:00'),
    (95, 19, 'Area 14-Clinica', '2026-10-07 00:00:00'),
    (96, 19, 'Area 3-Psicologia I', '2026-10-07 00:00:00'),
    (97, 19, 'Area 5-Psicologia II', '2026-10-07 00:00:00'),
    (98, 19, 'Area 9-Psicobilogica', '2026-10-07 00:00:00'),
    (99, 20, 'Area de Biologia', '2026-10-07 00:00:00'),
    (100, 20, 'Area de Produccion Animal', '2026-10-07 00:00:00'),
    (101, 20, 'Area de Produccion y Sanidad Vegetal', '2026-10-07 00:00:00'),
    (102, 20, 'Area de Recursos Naturales', '2026-10-07 00:00:00'),
    (103, 21, 'Area de Computacion', '2026-10-07 00:00:00'),
    (104, 21, 'Area de Dibujo Tecnico', '2026-10-07 00:00:00'),
    (105, 21, 'Area de Diseño', '2026-10-07 00:00:00'),
    (106, 21, 'Area de Fisica', '2026-10-07 00:00:00'),
    (107, 21, 'Area de Idiomas', '2026-10-07 00:00:00'),
    (108, 21, 'Area de Matematicas', '2026-10-07 00:00:00'),
    (109, 21, 'Area de Quimica', '2026-10-07 00:00:00'),
    (110, 22, 'Area Contable-Impositiva', '2026-10-07 00:00:00'),
    (111, 22, 'Area de Administracion', '2026-10-07 00:00:00'),
    (112, 22, 'Area de Comportamiento Humano', '2026-10-07 00:00:00'),
    (113, 22, 'Area de Metodos y Tecnicas', '2026-10-07 00:00:00'),
    (114, 22, 'Area de Trabajo Social', '2026-10-07 00:00:00'),
    (115, 22, 'Area Economica', '2026-10-07 00:00:00'),
    (116, 22, 'Area Juridico-Politica', '2026-10-07 00:00:00'),
    (117, 23, 'Area de Biologia', '2026-10-07 00:00:00'),
    (118, 23, 'Area de Electricidad', '2026-10-07 00:00:00'),
    (119, 23, 'Area de Electronica y Control', '2026-10-07 00:00:00'),
    (120, 23, 'Area de Estructura', '2026-10-07 00:00:00'),
    (121, 23, 'Area de Mecanica', '2026-10-07 00:00:00'),
    (122, 23, 'Area de Procesos Fisicos', '2026-10-07 00:00:00'),
    (123, 23, 'Area de Procesos Quimicos', '2026-10-07 00:00:00'),
    (124, 23, 'Area de Produccion Animal', '2026-10-07 00:00:00'),
    (125, 23, 'Area de Recursos Naturales', '2026-10-07 00:00:00'),
    (126, 23, 'Area de Sanidad Vegetal', '2026-10-07 00:00:00'),
    (127, 24, 'Area 10- Formacion Profesional en Kinesiologia y Fisiatria', '2026-10-07 00:00:00'),
    (128, 24, 'Area 11- Formacion Complementaria en Kinesiologia y Fisiatria', '2026-10-07 00:00:00'),
    (129, 24, 'Area 3- Formacion Basica', null),
    (130, 24, 'Area 4- Formacion Profesional', null),
    (131, 24, 'Area 9- Formacion Basica en Kinesiologia y Fisiatria', '2026-10-07 00:00:00'),
    (132, 24, 'Area Formacion Basica', '2026-10-07 00:00:00'),
    (133, 24, 'Area Formacion Profesional', '2026-10-07 00:00:00'),
    (134, 25, 'Area 1- Propedeutica de Enfermeria', null),
    (135, 25, 'Area 2- Profesional de Enfermeria', null),
    (136, 25, 'Area Profesional de Enfermeria', '2026-10-07 00:00:00'),
    (137, 25, 'Area Propedeutica de Enfermeria', '2026-10-07 00:00:00'),
    (138, 25, 'Area Unica', null),
    (139, 26, 'Area 5- Audiologica', '2026-10-07 00:00:00'),
    (140, 26, 'Area 6- Foniatrica', '2026-10-07 00:00:00'),
    (141, 26, 'Area 7- Rehabilitacion', '2026-10-07 00:00:00'),
    (142, 26, 'Area Aplicada', '2026-10-07 00:00:00'),
    (143, 26, 'Area Audiologia', null),
    (144, 26, 'Area Foniatrica', '2026-10-07 00:00:00'),
    (145, 26, 'Area Lenguaje', null),
    (146, 26, 'Area Linguistica', '2026-10-07 00:00:00'),
    (147, 26, 'Area Preparatoria', '2026-10-07 00:00:00'),
    (148, 26, 'Area Rehabilitacion', '2026-10-07 00:00:00'),
    (149, 26, 'Area Voz y Fonoestomatologia', null),
    (150, 27, 'Area 10- Formacion Profesional en Kinesiologia y Fisiatria', null),
    (151, 27, 'Area 9- Formacion Basica en Kinesiologia y Fisiatria', null),
    (152, 28, 'Area de Formacion Aplicada a la Jardineria', null),
    (153, 28, 'Area de Formacion Aplicada a la Produccion', null),
    (154, 28, 'Area de Formacion Basica', null),
    (155, 29, 'Area de Desarrollo Urbano y Regional', null),
    (156, 29, 'Area de Formacion General', null),
    (157, 29, 'Area de Organizacion y Gestion de Empresas Turisticas', null),
    (158, 29, 'Area de Practica', null),
    (159, 29, 'Area de Turismo y Sociedad', null),
    (160, 30, 'Area de Formacion Integral', null),
    (161, 30, 'Area de Procesos Psicologicos Basicos', null),
    (162, 30, 'Area Modelos Teoricos', null),
    (163, 30, 'Area Psicobiologica', null),
    (164, 30, 'Formacion Basica en Psicomotricidad', null),
    (165, 31, 'Area de Formacion Profesional en Psicomotricidad', null),
    (166, 31, 'Area de Intervencion Psicologica I', null),
    (167, 31, 'Area de Intervencion Psicologica II', null),
    (168, 32, 'Area 14 Clinica', '2026-10-07 00:00:00'),
    (169, 32, 'Area 3 Psicologica I', '2026-10-07 00:00:00'),
    (170, 32, 'Area 5 Psicologica II', '2026-10-07 00:00:00'),
    (171, 32, 'Area Clinica', '2026-10-07 00:00:00'),
    (172, 32, 'Area Psicologia I', '2026-10-07 00:00:00'),
    (173, 32, 'Area Psicologia II', '2026-10-07 00:00:00'),
    (174, 33, 'Area de Basicas Agronomicas', null),
    (175, 33, 'Area de Biologia', '2026-10-07 00:00:00'),
    (176, 33, 'Area de Desarrollo Rural', '2026-10-07 00:00:00'),
    (177, 33, 'Area de Produccion Animal', null),
    (178, 33, 'Area de Produccion y Sanidad Vegetal', null),
    (179, 33, 'Area de Recursos Naturales e Ingenieria Rural', null),
    (180, 34, 'Area de Computacion', null),
    (181, 34, 'Area de Dibujo Tecnico', null),
    (182, 34, 'Area de Fisica', null),
    (183, 34, 'Area de Idiomas', null),
    (184, 34, 'Area de Matematicas', null),
    (185, 34, 'Area de Quimica', null),
    (186, 35, 'Area de Automatizacion', null),
    (187, 35, 'Area de Electricidad', null),
    (188, 35, 'Area de Electronica', null),
    (189, 35, 'Area de Electronica y Control', '2026-10-07 00:00:00'),
    (190, 35, 'Area de Materiales y Estructuras', null),
    (191, 35, 'Area de Mecanica', null),
    (192, 35, 'Area Gestion', null),
    (193, 35, 'Area Tecnologia', '2026-10-07 00:00:00'),
    (194, 36, 'Area de Procesos Fisicos', null),
    (195, 36, 'Area de Procesos Quimicos', null),
    (196, 36, 'Area Gestion y Servicios', null),
    (197, 36, 'Area Tecnologia de los Alimentos', null),
    (198, 37, 'Area Contable', null),
    (199, 37, 'Area Contable-Impositiva', '2026-10-07 00:00:00'),
    (200, 37, 'Area de Administracion', null),
    (201, 37, 'Area de Economia y Gestion Publica', null),
    (202, 37, 'Area Economica', '2026-10-07 00:00:00'),
    (203, 37, 'Area Legislacion y Practica Profesional', null),
    (204, 37, 'Area Metodos Cuantitativos', null),
    (205, 38, 'Area de Ciencias Politicas y Derecho Publico', '2026-10-07 00:00:00'),
    (206, 38, 'Area de Derecho Privado y de la Convergencia', '2026-10-07 00:00:00'),
    (207, 38, 'Area Juridico-Politica', '2026-10-07 00:00:00'),
    (208, 39, 'Area de Ciencias Politicas y Derecho Publico', '2026-10-07 00:00:00'),
    (209, 39, 'Area de Derecho Privado', null),
    (210, 39, 'Area de Derecho Privado y de la Convergencia', null),
    (211, 39, 'Area de Derecho Publico y de la Convergencia', null),
    (212, 39, 'Area de Formacion General', null),
    (213, 39, 'Area de Formacion General para las Ciencias Juridicas y Politicas', null),
    (214, 39, 'Area de Formacion Practica y Derecho Procesal', null),
    (215, 40, 'Area de Comportamiento Humano', '2026-10-07 00:00:00'),
    (216, 40, 'Area de Formacion Basica en Cs. Sociales y Humanas', null),
    (217, 40, 'Area de Formacion General', null),
    (218, 40, 'Area de Intervencion Profesional', null),
    (219, 40, 'Area de Investigacion y Comunicacion', null),
    (220, 40, 'Area de Trabajo Social', '2026-10-07 00:00:00'),
    (221, 40, 'Area Socio Politica', null)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------
-- 2. DATOS DE EJEMPLO: solo para desarrollo. Antes de cargar los datos reales,
--    borrar esta sección. Las tres cuentas de ejemplo tienen la contraseña
--    digesto-prueba (guardada con bcrypt, costo 10).
-- --------------------------------------------------------

-- Usuarios: un administrador, un moderador y un moderador dado de baja
INSERT INTO usuario (id, nombre, email, password_hash, es_admin, fecha_alta, fecha_baja)
VALUES
    (1, 'Administración del Digesto', 'admin@ejemplo.com', '$2a$10$KIZ0d6cfQAs90Uo4lXypzugcP033SnIn4K8DCjtj09sTsij1mi15y', true, '2026-10-01 09:00:00', null),
    (2, 'Moderador de FICA y FCEJS', 'moderador@ejemplo.com', '$2a$10$KIZ0d6cfQAs90Uo4lXypzugcP033SnIn4K8DCjtj09sTsij1mi15y', false, '2026-10-01 09:30:00', null),
    (3, 'Ex moderador de FCH', 'exmoderador@ejemplo.com', '$2a$10$KIZ0d6cfQAs90Uo4lXypzugcP033SnIn4K8DCjtj09sTsij1mi15y', false, '2026-03-02 10:00:00', '2026-09-15 12:00:00')
ON CONFLICT DO NOTHING;

-- Permisos: el moderador carga documentos de FICA y FCEJS y concursos de FICA; el ex moderador tenía documentos de FCH
INSERT INTO permiso (id_usuario, id_dependencia, modulo, fecha_baja)
VALUES
    (2, 14, 'documentos', null),
    (2, 15, 'documentos', null),
    (2, 14, 'concursos', null),
    (3, 5, 'documentos', '2026-09-15 12:00:00')
ON CONFLICT DO NOTHING;

-- Documentos: uno cargado por el administrador, uno que trajo el feed, uno del moderador, uno dado de baja y una orden del día
INSERT INTO documento (id, codigo, prefijo, id_dependencia_origen, numero, anio, id_dependencia_emisora, fecha_emision, descripcion, archivo_ruta, url_externa, fecha_registro, id_usuario_alta, fecha_modificacion, id_usuario_modificacion, fecha_baja, id_usuario_baja)
VALUES
    (1, 'RCD-3-155/26', 'RCD', 4, '155', 2026, 4, '2026-10-02', 'Llamar a concurso para cubrir cargos docentes en el Área Única de Matemática del Departamento de Matemática.', '202610/20261002140000_10001.pdf', null, '2026-10-02 14:00:00', 1, null, null, null, null),
    (2, 'RD-3-744/26', 'RD', 4, '744', 2026, 4, null, null, null, 'http://digesto.unsl.edu.ar/busca_codigo.php3?var=RD-3-744/26', '2026-10-03 03:00:00', null, null, null, null, null),
    (3, 'RCD-14-210/26', 'RCD', 14, '210', 2026, 14, '2026-09-30', 'Aprobar el calendario de mesas de examen del turno de noviembre.', '202610/20261001101500_10002.pdf', null, '2026-10-01 10:15:00', 2, null, null, null, null),
    (4, 'RD-15-98/26', 'RD', 15, '98', 2026, 15, '2026-09-25', 'Designar la comisión evaluadora de adscripciones.', '202609/20260926120000_10003.pdf', null, '2026-09-26 12:00:00', 2, '2026-09-27 09:00:00', 2, '2026-09-28 08:30:00', 2),
    (5, 'ODCS-1-17/03/26', 'ODCS', 2, '17/03', 2026, 2, '2026-03-17', 'Orden del día de Consejo Superior 17 de marzo de 2026. Sesión Ordinaria.', '202603/20260313144608_26711.pdf', null, '2026-03-13 14:46:08', null, null, null, null, null)
ON CONFLICT DO NOTHING;

-- Llamados: los de RCD-3-155/26 (uno quitado al modificar el concurso) y el de RD-3-744/26 que trajo el feed
INSERT INTO llamado_concurso (id, id_documento, id_area, cargo, dedicacion, caracter, inscripcion_desde, inscripcion_hasta, fecha_baja, id_usuario_baja)
VALUES
    (1, 1, 59, 'Auxiliares de Primera', 'Semiexclusivos', 'Efectivos', '2026-10-13', '2026-10-26', null, null),
    (2, 2, 46, 'Profesores Adjuntos', 'Exclusivos', 'Efectivos', '2026-09-02', '2026-10-14', null, null),
    (3, 1, 59, 'Jefes de Trabajos Practicos', 'Simples', 'Interinos', '2026-10-13', '2026-10-26', null, null),
    (4, 1, 59, 'Auxiliares de Segunda', 'Simples', 'Suplentes', '2026-10-13', '2026-10-26', '2026-10-03 11:00:00', 1)
ON CONFLICT DO NOTHING;

-- Carreras: dos de FQByF y la LAyGD
INSERT INTO carrera (id, codigo, nombre, fecha_baja)
VALUES
    (1, '02001', 'LICENCIATURA EN QUÍMICA', null),
    (2, '02005', 'FARMACIA', null),
    (3, '16001', 'LICENCIATURA EN ANÁLISIS Y GESTIÓN DE DATOS', null)
ON CONFLICT DO NOTHING;

-- Carreras por dependencia: la LAyGD se dicta en FCFMyN y en FCEJS
INSERT INTO carrera_dependencia (id_carrera, id_dependencia, fecha_baja)
VALUES
    (1, 3, null),
    (2, 3, null),
    (3, 4, null),
    (3, 15, null)
ON CONFLICT DO NOTHING;

-- Planes: los de las 3 carreras y uno de Farmacia que dejó de ser vigente
INSERT INTO plan_estudio (id, id_carrera, plan, ordenanza, anios, url_oficial, version_id, sincronizado_en, fecha_baja)
VALUES
    (1, 1, '12/21', '12/21', 5, 'http://planesestudio.unsl.edu.ar/index.php?action=car_g3&fac=2&car=02001&plan=12/21&version=1&version_id=853', 853, '2026-10-06 03:00:00', null),
    (2, 2, '18/24', '18/24', 5, 'http://planesestudio.unsl.edu.ar/index.php?action=car_g3&fac=2&car=02005&plan=18/24&version=1&version_id=1272', 1272, '2026-10-06 03:00:00', null),
    (3, 3, '27/22', 'OCS-27/22', 5, 'http://planesestudio.unsl.edu.ar/index.php?action=car_g3&fac=16&car=16001&plan=27/22&version=2&version_id=614', 614, '2026-10-06 03:00:00', null),
    (4, 2, '04/04', '04/04', 5, 'http://planesestudio.unsl.edu.ar/index.php?action=car_g3&fac=2&car=02005&plan=04/04&version=8&version_id=908', 908, '2026-10-05 03:00:00', '2026-10-06 03:00:00')
ON CONFLICT DO NOTHING;

-- Materias: tres de primer año de Licenciatura en Química y una de la LAyGD
INSERT INTO materia (id, id_plan, anio, orden, codigo, nombre, periodo, fecha_baja)
VALUES
    (1, 1, 1, 1, '02MA00288', 'INGLÉS', '1° anual', null),
    (2, 1, 1, 2, '02MAMOD01', 'MÓDULO DE MATEMÁTICA', '1° bimestre', null),
    (3, 1, 1, 5, '02MA00043', 'MATEMÁTICA I', '1° cuatrimestre', null),
    (4, 3, 1, 1, '16001MA0002', 'INTRODUCCIÓN AL ÁLGEBRA', '1° cuatrimestre', null)
ON CONFLICT DO NOTHING;

-- Términos buscados
INSERT INTO termino_buscado (termino, busquedas)
VALUES
    ('calendario académico', 1842),
    ('concurso docente', 1517),
    ('plan de estudios', 1390),
    ('licencia', 1204),
    ('becas', 1131)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------
-- 3. SECUENCIAS: que el próximo id siga después de los cargados
-- --------------------------------------------------------
SELECT setval('dependencia_id_seq', (SELECT COALESCE(MAX(id), 1) FROM dependencia));
SELECT setval('tipo_documento_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tipo_documento));
SELECT setval('organo_emisor_id_seq', (SELECT COALESCE(MAX(id), 1) FROM organo_emisor));
SELECT setval('usuario_id_seq', (SELECT COALESCE(MAX(id), 1) FROM usuario));
SELECT setval('documento_id_seq', (SELECT COALESCE(MAX(id), 1) FROM documento));
SELECT setval('departamento_id_seq', (SELECT COALESCE(MAX(id), 1) FROM departamento));
SELECT setval('area_id_seq', (SELECT COALESCE(MAX(id), 1) FROM area));
SELECT setval('llamado_concurso_id_seq', (SELECT COALESCE(MAX(id), 1) FROM llamado_concurso));
SELECT setval('carrera_id_seq', (SELECT COALESCE(MAX(id), 1) FROM carrera));
SELECT setval('plan_estudio_id_seq', (SELECT COALESCE(MAX(id), 1) FROM plan_estudio));
SELECT setval('materia_id_seq', (SELECT COALESCE(MAX(id), 1) FROM materia));
