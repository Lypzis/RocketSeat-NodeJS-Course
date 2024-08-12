import { env } from './env';
import { app } from './app';

(async () => {
  await app.listen({
    host: '0.0.0.0',
    port: env.PORT,
  });

  console.log(`HTTP Server Running!`);
})();
