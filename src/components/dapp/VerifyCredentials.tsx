// VerifyCredentials.tsx
import React, { useState } from 'react';
import { Upload, CheckCircle2, XCircle } from 'lucide-react';
import { hederaService } from './HederaService';

export function VerifyCredentials() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    metadata?: any;
  } | null>(null);
  const [credentialId, setCredentialId] = useState('');

  const verifyCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const result = await hederaService.verifyCredential(credentialId);
      setVerificationResult(result);
    } catch (error) {
      console.error('Error verifying credential:', error);
      setVerificationResult({
        isValid: false
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Verify Credentials</h2>
      
      <form onSubmit={verifyCredential} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Credential ID</label>
          <input
            type="text"
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="token_id:serial_number"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying}
          className="px-6 py-2 bg-[#00FF94] text-gray-900 rounded-lg font-semibold hover:bg-[#00CC77] disabled:opacity-50"
        >
          {isVerifying ? 'Verifying...' : 'Verify Credential'}
        </button>
      </form>

      {verificationResult && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            {verificationResult.isValid ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <span className="text-green-500 font-semibold">Valid Credential</span>
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                <span className="text-red-500 font-semibold">Invalid Credential</span>
              </>
            )}
          </div>

          {verificationResult.isValid && verificationResult.metadata && (
            <div className="space-y-2">
              <p className="text-gray-300">Title: {verificationResult.metadata.title}</p>
              <p className="text-gray-300">Type: {verificationResult.metadata.type}</p>
              <p className="text-gray-300">Institution: {verificationResult.metadata.institution}</p>
              <p className="text-gray-300">Issue Date: {new Date(verificationResult.metadata.issueDate).toLocaleDateString()}</p>
              <p className="text-gray-300">Issuer: {verificationResult.metadata.issuer}</p>
              <p className="text-gray-300">Recipient: {verificationResult.metadata.recipient}</p>
              {verificationResult.metadata.additionalDetails && (
                <p className="text-gray-300">Additional Details: {verificationResult.metadata.additionalDetails}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}