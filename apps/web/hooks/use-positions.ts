import useSWR from 'swr';
import type { Address } from 'viem';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Failed to fetch positions');
    throw error;
  }
  return res.json();
};

export interface Position {
  _id: string;
  walletAddress: Address;
  tokenAddress: Address;
  balance: bigint;
  lastUpdated: Date;
}

export interface PositionsResponse {
  positions: Position[];
}

/**
 * Hook to fetch wallet token positions
 * @param address - Wallet address to fetch positions for
 * @returns Positions data, loading state, error state, and refetch function
 */
export const usePositions = (address?: Address) => {
  const { data, error, isLoading, mutate } = useSWR<PositionsResponse>(
    address ? `${API_URL}/wallets/${address}/positions` : null,
    fetcher,
    {
      refreshInterval: 15000, // Auto-refresh every 15 seconds
      revalidateOnFocus: false,
    }
  );

  return {
    positions: data?.positions || [],
    isLoading,
    isError: error,
    refetch: mutate,
  };
};
