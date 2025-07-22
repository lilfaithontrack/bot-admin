import { useState, useEffect } from 'react';
import api from '../services/api';

const Levels = () => {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await api.get('/levels');
      setLevels(response.data.levels || []);
    } catch (error) {
      console.error('Error fetching levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLevel = async (levelData) => {
    try {
      await api.post('/levels', levelData);
      fetchLevels();
      setShowModal(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating level:', error);
    }
  };

  const handleUpdateLevel = async (levelId, updates) => {
    try {
      await api.put(`/levels/${levelId}`, updates);
      fetchLevels();
      setShowModal(false);
      setSelectedLevel(null);
    } catch (error) {
      console.error('Error updating level:', error);
    }
  };

  const handleDeleteLevel = async (levelId) => {
    if (window.confirm('Are you sure you want to delete this level?')) {
      try {
        await api.delete(`/levels/${levelId}`);
        fetchLevels();
      } catch (error) {
        console.error('Error deleting level:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading levels...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">Levels</h1>
            <p className="text-xl text-gray-600">Manage user levels and permissions</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setSelectedLevel(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
          >
            <span>⭐</span>
            Add Level
          </button>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <div key={level._id} className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {level.level}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-600">{level.name}</h3>
                    <p className="text-sm text-gray-500">Level {level.level}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  level.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {level.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">{level.description}</p>
              
              {level.requirements && (
                <div className="bg-red-50 rounded-lg p-3 mb-4 border border-red-100">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-red-600">Requirements:</span> {level.requirements}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedLevel(level);
                    setIsCreating(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLevel(level._id)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors duration-200 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Level Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">
                  {isCreating ? 'Add New Level' : 'Edit Level'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedLevel(null);
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
                const levelData = {
                  name: formData.get('name'),
                  description: formData.get('description'),
                  level: parseInt(formData.get('level')),
                  requirements: formData.get('requirements'),
                  isActive: formData.get('isActive') === 'true',
                };

                if (isCreating) {
                  handleCreateLevel(levelData);
                } else {
                  handleUpdateLevel(selectedLevel._id, levelData);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedLevel?.name}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={selectedLevel?.description}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Level Number</label>
                    <input
                      type="number"
                      name="level"
                      defaultValue={selectedLevel?.level}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Requirements</label>
                    <input
                      type="text"
                      name="requirements"
                      defaultValue={selectedLevel?.requirements}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Status</label>
                    <select
                      name="isActive"
                      defaultValue={selectedLevel?.isActive?.toString() || 'true'}
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
                      setSelectedLevel(null);
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
                    {isCreating ? 'Create Level' : 'Save Changes'}
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

export default Levels;