/**
 * Arkiv Client Configuration for DotGo
 *
 * Connects to Arkiv Mendoza testnet for event indexing
 * Network ID: 60138453056
 *
 * Prize Track: Arkiv Main ($10k)
 */

'use client';

import { Arkiv } from '@arkiv-network/sdk';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Arkiv Mendoza Network Configuration
export const ARKIV_MENDOZA_CHAIN = {
  id: 60138453056,
  name: 'Arkiv Mendoza',
  network: 'mendoza',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mendoza.hoodi.arkiv.network/rpc'],
      webSocket: ['wss://mendoza.hoodi.arkiv.network/rpc/ws'],
    },
    public: {
      http: ['https://mendoza.hoodi.arkiv.network/rpc'],
      webSocket: ['wss://mendoza.hoodi.arkiv.network/rpc/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mendoza Explorer',
      url: 'https://explorer.mendoza.hoodi.arkiv.network',
    },
  },
  testnet: true,
} as const;

/**
 * Create Arkiv Client instance
 *
 * For hackathon demo: Uses environment variable private key
 * For production: Should use proper wallet connection
 */
export async function createArkivClient() {
  // Check if private key is available
  const privateKey = process.env.NEXT_PUBLIC_ARKIV_PRIVATE_KEY ||
                     process.env.ARKIV_PRIVATE_KEY;

  if (!privateKey) {
    console.warn('⚠️ Arkiv private key not configured. Indexing will not work.');
    console.warn('Set ARKIV_PRIVATE_KEY in .env.local to enable indexing.');
    return null;
  }

  try {
    // Create account from private key
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    // Create wallet client for Mendoza
    const walletClient = createWalletClient({
      account,
      chain: ARKIV_MENDOZA_CHAIN,
      transport: http(ARKIV_MENDOZA_CHAIN.rpcUrls.default.http[0]),
    });

    // Initialize Arkiv client
    const arkivClient = new Arkiv({ walletClient });

    console.log('✅ Arkiv client initialized');
    console.log('  Network: Mendoza (Chain ID: 60138453056)');
    console.log('  Account:', account.address);

    return arkivClient;
  } catch (error) {
    console.error('❌ Failed to create Arkiv client:', error);
    return null;
  }
}

/**
 * Get singleton Arkiv client instance
 */
let arkivClientInstance: Awaited<ReturnType<typeof createArkivClient>> | null = null;

export async function getArkivClient() {
  if (!arkivClientInstance) {
    arkivClientInstance = await createArkivClient();
  }
  return arkivClientInstance;
}

/**
 * Test Arkiv connection
 */
export async function testArkivConnection() {
  console.log('🔌 Testing Arkiv connection...');

  const client = await getArkivClient();

  if (!client) {
    console.error('❌ Arkiv client not initialized');
    return false;
  }

  try {
    // Try to query entities (even if empty)
    const entities = await client.getEntities({
      limit: 1,
    });

    console.log('✅ Arkiv connection successful');
    console.log(`  Found ${entities.length} entities`);
    return true;
  } catch (error) {
    console.error('❌ Arkiv connection failed:', error);
    return false;
  }
}
