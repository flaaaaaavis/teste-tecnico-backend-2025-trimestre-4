import * as express from 'express';
import mongoose from 'mongoose';

const app = express();

import { PORT, MONGODB_URL } from '@constants/server';
import { logger } from '@libs/logger';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import router from './routers';
app.use('/cep', router);

import { ErrorMiddleware } from '@middlewares/ErrorMiddleware';
app.use(ErrorMiddleware);

const startServer = async () => {
  try {
    if (MONGODB_URL) {
      await mongoose.connect(MONGODB_URL);
      logger.info('✅ MongoDB connected');
    } else {
      logger.warn('⚠️ MONGODB_URL not defined, skipping DB connection');
    }

    const server = app.listen(Number(PORT) || 3000, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });

    const shutdown = async () => {
      logger.info('🛑 Shutting down server...');
      server.close(async () => {
        if (mongoose.connection.readyState === 1) {
          await mongoose.disconnect();
          logger.info('🔌 MongoDB disconnected');
        }
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (err) {
    logger.error({ err }, '❌ Failed to start server');
    process.exit(1);
  }
}

startServer();
