// Network configuration - Using r0gue-io/polkadot-chains endpoints
export const POLKADOT_NETWORKS = {
  paseo: {
    name: 'Paseo Asset Hub (Contracts)',
    rpc: 'wss://testnet-passet-hub.polkadot.io',
    fallbackRpc: 'wss://passet-hub-paseo.ibp.network',
    chainId: 'paseo-asset-hub',
    explorer: 'https://assethub-paseo.subscan.io/',
  },
  westend: {
    name: 'Westend Asset Hub',
    rpc: 'wss://westend-asset-hub-rpc.polkadot.io',
    fallbackRpc: 'wss://asset-hub-westend-rpc.n.dwellir.com',
    chainId: 'westend-asset-hub',
    explorer: 'https://assethub-westend.subscan.io/',
  },
  rococo: {
    name: 'Contracts on Rococo',
    rpc: 'wss://rococo-contracts-rpc.polkadot.io',
    fallbackRpc: 'wss://rococo-contracts.api.onfinality.io/public-ws',
    chainId: 'rococo-contracts',
    explorer: 'https://contracts-rococo.subscan.io/',
  },
  local: {
    name: 'Local Node',
    rpc: 'ws://127.0.0.1:9944',
    chainId: 'local',
  },
};

// Use Paseo as default - dedicated contracts testnet from r0gue-io
export const DEFAULT_NETWORK = POLKADOT_NETWORKS.paseo;

// Contract configuration (update after deployment)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS || '';

let api: any = null;
let contract: any = null;

/**
 * Initialize Polkadot API connection with automatic fallback
 */
export async function initPolkadotApi(rpcUrl: string = DEFAULT_NETWORK.rpc): Promise<any> {
  if (typeof window === 'undefined') return null; // SSR guard
  if (api) return api;

  const { ApiPromise, WsProvider } = await import('@polkadot/api');

  try {
    const provider = new WsProvider(rpcUrl, 3000); // 3s timeout
    api = await ApiPromise.create({ provider });
    return api;
  } catch (err) {
    console.error(`Failed to connect to ${rpcUrl}, trying fallback...`, err);

    // Try fallback if available
    if (DEFAULT_NETWORK.fallbackRpc && rpcUrl !== DEFAULT_NETWORK.fallbackRpc) {
      const fallbackProvider = new WsProvider(DEFAULT_NETWORK.fallbackRpc, 3000);
      api = await ApiPromise.create({ provider: fallbackProvider });
      return api;
    }

    throw err;
  }
}

/**
 * Get or create contract instance
 */
export async function getContract(address?: string): Promise<any | null> {
  if (typeof window === 'undefined') return null; // SSR guard
  if (!CONTRACT_ADDRESS && !address) {
    console.warn('Contract address not configured');
    return null;
  }

  if (contract) return contract;

  const { ContractPromise } = await import('@polkadot/api-contract');
  const CONTRACT_METADATA = await import('../contracts/dotgo_portfolio.json');
  const apiInstance = await initPolkadotApi();
  contract = new ContractPromise(apiInstance, CONTRACT_METADATA, address || CONTRACT_ADDRESS);

  return contract;
}

/**
 * Enable Polkadot extension and get accounts
 */
export async function connectPolkadotWallet(appName: string = 'DotGo'): Promise<{
  accounts: any[];
  selectedAccount: any | null;
}> {
  if (typeof window === 'undefined') {
    throw new Error('Wallet connection requires browser environment');
  }

  const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');

  // Enable extension
  const extensions = await web3Enable(appName);

  if (extensions.length === 0) {
    throw new Error('No Polkadot extension found. Please install Polkadot.js, Talisman, or SubWallet.');
  }

  // Get all accounts
  const accounts = await web3Accounts();

  if (accounts.length === 0) {
    throw new Error('No accounts found. Please create an account in your Polkadot wallet.');
  }

  return {
    accounts,
    selectedAccount: accounts[0], // Default to first account
  };
}

/**
 * Get injector for signing transactions
 */
export async function getInjector(address: string) {
  if (typeof window === 'undefined') return null;
  const { web3FromAddress } = await import('@polkadot/extension-dapp');
  return await web3FromAddress(address);
}

/**
 * Disconnect and cleanup
 */
export async function disconnectPolkadot() {
  if (api) {
    await api.disconnect();
    api = null;
    contract = null;
  }
}

/**
 * Format Polkadot address for display
 */
export function formatPolkadotAddress(address: string, length: number = 8): string {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Convert DOT to Planck (smallest unit)
 */
export function dotToPlanck(dot: number): bigint {
  return BigInt(Math.floor(dot * 10 ** 12));
}

/**
 * Convert Planck to DOT
 */
export function planckToDot(planck: bigint): number {
  return Number(planck) / 10 ** 12;
}
