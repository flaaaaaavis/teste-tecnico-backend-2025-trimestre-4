import { Request, Response, NextFunction } from 'express';
import CrawlModel from '@schemas/crawl.model';
import { sqs } from '@apis/sqs';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { MAX_CEP_RANGE, SQS_QUEUE_URL } from '@constants/server';

const isValidCEP = (cep: string) => /^\d{8}$/.test(cep);

const padCep = (n: number) => n.toString().padStart(8, '0');

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cep_start, cep_end } = // @ts-ignore
      req.validatedBody || req.body;

    if (!isValidCEP(cep_start) || !isValidCEP(cep_end)) {
      return res.status(400).json({ message: 'Invalid CEP format' });
    }

    const start = parseInt(cep_start, 10);
    const end = parseInt(cep_end, 10);
    if (start > end) return res.status(400).json({ message: 'cep_start must be <= cep_end' });

    const maxRange = parseInt(MAX_CEP_RANGE || '1000', 10);
    const total = end - start + 1;
    if (total > maxRange) return res.status(400).json({ message: `Range too large. Max ${maxRange}` });

    const crawl = await CrawlModel.create({ baseRange: { start: cep_start, end: cep_end }, fullRange: [] });

    const queueUrl = SQS_QUEUE_URL;
    if (!queueUrl) return res.status(500).json({ message: 'SQS queue URL not configured' });

    const sendPromises = [];
    for (let i = start; i <= end; i += 1) {
      const cep = padCep(i);
      const body = JSON.stringify({ crawlId: crawl._id.toString(), cep });
      const cmd = new SendMessageCommand({ QueueUrl: queueUrl, MessageBody: body });
      sendPromises.push(sqs.send(cmd));
    }

    await Promise.all(sendPromises);

    return res.status(202).json({ crawl_id: crawl._id.toString() });
  } catch (err) {
    return next(err);
  }
};

export const status = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const crawl = await CrawlModel.findById(id).exec();
    if (!crawl) return res.status(404).json({ message: 'Not found' });

    const total = crawl.baseRange ? (parseInt(crawl.baseRange.cep_end, 10) - parseInt(crawl.baseRange.cep_start, 10) + 1) : 0;
    const processed = Array.isArray(crawl.fullRange) ? crawl.fullRange.length : 0;
    const successes = processed;
    const errors = 0;

    return res.status(200).json({ total, processed, successes, errors, status: crawl.status });
  } catch (err) {
    return next(err);
  }
};

export const results = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const page = parseInt((req.query.page as string) || '1', 10);
    const limit = parseInt((req.query.limit as string) || '50', 10);
    const crawl = await CrawlModel.findById(id).exec();
    if (!crawl) return res.status(404).json({ message: 'Not found' });

    const start = (page - 1) * limit;
    const items = (crawl.fullRange || []).slice(start, start + limit);
    return res.status(200).json({ page, limit, items });
  } catch (err) {
    return next(err);
  }
};

export default { create, status, results };

