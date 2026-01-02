import * as yup from 'yup';

export const cepValidation = yup
  .string()
  .trim()
  .required('CEP é obrigatório')
  .matches(/^\d+$/, 'CEP deve conter apenas números')
  .length(8, 'CEP deve conter exatamente 8 dígitos');

export const yupSchema = yup.object({
  cep_start: cepValidation,
  cep_end: cepValidation,
});
