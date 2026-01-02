import { ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from '@apis/sqs';
import { logger } from '@libs/logger';
import { sleep } from '@libs/sleep';
import { processCepMessage } from './handler';
import { SQS_QUEUE_URL, RATE_LIMIT_MS } from '@constants/server';

const listen = async () => {
  if (!SQS_QUEUE_URL) {
    throw new Error('SQS_QUEUE_URL not set');
  }

  logger.info('📥 Worker started, listening to SQS');

  while (true) {
    const response = await sqs.send(
      new ReceiveMessageCommand({
        QueueUrl: SQS_QUEUE_URL,
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 20,
      })
    );

    const messages = response.Messages ?? [];

    for (const msg of messages) {
      try {
        if (msg.Body) {
          await processCepMessage(msg.Body);
        }

        if (msg.ReceiptHandle) {
          await sqs.send(
            new DeleteMessageCommand({
              QueueUrl: SQS_QUEUE_URL,
              ReceiptHandle: msg.ReceiptHandle,
            })
          );
        }
      } catch (err) {
        logger.error({ err }, '⚠️ Error processing message');
        await sleep(500);
      }

      await sleep(Number(RATE_LIMIT_MS));
    }
  }
};

listen();
