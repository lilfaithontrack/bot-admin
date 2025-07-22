# Fetan Admin Panel

A modern, responsive admin panel for the Fetan platform with a beautiful red and gold theme. Built with React, Vite, and Tailwind CSS.

## 🎨 Features

- **Modern Design**: Red and gold color scheme with gradient backgrounds
- **Mobile Responsive**: Optimized for both desktop and mobile devices
- **Real-time Dashboard**: Live statistics and recent activity
- **User Management**: Complete CRUD operations for users
- **Product Management**: Manage product catalog with images
- **Order Management**: Track and manage customer orders
- **Subscription Management**: Handle subscription plans
- **Level Management**: User levels and permissions
- **Payment Methods**: Manage payment options
- **Gallery Management**: Image and media content
- **Coupon Management**: Discount codes and promotions
- **Agent Management**: Sales agents and permissions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fetan-admin-panel
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

### Authentication

1. Navigate to the login page
2. Enter your admin credentials
3. The system will authenticate and redirect to the dashboard

### Dashboard

The dashboard provides an overview of:
- Total users, orders, products, and revenue
- Recent orders and user activity
- Quick action buttons for common tasks

### User Management

- View all users in a responsive table/grid
- Search users by name, Telegram ID, or phone
- Edit user information
- Activate/deactivate users
- Manage subscription status

### Product Management

- Add new products with images
- Edit product details
- Manage product status and categories
- View product statistics

### Order Management

- View all orders with detailed information
- Update order and payment status
- Track order progress
- View customer details and shipping information

## 🎨 Design System

### Color Palette

- **Primary Red**: `#dc2626` (Red-600)
- **Secondary Gold**: `#fbbf24` (Amber-400)
- **Dark Gold**: `#d97706` (Amber-600)
- **Background**: Gradient from gray-50 to gray-100
- **Cards**: White with subtle shadows and borders

### Components

- **Cards**: Rounded corners (2xl) with hover effects
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Clean inputs with gold focus states
- **Tables**: Responsive with gradient headers
- **Modals**: Centered with backdrop blur

### Animations

- **Hover Effects**: Scale and lift animations
- **Transitions**: Smooth color and transform transitions
- **Loading States**: Spinning animations with gold accents

## 📱 Mobile Responsiveness

The admin panel is fully responsive with:

- **Mobile-First Design**: Optimized for small screens
- **Adaptive Layouts**: Different views for mobile and desktop
- **Touch-Friendly**: Large buttons and touch targets
- **Collapsible Sidebar**: Hamburger menu for mobile
- **Grid/Table Toggle**: Card view on mobile, table on desktop

## 🔧 Configuration

### API Configuration

Update the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Fetan Admin
```

## 🛠️ Development

### Project Structure

```
src/
├── components/          # Reusable components
│   └── Layout.jsx      # Main layout with sidebar
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Dashboard.jsx   # Dashboard page
│   ├── Users.jsx       # User management
│   ├── Products.jsx    # Product management
│   └── ...            # Other pages
├── services/           # API services
│   ├── api.js         # Base API configuration
│   └── authService.js # Authentication service
└── utils/              # Utility functions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Theme Colors

To customize the color scheme, update the CSS variables in `src/index.css`:

```css
.bg-gradient-primary {
  background: linear-gradient(135deg, #your-red-1 0%, #your-red-2 50%, #your-red-3 100%);
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, #your-gold-1 0%, #your-gold-2 50%, #your-gold-3 100%);
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Add navigation item in `src/components/Layout.jsx`

## 🔒 Security

- JWT token-based authentication
- Protected routes
- Automatic token refresh
- Secure API communication

## 📊 Performance

- Lazy loading for better performance
- Optimized images and assets
- Efficient state management
- Minimal bundle size

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
# bot-admin
