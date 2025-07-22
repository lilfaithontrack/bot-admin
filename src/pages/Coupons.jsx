import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box, Typography, Paper, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress, Chip
} from '@mui/material';

const red = '#b91c1c';
const gold = '#fbbf24';

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
      <Box display="flex" alignItems="center" justifyContent="center" height={300}>
        <CircularProgress sx={{ color: gold, mb: 2 }} size={48} />
        <Typography variant="h6" color="text.secondary" ml={2}>Loading coupons...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mt: 2, bgcolor: '#fff', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color={red} mb={0.5}>Coupons</Typography>
          <Typography variant="h6" color={gold} fontWeight={600}>Manage discount coupons and promotional codes</Typography>
        </Box>
        <Button
          variant="contained"
          sx={{ bgcolor: red, color: '#fff', fontWeight: 700, borderRadius: 2, boxShadow: 2, '&:hover': { bgcolor: '#991b1b' } }}
          onClick={() => {
            setIsCreating(true);
            setSelectedCoupon(null);
            setShowModal(true);
          }}
        >
          Add Coupon
        </Button>
      </Box>
      <Grid container spacing={3}>
        {coupons.map((coupon) => (
          <Grid item xs={12} sm={6} md={4} key={coupon._id}>
            <Paper elevation={4} sx={{ borderRadius: 3, p: 3, minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 6, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)', boxShadow: 12 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                <Typography variant="h6" fontWeight={700} color={red}>{coupon.code}</Typography>
                <Box display="flex" flexDirection="column" alignItems="end">
                  <Chip
                    label={coupon.isActive ? 'Active' : 'Inactive'}
                    sx={{ bgcolor: coupon.isActive ? 'rgba(22,163,74,0.15)' : 'rgba(185,28,28,0.15)', color: coupon.isActive ? '#16a34a' : red, fontWeight: 700, mb: 0.5 }}
                  />
                  {coupon.expiryDate && isExpired(coupon.expiryDate) && (
                    <Chip label="Expired" sx={{ bgcolor: 'rgba(185,28,28,0.15)', color: red, fontWeight: 700 }} />
                  )}
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={1}>{coupon.description}</Typography>
              <Typography variant="h4" fontWeight={700} color={gold} mb={1}>
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>Min. Order: ${coupon.minimumOrderAmount || 0}</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>Max Uses: {coupon.maxUses || 'Unlimited'}</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>Used: {coupon.usedCount || 0} times</Typography>
              {coupon.expiryDate && (
                <Typography variant="body2" color="text.secondary" mb={1}>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</Typography>
              )}
              <Box display="flex" gap={1} mt={2}>
                <Button
                  variant="outlined"
                  sx={{ color: red, borderColor: red, fontWeight: 700, borderRadius: 2, flex: 1, '&:hover': { bgcolor: 'rgba(185,28,28,0.08)', borderColor: red } }}
                  onClick={() => {
                    setSelectedCoupon(coupon);
                    setIsCreating(false);
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  sx={{ bgcolor: '#000', color: '#fff', borderColor: red, fontWeight: 700, borderRadius: 2, flex: 1, '&:hover': { bgcolor: red } }}
                  onClick={() => handleDeleteCoupon(coupon._id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Coupon Modal */}
      <Dialog open={showModal} onClose={() => { setShowModal(false); setSelectedCoupon(null); setIsCreating(false); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: red }}>{isCreating ? 'Add New Coupon' : 'Edit Coupon'}</DialogTitle>
        <DialogContent>
          <Box component="form" id="coupon-form" sx={{ mt: 1 }} onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
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
            <TextField
              label="Coupon Code"
              name="code"
              defaultValue={selectedCoupon?.code}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              defaultValue={selectedCoupon?.description}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Discount Type</InputLabel>
              <Select
                name="discountType"
                defaultValue={selectedCoupon?.discountType || 'percentage'}
                label="Discount Type"
                required
              >
                <MenuItem value="percentage">Percentage</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Discount Value"
              name="discountValue"
              type="number"
              step="0.01"
              defaultValue={selectedCoupon?.discountValue}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              label="Minimum Order Amount"
              name="minimumOrderAmount"
              type="number"
              step="0.01"
              defaultValue={selectedCoupon?.minimumOrderAmount || 0}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Maximum Uses"
              name="maxUses"
              type="number"
              defaultValue={selectedCoupon?.maxUses || ''}
              fullWidth
              margin="normal"
              placeholder="Leave empty for unlimited"
            />
            <TextField
              label="Expiry Date"
              name="expiryDate"
              type="datetime-local"
              defaultValue={selectedCoupon?.expiryDate ? selectedCoupon.expiryDate.slice(0, 16) : ''}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="isActive"
                defaultValue={selectedCoupon?.isActive?.toString() || 'true'}
                label="Status"
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowModal(false); setSelectedCoupon(null); setIsCreating(false); }} sx={{ color: '#000', fontWeight: 700 }}>Cancel</Button>
          <Button type="submit" form="coupon-form" variant="contained" sx={{ bgcolor: red, color: '#fff', fontWeight: 700, '&:hover': { bgcolor: '#991b1b' } }}>{isCreating ? 'Create Coupon' : 'Save Changes'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Coupons; 