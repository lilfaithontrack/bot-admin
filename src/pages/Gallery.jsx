import { useState, useEffect } from 'react';
import api from '../services/api';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await api.get('/gallery');
      setGalleryItems(response.data.galleryItems || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGalleryItem = async (galleryData) => {
    try {
      await api.post('/gallery', galleryData);
      fetchGalleryItems();
      setShowModal(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating gallery item:', error);
    }
  };

  const handleUpdateGalleryItem = async (itemId, updates) => {
    try {
      await api.put(`/gallery/${itemId}`, updates);
      fetchGalleryItems();
      setShowModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating gallery item:', error);
    }
  };

  const handleDeleteGalleryItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        await api.delete(`/gallery/${itemId}`);
        fetchGalleryItems();
      } catch (error) {
        console.error('Error deleting gallery item:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">Gallery</h1>
            <p className="text-xl text-gray-600">Manage images and media content</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setSelectedItem(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
          >
            <span>🖼️</span>
            Add Item
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-red-50 flex items-center justify-center border-b border-red-100">
                    <span className="text-4xl text-red-300">🖼️</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-red-600 line-clamp-1">{item.title}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    item.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                {item.category && (
                  <div className="bg-red-50 rounded-lg px-3 py-1 mb-3 border border-red-100">
                    <span className="text-xs font-semibold text-red-600">{item.category}</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsCreating(false);
                      setShowModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGalleryItem(item._id)}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Item Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">
                  {isCreating ? 'Add New Gallery Item' : 'Edit Gallery Item'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedItem(null);
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
                const galleryData = {
                  title: formData.get('title'),
                  description: formData.get('description'),
                  imageUrl: formData.get('imageUrl'),
                  category: formData.get('category'),
                  isActive: formData.get('isActive') === 'true'
                };

                if (isCreating) {
                  handleCreateGalleryItem(galleryData);
                } else {
                  handleUpdateGalleryItem(selectedItem._id, galleryData);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={selectedItem?.title}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={selectedItem?.description}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      defaultValue={selectedItem?.imageUrl}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={selectedItem?.category}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Status</label>
                    <select
                      name="isActive"
                      defaultValue={selectedItem?.isActive?.toString() || 'true'}
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
                      setSelectedItem(null);
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
                    {isCreating ? 'Create Item' : 'Save Changes'}
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

export default Gallery;