// Deprecated: All mock data has been removed. Use Supabase for all data operations.

// Mock Users
export const mockUsers = [
  {
    id: '1',
    name: 'Test User',
    phone: '1234567890',
    email: 'test@example.com',
    password: 'testpassword',
    address: '123 Main St',
    location: { lat: 12.9716, lng: 77.5946 },
    status: 'approved' as const,
    planType: 'monthly' as const,
    paymentStatus: 'paid' as const,
    timePreference: 'afternoon' as const,
    estimatedDeliveryTime: '01:00 PM',
    joinedDate: '2024-06-01',
    expiryDate: '2024-07-01',
    daysActive: 10
  },
  {
    id: '2',
    name: 'Jane Doe',
    phone: '9876543210',
    email: 'jane@example.com',
    password: 'janepass',
    address: '456 Side St',
    location: { lat: 12.2958, lng: 76.6394 },
    status: 'pending' as const,
    planType: 'weekly' as const,
    paymentStatus: 'unpaid' as const,
    timePreference: 'night' as const,
    estimatedDeliveryTime: '09:00 PM',
    joinedDate: '2024-06-05',
    expiryDate: undefined,
    daysActive: 3
  }
];

// Mock Orders
export const mockOrders = [
  {
    id: 'ORD001',
    userName: 'Test User',
    address: '123 Main St',
    date: '2024-06-10',
    status: 'delivered',
    items: ['Rice', 'Sambar', 'Paneer Curry'],
  },
  {
    id: 'ORD002',
    userName: 'Jane Doe',
    address: '456 Side St',
    date: '2024-06-10',
    status: 'preparing',
    items: ['Chapati', 'Dal Fry', 'Chicken Curry'],
  }
];

// Mock Delivery Slots
export const mockDeliverySlots = [
  {
    id: 'DS001',
    time: '01:00 PM',
    type: 'lunch',
    capacity: 50,
    isActive: true,
    currentBookings: 20
  },
  {
    id: 'DS002',
    time: '09:00 PM',
    type: 'dinner',
    capacity: 50,
    isActive: true,
    currentBookings: 15
  }
];

// Mock Banners
export const mockBanners = [
  {
    id: 'BN001',
    title: 'Welcome!',
    message: 'Welcome to Kerala Kitchen!',
    type: 'info' as const,
    isActive: true,
    createdAt: '2024-06-01'
  },
  {
    id: 'BN002',
    title: 'Payment Due',
    message: 'Your payment is pending.',
    type: 'warning' as const,
    isActive: true,
    createdAt: '2024-06-05'
  }
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 'NT001',
    title: 'System Maintenance',
    message: 'System will be down for maintenance tonight.',
    type: 'warning' as const,
    isActive: true,
    createdAt: '2024-06-01'
  },
  {
    id: 'NT002',
    title: 'Emergency Alert',
    message: 'Delivery service temporarily suspended due to weather.',
    type: 'emergency' as const,
    isActive: true,
    createdAt: '2024-06-05'
  }
];