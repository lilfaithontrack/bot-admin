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
      <div className="flex items-center justify-center h-64 bg-black">
        <div className="text-lg text-white">Loading agents...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-black min-h-screen px-2 md:px-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Agents</h1>
          <p className="text-gray-300">Manage sales agents and their permissions</p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setSelectedAgent(null);
            setShowModal(true);
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 shadow-md transition"
        >
          Add Agent
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent._id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between min-h-[260px] hover-scale transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-black">{agent.fullName}</h3>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                agent.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {agent.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-700">{agent.email}</div>
              <div className="text-sm text-gray-500">Phone: {agent.phone}</div>
              <div className="text-sm text-gray-500">Referral Code: {agent.referralCode}</div>
              {agent.commission && (
                <div className="text-sm text-gray-500">
                  Commission: {agent.commission}%
                </div>
              )}
              {agent.permissions && agent.permissions.length > 0 && (
                <div className="text-sm text-gray-500">
                  Permissions: {agent.permissions.join(', ')}
                </div>
              )}
              {agent.lastLogin && (
                <div className="text-sm text-gray-500">
                  Last Login: {new Date(agent.lastLogin).toLocaleDateString()}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => {
                  setSelectedAgent(agent);
                  setIsCreating(false);
                  setShowModal(true);
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleToggleAgentStatus(agent._id, agent.isActive)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md border transition ${
                  agent.isActive
                    ? 'text-white bg-red-600 border-red-600 hover:bg-red-700'
                    : 'text-white bg-green-600 border-green-600 hover:bg-green-700'
                }`}
              >
                {agent.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleDeleteAgent(agent._id)}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-black border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-2">
          <div className="relative w-full max-w-md mx-auto p-6 border border-red-600 shadow-2xl rounded-xl bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-bold text-black mb-4">
                {isCreating ? 'Add New Agent' : 'Edit Agent'}
              </h3>
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
                    <label className="block text-sm font-medium text-black">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      defaultValue={selectedAgent?.fullName}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={selectedAgent?.email}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      defaultValue={selectedAgent?.phone}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
                    />
                  </div>
                  {isCreating && (
                    <div>
                      <label className="block text-sm font-medium text-black">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Commission (%)
                    </label>
                    <input
                      type="number"
                      name="commission"
                      step="0.01"
                      defaultValue={selectedAgent?.commission || 0}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Permissions
                    </label>
                    <input
                      type="text"
                      name="permissions"
                      defaultValue={selectedAgent?.permissions?.join(', ')}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white text-black"
                      placeholder="view_orders, manage_products, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black">
                      Status
                    </label>
                    <select
                      name="isActive"
                      defaultValue={selectedAgent?.isActive?.toString() || 'true'}
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
                      setSelectedAgent(null);
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
                    {isCreating ? 'Create Agent' : 'Save Changes'}
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

export default Agents; 