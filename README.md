# Digesto Administrativo UNSL

## Requisitos

- Node.js 20.12 o superior
- PostgreSQL 18
- Go 1.26

## 1. Base de datos

Crear la base `DigestoUNSL` y ejecutar los scripts desde la raíz del proyecto:

```bash
psql -U postgres -c "CREATE DATABASE \"DigestoUNSL\";"
psql -U postgres -d DigestoUNSL -f database/schema.sql
psql -U postgres -d DigestoUNSL -f database/seed.sql
```

## 2. Variables de entorno

Copiar `backend_node/.env.example` como `backend_node/.env` y completar la contraseña de PostgreSQL y
un `JWT_SECRET` largo y aleatorio. Copiar también `backend-go/.env.example` como `backend-go/.env`.
Los archivos `.env` no se suben al repositorio.

## 3. Backend

API en Go, en `http://localhost:8080`:

```bash
cd backend-go
go run ./cmd/api
```

API en Node, en `http://localhost:3000`:

```bash
cd backend_node
npm install
npm run dev
```

## 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:5173`.

## Usuario de prueba

| Correo | Contraseña |
|---|---|
| `admin@ejemplo.com` | `digesto-prueba` |
