import { useState, useEffect } from 'react';
import api from '../services/api';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await api.get('/coupons');
      setCoupons(response.data.coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (couponData) => {
    try {
      await api.post('/coupons', couponData);
      fetchCoupons();
      setShowModal(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const handleUpdateCoupon = async (couponId, updates) => {
    try {
      await api.put(`/coupons/${couponId}`, updates);
      fetchCoupons();
      setShowModal(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.error('Error updating coupon:', error);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.delete(`/coupons/${couponId}`);
        fetchCoupons();
      } catch (error) {
        console.error('Error deleting coupon:', error);
      }
    }
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading coupons...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">Coupons</h1>
            <p className="text-xl text-gray-600">Manage discount coupons and promotional codes</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setSelectedCoupon(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
          >
            <span>🎫</span>
            Add Coupon
          </button>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    🎫
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-600">{coupon.code}</h3>
                    <p className="text-sm text-gray-500 capitalize">{coupon.discountType}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    coupon.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {coupon.expiryDate && isExpired(coupon.expiryDate) && (
                    <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                      Expired
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{coupon.description}</p>

              <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-100">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Min. Order: <span className="font-semibold">${coupon.minimumOrderAmount || 0}</span></div>
                  <div>Max Uses: <span className="font-semibold">{coupon.maxUses || 'Unlimited'}</span></div>
                  <div>Used: <span className="font-semibold">{coupon.usedCount || 0} times</span></div>
                  {coupon.expiryDate && (
                    <div>Expires: <span className="font-semibold">{new Date(coupon.expiryDate).toLocaleDateString()}</span></div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedCoupon(coupon);
                    setIsCreating(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCoupon(coupon._id)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors duration-200 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">
                  {isCreating ? 'Add New Coupon' : 'Edit Coupon'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedCoupon(null);
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
                const couponData = {
                  code: formData.get('code'),
                  description: formData.get('description'),
                  discountType: formData.get('discountType'),
                  discountValue: parseFloat(formData.get('discountValue')),
                  minimumOrderAmount: parseFloat(formData.get('minimumOrderAmount')) || 0,
                  maxUses: parseInt(formData.get('maxUses')) || null,
                  expiryDate: formData.get('expiryDate') || null,
                  isActive: formData.get('isActive') === 'true'
                };

                if (isCreating) {
                  handleCreateCoupon(couponData);
                } else {
                  handleUpdateCoupon(selectedCoupon._id, couponData);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Coupon Code</label>
                    <input
                      type="text"
                      name="code"
                      defaultValue={selectedCoupon?.code}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={selectedCoupon?.description}
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Discount Type</label>
                    <select
                      name="discountType"
                      defaultValue={selectedCoupon?.discountType || 'percentage'}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Discount Value</label>
                    <input
                      type="number"
                      name="discountValue"
                      step="0.01"
                      defaultValue={selectedCoupon?.discountValue}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Minimum Order Amount</label>
                    <input
                      type="number"
                      name="minimumOrderAmount"
                      step="0.01"
                      defaultValue={selectedCoupon?.minimumOrderAmount || 0}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Maximum Uses</label>
                    <input
                      type="number"
                      name="maxUses"
                      defaultValue={selectedCoupon?.maxUses || ''}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                      placeholder="Leave empty for unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Expiry Date</label>
                    <input
                      type="datetime-local"
                      name="expiryDate"
                      defaultValue={selectedCoupon?.expiryDate ? selectedCoupon.expiryDate.slice(0, 16) : ''}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Status</label>
                    <select
                      name="isActive"
                      defaultValue={selectedCoupon?.isActive?.toString() || 'true'}
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
                      setSelectedCoupon(null);
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
                    {isCreating ? 'Create Coupon' : 'Save Changes'}
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

export default Coupons;