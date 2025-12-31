# 🛒 Zembile - Ethiopian E-commerce Marketplace

<div align="center">
  <img src="frontend/public/logo.svg" alt="Zembile Logo" width="120" height="120">
  
  **Authentic Ethiopian Products Marketplace**
  
  *Connecting Ethiopian artisans, farmers, and businesses with customers worldwide*

  [![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey.svg)](https://expressjs.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.7-38B2AC.svg)](https://tailwindcss.com/)
</div>

## 🌟 Overview

Zembile is a modern, full-featured e-commerce marketplace specifically designed for Ethiopian products and culture. Built with React and Node.js, it provides a professional shopping experience while celebrating Ethiopian heritage through authentic products, traditional design elements, and local payment methods.

## ✨ Key Features

### 🛍️ **E-commerce Core**
- **Product Catalog** - Comprehensive product listings with advanced filtering and search
- **Shopping Cart** - Persistent cart with quantity management and wishlist integration
- **Checkout System** - Secure checkout with Ethiopian payment methods
- **Order Management** - Complete order tracking and history
- **Wishlist** - Save and manage favorite products across devices

### 🔐 **Authentication & Security**
- **User Registration** - Complete signup with Ethiopian phone number support
- **Secure Login** - JWT-based authentication with password strength validation
- **Password Recovery** - Email-based password reset system
- **Protected Routes** - Role-based access control for sensitive pages
- **Profile Management** - User account and preference management

### 💳 **Payment Integration**
- **Chapa Payment Gateway** - Ethiopian mobile money integration (Telebirr, CBE Birr)
- **Bank Transfer** - Manual transfer with payment proof upload system
- **Multiple Banks** - Support for major Ethiopian banks (CBE, Dashen, Awash, BOA)
- **Order Tracking** - Real-time order status updates and notifications

### 🇪🇹 **Ethiopian Cultural Integration**
- **Traditional Design** - Zembile (basket) theme with Ethiopian flag colors
- **Local Products** - Coffee, spices, crafts, textiles, and traditional items
- **Cultural Content** - Educational content about Ethiopian traditions
- **Local Context** - Ethiopian Birr currency, regional addresses, local delivery

### 📱 **Modern User Experience**
- **Responsive Design** - Mobile-first approach with touch-friendly interface
- **Professional UI** - Clean, modern design matching international standards
- **Toast Notifications** - Professional feedback system throughout the app
- **Loading States** - Smooth loading indicators and skeleton screens
- **Accessibility** - WCAG compliant with keyboard navigation support

## 🏗️ Project Structure

```
zembile/
├── 📁 frontend/                 # React frontend application
│   ├── 📁 public/              # Static assets (logo, favicon)
│   ├── 📁 src/
│   │   ├── 📁 auth/            # Authentication components
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Signup.jsx      # Registration page
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── 📁 components/      # Reusable UI components
│   │   │   ├── Header.jsx      # Navigation with auth integration
│   │   │   ├── Footer.jsx      # Site footer
│   │   │   ├── ProductCard.jsx # Product display component
│   │   │   └── ToastProvider.jsx
│   │   ├── 📁 context/         # React Context providers
│   │   │   ├── AuthContext.jsx # Authentication state
│   │   │   ├── CartContext.jsx # Shopping cart state
│   │   │   └── WishlistContext.jsx
│   │   ├── 📁 pages/           # Main application pages
│   │   │   ├── Home.jsx        # Landing page with features
│   │   │   ├── ProductList.jsx # Product catalog with filters
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx        # Shopping cart management
│   │   │   ├── Checkout.jsx    # Secure checkout process
│   │   │   ├── PaymentProof.jsx # Payment verification
│   │   │   ├── Orders.jsx      # Order history
│   │   │   └── Wishlist.jsx    # Saved products
│   │   └── 📁 data/            # Mock data and utilities
│   │       └── products.js     # Product catalog data
├── 📁 api/                     # Node.js backend API
│   ├── 📁 routes/              # API route handlers
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── payments.js        # Payment processing
│   │   └── uploads.js         # File upload handling
│   ├── 📁 uploads/            # User uploaded files (gitignored)
│   ├── package.json           # Backend dependencies
│   └── server.js              # Express server setup
├── 📁 adminpanel/             # Admin dashboard (React)
└── 📁 docs/                   # Documentation files
    ├── AUTHENTICATION_SYSTEM_GUIDE.md
    ├── PAYMENT_INTEGRATION_GUIDE.md
    ├── HOME_PAGE_ENHANCEMENTS.md
    └── *.md                   # Feature documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Git** for version control
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zembile.git
   cd zembile
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../api
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in api directory
   cd api
   echo "JWT_SECRET=your_super_secure_jwt_secret_key_here" > .env
   echo "NODE_ENV=development" >> .env
   ```

5. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd api
   npm run dev
   # Server runs on http://localhost:4000
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:3000
   ```

6. **Access the application**
   - **Frontend**: http://localhost:3000
   - **API Health Check**: http://localhost:4000
   - **Demo Account**: `demo@zembile.com` / `demo123`

## 🎯 Demo & Testing

### Demo Account
- **Email**: `demo@zembile.com`
- **Password**: `demo123`
- **Role**: Customer with full access

### Test Features
1. **Browse Products** - Explore Ethiopian coffee, crafts, and spices
2. **Search & Filter** - Use advanced filtering and search functionality
3. **Add to Cart** - Test shopping cart and wishlist features
4. **User Registration** - Create a new account with Ethiopian phone format
5. **Checkout Process** - Test both Chapa and bank transfer payment methods
6. **Order Management** - View order history and upload payment proofs

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern React with hooks and context
- **React Router 6** - Client-side routing with protected routes
- **Tailwind CSS 3.4.7** - Utility-first CSS framework
- **React Hot Toast** - Professional notification system
- **Vite** - Fast build tool and development server

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express 4.18.2** - Web application framework
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing and security
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **Nodemon** - Development server auto-restart

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/signup          # User registration
POST /api/auth/login           # User login
GET  /api/auth/verify          # Token verification
POST /api/auth/forgot-password # Password reset request
POST /api/auth/reset-password  # Password reset confirmation
GET  /api/auth/profile         # Get user profile
PUT  /api/auth/profile         # Update user profile
POST /api/auth/change-password # Change password
POST /api/auth/logout          # User logout
```

### Payment Endpoints
```
POST /api/chapa/initialize     # Initialize Chapa payment
POST /api/chapa/callback       # Chapa payment webhook
POST /api/orders               # Create order
GET  /api/orders/:id           # Get order details
POST /api/payment-proof        # Upload payment proof
```

### Upload Endpoints
```
POST /api/uploads/payment-proof # Upload payment verification files
GET  /api/uploads/file/:filename # Retrieve uploaded files
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
JWT_SECRET=your_super_secure_jwt_secret_key_here
NODE_ENV=development
CHAPA_SECRET_KEY=your_chapa_secret_key
CHAPA_PUBLIC_KEY=your_chapa_public_key
PORT=4000
```

### Payment Integration

#### Chapa Payment Gateway
- **Test Mode**: Enabled by default for development
- **Supported Methods**: Telebirr, CBE Birr, Amole
- **Documentation**: https://developer.chapa.co/

#### Ethiopian Bank Accounts
- Commercial Bank of Ethiopia (CBE)
- Dashen Bank
- Awash Bank  
- Bank of Abyssinia

## 🚀 Deployment

### Production Checklist
- [ ] Set strong JWT secret in environment variables
- [ ] Configure production database (MongoDB/PostgreSQL)
- [ ] Set up file storage (AWS S3/Google Cloud)
- [ ] Configure email service for password resets
- [ ] Enable HTTPS and security headers
- [ ] Set up monitoring and logging
- [ ] Configure backup systems
- [ ] Test payment gateway in live mode

### Deployment Options
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Railway, Heroku, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas, AWS RDS, PlanetScale
- **File Storage**: AWS S3, Google Cloud Storage, Cloudinary

## 🤝 Contributing

We welcome contributions to improve Zembile! Here's how you can help:

### Development Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure mobile responsiveness
- Test with Ethiopian context (currency, addresses, etc.)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ethiopian Artisans** - For inspiring authentic product designs
- **React Community** - For excellent documentation and tools
- **Tailwind CSS** - For the utility-first CSS framework
- **Chapa** - For Ethiopian payment gateway integration
- **Contributors** - Everyone who helps improve this project

## 📞 Support

### Getting Help
- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Email**: support@zembile.com (if available)

### Useful Links
- **Live Demo**: [https://zembile-demo.vercel.app](https://zembile-demo.vercel.app)
- **API Documentation**: [https://api.zembile.com/docs](https://api.zembile.com/docs)
- **Design System**: [https://design.zembile.com](https://design.zembile.com)

---

<div align="center">
  <p>Made with ❤️ for Ethiopian culture and commerce</p>
  <p>
    <a href="#-overview">Back to Top</a> •
    <a href="https://github.com/yourusername/zembile/issues">Report Bug</a> •
    <a href="https://github.com/yourusername/zembile/discussions">Request Feature</a>
  </p>
</div>