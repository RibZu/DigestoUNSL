# Digesto Administrativo UNSL

## Requisitos

- Node.js 20.12 o superior
- PostgreSQL 18
- Go 1.26

## 1. Base de datos

Ejecutar los scripts desde la raíz del proyecto: `schema.sql` crea la base `DigestoUNSL` y sus
tablas, y `seed.sql` carga los datos de prueba.

```bash
psql -U postgres -f database/schema.sql
psql -U postgres -d DigestoUNSL -f database/seed.sql
```

## 2. Variables de entorno

Copiar `backend_node/.env.example` como `backend_node/.env` y completar la contraseña de PostgreSQL y
un `JWT_SECRET` largo y aleatorio. Copiar también `backend-go/.env.example` como `backend-go/.env`.


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

## Levantar todo con `levantar.bat` (Windows)

En la raíz del proyecto está `levantar.bat`, que reemplaza los pasos 3 y 4 para no abrir cada programa
a mano: abre tres ventanas de consola, `backend-go`, `backend_node` y `frontend`, y en cada una corre su
`go run ./cmd/api` o `npm run dev`. Se ejecuta con doble clic o desde la raíz con `.\levantar.bat`.

No instala dependencias ni crea la base: antes hay que tener PostgreSQL corriendo, haber hecho los
pasos 1 y 2 y un `npm install` en `backend_node` y en `frontend`. Si un programa falla, su ventana queda
abierta con el error; para detenerlo se cierra su ventana o se aprieta Ctrl+C.

## Usuario de prueba

| Correo | Contraseña |
|---|---|
| `admin@ejemplo.com` | `digesto-prueba` |
