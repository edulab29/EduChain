import React from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';

export function ConnectWallet() {
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="flex justify-end mb-8">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          className="flex items-center gap-2 px-6 py-3 bg-[#3366FF] text-white rounded-lg font-semibold hover:bg-[#2952CC] transition-all"
        >
          <Wallet className="w-5 h-5" />
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <span className="text-gray-300">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}