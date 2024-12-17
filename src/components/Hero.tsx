import React from 'react';
import { Wallet, ArrowRight, GraduationCap } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export function Hero() {


  const navigate = useNavigate();

  const handleLaunchClick = () => {
    navigate("/dapp"); // Navigate to /app
  };
  return (
    <section className="min-h-screen bg-[#1A1A1A] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3366FF]/10 to-[#00FF94]/10" />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-float">
            <GraduationCap className="w-20 h-20 mx-auto text-[#00FF94]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-poppins">
            Your Academic Achievements,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3366FF] to-[#00FF94]">
              Immutably Verified
            </span>{' '}
            on Blockchain
          </h1>
          <p className="text-xl text-gray-300 mb-12 font-inter">
            Secure, transparent, and instantly verifiable academic credentials powered by Hedera
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {/* <button className="px-8 py-4 bg-[#3366FF] text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#2952CC] transition-all transform hover:scale-105">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </button> */}
            <button onClick={handleLaunchClick} className="px-8 py-4 bg-transparent border-2 border-[#00FF94] text-[#00FF94] rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#00FF94]/10 transition-all">
              Launch DApp
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}