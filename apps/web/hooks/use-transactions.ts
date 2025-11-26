import useSWR from 'swr';
import type { Address, Hex } from 'viem';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Failed to fetch transactions');
    throw error;
  }
  return res.json();
};

export interface Transaction {
  _id: string;
  walletAddress: Address;
  userOpHash: Hex;
  txHash: Hex;
  blockNumber: number;
  timestamp: Date;
  sender: Address;
  paymaster?: Address;
  nonce: bigint;
  success: boolean;
  actualGasCost: bigint;
  actualGasUsed: bigint;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Hook to fetch wallet transactions with pagination
 * @param address - Wallet address to fetch transactions for
 * @param limit - Number of transactions to fetch (default: 50)
 * @param offset - Offset for pagination (default: 0)
 * @returns Transactions data, total count, loading state, error state, and refetch function
 */
export const useTransactions = (
  address?: Address,
  limit = 50,
  offset = 0
) => {
  const { data, error, isLoading, mutate } = useSWR<TransactionsResponse>(
    address 
      ? `${API_URL}/wallets/${address}/transactions?limit=${limit}&offset=${offset}`
      : null,
    fetcher,
    {
      refreshInterval: 10000, // Auto-refresh every 10 seconds
      revalidateOnFocus: false,
    }
  );

  return {
    transactions: data?.transactions || [],
    total: data?.total || 0,
    limit: data?.limit || limit,
    offset: data?.offset || offset,
    isLoading,
    isError: error,
    refetch: mutate,
  };
};
