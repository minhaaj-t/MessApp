import React, { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchUserById } from '../../api/users';
import { User } from '../../types';

interface PlanDetailsProps {
  userId: string;
}

const PlanDetails: React.FC<PlanDetailsProps> = ({ userId }) => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    fetchUserById(userId).then(setUserData);
  }, [userId]);

  if (!userData) {
    return <div className="p-8 text-center text-gray-500">Loading plan details...</div>;
  }

  const getDaysRemaining = () => {
    if (!userData.expiryDate) return null;
    const today = new Date();
    const expiry = new Date(userData.expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Plan Details</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Plan Information */}
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-semibold text-gray-800">Current Plan</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan Type:</span>
                  <span className="font-semibold text-gray-800 capitalize">{userData.planType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Cost:</span>
                  <span className="font-semibold text-gray-800">
                    AED {userData.planType === 'monthly' ? '750' : '667'}
                  </span>
                </div>
                {userData.planType === 'yearly' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Cost:</span>
                    <span className="font-semibold text-gray-800">AED 8,000</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">Subscription Details</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(userData.joinedDate).toLocaleDateString()}
                  </span>
                </div>
                {userData.expiryDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiry Date:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(userData.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Days Active:</span>
                  <span className="font-semibold text-gray-800">{userData.daysActive} days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Alerts */}
          <div className="space-y-4">
            {daysRemaining !== null && (
              <div className={`p-4 rounded-lg border ${
                daysRemaining <= 7 
                  ? 'bg-red-50 border-red-200' 
                  : daysRemaining <= 30 
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {daysRemaining <= 7 ? (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  ) : (
                    <Clock className="w-6 h-6 text-blue-600" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-800">Plan Status</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Days Remaining:</span>
                    <span className={`font-bold ${
                      daysRemaining <= 7 ? 'text-red-600' : 'text-gray-800'
                    }`}>
                      {daysRemaining} days
                    </span>
                  </div>
                  {daysRemaining <= 7 && (
                    <div className="mt-3 p-3 bg-red-100 rounded-lg">
                      <p className="text-sm text-red-800">
                        Your plan expires soon! Please renew to continue service.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Includes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Daily fresh Kerala meals
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Customizable menu options
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Doorstep delivery
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Customer support
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Flexible delivery timing
                </li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Need to Change Plan?</h3>
              <p className="text-sm text-gray-600 mb-3">
                Contact our support team to upgrade or modify your subscription.
              </p>
              <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;