import type {
  Wallet,
  Transaction,
  TransactionListResponse,
  PositionListResponse,
  StatsResponse,
  PaginationOptions,
  ApiClientConfig,
  ApiErrorResponse,
  WalletByKeyIdResponse,
} from './types';
import { ApiError, NotFoundError, ServerError, NetworkError } from './errors';

/**
 * API Client for interacting with the Abstraction backend
 */
export class ApiClient {
  private baseUrl: string;
  private fetchFn: typeof globalThis.fetch;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
    this.fetchFn = config.fetch || globalThis.fetch;
  }

  /**
   * Internal method to make HTTP requests
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await this.fetchFn(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({
          error: 'Unknown error',
        }));

        if (response.status === 404) {
          throw new NotFoundError(errorData.error, errorData);
        } else if (response.status >= 500) {
          throw new ServerError(errorData.error, response.status, errorData);
        } else {
          throw new ApiError(errorData.error, response.status, errorData);
        }
      }

      return await response.json();
    } catch (error) {
      // Re-throw our custom errors
      if (error instanceof ApiError) {
        throw error;
      }

      // Wrap other errors as NetworkError
      throw new NetworkError(
        `Failed to fetch ${endpoint}`,
        error as Error
      );
    }
  }

  /**
   * Get wallet details by address
   * @param address - Wallet address
   * @returns Wallet details
   */
  async getWallet(address: string): Promise<Wallet> {
    return this.request<Wallet>(`/wallets/${address}`);
  }

  /**
   * Get wallet by keyId (searches both main keyId and pendingKeyId)
   * @param keyId - The keyId to search for
   * @returns Wallet details with key status information
   */
  async getWalletByKeyId(keyId: string): Promise<WalletByKeyIdResponse> {
    return this.request<WalletByKeyIdResponse>(`/wallets/by-key/${keyId}`);
  }


  /**
   * Get transactions for a wallet
   * @param address - Wallet address
   * @param options - Pagination options
   * @returns Paginated list of transactions
   */
  async getTransactions(
    address: string,
    options: PaginationOptions = {}
  ): Promise<TransactionListResponse> {
    const params = new URLSearchParams();
    
    if (options.limit !== undefined) {
      params.set('limit', options.limit.toString());
    }
    
    if (options.offset !== undefined) {
      params.set('offset', options.offset.toString());
    }

    const queryString = params.toString();
    const endpoint = `/wallets/${address}/transactions${queryString ? `?${queryString}` : ''}`;

    return this.request<TransactionListResponse>(endpoint);
  }

  /**
   * Get token positions for a wallet
   * @param address - Wallet address
   * @returns List of token positions
   */
  async getPositions(address: string): Promise<PositionListResponse> {
    return this.request<PositionListResponse>(`/wallets/${address}/positions`);
  }

  /**
   * Get platform statistics
   * @returns Platform statistics
   */
  async getStats(): Promise<StatsResponse> {
    return this.request<StatsResponse>('/stats');
  }

  /**
   * Update the base URL for the client
   * @param baseUrl - New base URL
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the current base URL
   * @returns Current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

/**
 * Create a new API client instance
 * @param config - Client configuration
 * @returns API client instance
 */
export function createApiClient(config?: ApiClientConfig): ApiClient {
  return new ApiClient(config);
}
