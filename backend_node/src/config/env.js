import { existsSync } from 'node:fs';

if (existsSync('.env')) process.loadEnvFile();

export const env = {
  PORT: process.env.PORT ?? 3000,
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  PGHOST: process.env.PGHOST ?? 'localhost',
  PGPORT: process.env.PGPORT ?? 5432,
  PGUSER: process.env.PGUSER ?? 'postgres',
  PGPASSWORD: process.env.PGPASSWORD ?? 'postgres',
  PGDATABASE: process.env.PGDATABASE ?? 'DigestoUNSL',

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',

  GO_API_URL: process.env.GO_API_URL ?? 'http://localhost:8080',

  CRON_CONCURSOS: process.env.CRON_CONCURSOS ?? '30 23 * * *',
  CRON_PLANES: process.env.CRON_PLANES ?? '0 3 1 2,6,10 *',
  DIGESTO_DOCS_URL: (process.env.DIGESTO_DOCS_URL ?? 'http://digesto.unsl.edu.ar/docs/').replace(/\/?$/, '/'),
  PAUSA_DESCARGAS: Number(process.env.PAUSA_DESCARGAS ?? 1000),
  ESPERA_GO: Number(process.env.ESPERA_GO ?? 900000),

  ARCHIVOS_DIR: process.env.ARCHIVOS_DIR ?? '../archivos',
};

if (!env.JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}
