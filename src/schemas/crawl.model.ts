import { Schema, InferSchemaType, model } from 'mongoose';

export const crawlRange = new Schema({
  cep_start: String,
  cep_end: String
});

const crawl = new Schema(
  {
    baseRange: crawlRange,
    fullRange: [String],
    status: {
      type: String,
      enum: ['pending', 'running', 'finished', 'failed'],
      default: 'pending'
    },
    processed: Number,
    success: Number,
    failures: Number,
  },
  {
    collection: 'Crawls',
    timestamps: true,
  }
);

crawl.index({ baseRange: 1 });
crawl.index({ status: 'text' });

export type Crawl = InferSchemaType<typeof crawl>;

export default model('crawl', crawl);
