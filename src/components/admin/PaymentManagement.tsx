import React, { useEffect, useState } from 'react';
import { DollarSign, CreditCard, AlertTriangle, CheckCircle, Clock, Filter, Search, Download, Eye, Edit } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const PaymentManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'paid' | 'half_paid' | 'unpaid'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    supabase.from('users').select('*').then(({ data }) => setUsers(data || []));
    supabase.from('payments').select('*').then(({ data }) => setPayments(data || []));
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.paymentStatus === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = filteredUsers.reduce((sum, user) => {
    if (user.paymentStatus === 'paid') {
      return sum + (user.planType === 'monthly' ? 750 : 8000);
    } else if (user.paymentStatus === 'half_paid') {
      return sum + (user.planType === 'monthly' ? 375 : 4000);
    }
    return sum;
  }, 0);

  const pendingAmount = filteredUsers.reduce((sum, user) => {
    if (user.paymentStatus === 'unpaid') {
      return sum + (user.planType === 'monthly' ? 750 : 8000);
    } else if (user.paymentStatus === 'half_paid') {
      return sum + (user.planType === 'monthly' ? 375 : 4000);
    }
    return sum;
  }, 0);

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'half_paid': return 'bg-yellow-100 text-yellow-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'half_paid': return <Clock className="w-4 h-4" />;
      case 'unpaid': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleSendReminder = (userId: string, userName: string) => {
    alert(`Payment reminder sent to ${userName}`);
  };

  const handleViewDetails = (userId: string) => {
    alert(`Viewing payment details for user ${userId}`);
  };

  const handleEditPayment = (userId: string) => {
    alert(`Editing payment for user ${userId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">AED {totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">AED {pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Pending Collections</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{filteredUsers.length}</p>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round((filteredUsers.filter(u => u.paymentStatus === 'paid').length / filteredUsers.length) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Payment Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="paid">Fully Paid</option>
              <option value="half_paid">Half Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Payment List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => {
            const amount = user.planType === 'monthly' ? 750 : 8000;
            const paidAmount = user.paymentStatus === 'paid' ? amount : 
                              user.paymentStatus === 'half_paid' ? amount / 2 : 0;
            const remainingAmount = amount - paidAmount;

            return (
              <div key={user.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getPaymentStatusColor(user.paymentStatus)}`}>
                        {getPaymentStatusIcon(user.paymentStatus)}
                        {user.paymentStatus === 'paid' ? 'Fully Paid' : 
                         user.paymentStatus === 'half_paid' ? 'Half Paid' : 'Unpaid'}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Plan:</span> {user.planType.charAt(0).toUpperCase() + user.planType.slice(1)}
                      </div>
                      <div>
                        <span className="font-medium">Total Amount:</span> AED {amount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Paid Amount:</span> AED {paidAmount.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Remaining:</span> AED {remainingAmount.toLocaleString()}
                      </div>
                    </div>

                    {user.paymentStatus !== 'paid' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Action Required:</strong> 
                          {user.paymentStatus === 'half_paid' 
                            ? ` Remaining amount of AED ${remainingAmount.toLocaleString()} needs to be collected.`
                            : ` Full payment of AED ${amount.toLocaleString()} is pending.`
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewDetails(user.id)}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    <button
                      onClick={() => handleEditPayment(user.id)}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Payment
                    </button>
                    
                    {user.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => handleSendReminder(user.id, user.name)}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Send Reminder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No payments found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Payment Summary */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Payment Summary</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Fully Paid</h4>
            <p className="text-2xl font-bold text-green-600">
              {filteredUsers.filter(u => u.paymentStatus === 'paid').length} users
            </p>
            <p className="text-sm text-green-700">
              AED {filteredUsers.filter(u => u.paymentStatus === 'paid').reduce((sum, u) => 
                sum + (u.planType === 'monthly' ? 750 : 8000), 0).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Half Paid</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {filteredUsers.filter(u => u.paymentStatus === 'half_paid').length} users
            </p>
            <p className="text-sm text-yellow-700">
              AED {filteredUsers.filter(u => u.paymentStatus === 'half_paid').reduce((sum, u) => 
                sum + (u.planType === 'monthly' ? 375 : 4000), 0).toLocaleString()}
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Unpaid</h4>
            <p className="text-2xl font-bold text-red-600">
              {filteredUsers.filter(u => u.paymentStatus === 'unpaid').length} users
            </p>
            <p className="text-sm text-red-700">
              AED {filteredUsers.filter(u => u.paymentStatus === 'unpaid').reduce((sum, u) => 
                sum + (u.planType === 'monthly' ? 750 : 8000), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;