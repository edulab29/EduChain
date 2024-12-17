import React from 'react';
import { Shield, Globe, Database } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Immutable Storage',
    description: 'Tamper-proof Digital Credentials secured by blockchain technology',
  },
  {
    icon: Globe,
    title: 'Global Access',
    description: 'Instant Worldwide Verification accessible anywhere, anytime',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Blockchain-powered Authentication ensuring credential integrity',
  },
];

export function Features() {
  return (
    <section className="bg-[#1A1A1A] py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white text-center mb-16 font-poppins">
          Why Choose EduChain?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 hover:from-[#3366FF]/20 hover:to-[#00FF94]/20 transition-all duration-300 transform hover:-translate-y-2"
            >
              <feature.icon className="w-12 h-12 text-[#00FF94] mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4 font-poppins">
                {feature.title}
              </h3>
              <p className="text-gray-300 font-inter">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}