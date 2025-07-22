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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading payment methods...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600">Manage payment options</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedPaymentMethod(null);
            setShowModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add Payment Method
        </button>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((paymentMethod) => (
          <div key={paymentMethod._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">{paymentMethod.name}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                paymentMethod.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {paymentMethod.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">{paymentMethod.description}</div>
              <div className="text-sm text-gray-500">Type: {paymentMethod.type}</div>
              {paymentMethod.accountInfo && (
                <div className="text-sm text-gray-500">
                  Account: {paymentMethod.accountInfo}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedPaymentMethod(paymentMethod);
                  setIsCreating(false);
                  setShowModal(true);
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeletePaymentMethod(paymentMethod._id)}
                className="px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isCreating ? 'Add New Payment Method' : 'Edit Payment Method'}
              </h3>
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
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedPaymentMethod?.name}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      defaultValue={selectedPaymentMethod?.description}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      name="type"
                      defaultValue={selectedPaymentMethod?.type}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="bank">Bank Transfer</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="crypto">Cryptocurrency</option>
                      <option value="card">Credit/Debit Card</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Information
                    </label>
                    <input
                      type="text"
                      name="accountInfo"
                      defaultValue={selectedPaymentMethod?.accountInfo}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Account number, phone number, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="isActive"
                      defaultValue={selectedPaymentMethod?.isActive?.toString() || 'true'}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedPaymentMethod(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {isCreating ? 'Create Payment Method' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods; 