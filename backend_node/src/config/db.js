import pkg from 'pg';
import { env } from './env.js';

const { Pool } = pkg;

export const pool = new Pool({
  host: env.PGHOST,
  port: env.PGPORT,
  user: env.PGUSER,
  password: env.PGPASSWORD,
  database: env.PGDATABASE,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones', err);
});
