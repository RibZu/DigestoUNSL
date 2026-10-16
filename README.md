# Digesto Administrativo UNSL

SPA en React que reemplaza el sitio legacy en PHP del Digesto Administrativo de la Universidad
Nacional de San Luis: búsqueda de documentos, novedades, concursos, planes de estudio y un panel
administrativo protegido. Una version preliminar se encuentra desplegada en: https://digesto-unsl.vercel.app/

## Estructura

| Carpeta | Qué tiene | Habla con |
|---|---|---|
| `frontend/` | La SPA en React + Vite. | Solo `backend_node` |
| `backend_node/` | La API en Node + Express, lo único que llama el front (por módulo y en capas). | `backend-go` y la base de datos |
| `backend-go/` | La API en Go: lee el feed de concursos, planesestudio y el Digesto actual, y le devuelve JSON a `backend_node`. | Las fuentes externas |
| `database/` | El esquema de la base (`schema.sql`) y los datos de ejemplo (`seed.sql`), en PostgreSQL. | La usa `backend_node` |
| `documentacion/` | Tres PDF: `api-y-base-de-datos.pdf` (endpoints de las dos APIs, sincronización y base de datos), `dominio.pdf` (los datos del Digesto: tipos, prefijos, dependencias, fuentes y casos especiales) y `reparto-de-tareas.pdf` (qué hace cada uno). También el material de la cátedra. | — |

Cada carpeta es un programa independiente: `frontend` y `backend_node` tienen su propio
`package.json` y `backend-go` su propio `go.mod`. Se instalan y se ejecutan por separado, cada uno en
su terminal.

Orden para levantar todo: base de datos, `backend-go`, `backend_node` y `frontend`.

## Cómo correrlo

### 1. Base de datos
Ver `database/README.md`: se crea la base `DigestoUNSL` y se ejecutan `schema.sql` y `seed.sql`.

### 2. Backend (API en Node)
Copiar `backend_node/.env.example` como `backend_node/.env` y completar los valores (la contraseña de
PostgreSQL y un `JWT_SECRET` largo y aleatorio). El `.env` no se sube al repositorio. Requiere
Node.js 20.12 o superior.

```bash
cd backend_node
npm install
npm run dev
```
El servidor quedará corriendo en `http://localhost:3000`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Abrir la URL que imprime Vite (por defecto `http://localhost:5173`).

## Autores

Proyecto de la cátedra Laboratorio de Tecnologías — Ingeniería en Informática, UNSL.
