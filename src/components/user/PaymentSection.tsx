import React, { useEffect, useState } from 'react';
import { CreditCard, Copy, CheckCircle, AlertCircle, Banknote } from 'lucide-react';
import { fetchUserById } from '../../api/users';
import { User } from '../../types';

interface PaymentSectionProps {
  userId: string;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ userId }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer'>('bank_transfer');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    fetchUserById(userId).then(setUserData);
  }, [userId]);

  const bankDetails = {
    bankName: 'Emirates NBD',
    accountName: 'Ajman Kerala Kitchen LLC',
    accountNumber: '1234567890123456',
    iban: 'AE070260001234567890123',
    swiftCode: 'EBILAEAD'
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReadyToPay = () => {
    if (paymentMethod === 'bank_transfer') {
      setShowBankDetails(true);
    } else {
      alert('Cash payment request submitted. Our team will contact you soon.');
    }
  };

  const getPaymentStatusInfo = () => {
    if (!userData) {
      return {
        color: 'bg-gray-50 border-gray-200',
        icon: null,
        title: 'Loading payment info...',
        description: '',
        amount: 0
      };
    }

    switch (userData.paymentStatus) {
      case 'paid':
        return {
          color: 'bg-green-50 border-green-500',
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          title: 'Payment Up to Date',
          description: 'Your account is current. Next payment due on Feb 15, 2024',
          amount: 0
        };
      case 'half_paid':
        return {
          color: 'bg-yellow-50 border-yellow-500',
          icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
          title: 'Partial Payment Made',
          description: 'You have made a partial payment. Remaining amount is due.',
          amount: userData.planType === 'monthly' ? 375 : 4000
        };
      case 'unpaid':
        return {
          color: 'bg-red-50 border-red-500',
          icon: <AlertCircle className="w-6 h-6 text-red-600" />,
          title: 'Payment Required',
          description: 'Please make your payment to continue service',
          amount: userData.planType === 'monthly' ? 750 : 8000
        };
    }
  };

  const paymentInfo = getPaymentStatusInfo();

  if (!userData) {
    return <div className="p-8 text-center text-gray-500">Loading payment info...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Status</h2>
        
        {/* Payment Status */}
        <div className="mb-8">
          <div className={`p-4 rounded-lg border-l-4 ${paymentInfo.color}`}>
            <div className="flex items-center gap-3">
              {paymentInfo.icon}
              <div>
                <h3 className="font-semibold text-gray-800">
                  {paymentInfo.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {paymentInfo.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                {userData.paymentStatus === 'paid' ? 'Amount Paid:' : 'Amount Due:'}
              </span>
              <span className="text-2xl font-bold text-gray-800">
                AED {paymentInfo.amount}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Plan Type:</span>
              <span className="text-sm font-medium text-gray-800 capitalize">
                {userData.planType}
              </span>
            </div>
            {userData.paymentStatus === 'half_paid' && (
              <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You have paid 50% of your subscription. The remaining amount is due to continue service.
                </p>
              </div>
            )}
          </div>
        </div>

        {(userData.paymentStatus === 'unpaid' || userData.paymentStatus === 'half_paid') && (
          <>
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Payment Method</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-emerald-600" />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Bank Transfer</h4>
                      <p className="text-sm text-gray-600">Transfer to our UAE bank account</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    paymentMethod === 'cash'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-6 h-6 text-emerald-600" />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-800">Cash on Hand</h4>
                      <p className="text-sm text-gray-600">Pay cash to our delivery person</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Ready to Pay Button */}
            <button
              onClick={handleReadyToPay}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Ready to Pay
            </button>
          </>
        )}

        {/* Bank Details Modal */}
        {showBankDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Bank Transfer Details</h3>
              
              <div className="space-y-4">
                {Object.entries(bankDetails).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="font-medium text-gray-800">{value}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(value)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {copied && (
                <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg text-center">
                  Copied to clipboard!
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowBankDetails(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowBankDetails(false);
                    alert('Payment confirmation submitted. We will verify and update your status.');
                  }}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg transition-colors"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSection;