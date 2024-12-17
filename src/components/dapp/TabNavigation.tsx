import React from 'react';
import { Upload, Shield, Download } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: 'issue', label: 'Issue Credentials', icon: Upload },
    { id: 'verify', label: 'Verify Credentials', icon: Shield },
    { id: 'manage', label: 'Manage Credentials', icon: Download },
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === tab.id
              ? 'bg-[#3366FF] text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}