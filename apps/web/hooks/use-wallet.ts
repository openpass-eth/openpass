import useSWR from 'swr';
import type { Address, Hex } from 'viem';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('Failed to fetch wallet data');
    throw error;
  }
  return res.json();
};

export interface Wallet {
  address: Address;
  keyId: Hex;
  pendingKeyId?: Hex;
  recoveryPublicKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletByKeyResponse {
  wallet: Wallet;
  keyStatus: {
    isMainKey: boolean;
    isPendingKey: boolean;
    keyType: 'main' | 'pending';
  };
}

/**
 * Hook to fetch wallet data by wallet address
 * @param address - Wallet address to fetch
 * @returns Wallet data, loading state, error state, and refetch function
 */
export const useWallet = (address?: Address) => {
  const { data, error, isLoading, mutate } = useSWR<Wallet>(
    address ? `${API_URL}/wallets/${address}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  return {
    wallet: data,
    isLoading,
    isError: error,
    refetch: mutate,
  };
};

/**
 * Hook to fetch wallet data by keyId
 * @param keyId - Key ID to look up wallet
 * @returns Wallet data, key status, loading state, error state, and refetch function
 */
export const useWalletByKey = (keyId?: string) => {
  const { data, error, isLoading, mutate } = useSWR<WalletByKeyResponse>(
    keyId ? `${API_URL}/wallets/by-key/${keyId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  return {
    wallet: data?.wallet,
    keyStatus: data?.keyStatus,
    isLoading,
    isError: error,
    refetch: mutate,
  };
};
