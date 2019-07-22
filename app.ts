import express, { Request, Response, NextFunction } from 'express';
import { loadEnvironmentVariables } from './config';
import routes from './routes';
import logging from './logger';

loadEnvironmentVariables();

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  app.get('/', routes.rootRoute);

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error) {
      logging.error(error);
    }
    res.status(500).send(error.message);
  });

  app.on('listening', (err: any) => {
    if (err) {
      logging.error(err);
      return;
    }
    logging.info(`🛡️  Server running on port ${PORT} 🛡️`);
  });

  app.listen(PORT);
}

startServer();
