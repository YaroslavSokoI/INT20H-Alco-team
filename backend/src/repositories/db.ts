import Knex from 'knex';
import { config } from '../../config';

export const db = Knex({
  client: 'pg',
  connection: {
    host: config.db.host,
    port: config.db.port,
    database: config.db.name,
    user: config.db.user,
    password: config.db.password,
    ssl: config.db.host.includes('neon.tech') ? { rejectUnauthorized: false } : false,
  },
  pool: { min: 2, max: 10 },
});
