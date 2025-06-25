export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  planType: 'monthly' | 'yearly' | 'weekly';
  paymentStatus: 'paid' | 'half_paid' | 'unpaid';
  timePreference: 'afternoon' | 'night' | 'both';
  estimatedDeliveryTime: string;
  joinedDate: string;
  expiryDate?: string;
  daysActive: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  isOptional: boolean;
  alternatives?: string[];
}

export interface DailyMenu {
  id: string;
  date: string;
  timeSlot: 'afternoon' | 'night';
  items: MenuItem[];
  notes?: string;
  cutoffTime: string; // "12:00" for afternoon, "18:00" for night
}

export interface UserMenuSelection {
  id: string;
  userId: string;
  date: string;
  selections: {
    itemId: string;
    selectedOption: string;
  }[];
  specialNote?: string;
  submittedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'emergency';
  isActive: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'emergency';
  isActive: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  message: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
}

export interface DeliveryTimeRequest {
  id: string;
  userId: string;
  userName: string;
  currentTime: string;
  requestedTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  processedAt?: string;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'cash' | 'bank_transfer';
  status: 'pending' | 'confirmed';
  transactionId?: string;
  paidAt: string;
}