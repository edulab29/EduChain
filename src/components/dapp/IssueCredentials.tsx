import React from 'react';

export function IssueCredentials() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Issue New Credential</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Recipient Address</label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="0x..."
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Credential Type</label>
          <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
            <option>Degree Certificate</option>
            <option>Course Completion</option>
            <option>Professional Certification</option>
          </select>
        </div>
      </div>
      <button className="w-full md:w-auto px-8 py-3 bg-[#00FF94] text-gray-900 rounded-lg font-semibold hover:bg-[#00CC77] transition-all">
        Issue Credential
      </button>
    </div>
  );
}