import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { LandingPage } from './pages/LandingPage';
import { DApp } from './pages/DApp';
import { Footer } from './components/Footer';
import { WalletProvider } from './contexts/WalletContext';

function App() {
  return (
    <BrowserRouter>
      <WalletProvider>
        <div className="min-h-screen bg-[#1A1A1A] flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dapp" element={<DApp />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WalletProvider>
    </BrowserRouter>
  );
}

export default App;