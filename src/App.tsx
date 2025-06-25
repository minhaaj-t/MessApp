import React, { useState } from 'react';
import Login from './components/Login';
import Registration from './components/Registration';
import UserDashboard from './components/user/UserDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { Home, Utensils, User as UserIcon, BarChart3 } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState<{
    type: 'admin' | 'user' | null;
    userId?: string;
  }>({ type: null });
  const [currentPage, setCurrentPage] = useState<'login' | 'registration' | 'dashboard' | 'home'>('login');
  const [activeNav, setActiveNav] = useState<'home' | 'menu' | 'profile' | 'analytics'>('home');

  const handleLogin = (userType: 'admin' | 'user', userId?: string) => {
    setCurrentUser({ type: userType, userId });
    setCurrentPage('dashboard');
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

  // Main content
  let mainContent;
  if (!currentUser.type) {
    if (currentPage === 'registration') {
      mainContent = <Registration onNavigate={handleNavigate} />;
    } else {
      mainContent = <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
    }
  } else if (currentUser.type === 'admin') {
    mainContent = <AdminDashboard onLogout={handleLogout} />;
  } else if (currentUser.type === 'user' && currentUser.userId) {
    mainContent = <UserDashboard userId={currentUser.userId} onLogout={handleLogout} />;
  } else {
    mainContent = <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex flex-col items-center">
      {/* Fixed Header */}
      <header className="w-full bg-white shadow-md py-3 px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 max-w-md mx-auto">
        <span className="font-bold text-emerald-600 text-lg">Kerala Kitchen</span>
      </header>
      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto pt-16 pb-16 px-2">
        {mainContent}
      </main>
      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around py-2 z-50 max-w-md mx-auto w-full">
        <button className={`flex flex-col items-center ${activeNav === 'home' ? 'text-emerald-600' : 'text-gray-500'}`} onClick={() => setActiveNav('home')}>
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </button>
        <button className={`flex flex-col items-center ${activeNav === 'menu' ? 'text-emerald-600' : 'text-gray-500'}`} onClick={() => setActiveNav('menu')}>
          <Utensils className="w-6 h-6" />
          <span className="text-xs">Menu</span>
        </button>
        <button className={`flex flex-col items-center ${activeNav === 'profile' ? 'text-emerald-600' : 'text-gray-500'}`} onClick={() => setActiveNav('profile')}>
          <UserIcon className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
        <button className={`flex flex-col items-center ${activeNav === 'analytics' ? 'text-emerald-600' : 'text-gray-500'}`} onClick={() => setActiveNav('analytics')}>
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs">Stats</span>
        </button>
      </nav>
    </div>
  );
}

export default App;