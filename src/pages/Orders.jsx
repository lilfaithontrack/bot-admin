import { useState, useEffect } from 'react';
import api from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      fetchOrders();
      setShowModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleUpdatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      await api.put(`/orders/${orderId}/payment-status`, { paymentStatus });
      fetchOrders();
      setShowModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber?.includes(searchTerm) ||
    order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">Orders</h1>
            <p className="text-xl text-gray-600">Manage customer orders</p>
          </div>
          <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
              🛒
            </div>
            <span className="text-red-600 font-semibold">{filteredOrders.length} orders</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by order number or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400">
              🔍
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-red-100">
              <thead className="bg-red-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-red-50">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-red-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600">
                        #{order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {order.user?.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.telegramId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-red-600">
                        ${order.total?.toFixed(2)}
                      </div>
                      {order.discount > 0 && (
                        <div className="text-sm text-green-600">
                          -${order.discount.toFixed(2)} discount
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-red-600">
                    Order #{selectedOrder.orderNumber}
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedOrder(null);
                    }}
                    className="text-gray-400 hover:text-red-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h4 className="font-bold text-red-600 mb-4 text-lg">Order Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Customer:</span>
                        <span className="text-gray-900">{selectedOrder.user?.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Telegram ID:</span>
                        <span className="text-gray-900">{selectedOrder.user?.telegramId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Phone:</span>
                        <span className="text-gray-900">{selectedOrder.user?.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Date:</span>
                        <span className="text-gray-900">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Subtotal:</span>
                        <span className="text-gray-900">${selectedOrder.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Discount:</span>
                        <span className="text-green-600">${selectedOrder.discount?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-red-200 pt-2">
                        <span className="font-bold text-red-600">Total:</span>
                        <span className="font-bold text-red-600">${selectedOrder.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Management */}
                  <div className="bg-white rounded-xl p-6 border-2 border-red-200">
                    <h4 className="font-bold text-red-600 mb-4 text-lg">Status Management</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-red-600 mb-2">
                          Order Status
                        </label>
                        <select
                          defaultValue={selectedOrder.status}
                          onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                          className="block w-full border-2 border-red-200 rounded-xl px-4 py-3 focus:border-red-500 focus:outline-none transition-colors duration-200"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-red-600 mb-2">
                          Payment Status
                        </label>
                        <select
                          defaultValue={selectedOrder.paymentStatus}
                          onChange={(e) => handleUpdatePaymentStatus(selectedOrder._id, e.target.value)}
                          className="block w-full border-2 border-red-200 rounded-xl px-4 py-3 focus:border-red-500 focus:outline-none transition-colors duration-200"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  <h4 className="font-bold text-red-600 mb-4 text-lg">Order Items</h4>
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-red-200 last:border-b-0">
                        <div>
                          <div className="font-semibold text-gray-900">{item.product?.name}</div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-600">${item.price?.toFixed(2)}</div>
                          {item.discount > 0 && (
                            <div className="text-sm text-green-600">-${item.discount.toFixed(2)}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Information */}
                {selectedOrder.shippingAddress && (
                  <div className="mt-6">
                    <h4 className="font-bold text-red-600 mb-4 text-lg">Shipping Address</h4>
                    <div className="bg-red-50 rounded-xl p-6 border border-red-100 text-sm">
                      <div className="font-semibold text-gray-900">{selectedOrder.shippingAddress.fullName}</div>
                      <div className="text-gray-700">{selectedOrder.shippingAddress.phone}</div>
                      <div className="text-gray-700">{selectedOrder.shippingAddress.address}</div>
                      <div className="text-gray-700">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                      </div>
                      <div className="text-gray-700">{selectedOrder.shippingAddress.country}</div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="mt-6">
                    <h4 className="font-bold text-red-600 mb-4 text-lg">Notes</h4>
                    <div className="bg-red-50 rounded-xl p-6 border border-red-100 text-sm text-gray-700">
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;