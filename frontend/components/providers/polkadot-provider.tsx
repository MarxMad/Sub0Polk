"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  initPolkadotApi,
  connectPolkadotWallet,
  disconnectPolkadot,
  DEFAULT_NETWORK
} from '@/lib/polkadot';

type InjectedAccountWithMeta = any;

interface PolkadotContextType {
  api: any | null;
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  selectAccount: (account: InjectedAccountWithMeta) => void;
}

const PolkadotContext = createContext<PolkadotContextType | undefined>(undefined);

export function PolkadotProvider({ children }: { children: ReactNode }) {
  const [api, setApi] = useState<any | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize API on mount
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard

    const init = async () => {
      try {
        const apiInstance = await initPolkadotApi(DEFAULT_NETWORK.rpc);
        if (apiInstance) {
          setApi(apiInstance);
        }
      } catch (err) {
        console.error('Failed to initialize Polkadot API:', err);
        setError('Failed to connect to Polkadot network');
      }
    };

    init();

    return () => {
      disconnectPolkadot();
    };
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const { accounts: walletAccounts, selectedAccount: defaultAccount } = await connectPolkadotWallet();

      setAccounts(walletAccounts);
      setSelectedAccount(defaultAccount);
      setIsConnected(true);
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    setAccounts([]);
    setSelectedAccount(null);
    setIsConnected(false);
  };

  const selectAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
  };

  const value: PolkadotContextType = {
    api,
    accounts,
    selectedAccount,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    selectAccount,
  };

  return (
    <PolkadotContext.Provider value={value}>
      {children}
    </PolkadotContext.Provider>
  );
}

export function usePolkadot() {
  const context = useContext(PolkadotContext);
  if (context === undefined) {
    throw new Error('usePolkadot must be used within a PolkadotProvider');
  }
  return context;
}
