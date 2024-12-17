import React from 'react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';

export function LandingPage() {
  return (
    <div className="pt-16">
      <Hero />
      <About />
      <Features />
      <HowItWorks />
    </div>
  );
}