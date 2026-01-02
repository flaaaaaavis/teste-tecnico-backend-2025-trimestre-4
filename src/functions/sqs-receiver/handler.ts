import { CepService } from './service';

export const processCepMessage = async (body: string) => {
  const payload = JSON.parse(body);
  await CepService.process(payload);
}
