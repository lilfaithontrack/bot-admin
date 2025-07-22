import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Box, Typography, Paper, Grid, Avatar, Button, TextField, Chip, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, MenuItem, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';

const red = '#b91c1c';
const gold = '#fbbf24';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await api.post('/products', productData);
      fetchProducts();
      setShowModal(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (productId, updates) => {
    try {
      await api.put(`/products/${productId}`, updates);
      fetchProducts();
      setShowModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleToggleProductStatus = async (productId, isActive) => {
    try {
      await api.put(`/products/${productId}`, { isActive: !isActive });
      fetchProducts();
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <CircularProgress sx={{ color: gold, mb: 2 }} size={48} />
        <Typography variant="h6" color="text.secondary">Loading products...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1400, mx: 'auto', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} color={red} mb={0.5}>Products</Typography>
          <Typography variant="h6" color={gold} fontWeight={600}>Manage your product catalog</Typography>
        </Box>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            background: `linear-gradient(90deg, ${red} 60%, ${gold} 100%)`,
            color: '#fff',
            fontWeight: 700,
            borderRadius: 2,
            py: 1.2,
            boxShadow: 2,
            '&:hover': {
              background: `linear-gradient(90deg, #991b1b 60%, #d97706 100%)`,
            },
          }}
          onClick={() => {
            setIsCreating(true);
            setSelectedProduct(null);
            setShowModal(true);
          }}
        >
          Add Product
        </Button>
      </Box>
      {/* Search */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <TextField
          label="Search Products"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          fullWidth
          InputProps={{ sx: { borderRadius: 2 } }}
          placeholder="Search by name or category..."
        />
      </Paper>
      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 6, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.03)', boxShadow: 12 } }}>
              <Box sx={{ height: 180, bgcolor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <InventoryIcon sx={{ fontSize: 60, color: '#cbd5e1' }} />
                )}
              </Box>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" fontWeight={700}>{product.name}</Typography>
                  <Chip
                    label={product.isActive ? 'Active' : 'Inactive'}
                    sx={{
                      bgcolor: product.isActive ? 'rgba(22,163,74,0.15)' : 'rgba(185,28,28,0.15)',
                      color: product.isActive ? '#16a34a' : red,
                      fontWeight: 700
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" mb={1}>{product.category}</Typography>
                <Typography variant="body2" color="text.secondary" mb={2} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.description}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} color={red}>${product.price}</Typography>
                    {product.originalPrice > product.price && (
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', ml: 1 }}>
                        ${product.originalPrice}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">Stock: {product.stock}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton color="primary" onClick={() => { setSelectedProduct(product); setIsCreating(false); setShowModal(true); }}><EditIcon /></IconButton>
                  <IconButton color={product.isActive ? 'error' : 'success'} onClick={() => handleToggleProductStatus(product._id, product.isActive)}>{product.isActive ? <ToggleOffIcon /> : <ToggleOnIcon />}</IconButton>
                  <IconButton color="error" onClick={() => handleDeleteProduct(product._id)}><DeleteIcon /></IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Product Modal */}
      <Dialog open={showModal} onClose={() => { setShowModal(false); setSelectedProduct(null); setIsCreating(false); }} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: gold, color: red, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isCreating ? 'Add New Product' : 'Edit Product'}
          <IconButton onClick={() => { setShowModal(false); setSelectedProduct(null); setIsCreating(false); }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="product-form" onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const productData = {
              name: formData.get('name'),
              description: formData.get('description'),
              price: parseFloat(formData.get('price')),
              originalPrice: parseFloat(formData.get('originalPrice')),
              category: formData.get('category'),
              stock: parseInt(formData.get('stock')),
              isActive: formData.get('isActive') === 'true',
              featured: formData.get('featured') === 'true'
            };
            if (isCreating) {
              handleCreateProduct(productData);
            } else {
              handleUpdateProduct(selectedProduct._id, productData);
            }
          }} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Product Name" name="name" defaultValue={selectedProduct?.name} required fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Category" name="category" defaultValue={selectedProduct?.category} required fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Price" name="price" type="number" step="0.01" defaultValue={selectedProduct?.price} required fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Original Price" name="originalPrice" type="number" step="0.01" defaultValue={selectedProduct?.originalPrice} required fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Stock" name="stock" type="number" defaultValue={selectedProduct?.stock || 0} required fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Status" name="isActive" select defaultValue={selectedProduct?.isActive?.toString() || 'true'} fullWidth margin="normal">
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Featured" name="featured" select defaultValue={selectedProduct?.featured?.toString() || 'false'} fullWidth margin="normal">
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Description" name="description" defaultValue={selectedProduct?.description} required fullWidth margin="normal" multiline rows={3} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setShowModal(false); setSelectedProduct(null); setIsCreating(false); }} color="inherit">Cancel</Button>
          <Button type="submit" form="product-form" variant="contained" sx={{ background: `linear-gradient(90deg, ${red} 60%, ${gold} 100%)`, color: '#fff', fontWeight: 700 }}>{isCreating ? 'Create Product' : 'Save Changes'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products; 