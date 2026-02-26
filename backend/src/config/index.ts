import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'wellness_orders',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },

  nominatim: {
    baseUrl: process.env.NOMINATIM_URL || 'http://nominatim:8080/reverse',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_prod',
    adminLogin: process.env.ADMIN_LOGIN || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'changeme',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

} as const;
