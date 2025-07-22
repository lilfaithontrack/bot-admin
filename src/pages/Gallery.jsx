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
      <div className="flex items-center justify-center h-64 bg-black">
        <div className="text-lg text-white">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-black min-h-screen px-2 md:px-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="text-gray-300">Manage images and media content</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedItem(null);
            setShowModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 shadow-md transition"
        >
          Add Item
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {galleryItems.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover-scale transition">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold text-black">{item.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    item.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setIsCreating(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGalleryItem(item._id)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-black border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-2">
          <div className="relative w-full max-w-md mx-auto p-6 border border-red-600 shadow-2xl rounded-xl bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-black mb-4">
                {isCreating ? 'Add New Gallery Item' : 'Edit Gallery Item'}
              </h3>
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
                    <label className="block text-sm font-medium text-black">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={selectedItem?.title}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      defaultValue={selectedItem?.description}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Image URL
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      defaultValue={selectedItem?.imageUrl}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={selectedItem?.category}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Status
                    </label>
                    <select
                      name="isActive"
                      defaultValue={selectedItem?.isActive?.toString() || 'true'}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
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
                      setSelectedItem(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200 border border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 shadow-md"
                  >
                    {isCreating ? 'Create Item' : 'Save Changes'}
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

export default Gallery; 