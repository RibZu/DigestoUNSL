# Base de Datos — Digesto UNSL

Este directorio contiene los scripts y el modelo formal de la base de datos PostgreSQL para el sistema del Digesto Administrativo de la UNSL.

---

## 1. Cómo levantar la base de datos (Instrucciones para el equipo)

### Opción A: Usando pgAdmin 4 (Recomendado)
1. Abrir **pgAdmin 4** y conectarse al servidor local de PostgreSQL.
2. Hacer clic derecho sobre **Databases** > **Create** > **Database...**
3. Nombre de la base de datos: `DigestoUNSL` (o el configurado en tu `.env`) y guardar.
4. Seleccionar la base de datos `DigestoUNSL` en el árbol izquierdo.
5. Abrir la herramienta de consulta: **Tools** > **Query Tool** (o ícono de play/ejecutar).
6. Abrir el archivo `database/BD.sql` (o copiar y pegar todo su contenido en el editor).
7. Presionar **F5** (o el botón **Execute**).
8. ¡Listo! Se habrán creado los tipos `ENUM`, las 15 tablas con sus relaciones e índices, y los datos iniciales de prueba.

### Opción B: Desde la Terminal (psql)
Con la terminal parada en la raíz del proyecto:
```bash
# 1. Crear la base de datos si aún no existe
psql -U postgres -c "CREATE DATABASE \"DigestoUNSL\";"

# 2. Ejecutar el script SQL completo
psql -U postgres -d DigestoUNSL -f database/BD.sql
```

---

## 2. Diagrama Entidad-Relación (MER)

```mermaid
classDiagram
    class dependencia {
        int id PK
        int numero UK
        varchar codigo UK
        varchar sigla
        varchar nombre
        varchar ubicacion
        boolean es_facultad
        boolean historica
        timestamp fecha_baja
    }
    class tipo_documento {
        int id PK
        varchar nombre UK
        timestamp fecha_baja
    }
    class organo_emisor {
        int id PK
        varchar nombre UK
        timestamp fecha_baja
    }
    class codificacion {
        varchar prefijo PK
        int id_tipo FK
        int id_organo FK
        enum_ambito ambito
        timestamp fecha_baja
    }
    class usuario {
        int id PK
        varchar nombre
        varchar email UK
        varchar password_hash
        boolean es_admin
        timestamp fecha_alta
        timestamp fecha_baja
    }
    class permiso {
        int id_usuario PK, FK
        int id_dependencia PK, FK
        enum_modulo modulo PK
        timestamp fecha_baja
    }
    class documento {
        int id PK
        varchar codigo UK
        varchar prefijo FK
        int id_dependencia_origen FK
        varchar numero
        smallint anio
        int id_dependencia_emisora FK
        date fecha_emision
        text descripcion
        varchar archivo_ruta
        varchar url_externa
        timestamp fecha_registro
        int id_usuario_alta FK
        timestamp fecha_modificacion
        int id_usuario_modificacion FK
        timestamp fecha_baja
        int id_usuario_baja FK
    }
    class departamento {
        int id PK
        int id_dependencia FK
        varchar nombre
        timestamp fecha_baja
    }
    class area {
        int id PK
        int id_departamento FK
        varchar nombre
        timestamp fecha_baja
    }
    class llamado_concurso {
        int id PK
        int id_documento FK
        int id_area FK
        enum_cargo cargo
        enum_dedicacion dedicacion
        enum_caracter caracter
        date inscripcion_desde
        date inscripcion_hasta
        timestamp fecha_baja
        int id_usuario_baja FK
    }
    class carrera {
        int id PK
        varchar codigo UK
        varchar nombre
        timestamp fecha_baja
    }
    class carrera_dependencia {
        int id_carrera PK, FK
        int id_dependencia PK, FK
        timestamp fecha_baja
    }
    class plan_estudio {
        int id PK
        int id_carrera FK
        varchar plan
        varchar ordenanza
        smallint anios
        varchar url_oficial
        int version_id
        timestamp sincronizado_en
        timestamp fecha_baja
    }
    class materia {
        int id PK
        int id_plan FK
        smallint anio
        smallint orden
        varchar codigo
        varchar nombre
        varchar periodo
        timestamp fecha_baja
    }
    class termino_buscado {
        varchar termino PK
        int busquedas
    }
    tipo_documento "1" --> "0..*" codificacion : se codifica con
    organo_emisor "0..1" --> "0..*" codificacion : se codifica con
    usuario "1" --> "0..*" permiso : tiene
    dependencia "1" --> "0..*" permiso : habilita
    codificacion "1" --> "0..*" documento : codifica
    dependencia "1" --> "0..*" documento : origina
    dependencia "1" --> "0..*" documento : emite
    usuario "0..1" --> "0..*" documento : carga
    usuario "0..1" --> "0..*" documento : modifica
    usuario "0..1" --> "0..*" documento : da de baja
    dependencia "1" --> "0..*" departamento : tiene
    departamento "1" --> "0..*" area : tiene
    documento "1" --> "0..*" llamado_concurso : llama a
    area "1" --> "0..*" llamado_concurso : recibe
    usuario "0..1" --> "0..*" llamado_concurso : da de baja
    carrera "1" --> "0..*" carrera_dependencia : se dicta en
    dependencia "1" --> "0..*" carrera_dependencia : dicta
    carrera "1" --> "0..*" plan_estudio : tiene
    plan_estudio "1" --> "0..*" materia : incluye
```

