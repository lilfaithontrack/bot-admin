import { useState, useEffect } from 'react';
import api from '../services/api';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/subscriptions');
      setSubscriptions(response.data.subscriptions || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = async (subscriptionData) => {
    try {
      await api.post('/subscriptions', subscriptionData);
      fetchSubscriptions();
      setShowModal(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating subscription:', error);
    }
  };

  const handleUpdateSubscription = async (subscriptionId, updates) => {
    try {
      await api.put(`/subscriptions/${subscriptionId}`, updates);
      fetchSubscriptions();
      setShowModal(false);
      setSelectedSubscription(null);
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleDeleteSubscription = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await api.delete(`/subscriptions/${subscriptionId}`);
        fetchSubscriptions();
      } catch (error) {
        console.error('Error deleting subscription:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">Subscriptions</h1>
            <p className="text-xl text-gray-600">Manage subscription plans</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setSelectedSubscription(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
          >
            <span>➕</span>
            Add Subscription
          </button>
        </div>

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <div key={subscription._id} className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-red-600">{subscription.name}</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  subscription.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="text-3xl font-bold text-red-600 mb-2">${subscription.price}</div>
              <div className="text-lg text-gray-600 mb-2">{subscription.duration} days</div>
              <p className="text-gray-600 mb-4 line-clamp-2">{subscription.description}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedSubscription(subscription);
                    setIsCreating(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSubscription(subscription._id)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors duration-200 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subscription Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">
                  {isCreating ? 'Add New Subscription' : 'Edit Subscription'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedSubscription(null);
                    setIsCreating(false);
                  }}
                  className="text-gray-400 hover:text-red-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const subscriptionData = {
                  name: formData.get('name'),
                  description: formData.get('description'),
                  price: parseFloat(formData.get('price')),
                  duration: parseInt(formData.get('duration')),
                  isActive: formData.get('isActive') === 'true',
                };

                if (isCreating) {
                  handleCreateSubscription(subscriptionData);
                } else {
                  handleUpdateSubscription(selectedSubscription._id, subscriptionData);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedSubscription?.name}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={selectedSubscription?.description}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      defaultValue={selectedSubscription?.price}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      name="duration"
                      defaultValue={selectedSubscription?.duration}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Status</label>
                    <select
                      name="isActive"
                      defaultValue={selectedSubscription?.isActive?.toString() || 'true'}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedSubscription(null);
                      setIsCreating(false);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
                  >
                    {isCreating ? 'Create Subscription' : 'Save Changes'}
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

export default Subscriptions;