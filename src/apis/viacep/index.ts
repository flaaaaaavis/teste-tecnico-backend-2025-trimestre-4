import axios from 'axios';
import { VIACEP_HOST } from '@constants/server';

const api = axios.create({
  baseURL: VIACEP_HOST,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const getCep = async (cep: string) => {
  const response = await api.get(`/${cep}/json/`);
  return response.data;
};
