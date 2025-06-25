import React, { useEffect, useState } from 'react';
import { AlertTriangle, Info, CheckCircle, Bell, Utensils, Clock } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { User } from '../../types';

interface Banner {
  id: string;
  title: string;
  content: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

interface UserBannersProps {
  userId: string;
}

const UserBanners: React.FC<UserBannersProps> = ({ userId }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch user
    supabase.from('users').select('*').eq('id', userId).single().then(({ data }) => setUserData(data));
    // Fetch banners
    supabase.from('banners').select('*').eq('isActive', true).then(({ data }) => setBanners(data || []));
    // Fetch notifications
    supabase.from('notifications').select('*').eq('isActive', true).then(({ data }) => setNotifications(data || []));
  }, [userId]);

  const getBannerIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'emergency':
        return <Bell className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getBannerColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'emergency':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (!userData) {
    return <div className="p-8 text-center text-gray-500">Loading user data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back, {userData.name}!</h2>
        {/* Emergency Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-500" />
              Important Alerts
            </h3>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    notification.type === 'emergency' 
                      ? 'bg-red-50 border-red-500' 
                      : 'bg-yellow-50 border-yellow-500'
                  }`}
                >
                  <h4 className="font-semibold text-gray-800 mb-1">{notification.title}</h4>
                  <p className="text-gray-700">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Banners */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Announcements</h3>
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`p-4 rounded-lg border ${getBannerColor(banner.type)}`}
            >
              <div className="flex items-start gap-3">
                {getBannerIcon(banner.type)}
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{banner.title}</h4>
                  <p className="text-sm">{banner.content}</p>
                  <p className="text-xs opacity-75 mt-2">
                    {new Date(banner.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {banners.length === 0 && notifications.length === 0 && (
          <div className="text-center py-12">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No announcements at this time.</p>
          </div>
        )}
      </div>
      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{userData.daysActive}</p>
              <p className="text-sm text-gray-600">Days Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Utensils className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">45</p>
              <p className="text-sm text-gray-600">Meals Delivered</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              {userData.timePreference === 'both' ? (
                <div>
                  <p className="text-lg font-bold text-gray-800">01:00 PM / 09:00 PM</p>
                  <p className="text-sm text-gray-600">Both Times</p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold text-gray-800">{userData.estimatedDeliveryTime}</p>
                  <p className="text-sm text-gray-600">Delivery Time</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBanners;