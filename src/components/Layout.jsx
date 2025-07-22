import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../style.css';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Users', href: '/users', icon: '👥' },
  { name: 'Products', href: '/products', icon: '📦' },
  { name: 'Orders', href: '/orders', icon: '🛒' },
  { name: 'Subscriptions', href: '/subscriptions', icon: '💳' },
  { name: 'Levels', href: '/levels', icon: '⭐' },
  { name: 'Payment Methods', href: '/payment-methods', icon: '💳' },
  { name: 'Gallery', href: '/gallery', icon: '🖼️' },
  { name: 'Coupons', href: '/coupons', icon: '🎫' },
  { name: 'Agents', href: '/agents', icon: '👨‍💼' },
];

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNav = (href) => {
    navigate(href);
    setSidebarOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Sidebar */}
      <div className={`sidebar${sidebarOpen ? ' open' : ''}`} style={{ display: sidebarOpen ? 'flex' : '', zIndex: 99 }}>
        <div className="sidebar-header">
          <div className="sidebar-logo">{user?.fullName?.charAt(0)?.toUpperCase() || 'F'}</div>
          <span className="logo">Fetan Admin</span>
        </div>
        <nav>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => handleNav(item.href)}
                className={`nav-btn${isActive ? ' active' : ''}`}
              >
                <span style={{ fontSize: '1.2em' }}>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-avatar">{user?.fullName?.charAt(0)?.toUpperCase() || 'A'}</div>
          <div>
            <div style={{ fontWeight: 600 }}>{user?.fullName || 'Admin'}</div>
            <div style={{ fontSize: '0.85em', color: 'var(--red-dark)' }}>{user?.role || 'Administrator'}</div>
          </div>
        </div>
      </div>
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 98, background: 'rgba(0,0,0,0.4)' }} onClick={() => setSidebarOpen(false)}></div>
      )}
      {/* Main content */}
      <div className="layout-main">
        {/* Header */}
        <header className="app-header" style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          marginLeft: 'var(--sidebar-width)',
          width: `calc(100% - var(--sidebar-width))`,
          transition: 'margin 0.3s, width 0.3s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="btn-red"
              style={{ display: 'inline-block', marginRight: '1rem', fontSize: '1.5rem', background: 'transparent', color: 'var(--red)', border: 'none', boxShadow: 'none' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open sidebar"
            >
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>&#9776;</span>
            </button>
            <span className="logo">Fetan Admin</span>
          </div>
          <div className="user-info">
            <span style={{ fontSize: '1rem', fontWeight: 500 }}>Welcome back, <span style={{ fontWeight: 700 }}>{user?.fullName || 'Admin'}</span></span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        <main style={{ padding: '2rem 1rem', minHeight: 'calc(100vh - 64px)', background: 'var(--white)' }}>
          <Outlet />
        </main>
      </div>
      {/* Responsive adjustments for mobile */}
      <style>{`
        @media (max-width: 1024px) {
          .app-header {
            margin-left: 0 !important;
            width: 100% !important;
          }
          .layout-main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout; 