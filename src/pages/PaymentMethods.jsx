import { useState, useEffect } from 'react';
import api from '../services/api';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get('/payment-methods');
      setPaymentMethods(response.data.paymentMethods || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaymentMethod = async (paymentMethodData) => {
    try {
      await api.post('/payment-methods', paymentMethodData);
      fetchPaymentMethods();
      setShowModal(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating payment method:', error);
    }
  };

  const handleUpdatePaymentMethod = async (paymentMethodId, updates) => {
    try {
      await api.put(`/payment-methods/${paymentMethodId}`, updates);
      fetchPaymentMethods();
      setShowModal(false);
      setSelectedPaymentMethod(null);
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await api.delete(`/payment-methods/${paymentMethodId}`);
        fetchPaymentMethods();
      } catch (error) {
        console.error('Error deleting payment method:', error);
      }
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bank': return '🏦';
      case 'mobile_money': return '📱';
      case 'crypto': return '₿';
      case 'card': return '💳';
      default: return '💰';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading payment methods...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">Payment Methods</h1>
            <p className="text-xl text-gray-600">Manage payment options</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setSelectedPaymentMethod(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
          >
            <span>💳</span>
            Add Payment Method
          </button>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.map((paymentMethod) => (
            <div key={paymentMethod._id} className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    {getTypeIcon(paymentMethod.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-600">{paymentMethod.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{paymentMethod.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  paymentMethod.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {paymentMethod.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{paymentMethod.description}</p>
              
              {paymentMethod.accountInfo && (
                <div className="bg-red-50 rounded-lg p-3 mb-4 border border-red-100">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-red-600">Account:</span> {paymentMethod.accountInfo}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPaymentMethod(paymentMethod);
                    setIsCreating(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePaymentMethod(paymentMethod._id)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors duration-200 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Method Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">
                  {isCreating ? 'Add New Payment Method' : 'Edit Payment Method'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPaymentMethod(null);
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
                const paymentMethodData = {
                  name: formData.get('name'),
                  description: formData.get('description'),
                  type: formData.get('type'),
                  accountInfo: formData.get('accountInfo'),
                  isActive: formData.get('isActive') === 'true'
                };

                if (isCreating) {
                  handleCreatePaymentMethod(paymentMethodData);
                } else {
                  handleUpdatePaymentMethod(selectedPaymentMethod._id, paymentMethodData);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedPaymentMethod?.name}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={selectedPaymentMethod?.description}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Type</label>
                    <select
                      name="type"
                      defaultValue={selectedPaymentMethod?.type}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    >
                      <option value="bank">Bank Transfer</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="crypto">Cryptocurrency</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Account Information</label>
                    <input
                      type="text"
                      name="accountInfo"
                      defaultValue={selectedPaymentMethod?.accountInfo}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                      placeholder="Account number, phone number, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Status</label>
                    <select
                      name="isActive"
                      defaultValue={selectedPaymentMethod?.isActive?.toString() || 'true'}
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
                      setSelectedPaymentMethod(null);
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
                    {isCreating ? 'Create Payment Method' : 'Save Changes'}
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

export default PaymentMethods;