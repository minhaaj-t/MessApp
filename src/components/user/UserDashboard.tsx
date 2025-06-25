import React, { useEffect, useState } from 'react';
import { Bell, CreditCard, Calendar, Utensils, MessageSquare, Clock, LogOut, Package } from 'lucide-react';
import UserBanners from './UserBanners';
import PaymentSection from './PaymentSection';
import PlanDetails from './PlanDetails';
import FoodMenu from './FoodMenu';
import FeedbackSection from './FeedbackSection';
import DeliveryTimeRequest from './DeliveryTimeRequest';
import { fetchUserById } from '../../api/users';
import { User } from '../../types';

interface UserDashboardProps {
  userId: string;
  onLogout: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userId, onLogout }) => {
  const [activeTab, setActiveTab] = useState('banners');
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    fetchUserById(userId).then(setUserData);
  }, [userId]);

  const tabs = [
    { id: 'banners', label: 'Home', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'plan', label: 'Plan Details', icon: Calendar },
    { id: 'menu', label: 'Food Menu', icon: Utensils },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'delivery', label: 'Delivery Time', icon: Clock }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'banners':
        return <UserBanners userId={userId} />;
      case 'payment':
        return <PaymentSection userId={userId} />;
      case 'plan':
        return <PlanDetails userId={userId} />;
      case 'menu':
        return <FoodMenu userId={userId} />;
      case 'feedback':
        return <FeedbackSection userId={userId} />;
      case 'delivery':
        return <DeliveryTimeRequest userId={userId} />;
      default:
        return <UserBanners userId={userId} />;
    }
  };

  if (!userData) {
    return <div className="p-8 text-center text-gray-500">Loading user data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AK</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Kerala Kitchen</h1>
                <p className="text-sm text-gray-600">User Dashboard</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-sm text-gray-500">Days Active</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{userData.daysActive}</h3>
                <p className="text-sm text-gray-600">Since {new Date(userData.joinedDate).toLocaleDateString()}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Delivery Time</span>
                </div>
                {userData.timePreference === 'both' ? (
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Afternoon: 01:00 PM</h3>
                    <h3 className="text-lg font-bold text-gray-800">Night: 09:00 PM</h3>
                    <p className="text-sm text-gray-600">Both Times Available</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{userData.estimatedDeliveryTime}</h3>
                    <p className="text-sm text-gray-600">
                      {userData.timePreference === 'afternoon' ? 'Afternoon Only' : 'Night Only'}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Plan Type</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 capitalize">{userData.planType}</h3>
                <p className="text-sm text-gray-600">
                  {userData.expiryDate ? `Expires ${new Date(userData.expiryDate).toLocaleDateString()}` : 'No expiry date'}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-500">Payment Status</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {userData.paymentStatus === 'paid' ? 'Fully Paid' :
                   userData.paymentStatus === 'half_paid' ? 'Half Paid' : 'Unpaid'}
                </h3>
                <p className="text-sm text-gray-600">
                  {userData.paymentStatus === 'paid' ? 'All payments complete' :
                   userData.paymentStatus === 'half_paid' ? 'Partial payment received' : 'Payment pending'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;