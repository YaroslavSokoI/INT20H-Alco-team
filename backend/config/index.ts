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

  taxApi: {
    apiKey: process.env.TAXJAR_API_KEY || '',
    baseUrl: 'https://api.taxjar.com',
  },

  nominatim: {
    baseUrl: 'https://nominatim.openstreetmap.org/reverse',
    userAgent: process.env.NOMINATIM_USER_AGENT || 'InstantWellnessApp/1.0',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_in_prod',
    adminLogin: process.env.ADMIN_LOGIN || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'changeme',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  nyBounds: {
    minLat: 40.477399,
    maxLat: 45.015851,
    minLon: -79.762152,
    maxLon: -71.856214,
  },
} as const;
