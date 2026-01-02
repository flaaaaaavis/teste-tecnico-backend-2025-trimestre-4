import { SQSClient } from "@aws-sdk/client-sqs";
import { SQS_ENDPOINT, SQS_REGION, SQS_ACCESS_KEY_ID, SQS_SECRET_ACCESS_KEY} from "@constants/server";

const endpoint = SQS_ENDPOINT || 'http://localhost:9324';

export const sqs = new SQSClient({
  region: SQS_REGION || 'us-east-1',
  endpoint,
  credentials: {
    accessKeyId: SQS_ACCESS_KEY_ID || 'test',
    secretAccessKey: SQS_SECRET_ACCESS_KEY || 'test',
  },
});
