import { useState, useEffect } from 'react';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await api.put(`/users/${userId}`, updates);
      fetchUsers();
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !isActive });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telegramId?.includes(searchTerm) ||
    user.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">Users</h1>
            <p className="text-xl text-gray-600">Manage your platform users</p>
          </div>
          <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              👥
            </div>
            <span className="text-red-600 font-semibold">{filteredUsers.length} users</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, Telegram ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400">
              🔍
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-lg font-bold mr-3">
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-red-600">{user.fullName}</h3>
                    <p className="text-sm text-gray-500">@{user.username || 'No username'}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 mr-2">📱</span>
                  <span>{user.telegramId}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 mr-2">📞</span>
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-4 mr-2">💳</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.subscriptionStatus === 'active'
                      ? 'bg-green-100 text-green-800'
                      : user.subscriptionStatus === 'expired'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.subscriptionStatus}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                  className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-colors duration-200 ${
                    user.isActive
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit User Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">Edit User</h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-red-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleUpdateUser(selectedUser._id, {
                  fullName: formData.get('fullName'),
                  phone: formData.get('phone'),
                  subscriptionStatus: formData.get('subscriptionStatus')
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      defaultValue={selectedUser?.fullName}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={selectedUser?.phone}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Subscription Status</label>
                    <select
                      name="subscriptionStatus"
                      defaultValue={selectedUser?.subscriptionStatus}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedUser(null);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;