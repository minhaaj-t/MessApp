import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';

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

const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'banners' | 'notifications'>('banners');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Banner | Notification | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'emergency',
    isActive: true
  });

  useEffect(() => {
    supabase.from('banners').select('*').then(({ data }) => setBanners(data || []));
    supabase.from('notifications').select('*').then(({ data }) => setNotifications(data || []));
  }, []);

  const handleSave = () => {
    if (activeTab === 'banners') {
      if (editingItem) {
        setBanners(banners.map(banner => 
          banner.id === editingItem.id 
            ? { ...banner, ...formData }
            : banner
        ));
      } else {
        const newBanner: Banner = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setBanners([...banners, newBanner]);
      }
    } else {
      if (editingItem) {
        setNotifications(notifications.map(notification => 
          notification.id === editingItem.id 
            ? { ...notification, title: formData.title, message: formData.content, type: formData.type, isActive: formData.isActive }
            : notification
        ));
      } else {
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: formData.title,
          message: formData.content,
          type: formData.type,
          isActive: formData.isActive,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setNotifications([...notifications, newNotification]);
      }
    }
    
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({ title: '', content: '', type: 'info', isActive: true });
  };

  const handleEdit = (item: Banner | Notification) => {
    setEditingItem(item);
    if ('content' in item) {
      setFormData({
        title: item.title,
        content: item.content,
        type: item.type,
        isActive: item.isActive
      });
    } else {
      setFormData({
        title: item.title,
        content: item.message,
        type: item.type,
        isActive: item.isActive
      });
    }
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'banners') {
        setBanners(banners.filter(banner => banner.id !== id));
      } else {
        setNotifications(notifications.filter(notification => notification.id !== id));
      }
    }
  };

  const toggleStatus = (id: string) => {
    if (activeTab === 'banners') {
      setBanners(banners.map(banner => 
        banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
      ));
    } else {
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, isActive: !notification.isActive } : notification
      ));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'emergency':
        return <Bell className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const currentItems = activeTab === 'banners' ? banners : notifications;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Banners & Notifications</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add {activeTab === 'banners' ? 'Banner' : 'Notification'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'banners'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Banners
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Emergency Alerts
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {currentItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-600 mb-2">
                    {'content' in item ? item.content : item.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      item.isActive
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No {activeTab} found. Create your first one!</p>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'banners' ? 'Banner' : 'Notification'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'banners' ? 'Content' : 'Message'}
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label className="text-sm text-gray-700">Active</label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingItem(null);
                      setFormData({ title: '', content: '', type: 'info', isActive: true });
                    }}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;