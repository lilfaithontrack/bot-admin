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

  return (
    <div className="min-h-screen bg-white py-8 px-2 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-red-600 mb-1">Subscriptions</h1>
          <p className="text-lg text-black/70">Manage subscription plans</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedSubscription(null);
            setShowModal(true);
          }}
          className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
        >
          Add Subscription
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600 animate-pulse">Loading subscriptions...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <div key={subscription._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between min-h-[220px] border border-red-100 hover:shadow-2xl transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-red-600">{subscription.name}</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full shadow ${subscription.isActive ? 'bg-red-100 text-red-700' : 'bg-white text-red-400 border border-red-200'}`}>{subscription.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-2">${subscription.price}</div>
              <div className="text-base text-black/80 mb-1">{subscription.duration} days</div>
              <div className="text-base text-black/80 mb-2 line-clamp-2">{subscription.description}</div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedSubscription(subscription);
                    setIsCreating(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-red-600 text-red-600 font-semibold hover:bg-red-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSubscription(subscription._id)}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-red-200 relative animate-fadeIn">
            <h2 className="text-2xl font-bold text-red-600 mb-6">{isCreating ? 'Add New Subscription' : 'Edit Subscription'}</h2>
            <form
              onSubmit={e => {
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
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedSubscription?.name}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={selectedSubscription?.description}
                  required
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  defaultValue={selectedSubscription?.price}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-1">Duration (days)</label>
                <input
                  type="number"
                  name="duration"
                  defaultValue={selectedSubscription?.duration}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-1">Status</label>
                <select
                  name="isActive"
                  defaultValue={selectedSubscription?.isActive?.toString() || 'true'}
                  className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedSubscription(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
                >
                  {isCreating ? 'Create Subscription' : 'Save Changes'}
                </button>
              </div>
            </form>
            <button
              className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-2xl font-bold transition"
              onClick={() => {
                setShowModal(false);
                setSelectedSubscription(null);
                setIsCreating(false);
              }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions; 