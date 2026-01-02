export const generateCepRange = (baseRange: { cep_start: string; cep_end: string }): string[] => {
  const cepRegex = /^\d{8}$/;

  const { cep_start: cepStart, cep_end: cepEnd } = baseRange;

  if (!cepRegex.test(cepStart) || !cepRegex.test(cepEnd)) {
    throw new Error('CEP inválido. Use o formato 00000000');
  }

  const start = Number(cepStart);
  const end = Number(cepEnd);

  if (start > end) {
    throw new Error('cep_start deve ser menor ou igual a cep_end');
  }

  const result: string[] = [];

  for (let cep = start; cep <= end; cep++) {
    result.push(cep.toString().padStart(8, '0'));
  }

  return result;
}
