import app from './app.js';
import { env } from './config/env.js';
import { iniciarReloj } from './config/reloj.js';

app.listen(env.PORT, () => console.log(`Servidor en http://localhost:${env.PORT}`));

iniciarReloj();
