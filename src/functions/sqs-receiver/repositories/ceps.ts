import CEPModel, { CEP } from '@schemas/cep.model';

const markFailed = async (cepId: string, results: any) => {
  return (await CEPModel.findByIdAndUpdate(
    { _id: cepId },
    { status: 'failed', results },
    { new: true }
  ).lean());
}

const markSuccess = async (cepId: string, data: Partial<CEP>) => {
  return (await CEPModel.findByIdAndUpdate(
    { _id: cepId },
    { status: 'finished', ...data },
    { new: true }
  ).lean());
}

interface IRepository {
  markFailed(cepId: string, results: any): Promise<CEP | null>;
  markSuccess(cepId: string, data: Partial<CEP>): Promise<CEP | null>;
}

class Repository implements IRepository {
  markFailed = markFailed;
  markSuccess = markSuccess;
}

export const CepRepository = new Repository();


