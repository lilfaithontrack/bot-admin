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

  return (
    <div className="min-h-screen bg-white py-8 px-2 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-red-600 mb-1">Levels</h1>
          <p className="text-lg text-black/70">Manage user levels and permissions</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedLevel(null);
            setShowModal(true);
          }}
          className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
        >
          Add Level
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600 animate-pulse">Loading levels...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level) => (
            <div key={level._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between min-h-[220px] border border-red-100 hover:shadow-2xl transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-red-600">{level.name}</h3>
                <span className={`px-3 py-1 text-xs font-bold rounded-full shadow ${level.isActive ? 'bg-red-100 text-red-700' : 'bg-white text-red-400 border border-red-200'}`}>{level.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="text-base text-black/80 mb-2 line-clamp-2">{level.description}</div>
              <div className="text-sm text-black/60 mb-1">Level: <span className="font-semibold text-black">{level.level}</span></div>
              {level.requirements && (
                <div className="text-sm text-black/60 mb-1">Requirements: {level.requirements}</div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedLevel(level);
                    setIsCreating(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-red-600 text-red-600 font-semibold hover:bg-red-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLevel(level._id)}
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
            <h2 className="text-2xl font-bold text-red-600 mb-6">{isCreating ? 'Add New Level' : 'Edit Level'}</h2>
            <form
              onSubmit={e => {
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
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedLevel?.name}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={selectedLevel?.description}
                  required
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-1">Level Number</label>
                <input
                  type="number"
                  name="level"
                  defaultValue={selectedLevel?.level}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-1">Requirements</label>
                <input
                  type="text"
                  name="requirements"
                  defaultValue={selectedLevel?.requirements}
                  className="w-full px-4 py-2 rounded-lg border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-red-600 mb-1">Status</label>
                <select
                  name="isActive"
                  defaultValue={selectedLevel?.isActive?.toString() || 'true'}
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
                    setSelectedLevel(null);
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
                  {isCreating ? 'Create Level' : 'Save Changes'}
                </button>
              </div>
            </form>
            <button
              className="absolute top-3 right-3 text-red-400 hover:text-red-600 text-2xl font-bold transition"
              onClick={() => {
                setShowModal(false);
                setSelectedLevel(null);
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

export default Levels; 