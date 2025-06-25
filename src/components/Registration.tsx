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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for registering with Ajman Kerala Kitchen. Our team will review your application and contact you within 24 hours.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => onNavigate('login')}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                ← Back to Login
              </button>
              <div></div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Join Our Family</h1>
            <p className="text-xl text-gray-600">Register to enjoy authentic Kerala meals delivered daily</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Registration Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Submit Registration
                </button>
              </form>
            </div>

            {/* Information Panel */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">What Happens Next?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Application Review</h4>
                      <p className="text-gray-600 text-sm">Our team reviews your registration within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Approval Confirmation</h4>
                      <p className="text-gray-600 text-sm">You'll receive a call/SMS confirming your registration</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-emerald-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Start Enjoying</h4>
                      <p className="text-gray-600 text-sm">Your daily meals will start from the next business day</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Service Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-gray-700">Afternoon: 12:00 PM - 3:00 PM (Default: 01:00 PM)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-gray-700">Night: 7:00 PM - 10:00 PM (Default: 09:00 PM)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Utensils className="w-5 h-5 text-amber-600" />
                    <span className="text-gray-700">Fresh meals prepared daily</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <span className="text-gray-700">Serving all areas in Ajman</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;