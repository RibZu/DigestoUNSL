# Digesto Administrativo UNSL

SPA en React que reemplaza el sitio legacy en PHP del Digesto Administrativo de la Universidad
Nacional de San Luis: búsqueda de documentos, novedades, concursos, planes de estudio y un panel
administrativo protegido. Una version preliminar se encuentra desplegada en: https://digesto-unsl.vercel.app/
## Cómo correrlo

### 1. Frontend
```bash
npm install
npm run dev
```
Abrir la URL que imprime Vite (por defecto `http://localhost:5173`).

### 2. Backend (API y Base de Datos)
Asegurarse de tener PostgreSQL en ejecución y configurar las variables de entorno en `backend_node/src/.env` (o `backend_node/.env`):
```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=DigestoUNSL
DB_PASSWORD=postgres
DB_PORT=5432
```

Para instalar dependencias y levantar el servidor:
```bash
cd backend_node
npm install
npm run dev    # o npm start
```
(También se puede iniciar desde la raíz con `npm start`)

El servidor quedará corriendo en `http://localhost:3000`.

## Autores

Proyecto de la cátedra Laboratorio de Tecnologías — Ingeniería en Informática, UNSL.
