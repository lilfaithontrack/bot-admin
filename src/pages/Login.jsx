import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Avatar, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const red = '#b91c1c';
const gold = '#fbbf24';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fff',
      p: 2,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <Paper elevation={8} sx={{
        maxWidth: 400,
        width: '100%',
        p: 4,
        borderRadius: 5,
        bgcolor: '#fff',
        border: `1.5px solid ${gold}`,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 24px 0 rgba(185,28,28,0.08)',
      }}>
        <Avatar sx={{ bgcolor: gold, width: 60, height: 60, mb: 1.5, fontSize: 32, fontWeight: 'bold', border: `2.5px solid ${red}`, boxShadow: 2 }}>
          <LockOutlinedIcon sx={{ fontSize: 32, color: red }} />
        </Avatar>
        <Typography variant="h5" fontWeight={700} color={red} mb={0.5} letterSpacing={1} sx={{ fontFamily: 'inherit', fontSize: '1.3rem' }}>
          Fetan Admin
        </Typography>
        <Typography variant="subtitle2" color={gold} fontWeight={600} mb={0.5} sx={{ fontFamily: 'inherit', fontSize: '1rem' }}>
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2} sx={{ fontFamily: 'inherit', fontSize: '0.85rem' }}>
          Sign in to your admin account
        </Typography>
        <Divider sx={{ width: '100%', mb: 2, bgcolor: gold, opacity: 0.5 }} />
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoComplete="email"
            InputProps={{ sx: { borderRadius: 2, bgcolor: '#fff', fontSize: '0.95rem' } }}
            InputLabelProps={{ sx: { fontSize: '0.95rem' } }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            autoComplete="current-password"
            InputProps={{ sx: { borderRadius: 2, bgcolor: '#fff', fontSize: '0.95rem' } }}
            InputLabelProps={{ sx: { fontSize: '0.95rem' } }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1, mb: 1, fontWeight: 500, textAlign: 'center', fontSize: '0.9rem' }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.2,
              fontWeight: 700,
              fontSize: '1rem',
              background: `linear-gradient(90deg, ${red} 60%, ${gold} 100%)`,
              color: '#fff',
              boxShadow: 2,
              borderRadius: 2,
              letterSpacing: 0.5,
              '&:hover': {
                background: `linear-gradient(90deg, #991b1b 60%, #d97706 100%)`,
              },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: gold }} /> : 'Sign in'}
          </Button>
        </form>
      </Paper>
      <Typography variant="body2" color={gold} sx={{ mt: 3, opacity: 0.8, fontFamily: 'inherit', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} Fetan Admin. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Login; 