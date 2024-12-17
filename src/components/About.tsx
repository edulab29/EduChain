import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export function About() {
  return (
    <section className="bg-gray-900 py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-8 font-poppins">
              Revolutionizing Academic Verification
            </h2>
            <p className="text-gray-300 mb-8 text-lg font-inter">
              EduChain is transforming how academic credentials are issued, stored, and verified.
              Our blockchain solution eliminates credential fraud while providing instant verification
              worldwide.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <XCircle className="w-6 h-6 text-red-500" />
                <span className="text-gray-300">30% of job applications contain false credentials</span>
              </div>
              <div className="flex items-center gap-4">
                <XCircle className="w-6 h-6 text-red-500" />
                <span className="text-gray-300">2-4 weeks average verification time</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-[#00FF94]" />
                <span className="text-white">Instant blockchain verification</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-[#00FF94]" />
                <span className="text-white">100% tamper-proof records</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#3366FF] to-[#00FF94] p-1">
              <div className="w-full h-full rounded-2xl bg-gray-900 p-8">
                <img
                  src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1200"
                  alt="Digital Credentials"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}