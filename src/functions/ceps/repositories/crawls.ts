import CrawlModel, { Crawl } from '@schemas/crawl.model';

export const createCrawl = async (crawl: Crawl): Promise<Crawl> => {
  return ((await CrawlModel.create(crawl)).toObject());
}

export const updateCrawl = async (crawl: Crawl & { _id: string }): Promise<Crawl> => {
  return (await CrawlModel.findByIdAndUpdate({ _id: crawl._id }, crawl, { new: true }).lean());
}
