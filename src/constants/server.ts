// import * as process from 'node:process';
import 'dotenv/config';

export const {
  MONGODB_URL,
  SQS_QUEUE_URL,
  SQS_ENDPOINT,
  SQS_REGION,
  SQS_ACCESS_KEY_ID,
  SQS_SECRET_ACCESS_KEY,
  VIACEP_HOST,
  RATE_LIMIT_MS,
  MAX_CEP_RANGE,
  NODE_ENV,
  PORT,
} = process.env;
