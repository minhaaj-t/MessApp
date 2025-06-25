import React, { useEffect, useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, MapPin, Phone, Mail, Calendar, Clock, Edit2, AlertTriangle, User as UserIcon } from 'lucide-react';
import { User } from '../../types';
import UserEditModal from './UserEditModal';
import { fetchUsers, updateUser, deleteUser } from '../../api/users';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'afternoon' | 'night' | 'both'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesTimeFilter = timeFilter === 'all' || user.timePreference === timeFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesTimeFilter && matchesSearch;
  });

  const handleStatusChange = async (userId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const updatedUser = { ...user, status: newStatus };
    await updateUser(userId, { status: newStatus });
    setUsers(users => users.map(u => u.id === userId ? updatedUser : u));
  };

  const handlePaymentStatusChange = async (userId: string, newStatus: 'paid' | 'half_paid' | 'unpaid') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const updatedUser = { ...user, paymentStatus: newStatus };
    await updateUser(userId, { paymentStatus: newStatus });
    setUsers(users => users.map(u => u.id === userId ? updatedUser : u));
  };

  const handleDeliveryTimeUpdate = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const updatedUser = { ...user, estimatedDeliveryTime: deliveryTime };
    await updateUser(userId, { estimatedDeliveryTime: deliveryTime });
    setUsers(users => users.map(u => u.id === userId ? updatedUser : u));
    setEditingUser(null);
    setDeliveryTime('');
  };

  const handleDeleteUser = async (userId: string) => {
    await deleteUser(userId);
    setUsers(users => users.filter(u => u.id !== userId));
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = async (updatedUser: User) => {
    await updateUser(updatedUser.id, updatedUser);
    setUsers(users => users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'half_paid': return 'bg-yellow-100 text-yellow-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingCount = users.filter(u => u.status === 'pending').length;
  const approvedCount = users.filter(u => u.status === 'approved').length;
  const paidCount = users.filter(u => u.paymentStatus === 'paid').length;
  const halfPaidCount = users.filter(u => u.paymentStatus === 'half_paid').length;
  const unpaidCount = users.filter(u => u.paymentStatus === 'unpaid').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{approvedCount}</p>
              <p className="text-sm text-gray-600">Approved Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{paidCount}</p>
              <p className="text-sm text-gray-600">Fully Paid</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{halfPaidCount}</p>
              <p className="text-sm text-gray-600">Half Paid</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
        
        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="relative">
            <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Times</option>
              <option value="afternoon">Afternoon Only</option>
              <option value="night">Night Only</option>
              <option value="both">Both Times</option>
            </select>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(user.paymentStatus)}`}>
                      {user.paymentStatus === 'paid' ? 'Fully Paid' : 
                       user.paymentStatus === 'half_paid' ? 'Half Paid' : 'Unpaid'}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.timePreference === 'afternoon' ? 'bg-orange-100 text-orange-800' :
                      user.timePreference === 'night' ? 'bg-indigo-100 text-indigo-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {user.timePreference === 'afternoon' ? 'Afternoon' :
                       user.timePreference === 'night' ? 'Night' : 'Both Times'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Plan: {user.planType.charAt(0).toUpperCase() + user.planType.slice(1)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Delivery: {user.timePreference === 'both' ? '01:00 PM / 09:00 PM' : user.estimatedDeliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Active: {user.daysActive} days</span>
                    </div>
                  </div>

                  {user.expiryDate && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Expires:</span> {new Date(user.expiryDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    Edit User
                  </button>

                  {user.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(user.id, 'approved')}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(user.id, 'rejected')}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}
                  
                  {user.status === 'approved' && (
                    <>
                      <button
                        onClick={() => {
                          const nextStatus = user.paymentStatus === 'paid' ? 'half_paid' : 
                                           user.paymentStatus === 'half_paid' ? 'unpaid' : 'paid';
                          handlePaymentStatusChange(user.id, nextStatus);
                        }}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                          user.paymentStatus === 'paid'
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : user.paymentStatus === 'half_paid'
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                            : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                      >
                        {user.paymentStatus === 'paid' ? 'Fully Paid' : 
                         user.paymentStatus === 'half_paid' ? 'Half Paid' : 'Unpaid'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setDeliveryTime(user.estimatedDeliveryTime);
                        }}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Time
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}

        {/* Edit Delivery Time Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Update Delivery Time for {editingUser.name}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery Time
                </label>
                <input
                  type="text"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  placeholder="e.g., 12:30 PM"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDeliveryTimeUpdate(editingUser.id)}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setDeliveryTime('');
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Edit Modal */}
        <UserEditModal
          user={selectedUser}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      </div>
    </div>
  );
};

export default UserManagement;