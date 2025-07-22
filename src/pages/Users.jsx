import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box, Typography, Paper, Grid, Avatar, Button, TextField, Chip, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, MenuItem, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import CloseIcon from '@mui/icons-material/Close';
import GroupIcon from '@mui/icons-material/Group';

const red = '#b91c1c';
const gold = '#fbbf24';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await api.put(`/users/${userId}`, updates);
      fetchUsers();
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !isActive });
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telegramId?.includes(searchTerm) ||
    user.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <CircularProgress sx={{ color: gold, mb: 2 }} size={48} />
        <Typography variant="h6" color="text.secondary">Loading users...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color={red} mb={0.5}>Users</Typography>
          <Typography variant="h6" color={gold} fontWeight={600}>Manage your platform users</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: red, color: '#fff', width: 32, height: 32 }}><GroupIcon /></Avatar>
          <Typography variant="body1" color="text.secondary">{filteredUsers.length} users</Typography>
        </Box>
      </Box>
      {/* Search */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <TextField
          label="Search Users"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          fullWidth
          InputProps={{ sx: { borderRadius: 2 } }}
          placeholder="Search by name, Telegram ID, or phone..."
        />
      </Paper>
      {/* Users Table */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'auto' }}>
        <Box sx={{ minWidth: 800 }}>
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <Box component="thead" sx={{ background: `linear-gradient(90deg, ${red} 60%, ${gold} 100%)` }}>
                <Box component="tr">
                  <Box component="th" sx={{ px: 3, py: 2, color: '#fff', fontWeight: 700, textAlign: 'left' }}>User</Box>
                  <Box component="th" sx={{ px: 3, py: 2, color: '#fff', fontWeight: 700, textAlign: 'left' }}>Telegram ID</Box>
                  <Box component="th" sx={{ px: 3, py: 2, color: '#fff', fontWeight: 700, textAlign: 'left' }}>Phone</Box>
                  <Box component="th" sx={{ px: 3, py: 2, color: '#fff', fontWeight: 700, textAlign: 'left' }}>Status</Box>
                  <Box component="th" sx={{ px: 3, py: 2, color: '#fff', fontWeight: 700, textAlign: 'left' }}>Subscription</Box>
                  <Box component="th" sx={{ px: 3, py: 2, color: '#fff', fontWeight: 700, textAlign: 'left' }}>Actions</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {filteredUsers.map((user) => (
                  <Box component="tr" key={user._id} sx={{ '&:hover': { background: '#f3f4f6' } }}>
                    <Box component="td" sx={{ px: 3, py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: gold, color: red, mr: 2 }}>
                          {user.fullName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>{user.fullName}</Typography>
                          <Typography variant="body2" color="text.secondary">@{user.username || 'No username'}</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box component="td" sx={{ px: 3, py: 2 }}>{user.telegramId}</Box>
                    <Box component="td" sx={{ px: 3, py: 2 }}>{user.phone}</Box>
                    <Box component="td" sx={{ px: 3, py: 2 }}>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        sx={{
                          bgcolor: user.isActive ? 'rgba(22,163,74,0.15)' : 'rgba(185,28,28,0.15)',
                          color: user.isActive ? '#16a34a' : red,
                          fontWeight: 700
                        }}
                      />
                    </Box>
                    <Box component="td" sx={{ px: 3, py: 2 }}>
                      <Chip
                        label={user.subscriptionStatus}
                        sx={{
                          bgcolor:
                            user.subscriptionStatus === 'active'
                              ? 'rgba(22,163,74,0.15)'
                              : user.subscriptionStatus === 'expired'
                              ? 'rgba(185,28,28,0.15)'
                              : 'rgba(251,191,36,0.15)',
                          color:
                            user.subscriptionStatus === 'active'
                              ? '#16a34a'
                              : user.subscriptionStatus === 'expired'
                              ? red
                              : gold,
                          fontWeight: 700
                        }}
                      />
                    </Box>
                    <Box component="td" sx={{ px: 3, py: 2 }}>
                      <IconButton color="primary" onClick={() => { setSelectedUser(user); setShowModal(true); }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color={user.isActive ? 'error' : 'success'}
                        onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                      >
                        {user.isActive ? <ToggleOffIcon /> : <ToggleOnIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
      {/* Edit User Modal */}
      <Dialog open={showModal && !!selectedUser} onClose={() => { setShowModal(false); setSelectedUser(null); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: gold, color: red, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Edit User
          <IconButton onClick={() => { setShowModal(false); setSelectedUser(null); }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="edit-user-form" onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleUpdateUser(selectedUser._id, {
              fullName: formData.get('fullName'),
              phone: formData.get('phone'),
              subscriptionStatus: formData.get('subscriptionStatus')
            });
          }} sx={{ mt: 2 }}>
            <TextField
              label="Full Name"
              name="fullName"
              defaultValue={selectedUser?.fullName}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Phone"
              name="phone"
              defaultValue={selectedUser?.phone}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Subscription Status"
              name="subscriptionStatus"
              defaultValue={selectedUser?.subscriptionStatus}
              select
              fullWidth
              margin="normal"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowModal(false); setSelectedUser(null); }} color="inherit">Cancel</Button>
          <Button type="submit" form="edit-user-form" variant="contained" sx={{ background: `linear-gradient(90deg, ${red} 60%, ${gold} 100%)`, color: '#fff', fontWeight: 700 }}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users; 