@echo off
start "backend-go" /D "%~dp0backend-go" cmd /k go run ./cmd/api
start "backend_node" /D "%~dp0backend_node" cmd /k npm run dev
start "frontend" /D "%~dp0frontend" cmd /k npm run dev
