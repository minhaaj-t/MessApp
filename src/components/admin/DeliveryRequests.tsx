import React, { useEffect, useState } from 'react';
import { Clock, Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { mockUsers } from '../../data/mockData';

interface DeliveryRequest {
  id: string;
  userId: string;
  userName: string;
  currentTime: string;
  requestedTime: string;
  reason: string;
  status: string;
  submittedAt: string;
  processedAt?: string;
}

const DeliveryRequests: React.FC = () => {
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    setRequests([
      {
        id: '1',
        userId: '1',
        userName: 'Test User',
        currentTime: '01:00 PM',
        requestedTime: '09:00 PM',
        reason: 'Work schedule change',
        status: 'pending',
        submittedAt: '2024-06-01T10:00:00Z',
        processedAt: undefined
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Doe',
        currentTime: '09:00 PM',
        requestedTime: '01:00 PM',
        reason: 'Personal preference',
        status: 'approved',
        submittedAt: '2024-06-05T14:00:00Z',
        processedAt: '2024-06-06T09:00:00Z'
      }
    ]);
    setUsers(mockUsers);
  }, []);

  const filteredRequests = requests.filter(request => 
    filter === 'all' || request.status === filter
  );

  const handleStatusChange = (requestId: string, newStatus: 'approved' | 'rejected') => {
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: newStatus, processedAt: new Date().toISOString().split('T')[0] }
        : request
    ));

    // If approved, update user's delivery time
    if (newStatus === 'approved') {
      const request = requests.find(r => r.id === requestId);
      if (request) {
        alert(`Delivery time updated for ${request.userName} to ${request.requestedTime}`);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              <p className="text-sm text-gray-600">Pending Requests</p>
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
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{rejectedCount}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{requests.length}</p>
              <p className="text-sm text-gray-600">Total Requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Delivery Time Requests</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{request.userName}</h3>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(request.status)}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Current Time:</span>
                        <span className="font-semibold text-gray-800">{request.currentTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span className="text-gray-600">Requested Time:</span>
                        <span className="font-semibold text-emerald-600">{request.requestedTime}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Submitted:</span>
                        <span className="text-gray-800">{new Date(request.submittedAt).toLocaleDateString()}</span>
                      </div>
                      {request.processedAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">Processed:</span>
                          <span className="text-gray-800">{new Date(request.processedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Reason:</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{request.reason}</p>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(request.id, 'approved')}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(request.id, 'rejected')}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No delivery time requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryRequests;