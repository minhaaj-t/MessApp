import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  return (
    <header className="bg-white shadow-lg border-b-4 border-emerald-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">AK</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Ajman Kerala Kitchen</h1>
              <p className="text-sm text-gray-600">Authentic Kerala Meals Delivered</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>Ajman, UAE</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>+971 50 123 4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>11:00 AM - 9:00 PM</span>
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'home'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-700 hover:text-emerald-500'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('register')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 'register'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-700 hover:text-emerald-500'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className={`px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 ${
                currentPage === 'admin' ? 'ring-2 ring-amber-300' : ''
              }`}
            >
              Admin
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;