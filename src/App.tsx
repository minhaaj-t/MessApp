import React, { useState } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import UserDashboard from './components/user/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState<{
    type: 'admin' | 'user' | null;
    userId?: string;
  }>({ type: null });
  const [currentPage, setCurrentPage] = useState<'login' | 'registration'>('login');

  const handleLogin = (userType: 'admin' | 'user', userId?: string) => {
    setCurrentUser({ type: userType, userId });
  };

  const handleLogout = () => {
    setCurrentUser({ type: null });
    setCurrentPage('login');
  };

  const handleNavigate = (page: string) => {
    if (page === 'login') {
      setCurrentPage('login');
    } else if (page === 'registration') {
      setCurrentPage('registration');
    } else if (page === 'home') {
      setCurrentPage('login');
    }
  };

  if (!currentUser.type) {
    if (currentPage === 'registration') {
      return <Registration onNavigate={handleNavigate} />;
    }
    return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  if (currentUser.type === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (currentUser.type === 'user' && currentUser.userId) {
    return <UserDashboard userId={currentUser.userId} onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
}

export default App;