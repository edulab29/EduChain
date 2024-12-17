import React from 'react';
import { Download } from 'lucide-react';

export function ManageCredentials() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Manage Credentials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* {[1, 2, 3, 4].map((i) => ( */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Bachelor of Science</h3>
            <p className="text-gray-400 text-sm mb-4">Issued on March 15, 2024</p>
            <div className="flex justify-between items-center">
              <span className="text-[#00FF94]">Verified ✓</span>
              <button className="text-gray-400 hover:text-white">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Master of Science</h3>
            <p className="text-gray-400 text-sm mb-4">Issued on September 15, 2024</p>
            <div className="flex justify-between items-center">
              <span className="text-[#00FF94]">Verified ✓</span>
              <button className="text-gray-400 hover:text-white">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Hedera Hashgraph Developer Course</h3>
            <p className="text-gray-400 text-sm mb-4">Issued on August 30, 2024</p>
            <div className="flex justify-between items-center">
              <span className="text-[#00FF94]">Verified ✓</span>
              <button className="text-gray-400 hover:text-white">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        {/* ))} */}
      </div>
    </div>
  );
}