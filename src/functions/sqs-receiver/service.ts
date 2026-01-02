import { getCep } from '@apis/viacep';
import { CepRepository, CrawlRepository } from './repositories';

const process = async ({ crawlId, cepId, cep }: any) => {
  const data = await getCep(cep);

  if (data.erro) {
    await CepRepository.markFailed(cepId, data);
    await CrawlRepository.markFailed(crawlId);
    return;
  }

  await CepRepository.markSuccess(cepId, data);
  await CrawlRepository.markSuccess(crawlId);
};

interface IService {
  process(payload: any): Promise<void>;
}

class Service implements IService {
  public process = process;
}

export const CepService = new Service();
