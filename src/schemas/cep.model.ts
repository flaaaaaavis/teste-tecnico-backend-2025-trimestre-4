import { Schema, InferSchemaType, model } from 'mongoose';

const cep = new Schema(
  {
    crawl: { type: Schema.Types.ObjectId, ref: 'crawl' },
    cep: String,
    status: {
      type: String,
      enum: ['pending', 'running', 'finished', 'failed'],
      default: 'pending'
    },
    results: {
      type: Schema.Types.Mixed,
      default: []
    },
    logradouro: {type: String, default: ''},
    complemento: { type: String, default: '' },
    bairro: { type: String, default: '' },
    localidade: { type: String, default: '' },
    uf: { type: String, default: '' },
    ibge: { type: String, default: '' },
    gia: { type: String, default: '' },
    ddd: { type: String, default: '' },
    siafi: { type: String, default: '' }
  },
  {
    collection: 'CEPs',
    timestamps: true,
  }
);

cep.index({ cep: 'text' });

export type CEP = InferSchemaType<typeof cep>;

export default model('cep', cep);
