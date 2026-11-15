import cron from 'node-cron';
import { env } from './env.js';
import { sincronizarConcursos } from '../modules/concursos/concursos.service.js';
import { sincronizarPlanes } from '../modules/planes/planes.service.js';

const ZONA = 'America/Argentina/San_Luis';

const agendar = (nombre, variable, expresion, tarea) => {
  if (!cron.validate(expresion)) {
    throw new Error(`${variable} inválida: "${expresion}"`);
  }
  cron.schedule(
    expresion,
    async () => {
      try {
        await tarea();
      } catch (error) {
        console.error(`[reloj] la actualización de ${nombre} falló: ${error.message}`);
      }
    },
    { timezone: ZONA, noOverlap: true, name: nombre },
  );
  console.log(`Reloj: ${nombre} con "${expresion}" (${ZONA})`);
};

export const iniciarReloj = () => {
  agendar('concursos', 'CRON_CONCURSOS', env.CRON_CONCURSOS, sincronizarConcursos);
  agendar('planes', 'CRON_PLANES', env.CRON_PLANES, sincronizarPlanes);
};
