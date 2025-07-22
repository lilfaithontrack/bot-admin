import { useState, useEffect } from 'react';
import api from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await api.post('/products', productData);
      fetchProducts();
      setShowModal(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (productId, updates) => {
    try {
      await api.put(`/products/${productId}`, updates);
      fetchProducts();
      setShowModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleToggleProductStatus = async (productId, isActive) => {
    try {
      await api.put(`/products/${productId}`, { isActive: !isActive });
      fetchProducts();
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">Products</h1>
            <p className="text-xl text-gray-600">Manage your product catalog</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setSelectedProduct(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
          >
            <span>➕</span>
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400">
              🔍
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Product Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl text-gray-300">📦</div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-red-600 line-clamp-1">{product.name}</h3>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    product.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-600">${product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsCreating(false);
                      setShowModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleProductStatus(product._id, product.isActive)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                      product.isActive
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                  >
                    {product.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="px-3 py-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">
                  {isCreating ? 'Add New Product' : 'Edit Product'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedProduct(null);
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
                const productData = {
                  name: formData.get('name'),
                  description: formData.get('description'),
                  price: parseFloat(formData.get('price')),
                  originalPrice: parseFloat(formData.get('originalPrice')),
                  category: formData.get('category'),
                  stock: parseInt(formData.get('stock')),
                  isActive: formData.get('isActive') === 'true',
                  featured: formData.get('featured') === 'true'
                };

                if (isCreating) {
                  handleCreateProduct(productData);
                } else {
                  handleUpdateProduct(selectedProduct._id, productData);
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedProduct?.name}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={selectedProduct?.category}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      defaultValue={selectedProduct?.price}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Original Price</label>
                    <input
                      type="number"
                      name="originalPrice"
                      step="0.01"
                      defaultValue={selectedProduct?.originalPrice}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      defaultValue={selectedProduct?.stock || 0}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Status</label>
                    <select
                      name="isActive"
                      defaultValue={selectedProduct?.isActive?.toString() || 'true'}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Featured</label>
                    <select
                      name="featured"
                      defaultValue={selectedProduct?.featured?.toString() || 'false'}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-semibold text-red-600 mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={selectedProduct?.description}
                    required
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedProduct(null);
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
                    {isCreating ? 'Create Product' : 'Save Changes'}
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

export default Products;