import React from 'react';

export function VerifyCredentials() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Verify Credentials</h2>
      <div className="p-8 border-2 border-dashed border-gray-700 rounded-lg text-center">
        <p className="text-gray-400 mb-4">Drag and drop credential file or click to upload</p>
        <button className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700">
          Choose File
        </button>
      </div>
    </div>
  );
}