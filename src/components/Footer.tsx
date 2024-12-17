import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-white font-bold text-xl mb-4 font-poppins">EduChain</h3>
            <p className="text-gray-400 font-inter">
              Revolutionizing academic credentials through blockchain technology
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 font-poppins">Documentation</h4>
            <ul className="space-y-2 font-inter">
              <li><a href="#" className="text-gray-400 hover:text-[#00FF94]">Getting Started</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF94]">API Reference</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF94]">Integration Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 font-poppins">Company</h4>
            <ul className="space-y-2 font-inter">
              <li><a href="#" className="text-gray-400 hover:text-[#00FF94]">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF94]">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00FF94]">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 font-poppins">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#00FF94]">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FF94]">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FF94]">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00FF94]">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 font-inter">
            © {new Date().getFullYear()} EduChain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}