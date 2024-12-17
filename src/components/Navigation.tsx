import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    // { to: '/dapp', label: 'DApp' },
    { to: '/about', label: 'About' },
    { to: '/docs', label: 'Documentation' },
  ];

  return (
    <nav className="fixed w-full bg-gray-900/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-[#00FF94]" />
            <span className="text-white font-bold text-xl font-poppins">EduChain</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-${isActive ? '[#00FF94]' : 'gray-300'} hover:text-[#00FF94] transition-colors font-inter`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {/* <button className="px-4 py-2 bg-[#3366FF] text-white rounded-lg font-semibold hover:bg-[#2952CC] transition-all">
              Connect Wallet
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium text-${
                      isActive ? '[#00FF94]' : 'gray-300'
                    } hover:text-[#00FF94] transition-colors`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              {/* <button className="w-full mt-2 px-4 py-2 bg-[#3366FF] text-white rounded-lg font-semibold hover:bg-[#2952CC] transition-all">
                Connect Wallet
              </button> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}