---

## 3. Modelo DBML (para dbdiagram.io)

Si querés ver o editar el diagrama visual en [dbdiagram.io](https://dbdiagram.io/):

```dbml
Table dependencia {
  id int [pk, increment]
  numero int [unique]
  codigo varchar [unique]
  sigla varchar
  nombre varchar
  ubicacion varchar
  es_facultad boolean
  historica boolean
  fecha_baja timestamp
}

Table tipo_documento {
  id int [pk, increment]
  nombre varchar [unique]
  fecha_baja timestamp
}

Table organo_emisor {
  id int [pk, increment]
  nombre varchar [unique]
  fecha_baja timestamp
}

Table codificacion {
  prefijo varchar [pk]
  id_tipo int [not null]
  id_organo int
  ambito varchar
  fecha_baja timestamp
}

Table usuario {
  id int [pk, increment]
  nombre varchar
  email varchar [unique]
  password_hash varchar
  es_admin boolean
  fecha_alta timestamp
  fecha_baja timestamp
}

Table permiso {
  id_usuario int [pk]
  id_dependencia int [pk]
  modulo varchar [pk]
  fecha_baja timestamp
}

Table documento {
  id int [pk, increment]
  codigo varchar [unique]
  prefijo varchar [not null]
  id_dependencia_origen int [not null]
  numero varchar
  anio smallint
  id_dependencia_emisora int [not null]
  fecha_emision date
  descripcion text
  archivo_ruta varchar
  url_externa varchar
  fecha_registro timestamp
  id_usuario_alta int
  fecha_modificacion timestamp
  id_usuario_modificacion int
  fecha_baja timestamp
  id_usuario_baja int
}

Table departamento {
  id int [pk, increment]
  id_dependencia int [not null]
  nombre varchar
  fecha_baja timestamp
}

Table area {
  id int [pk, increment]
  id_departamento int [not null]
  nombre varchar
  fecha_baja timestamp
}

Table llamado_concurso {
  id int [pk, increment]
  id_documento int [not null]
  id_area int [not null]
  cargo varchar
  dedicacion varchar
  caracter varchar
  inscripcion_desde date
  inscripcion_hasta date
  fecha_baja timestamp
  id_usuario_baja int
}

Table carrera {
  id int [pk, increment]
  codigo varchar [unique]
  nombre varchar
  fecha_baja timestamp
}

Table carrera_dependencia {
  id_carrera int [pk]
  id_dependencia int [pk]
  fecha_baja timestamp
}

Table plan_estudio {
  id int [pk, increment]
  id_carrera int [not null]
  plan varchar
  ordenanza varchar
  anios smallint
  url_oficial varchar
  version_id int
  sincronizado_en timestamp
  fecha_baja timestamp
}

Table materia {
  id int [pk, increment]
  id_plan int [not null]
  anio smallint
  orden smallint
  codigo varchar
  nombre varchar
  periodo varchar
  fecha_baja timestamp
}

Table termino_buscado {
  termino varchar [pk]
  busquedas int
}

Ref: codificacion.id_tipo > tipo_documento.id
Ref: codificacion.id_organo > organo_emisor.id
Ref: permiso.id_usuario > usuario.id
Ref: permiso.id_dependencia > dependencia.id
Ref: documento.prefijo > codificacion.prefijo
Ref: documento.id_dependencia_origen > dependencia.id
Ref: documento.id_dependencia_emisora > dependencia.id
Ref: documento.id_usuario_alta > usuario.id
Ref: documento.id_usuario_modificacion > usuario.id
Ref: documento.id_usuario_baja > usuario.id
Ref: departamento.id_dependencia > dependencia.id
Ref: area.id_departamento > departamento.id
Ref: llamado_concurso.id_documento > documento.id
Ref: llamado_concurso.id_area > area.id
Ref: llamado_concurso.id_usuario_baja > usuario.id
Ref: carrera_dependencia.id_carrera > carrera.id
Ref: carrera_dependencia.id_dependencia > dependencia.id
Ref: plan_estudio.id_carrera > carrera.id
Ref: materia.id_plan > plan_estudio.id
```
