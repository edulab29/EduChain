import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, Filter, Search, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { Alert, AlertDescription } from './ui/alert';
// import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { hederaService } from './HederaService';

interface Credential {
  id: string;
  metadata: {
    title: string;
    type: string;
    institution: string;
    issueDate: string;
    issuer: string;
    recipient: string;
    additionalDetails?: string;
  };
  status: 'verified' | 'pending' | 'revoked';
}

export function ManageCredentials() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [filteredCredentials, setFilteredCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'revoked'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const { walletAddress } = useWallet();

  // Fetch credentials on component mount
  useEffect(() => {
    const fetchCredentials = async () => {
      if (!walletAddress) return;
      
      try {
        setIsLoading(true);
        const fetchedCredentials = await hederaService.getCredentialsForAccount(walletAddress);
        setCredentials(fetchedCredentials);
        setFilteredCredentials(fetchedCredentials);
      } catch (error) {
        console.error('Error fetching credentials:', error);
        setError('Failed to load credentials. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, [walletAddress]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...credentials];

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(cred => cred.status === filterStatus);
    }

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(cred => 
        cred.metadata.title.toLowerCase().includes(searchLower) ||
        cred.metadata.institution.toLowerCase().includes(searchLower) ||
        cred.metadata.type.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.metadata.issueDate).getTime();
      const dateB = new Date(b.metadata.issueDate).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredCredentials(filtered);
  }, [credentials, filterStatus, searchTerm, sortOrder]);

  const handleRevoke = async (credentialId: string) => {
    if (!window.confirm('Are you sure you want to revoke this credential? This action cannot be undone.')) {
      return;
    }

    try {
      const success = await hederaService.revokeCredential(credentialId);
      if (success) {
        setCredentials(prev => 
          prev.map(cred => 
            cred.id === credentialId 
              ? { ...cred, status: 'revoked' as const } 
              : cred
          )
        );
      } else {
        throw new Error('Failed to revoke credential');
      }
    } catch (error) {
      console.error('Error revoking credential:', error);
      alert('Failed to revoke credential. Please try again.');
    }
  };

  const handleDownload = async (credential: Credential) => {
    try {
      // Create a JSON file with credential data
      const credentialData = {
        ...credential.metadata,
        credentialId: credential.id,
        verificationUrl: `https://hashscan.io/testnet/token/${credential.id.split(':')[0]}`,
        status: credential.status
      };

      const blob = new Blob([JSON.stringify(credentialData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `credential-${credential.id}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading credential:', error);
      alert('Failed to download credential. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400">Loading your credentials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-900 border-red-800">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Manage Credentials</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-grow sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search credentials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter and Sort */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="revoked">Revoked</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCredentials.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <div className="space-y-4">
            {searchTerm || filterStatus !== 'all' ? (
              <>
                <Filter className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-gray-400">No credentials match your filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-gray-700 mx-auto flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-400">No credentials found for this wallet</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCredentials.map((credential) => (
            <div key={credential.id} className="p-6 bg-gray-800 rounded-lg space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {credential.metadata.title}
                  </h3>
                  <p className="text-gray-400">
                    {credential.metadata.institution}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  credential.status === 'verified' ? 'bg-green-900 text-green-300' :
                  credential.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {credential.status === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                  {credential.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                  {credential.status === 'revoked' && <XCircle className="w-3 h-3" />}
                  {credential.status.charAt(0).toUpperCase() + credential.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-400">
                  <span className="text-gray-500">Type:</span> {credential.metadata.type}
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">Issued:</span> {
                    new Date(credential.metadata.issueDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  }
                </p>
                <p className="text-gray-400">
                  <span className="text-gray-500">Issuer:</span> {
                    `${credential.metadata.issuer.slice(0, 8)}...${credential.metadata.issuer.slice(-6)}`
                  }
                </p>
                {credential.metadata.additionalDetails && (
                  <p className="text-gray-400">
                    <span className="text-gray-500">Details:</span> {credential.metadata.additionalDetails}
                  </p>
                )}
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-gray-700">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(credential)}
                    className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                    title="Download credential"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <a
                    href={`https://hashscan.io/testnet/token/${credential.id.split(':')[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on HashScan
                  </a>
                </div>
                {credential.status !== 'revoked' && (
                  <button
                    onClick={() => handleRevoke(credential.id)}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}