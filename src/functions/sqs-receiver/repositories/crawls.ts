import CrawlModel, { Crawl } from '@schemas/crawl.model';

const markFailed = async (_id: string) => {
  const crawl = await CrawlModel.findById(_id);

  crawl.processed += 1;
  crawl.failures += 1;

  if (crawl.processed === crawl.fullRange.length) {
    crawl.status = 'finished';
  }

  if (crawl.processed === 1) {
    crawl.status = 'running';
  }

  await crawl.save();

  return crawl;
};

const markSuccess = async (_id: string) => {
  const crawl = await CrawlModel.findById(_id);

  crawl.processed += 1;
  crawl.success += 1;

  if (crawl.processed === crawl.fullRange.length) {
    crawl.status = 'finished';
  }

  if (crawl.processed === 1) {
    crawl.status = 'running';
  }

  await crawl.save();

  return crawl;
};

interface IRepository {
  markFailed(_id: string): Promise<Crawl | null>;
  markSuccess(_id: string): Promise<Crawl | null>;
}

class Repository implements IRepository {
  markFailed = markFailed;
  markSuccess = markSuccess;
}

export const CrawlRepository = new Repository();


