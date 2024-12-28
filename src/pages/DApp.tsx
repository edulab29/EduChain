import React, { useState } from 'react';
import { ConnectWallet } from '../components/dapp/ConnectWallet';
import { SearchBar } from '../components/dapp/SearchBar';
import { TabNavigation } from '../components/dapp/TabNavigation';
import { IssueCredentials } from '../components/dapp/IssueCredentials';
import { VerifyCredentials } from '../components/dapp/VerifyCredentials';
import { ManageCredentials } from '../components/dapp/ManageCredentials';
import { useWallet } from '../contexts/WalletContext';

export function DApp() {
  const [activeTab, setActiveTab] = useState('issue');
  const { isWalletConnected } = useWallet();

  const renderContent = () => {
    if (!isWalletConnected) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Please connect your wallet to access the DApp</p>
        </div>
      ); 
    }

    return (
      <div className="bg-gray-900 rounded-xl p-6"> 
        {activeTab === 'issue' && <IssueCredentials />}
        {activeTab === 'verify' && <VerifyCredentials />}
        {activeTab === 'manage' && <ManageCredentials />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <ConnectWallet />
          <SearchBar />
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderContent()}
        </div>
      </div>
    </div>
  );
}