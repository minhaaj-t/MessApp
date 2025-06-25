import React, { useEffect, useState } from 'react';
import { Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';

interface DeliveryTimeRequestProps {
  userId: string;
}

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

const DeliveryTimeRequest: React.FC<DeliveryTimeRequestProps> = ({ userId }) => {
  const [requestedTime, setRequestedTime] = useState('');
  const [requestedTimeSlot, setRequestedTimeSlot] = useState<'afternoon' | 'night'>('afternoon');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [userRequests, setUserRequests] = useState<DeliveryRequest[]>([]);

  useEffect(() => {
    setUserData(mockUsers.find(u => u.id === userId) || null);
    setUserRequests([
      {
        id: '1',
        userId,
        userName: 'Test User',
        currentTime: '01:00 PM',
        requestedTime: '09:00 PM',
        reason: 'Work schedule change',
        status: 'pending',
        submittedAt: '2024-06-01T10:00:00Z'
      }
    ]);
  }, [userId]);

  const getDefaultDeliveryTime = (timeSlot: 'afternoon' | 'night') => {
    return timeSlot === 'afternoon' ? '01:00 PM' : '09:00 PM';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRequestedTime('');
      setRequestedTimeSlot('afternoon');
      setReason('');
      setUserRequests([
        {
          id: '1',
          userId,
          userName: 'Test User',
          currentTime: '01:00 PM',
          requestedTime: '09:00 PM',
          reason: 'Work schedule change',
          status: 'pending',
          submittedAt: '2024-06-01T10:00:00Z'
        }
      ]);
      alert('Delivery time change request submitted! Admin will review and update your delivery time.');
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (!userData) {
    return <div className="p-8 text-center text-gray-500">Loading delivery info...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Current Delivery Time */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Time Management</h2>
        
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="font-semibold text-gray-800">Current Delivery Time</h3>
              {/* Will replace with Supabase fetch logic. */}
              <p className="text-2xl font-bold text-emerald-600">{getDefaultDeliveryTime(requestedTimeSlot)}</p>
              <p className="text-sm text-emerald-700 mt-1">
                Time Preference: {requestedTimeSlot === 'afternoon' ? 'Afternoon Only' :
                                requestedTimeSlot === 'night' ? 'Night Only' : 'Both Times'}
              </p>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time Slot
              </label>
              <select
                value={requestedTimeSlot}
                onChange={(e) => setRequestedTimeSlot(e.target.value as 'afternoon' | 'night')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="afternoon">Afternoon (12:00 PM - 3:00 PM)</option>
                <option value="night">Night (7:00 PM - 10:00 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requested Delivery Time
              </label>
              <input
                type="text"
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
                placeholder={requestedTimeSlot === 'afternoon' ? 'e.g., 01:30 PM' : 'e.g., 09:30 PM'}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Change
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you need to change your delivery time..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {submitted ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Request
              </>
            )}
          </button>
        </form>
      </div>

      {/* Request History */}
      {/* Will replace with Supabase fetch logic. */}
      {/* <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Request History</h3>
        
        <div className="space-y-4">
          {userRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(request.submittedAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">From:</span>
                  <span className="font-semibold text-gray-800 ml-2">{request.currentTime}</span>
                </div>
                <div>
                  <span className="text-gray-600">To:</span>
                  <span className="font-semibold text-gray-800 ml-2">{request.requestedTime}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="text-gray-600 text-sm">Reason:</span>
                <p className="text-gray-800 mt-1">{request.reason}</p>
              </div>
              
              {request.processedAt && (
                <div className="mt-3 text-sm text-gray-500">
                  Processed on: {new Date(request.processedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div> */}

      {/* Guidelines */}
      <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
        <h3 className="text-lg font-semibold text-amber-800 mb-3">Delivery Time Guidelines</h3>
        <ul className="text-sm text-amber-700 space-y-2">
          <li>• Afternoon deliveries: 12:00 PM - 3:00 PM (Default: 01:00 PM)</li>
          <li>• Night deliveries: 7:00 PM - 10:00 PM (Default: 09:00 PM)</li>
          <li>• Delivery time changes are subject to admin approval</li>
          <li>• Please allow 24-48 hours for processing your request</li>
          <li>• Changes may not be possible during peak hours</li>
          <li>• Provide a valid reason to help us process your request faster</li>
          <li>• You will be notified once your request is approved or rejected</li>
        </ul>
      </div>
    </div>
  );
};

export default DeliveryTimeRequest;