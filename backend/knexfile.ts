import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'wellness_orders',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      ssl: process.env.DB_HOST?.includes('neon.tech') ? { rejectUnauthorized: false } : false,
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
    pool: { min: 2, max: 10 },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
    pool: { min: 2, max: 10 },
  },
};

export default config;
