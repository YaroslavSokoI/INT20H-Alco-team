import Redis from 'ioredis';
import { config } from '../../config';

let redisInstance: Redis | null = null;

export function getRedis(): Redis {
  if (!redisInstance) {
    redisInstance = new Redis(config.redis.url, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    redisInstance.on('error', (err) => {
      console.error('[Redis] Connection error:', err.message);
    });
  }
  return redisInstance;
}

export async function connectRedis(): Promise<void> {
  await getRedis().connect();
  console.log('[Redis] Connected');
}

export async function disconnectRedis(): Promise<void> {
  if (redisInstance) {
    await redisInstance.quit();
    redisInstance = null;
    console.log('[Redis] Disconnected');
  }
}
