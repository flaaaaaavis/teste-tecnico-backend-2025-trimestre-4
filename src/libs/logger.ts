import pino from 'pino';
import { NODE_ENV } from '@constants/server';

const level = NODE_ENV === 'prod' ? 'info' : 'debug';

export const logger = pino({
  level,
});
