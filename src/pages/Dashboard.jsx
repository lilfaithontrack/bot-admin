import { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch statistics from different endpoints
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        api.get('/users'),
        api.get('/orders'),
        api.get('/products')
      ]);

      const users = usersRes.data.users || [];
      const orders = ordersRes.data.orders || [];
      const products = productsRes.data.products || [];

      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue,
        recentOrders: orders.slice(0, 5),
        recentUsers: users.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: '🛒',
      color: 'bg-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-red-700',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: '💰',
      color: 'bg-red-800',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome to your Fetan platform overview</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                  {card.icon}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-red-600">{card.value}</p>
                </div>
              </div>
              <div className="w-full bg-red-100 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white text-xl mr-3">
                🛒
              </div>
              <h3 className="text-xl font-bold text-red-600">Recent Orders</h3>
            </div>
            <div className="space-y-4">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">
                        #
                      </div>
                      <div>
                        <p className="font-semibold text-red-600">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">${order.total} • {order.status}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📦</span>
                  </div>
                  <p className="text-gray-500">No recent orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white text-xl mr-3">
                👥
              </div>
              <h3 className="text-xl font-bold text-red-600">Recent Users</h3>
            </div>
            <div className="space-y-4">
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">
                        {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-red-600">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.telegramId} • {user.subscriptionStatus}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <p className="text-gray-500">No recent users</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6">
          <h3 className="text-xl font-bold text-red-600 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200">
              <span className="text-2xl mb-2">➕</span>
              <span className="font-semibold">Add Product</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-white text-red-600 border-2 border-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200">
              <span className="text-2xl mb-2">👥</span>
              <span className="font-semibold">View Users</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200">
              <span className="text-2xl mb-2">🛒</span>
              <span className="font-semibold">Manage Orders</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-white text-red-600 border-2 border-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200">
              <span className="text-2xl mb-2">📊</span>
              <span className="font-semibold">Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;