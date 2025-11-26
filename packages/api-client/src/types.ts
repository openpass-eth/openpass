/**
 * Type definitions for API entities
 */

// Viem types (inlined to avoid dependency)
export type Address = `0x${string}`;
export type Hex = `0x${string}`;

/**
 * Wallet entity
 */
export interface Wallet {
  address: Address;
  keyId: Hex;
  createdAt: Date;
  pendingKeyId?: Hex;
  chainId?: number;
  telegramId?: string;
}

/**
 * Transaction entity
 */
export interface Transaction {
  hash: Hex;
  walletAddress: Address;
  chainId: number;
  type: string;
  metadata: any;
  status: "pending" | "success" | "failed";
  timestamp: Date;
  value: string;
  to: Address;
  from: Address;
}

/**
 * Token position entity
 */
export interface Position {
  walletAddress: Address;
  chainId: number;
  tokenAddress: Address;
  averageBuyPrice: number;
  realizedPnl: number;
  balance: string;
}

/**
 * Pagination options for list endpoints
 */
export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

/**
 * Response for paginated transaction list
 */
export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Response for wallet positions
 */
export interface PositionListResponse {
  positions: Position[];
}

/**
 * Key status information for wallet lookup by keyId
 */
export interface KeyStatus {
  isMainKey: boolean;
  isPendingKey: boolean;
  keyType: 'main' | 'pending';
}

/**
 * Response for wallet lookup by keyId
 */
export interface WalletByKeyIdResponse {
  wallet: Wallet;
  keyStatus: KeyStatus;
}


/**
 * Response for platform statistics
 */
export interface StatsResponse {
  totalWallets: number;
  totalTransactions: number;
}

/**
 * API client configuration options
 */
export interface ApiClientConfig {
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
}

/**
 * Error response from API
 */
export interface ApiErrorResponse {
  error: string;
}
