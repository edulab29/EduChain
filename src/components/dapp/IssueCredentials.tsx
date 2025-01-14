import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { hederaService } from './HederaService';

export function IssueCredentials() {
  const { walletAddress } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [needsAssociation, setNeedsAssociation] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    recipientAddress: '',
    credentialType: 'degree',
    programName: '',
    institution: '',
    awardDate: '',
    expiryDate: '',
    grade: '',
    additionalDetails: ''
  });



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAssociateToken = async () => {
    if (!formData.recipientAddress) return;

    try {
      setIsLoading(true);
      setStatus('idle');

      // Create and execute the association transaction
      await hederaService.createAssociateTransaction(formData.recipientAddress);

      // Wait for the association to be confirmed
      const isAssociated = await hederaService.checkAssociationStatus(formData.recipientAddress);

      if (isAssociated) {
        setNeedsAssociation(false);
        handleSubmit(); // Proceed with credential issuance
      } else {
        throw new Error('Token association failed or timed out');
      }
    } catch (error) {
      console.error('Error associating token:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const TOKEN_ID = '0.0.5384720';

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!formData.recipientAddress || !walletAddress) {
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setTransactionId(null);

    try {
      // First check if account is associated
      const isAssociated = await hederaService.isAccountAssociatedWithToken(formData.recipientAddress);
      
      if (!isAssociated) {
        setNeedsAssociation(true);
        return;
      }

      const result = await hederaService.issueCredential({
        title: `${formData.credentialType.toUpperCase()} - ${formData.programName}`,
        type: formData.credentialType,
        institution: formData.institution,
        issueDate: formData.awardDate,
        recipient: formData.recipientAddress,
        issuer: walletAddress,
        additionalDetails: formData.additionalDetails
      });

      setTransactionId(result.transactionId);
      setStatus('success');

        // Reset form after successful issuance
        setFormData({
          recipientAddress: '',
          credentialType: 'degree',
          programName: '',
          institution: '',
          awardDate: '',
          expiryDate: '',
          grade: '',
          additionalDetails: ''
        });
      } catch (error: any) {
        console.error('Error issuing credential:', error);
        if (error.message?.includes('needs to be associated')) {
          setNeedsAssociation(true);
        } else {
          setStatus('error');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
   

  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Issue New Credential</h2>
      
      {status === 'success' && (
        <Alert className="bg-green-900 border-green-800">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <span>Credential issued successfully!</span>
            {transactionId && (
              <a
                href={`https://hashscan.io/testnet/transaction/${transactionId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-300 hover:text-green-200 underline"
              >
                View transaction on HashScan
              </a>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert className="bg-red-900 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to issue credential. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {needsAssociation && (
        <div className="space-y-4">
          <Alert className="bg-yellow-900 border-yellow-800">
            <Info className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p>The recipient account needs to be associated with the credentials token to receive NFTs.</p>
              <p className="text-sm">Token ID: {TOKEN_ID}</p>
            </AlertDescription>
          </Alert>
          
          <button
            type="button"
            onClick={handleAssociateToken}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Associating Token...
              </span>
            ) : (
              'Associate Token'
            )}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form fields remain the same */}
        <div>
          <label className="block text-gray-300 mb-2" htmlFor="recipientAddress">
            Recipient Address *
          </label>
          <input
            id="recipientAddress"
            name="recipientAddress"
            type="text"
            value={formData.recipientAddress}
            onChange={handleInputChange}
            placeholder="0.0.1234567"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2" htmlFor="credentialType">
            Credential Type *
          </label>
          <select
            id="credentialType"
            name="credentialType"
            value={formData.credentialType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="degree">Degree Certificate</option>
            <option value="course">Course Completion</option>
            <option value="certification">Professional Certification</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2" htmlFor="programName">
            Program Name *
          </label>
          <input
            id="programName"
            name="programName"
            type="text"
            value={formData.programName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2" htmlFor="institution">
            Institution *
          </label>
          <input
            id="institution"
            name="institution"
            type="text"
            value={formData.institution}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2" htmlFor="awardDate">
            Award Date *
          </label>
          <input
            id="awardDate"
            name="awardDate"
            type="date"
            value={formData.awardDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2" htmlFor="grade">
            Grade/Result
          </label>
          <input
            id="grade"
            name="grade"
            type="text"
            value={formData.grade}
            onChange={handleInputChange}
            placeholder="e.g., A, First Class, 3.8 GPA"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-300 mb-2" htmlFor="additionalDetails">
            Additional Details
          </label>
          <textarea
            id="additionalDetails"
            name="additionalDetails"
            value={formData.additionalDetails}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter any additional details about the credential..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-[#00FF94] text-gray-900 rounded-lg font-semibold hover:bg-[#00CC77] transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Issuing...
            </span>
          ) : (
            'Issue Credential'
          )}
        </button>

        <div className="text-sm text-gray-400 flex items-center gap-1">
          <Info className="h-4 w-4" />
          Fields marked with * are required
        </div>
      </div>
    </form>
  );
}