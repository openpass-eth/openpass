import type { Address, Hex } from "viem";
import { Schema } from "mongoose";

// just store offchain information
export interface Wallet extends Document {
  address: Address;
  keyId: Hex
  createdAt: Date;
  pendingKeyId?: Hex;
  chainId?: number;
  telegramId?: string;
}

export const WalletSchema = new Schema<Wallet>({
  address: { type: String, required: true, unique: true },
  keyId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  pendingKeyId: { type: String, required: false },
  chainId: { type: Number, required: false },
  telegramId: { type: String, required: false },
});

WalletSchema.index({ address: 1 });
