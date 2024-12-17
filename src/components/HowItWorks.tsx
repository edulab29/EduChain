import React from 'react';
import { FileCheck, Share2, Shield, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: FileCheck,
    title: 'Issue Credentials',
    description: 'Educational institutions issue digital credentials',
  },
  {
    icon: Shield,
    title: 'Secure on Hedera',
    description: 'Credentials are tokenized and stored on Hedera',
  },
  {
    icon: Share2,
    title: 'Share Globally',
    description: 'Share credentials with employers worldwide',
  },
  {
    icon: CheckCircle,
    title: 'Instant Verification',
    description: 'Immediate verification through blockchain',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#1A1A1A] py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-16 font-poppins">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#3366FF]/20 flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-[#3366FF]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 text-center font-poppins">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-center font-inter">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[#3366FF] to-[#00FF94]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}