import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Users, Package, DollarSign, Star, CreditCard, AlertTriangle, CheckCircle, Calendar, BarChart3, PieChart, Activity, Clock } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Analytics: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    supabase.from('users').select('*').then(({ data }) => setUsers(data || []));
    supabase.from('payments').select('*').then(({ data }) => setPayments(data || []));
  }, []);

  // Calculate financial metrics from mock data
  const totalUsers = users.length;
  const paidUsers = users.filter(u => u.paymentStatus === 'paid').length;
  const halfPaidUsers = users.filter(u => u.paymentStatus === 'half_paid').length;
  const unpaidUsers = users.filter(u => u.paymentStatus === 'unpaid').length;

  // Time preference metrics
  const afternoonUsers = users.filter(u => u.timePreference === 'afternoon').length;
  const nightUsers = users.filter(u => u.timePreference === 'night').length;
  const bothTimeUsers = users.filter(u => u.timePreference === 'both').length;

  const monthlyRevenue = paidUsers * 750 + halfPaidUsers * 375;
  const yearlyRevenue = paidUsers * 8000 + halfPaidUsers * 4000;
  const totalRevenue = monthlyRevenue + yearlyRevenue;

  const pendingRevenue = unpaidUsers * 750 + halfPaidUsers * 375;

  const metrics = [
    {
      title: 'Total Revenue',
      value: `AED ${totalRevenue.toLocaleString()}`,
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pending Collections',
      value: `AED ${pendingRevenue.toLocaleString()}`,
      change: '-5.2%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Active Subscriptions',
      value: totalUsers.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Payment Success Rate',
      value: `${Math.round((paidUsers / totalUsers) * 100)}%`,
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  const paymentStats = [
    { status: 'Fully Paid', count: paidUsers, amount: paidUsers * 750, color: 'bg-green-500' },
    { status: 'Half Paid', count: halfPaidUsers, amount: halfPaidUsers * 375, color: 'bg-yellow-500' },
    { status: 'Unpaid', count: unpaidUsers, amount: unpaidUsers * 750, color: 'bg-red-500' }
  ];

  const timePreferenceStats = [
    { preference: 'Afternoon Only', count: afternoonUsers, color: 'bg-orange-500' },
    { preference: 'Night Only', count: nightUsers, color: 'bg-indigo-500' },
    { preference: 'Both Times', count: bothTimeUsers, color: 'bg-purple-500' }
  ];

  const revenueBreakdown = [
    { plan: 'Monthly Plans', revenue: monthlyRevenue, percentage: Math.round((monthlyRevenue / totalRevenue) * 100) },
    { plan: 'Yearly Plans', revenue: yearlyRevenue, percentage: Math.round((yearlyRevenue / totalRevenue) * 100) }
  ];

  const monthlyTrends = [
    { month: 'Jan', revenue: 8500, orders: 120 },
    { month: 'Feb', revenue: 9200, orders: 135 },
    { month: 'Mar', revenue: 8800, orders: 128 },
    { month: 'Apr', revenue: 9500, orders: 142 },
    { month: 'May', revenue: 10200, orders: 155 },
    { month: 'Jun', revenue: 9800, orders: 148 }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Financial Analytics</h2>
          <div className="flex gap-2">
            {['week', 'month', 'quarter'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{metric.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-sm text-gray-600">{metric.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Payment Status Distribution
          </h3>
          <div className="space-y-4">
            {paymentStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{stat.status}</span>
                    <span className="text-sm text-gray-600">
                      {stat.count} users • AED {stat.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${stat.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${(stat.count / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Preference Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Preference Distribution
          </h3>
          <div className="space-y-4">
            {timePreferenceStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{stat.preference}</span>
                    <span className="text-sm text-gray-600">
                      {stat.count} users
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${stat.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${(stat.count / totalUsers) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Revenue Breakdown
        </h3>
        <div className="space-y-4">
          {revenueBreakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.plan}</span>
                  <span className="text-sm text-gray-600">
                    AED {item.revenue.toLocaleString()} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Revenue Trends */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Monthly Revenue Trends
        </h3>
        <div className="grid grid-cols-6 gap-4">
          {monthlyTrends.map((trend, index) => (
            <div key={index} className="text-center">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">{trend.month}</p>
                <p className="text-lg font-bold text-emerald-600">AED {trend.revenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{trend.orders} orders</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Insights */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Cash Flow
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Incoming:</span>
              <span className="text-sm font-semibold text-green-600">AED {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending:</span>
              <span className="text-sm font-semibold text-yellow-600">AED {pendingRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Net Flow:</span>
              <span className="text-sm font-semibold text-emerald-600">AED {(totalRevenue - pendingRevenue).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Customer Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Customers:</span>
              <span className="text-sm font-semibold text-gray-800">{totalUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Paying Customers:</span>
              <span className="text-sm font-semibold text-green-600">{paidUsers + halfPaidUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Conversion Rate:</span>
              <span className="text-sm font-semibold text-emerald-600">
                {Math.round(((paidUsers + halfPaidUsers) / totalUsers) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Health
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Fully Paid:</span>
              <span className="text-sm font-semibold text-green-600">{paidUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Partial Payments:</span>
              <span className="text-sm font-semibold text-yellow-600">{halfPaidUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Overdue:</span>
              <span className="text-sm font-semibold text-red-600">{unpaidUsers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Financial Activity */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Financial Activity</h3>
        <div className="space-y-4">
          {[
            { time: '2 minutes ago', activity: 'Payment received from Ahmed Hassan - AED 750', type: 'payment', amount: '+750' },
            { time: '15 minutes ago', activity: 'Partial payment from Priya Nair - AED 4000', type: 'partial', amount: '+4000' },
            { time: '30 minutes ago', activity: 'Payment reminder sent to Ravi Kumar', type: 'reminder', amount: '-0' },
            { time: '1 hour ago', activity: 'New yearly subscription - Fatima Al-Zahra', type: 'subscription', amount: '+8000' },
            { time: '2 hours ago', activity: 'Monthly payment from Mohammed Ali', type: 'payment', amount: '+750' }
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                item.type === 'payment' ? 'bg-green-100' :
                item.type === 'partial' ? 'bg-yellow-100' :
                item.type === 'reminder' ? 'bg-red-100' :
                'bg-blue-100'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  item.type === 'payment' ? 'bg-green-500' :
                  item.type === 'partial' ? 'bg-yellow-500' :
                  item.type === 'reminder' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">{item.activity}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
              <span className={`text-sm font-semibold ${
                item.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;