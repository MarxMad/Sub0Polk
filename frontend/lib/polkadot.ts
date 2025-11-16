// Network configuration
export const POLKADOT_NETWORKS = {
  rococo: {
    name: 'Contracts on Rococo',
    rpc: 'wss://rococo-contracts-rpc.polkadot.io',
    chainId: 'rococo-contracts',
  },
  local: {
    name: 'Local Node',
    rpc: 'ws://127.0.0.1:9944',
    chainId: 'local',
  },
};

export const DEFAULT_NETWORK = POLKADOT_NETWORKS.rococo;

// Contract configuration (update after deployment)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_POLKADOT_CONTRACT_ADDRESS || '';

let api: any = null;
let contract: any = null;

/**
 * Initialize Polkadot API connection
 */
export async function initPolkadotApi(rpcUrl: string = DEFAULT_NETWORK.rpc): Promise<any> {
  if (typeof window === 'undefined') return null; // SSR guard
  if (api) return api;

  const { ApiPromise, WsProvider } = await import('@polkadot/api');
  const provider = new WsProvider(rpcUrl);
  api = await ApiPromise.create({ provider });

  return api;
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
