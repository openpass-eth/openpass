# @abstraction/api-client

TypeScript client SDK for the Abstraction API. Provides type-safe methods for interacting with wallet data, transactions, and positions.

## Installation

```bash
# In a monorepo workspace
bun add @abstraction/api-client
```

## Usage

### Basic Usage

```typescript
import { ApiClient } from '@abstraction/api-client';

// Create a client instance
const client = new ApiClient({
  baseUrl: 'http://localhost:3000', // Optional, defaults to localhost:3000
});

// Get wallet details
const wallet = await client.getWallet('0x1234...');

// Get wallet by keyId (searches both main and pending keys)
const { wallet: walletByKey, keyStatus } = await client.getWalletByKeyId('0xabc123...');
console.log(keyStatus.keyType); // 'main' or 'pending'
console.log(keyStatus.isMainKey); // true if it's the main key
console.log(keyStatus.isPendingKey); // true if it's a pending key


// Get transactions with pagination
const { transactions, total } = await client.getTransactions('0x1234...', {
  limit: 20,
  offset: 0,
});

// Get token positions
const { positions } = await client.getPositions('0x1234...');

// Get platform statistics
const stats = await client.getStats();
```

### Using the Default Instance

```typescript
import apiClient from '@abstraction/api-client';

// Use the default client instance
const wallet = await apiClient.getWallet('0x1234...');
```

### Error Handling

```typescript
import { ApiClient, NotFoundError, ServerError, NetworkError } from '@abstraction/api-client';

const client = new ApiClient();

try {
  const wallet = await client.getWallet('0xinvalid');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.error('Wallet not found');
  } else if (error instanceof ServerError) {
    console.error('Server error:', error.statusCode);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  }
}
```

### Configuration for Production

```typescript
const client = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.abstraction.app',
});

// Or update the base URL dynamically
client.setBaseUrl('https://api.abstraction.app');
```

## API Reference

### `ApiClient`

#### Methods

- **`getWallet(address: string): Promise<Wallet>`**
  - Get wallet details by address
  
- **`getWalletByKeyId(keyId: string): Promise<WalletByKeyIdResponse>`**
  - Get wallet by keyId (searches both main `keyId` and `pendingKeyId`)
  - Returns wallet details plus key status indicating if it's a main or pending key

- **`getTransactions(address: string, options?: PaginationOptions): Promise<TransactionListResponse>`**
  - Get paginated transactions for a wallet
  - Options: `{ limit?: number, offset?: number }`
  
- **`getPositions(address: string): Promise<PositionListResponse>`**
  - Get token positions for a wallet
  
- **`getStats(): Promise<StatsResponse>`**
  - Get platform statistics (total wallets, total transactions)
  
- **`setBaseUrl(baseUrl: string): void`**
  - Update the API base URL
  
- **`getBaseUrl(): string`**
  - Get the current API base URL

### Types

All types are fully typed and exported from the package:

- `Wallet` - Wallet details
- `Transaction` - Transaction details
- `Position` - Token position details
- `TransactionListResponse` - Paginated transaction response
- `PositionListResponse` - Position list response
- `StatsResponse` - Platform statistics

### Error Classes

- `ApiError` - Base error class for all API errors
- `NotFoundError` - 404 errors (extends `ApiError`)
- `ServerError` - 5xx errors (extends `ApiError`)
- `NetworkError` - Network/fetch errors (extends `ApiError`)

## Development

```bash
# Build the package
bun run build

# Watch mode for development
bun run dev

# Type check
bun run check-types
```
