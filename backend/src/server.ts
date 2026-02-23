import app from './app';
import { config } from './config';
import { db } from './repositories/db';
import { connectRedis, disconnectRedis } from './clients/redis.client';

async function start(): Promise<void> {
  await db.raw('SELECT 1');
  console.log('[DB] Connected to PostgreSQL');

  await connectRedis();

  const server = app.listen(config.port, () => {
    console.log(`[Server] Running on http://localhost:${config.port} (${config.nodeEnv})`);
  });

  const shutdown = async () => {
    server.close();
    await disconnectRedis();
    await db.destroy();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((err) => {
  console.error('[Server] Fatal error during startup:', err);
  process.exit(1);
});
