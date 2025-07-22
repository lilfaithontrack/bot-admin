import { useState, useEffect } from 'react';
import api from '../services/api';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/agents');
      setAgents(response.data.agents || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async (agentData) => {
    try {
      await api.post('/agents', agentData);
      fetchAgents();
      setShowModal(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const handleUpdateAgent = async (agentId, updates) => {
    try {
      await api.put(`/agents/${agentId}`, updates);
      fetchAgents();
      setShowModal(false);
      setSelectedAgent(null);
    } catch (error) {
      console.error('Error updating agent:', error);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await api.delete(`/agents/${agentId}`);
        fetchAgents();
      } catch (error) {
        console.error('Error deleting agent:', error);
      }
    }
  };

  const handleToggleAgentStatus = async (agentId, isActive) => {
    try {
      await api.put(`/agents/${agentId}`, { isActive: !isActive });
      fetchAgents();
    } catch (error) {
      console.error('Error toggling agent status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-lg text-gray-600">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-2">Agents</h1>
            <p className="text-xl text-gray-600">Manage sales agents and their permissions</p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setSelectedAgent(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-semibold"
          >
            <span>👨‍💼</span>
            Add Agent
          </button>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent._id} className="bg-white rounded-2xl shadow-lg border border-red-100 p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                    {agent.fullName?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-600">{agent.fullName}</h3>
                    <p className="text-sm text-gray-500">{agent.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  agent.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {agent.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 mr-2">📞</span>
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-4 mr-2">🔗</span>
                  <span>Code: {agent.referralCode}</span>
                </div>
                {agent.commission && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 mr-2">💰</span>
                    <span>Commission: {agent.commission}%</span>
                  </div>
                )}
                {agent.permissions && agent.permissions.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold text-red-600">Permissions:</span> {agent.permissions.join(', ')}
                    </p>
                  </div>
                )}
                {agent.lastLogin && (
                  <div className="text-xs text-gray-500">
                    Last Login: {new Date(agent.lastLogin).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedAgent(agent);
                    setIsCreating(false);
                    setShowModal(true);
                  }}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleAgentStatus(agent._id, agent.isActive)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    agent.isActive
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-green-100 text-green-600 hover:bg-green-200'
                  }`}
                >
                  {agent.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteAgent(agent._id)}
                  className="px-3 py-2 bg-gray-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Agent Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">
                  {isCreating ? 'Add New Agent' : 'Edit Agent'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAgent(null);
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
                const agentData = {
                  fullName: formData.get('fullName'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  commission: parseFloat(formData.get('commission')) || 0,
                  permissions: formData.get('permissions') ? formData.get('permissions').split(',').map(p => p.trim()) : [],
                  isActive: formData.get('isActive') === 'true'
                };

                if (isCreating) {
                  agentData.password = formData.get('password');
                  handleCreateAgent(agentData);
                } else {
                  handleUpdateAgent(selectedAgent._id, agentData);
                }
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      defaultValue={selectedAgent?.fullName}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={selectedAgent?.email}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={selectedAgent?.phone}
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  {isCreating && (
                    <div>
                      <label className="block text-sm font-semibold text-red-600 mb-2">Password</label>
                      <input
                        type="password"
                        name="password"
                        required
                        className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Commission (%)</label>
                    <input
                      type="number"
                      name="commission"
                      step="0.01"
                      defaultValue={selectedAgent?.commission || 0}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Permissions</label>
                    <input
                      type="text"
                      name="permissions"
                      defaultValue={selectedAgent?.permissions?.join(', ')}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors duration-200"
                      placeholder="view_orders, manage_products, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-red-600 mb-2">Status</label>
                    <select
                      name="isActive"
                      defaultValue={selectedAgent?.isActive?.toString() || 'true'}
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
                      setSelectedAgent(null);
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
                    {isCreating ? 'Create Agent' : 'Save Changes'}
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

export default Agents;