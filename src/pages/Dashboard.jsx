import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box, Typography, Paper, Grid, Avatar, CircularProgress, Button, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const red = '#b91c1c';
const gold = '#fbbf24';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch statistics from different endpoints
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        api.get('/users'),
        api.get('/orders'),
        api.get('/products')
      ]);

      const users = usersRes.data.users || [];
      const orders = ordersRes.data.orders || [];
      const products = productsRes.data.products || [];

      // Calculate statistics
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue,
        recentOrders: orders.slice(0, 5),
        recentUsers: users.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <CircularProgress sx={{ color: gold, mb: 2 }} size={48} />
        <Typography variant="h6" color="text.secondary">Loading dashboard...</Typography>
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <GroupIcon fontSize="large" />, 
      color: '#2563eb',
      bgColor: 'rgba(37,99,235,0.08)'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: <ShoppingCartIcon fontSize="large" />, 
      color: '#16a34a',
      bgColor: 'rgba(22,163,74,0.08)'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <InventoryIcon fontSize="large" />, 
      color: '#9333ea',
      bgColor: 'rgba(147,51,234,0.08)'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <MonetizationOnIcon fontSize="large" />, 
      color: gold,
      bgColor: 'rgba(251,191,36,0.08)'
    }
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mt: 2 }}>
      <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 3 }}>
        <Typography variant="h4" fontWeight={700} color={red} mb={0.5}>
          Dashboard
        </Typography>
        <Typography variant="h6" color={gold} fontWeight={600}>
          Welcome to your Fetan platform overview
        </Typography>
      </Box>
      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={4} sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: '#fff',
              boxShadow: 6,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.03)', boxShadow: 12 },
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: card.color, color: '#fff', mr: 2 }}>{card.icon}</Avatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{card.title}</Typography>
                  <Typography variant="h5" fontWeight={700} color={card.color}>{card.value}</Typography>
                </Box>
              </Box>
              <Divider sx={{ mt: 1, bgcolor: card.color, height: 3, borderRadius: 2 }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Recent Activity */}
      <Grid container spacing={3} mb={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: red, mr: 2 }}><ShoppingCartIcon /></Avatar>
              <Typography variant="h6" fontWeight={700} color={red}>Recent Orders</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {stats.recentOrders.length > 0 ? (
              <Box>
                {stats.recentOrders.map((order) => (
                  <Paper key={order._id} sx={{ p: 2, mb: 1.5, borderRadius: 2, bgcolor: 'rgba(251,191,36,0.06)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: gold, color: red, mr: 2, width: 36, height: 36, fontWeight: 700 }}>#</Avatar>
                        <Box>
                          <Typography fontWeight={600} color={red}>Order #{order.orderNumber}</Typography>
                          <Typography variant="body2" color="text.secondary">${order.total} • {order.status}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Avatar sx={{ bgcolor: gold, color: red, width: 56, height: 56, mx: 'auto', mb: 2 }}><InventoryIcon /></Avatar>
                <Typography color="text.secondary">No recent orders</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: gold, color: red, mr: 2 }}><GroupIcon /></Avatar>
              <Typography variant="h6" fontWeight={700} color={gold}>Recent Users</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {stats.recentUsers.length > 0 ? (
              <Box>
                {stats.recentUsers.map((user) => (
                  <Paper key={user._id} sx={{ p: 2, mb: 1.5, borderRadius: 2, bgcolor: 'rgba(185,28,28,0.06)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: red, color: gold, mr: 2, width: 36, height: 36, fontWeight: 700 }}>
                          {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} color={gold}>{user.fullName}</Typography>
                          <Typography variant="body2" color="text.secondary">{user.telegramId} • {user.subscriptionStatus}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Avatar sx={{ bgcolor: red, color: gold, width: 56, height: 56, mx: 'auto', mb: 2 }}><GroupIcon /></Avatar>
                <Typography color="text.secondary">No recent users</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* Quick Actions */}
      <Paper elevation={2} sx={{ borderRadius: 3, p: 3, background: `linear-gradient(90deg, #fff7ed 60%, ${gold}11 100%)`, border: `1px solid ${gold}33` }}>
        <Typography variant="h6" fontWeight={700} color={red} mb={2}>Quick Actions</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Button fullWidth variant="contained" startIcon={<AddIcon />} sx={{
              background: `linear-gradient(90deg, ${red} 60%, ${gold} 100%)`,
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              py: 2,
              boxShadow: 2,
              '&:hover': {
                background: `linear-gradient(90deg, #991b1b 60%, #d97706 100%)`,
              },
            }}>
              Add Product
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button fullWidth variant="contained" startIcon={<GroupIcon />} sx={{
              background: `linear-gradient(90deg, ${gold} 60%, ${red} 100%)`,
              color: red,
              fontWeight: 700,
              borderRadius: 2,
              py: 2,
              boxShadow: 2,
              '&:hover': {
                background: `linear-gradient(90deg, #d97706 60%, #991b1b 100%)`,
                color: '#fff',
              },
            }}>
              View Users
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button fullWidth variant="contained" startIcon={<ShoppingCartIcon />} sx={{
              background: `linear-gradient(90deg, ${red} 60%, ${gold} 100%)`,
              color: '#fff',
              fontWeight: 700,
              borderRadius: 2,
              py: 2,
              boxShadow: 2,
              '&:hover': {
                background: `linear-gradient(90deg, #991b1b 60%, #d97706 100%)`,
              },
            }}>
              Manage Orders
            </Button>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Button fullWidth variant="contained" startIcon={<MonetizationOnIcon />} sx={{
              background: `linear-gradient(90deg, ${gold} 60%, ${red} 100%)`,
              color: red,
              fontWeight: 700,
              borderRadius: 2,
              py: 2,
              boxShadow: 2,
              '&:hover': {
                background: `linear-gradient(90deg, #d97706 60%, #991b1b 100%)`,
                color: '#fff',
              },
            }}>
              Analytics
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 