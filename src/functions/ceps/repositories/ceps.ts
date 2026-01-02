import CEPModel, { CEP } from '@schemas/cep.model';

export const createCep = async (cep: CEP) => {
  return ((await CEPModel.create(cep)).toObject());
}

export const updateCep = async (cep: CEP & { _id: string }) => {
  return (await CEPModel.findByIdAndUpdate({ _id: cep._id }, cep, { new: true }).lean());
}
