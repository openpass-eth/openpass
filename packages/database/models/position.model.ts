import { Schema, Document } from "mongoose";
import type { Address } from "viem";

export interface Position extends Document {
  walletAddress: Address;
  chainId: number;
  tokenAddress: Address;
  averageBuyPrice: number;
  realizedPnl: number;
  balance: string;
}

export const PositionSchema = new Schema<Position>({
  walletAddress: { type: String, required: true },
  chainId: { type: Number, required: true },
  tokenAddress: { type: String, required: true },
  averageBuyPrice: { type: Number, default: 0 },
  realizedPnl: { type: Number, default: 0 },
  balance: { type: String, default: "0" },
});

PositionSchema.index({ walletAddress: 1, chainId: 1, tokenAddress: 1 }, { unique: true });
