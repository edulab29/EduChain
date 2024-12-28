import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DAppConnector, HederaSessionEvent, HederaJsonRpcMethod, HederaChainId } from '@hashgraph/hedera-wallet-connect';
import { LedgerId } from '@hashgraph/sdk';
import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

interface WalletContextType {
  isWalletConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [connector, setConnector] = useState<DAppConnector | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const projectId = '0a4f8da85fc03a4b02efcbf34fb6b818';
        if (!projectId) {
          throw new Error('WalletConnect project ID not found');
        }

        const core = new Core({
          projectId,
          relayUrl: 'wss://relay.walletconnect.org',
        });

        await Web3Wallet.init({
          core,
          metadata: {
            name: "EduChain",
            description: "Dapp",
            url: window.location.origin,
            icons: ["https://your-icon-url.com/icon.png"]
          }
        });

        const dAppConnector = new DAppConnector(
          {
            name: "EduChain",
            description: "Dapp",
            url: window.location.origin,
            icons: ["https://your-icon-url.com/icon.png"]
          },
          LedgerId.TESTNET,
          projectId, 
          Object.values(HederaJsonRpcMethod),
          [HederaSessionEvent.ChainChanged, HederaSessionEvent.AccountsChanged],
          [HederaChainId.Testnet],
          { relayUrl: 'wss://relay.walletconnect.org'}
        );

        await dAppConnector.init();
        setConnector(dAppConnector);
        setConnectionError(null);

        // Check for existing sessions
        const existingSessions = dAppConnector.walletConnectClient?.session.getAll() || [];
        if (existingSessions.length > 0) {
          const lastSession = existingSessions[existingSessions.length - 1];
          const accountId = lastSession.namespaces.hedera?.accounts[0].split(':')[2];
          if (accountId) {
            setWalletAddress(accountId);
            setIsWalletConnected(true);
          }
        }

      } catch (error) {
        console.error('Error initializing DAppConnector:', error);
        setConnectionError(error instanceof Error ? error.message : 'Failed to initialize wallet connection');
      }
    };

    init();

    return () => {
      if (connector) {
        connector.disconnectAll();
      }
    };
  }, []);


  const connectWallet = async () => {
    if (!connector) {
      setConnectionError('Wallet connector not initialized');
      return;
    }

    try {
      const session = await connector.openModal();
      if (!session.namespaces.hedera?.accounts?.[0]) {
        throw new Error('No Hedera account found in session');
      }
      const accountId = session.namespaces.hedera.accounts[0].split(':')[2];
      setWalletAddress(accountId);
      setIsWalletConnected(true);
      setConnectionError(null);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };


  const disconnectWallet = async () => {
    if (!connector) return;

    try {
      setIsLoading(true);
      await connector.disconnectAll();
      setIsWalletConnected(false);
      setWalletAddress('');
      setWalletBalance('0');
      setConnectionError(null);
    } catch (error) {
      console.error('Disconnect failed:', error);
      setConnectionError(error instanceof Error ? error.message : 'Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <WalletContext.Provider value={{ isWalletConnected, walletAddress, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};