import React, { useState } from 'react';
import { MapPin, Phone, Mail, User, CheckCircle, Clock, Utensils } from 'lucide-react';
import { addUser } from '../api/users';

interface RegistrationProps {
  onNavigate: (page: string) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    timePreference: 'afternoon' as 'afternoon' | 'night' | 'both'
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
          alert('Could not get your location. Please enter your address manually.');
        }
      );
    } else {
      setLoading(false);
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add user to Supabase
    await addUser({
      ...formData,
      location: location || undefined,
      status: 'pending',
      planType: 'monthly',
      paymentStatus: 'unpaid',
      estimatedDeliveryTime: formData.timePreference === 'afternoon' ? '01:00 PM' : formData.timePreference === 'night' ? '09:00 PM' : '01:00 PM',
      joinedDate: new Date().toISOString().split('T')[0],
      daysActive: 0
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-2 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering with Ajman Kerala Kitchen. Our team will review your application and contact you within 24 hours.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-8 px-2 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => onNavigate('login')}
            className="text-emerald-600 hover:text-emerald-700 font-medium mb-4"
          >
            ← Back to Login
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Join Our Family</h1>
          <p className="text-lg text-gray-600">Register to enjoy authentic Kerala meals delivered daily</p>
        </div>
        <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Registration Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  placeholder="+971 50 123 4567"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                placeholder="Enter your complete address"
                required
              />
            </div>
            <div>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loading}
                className="flex items-center space-x-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <MapPin className="w-4 h-4" />
                <span>{loading ? 'Getting Location...' : 'Use Current Location'}</span>
              </button>
              {location && (
                <p className="text-sm text-emerald-600 mt-2">
                  ✓ Location captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Time Preference</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="timePreference"
                    value="afternoon"
                    checked={formData.timePreference === 'afternoon'}
                    onChange={(e) => setFormData(prev => ({ ...prev, timePreference: e.target.value as 'afternoon' | 'night' | 'both' }))}
                    className="w-5 h-5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Afternoon Only (01:00 PM) - AED 25/day</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="timePreference"
                    value="night"
                    checked={formData.timePreference === 'night'}
                    onChange={(e) => setFormData(prev => ({ ...prev, timePreference: e.target.value as 'afternoon' | 'night' | 'both' }))}
                    className="w-5 h-5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Night Only (09:00 PM) - AED 30/day</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="timePreference"
                    value="both"
                    checked={formData.timePreference === 'both'}
                    onChange={(e) => setFormData(prev => ({ ...prev, timePreference: e.target.value as 'afternoon' | 'night' | 'both' }))}
                    className="w-5 h-5 text-emerald-500 border-gray-300 focus:ring-emerald-500"
                  />
                  <span className="text-gray-700">Both Times - AED 50/day</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-3 rounded-lg font-semibold transition-colors text-base"
            >
              {loading ? 'Submitting...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;