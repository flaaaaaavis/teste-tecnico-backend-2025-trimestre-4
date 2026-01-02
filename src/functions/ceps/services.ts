import { generateCepRange } from "src/utils/range";
import { createCrawl as createCrawlRepository } from "@functions/ceps/repositories/crawls";
import { sqs } from "@apis/sqs";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import CepModel, { CEP } from "@schemas/cep.model";
import { Crawl } from "@schemas/crawl.model";
import { SQS_QUEUE_URL } from '@constants/server';

export const createCrawl = async (baseRange: { cep_start: string; cep_end: string }) => {
  const fullRange = generateCepRange(baseRange);

  const crawl = await createCrawlRepository({
    baseRange,
    fullRange,
    status: 'pending',
    processed: 0,
    success: 0,
    failures: 0,
  } as Crawl);

  for (const cep of fullRange) {
    const newCEP = await CepModel.create(
      // @ts-ignore
      { cep, crawl: crawl._id } as CEP
    );
    const params = {
      QueueUrl: SQS_QUEUE_URL!,
      // @ts-ignore
      MessageBody: JSON.stringify({ crawlId: crawl._id, cepId: newCEP._id, cep }),
    };

    await sqs.send(new SendMessageCommand(params));
  }

  return crawl;
};
