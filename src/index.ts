import { initSwagger } from 'swagger';
import { AuthControllerV1, UserControllerV1 } from '@controllers/v1';
import App from './app';

const server = new App([AuthControllerV1, UserControllerV1]);
initSwagger(server);

(async () => {
  await server.initServerWithDB();
})();

const gracefulShutdown = async () => {
  try {
    await server.stopWebServer();
    await App.closeDB();

    console.log(`Process ${process.pid} received a graceful shutdown signal`);
    process.exit(0);
  } catch (error) {
    console.log(`graceful shutdown Process ${process.pid} got failed!`);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown).on('SIGINT', gracefulShutdown);
