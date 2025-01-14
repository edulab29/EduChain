// components/TokenAssociate.tsx
import React, { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { TokenAssociateTransaction, AccountId, TokenId } from '@hashgraph/sdk';

interface TokenAssociateProps {
  tokenId: string;
  onSuccess?: () => void;
}

export function TokenAssociate({ tokenId, onSuccess }: TokenAssociateProps) {
  const [isAssociating, setIsAssociating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { walletAddress } = useWallet();

  const handleAssociate = async () => {
    if (!walletAddress) return;
    
    setIsAssociating(true);
    setStatus('idle');

    try {
      // Create associate transaction
      const transaction = await new TokenAssociateTransaction()
        .setAccountId(AccountId.fromString(walletAddress))
        .setTokenIds([TokenId.fromString(tokenId)])
        .freezeWith(client);

      const txResponse = await transaction.execute(client);
      const receipt = await txResponse.getReceipt(client);

      if (receipt.status.toString() === 'SUCCESS') {
        setStatus('success');
        onSuccess?.();
      } else {
        throw new Error('Association failed');
      }
    } catch (error) {
      console.error('Error associating token:', error);
      setStatus('error');
    } finally {
      setIsAssociating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-yellow-900 border-yellow-800">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Your account needs to be associated with the credentials token before receiving NFTs.
        </AlertDescription>
      </Alert>

      {status === 'success' && (
        <Alert className="bg-green-900 border-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Successfully associated your account with the token!
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert className="bg-red-900 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to associate token. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <button
        onClick={handleAssociate}
        disabled={isAssociating || status === 'success'}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAssociating ? 'Associating...' : 'Associate Token'}
      </button>
    </div>
  );
}