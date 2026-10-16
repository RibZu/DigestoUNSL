import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

// Pool de conexiones
export const pool = new Pool({
  host: env.PGHOST,
  port: env.PGPORT,
  user: env.PGUSER,
  password: env.PGPASSWORD,
  database: env.PGDATABASE,
});

// Log de errores de conexiones inactivas que el servidor puede cerrar inesperadamente
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones', err);
});
