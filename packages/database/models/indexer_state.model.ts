import { Schema, Document } from "mongoose";

export interface IndexerState extends Document {
  chainId: number;
  lastCrawledBlock: number;
}

export const IndexerStateSchema = new Schema<IndexerState>({
  chainId: { type: Number, required: true, unique: true },
  lastCrawledBlock: { type: Number, required: true, default: 0 },
});
