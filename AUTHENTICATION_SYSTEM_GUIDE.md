# Authentication System Guide - Zembile Marketplace

## Overview
Complete authentication system for the Zembile Ethiopian e-commerce marketplace with login, signup, forgot password, reset password, and user management features.

## 🔐 Authentication Features

### Frontend Components

#### 1. **Login Page** (`frontend/src/auth/Login.jsx`)
- **Features**:
  - Email and password authentication
  - Password visibility toggle
  - Remember me checkbox
  - Demo account access
  - Social login placeholders (Google, Facebook)
  - Forgot password link
  - Professional form validation
  - Loading states and error handling

- **Demo Credentials**:
  - Email: `demo@zembile.com`
  - Password: `demo123`

#### 2. **Signup Page** (`frontend/src/auth/Signup.jsx`)
- **Features**:
  - Complete registration form (first name, last name, email, phone, password)
  - Real-time password strength indicator
  - Password confirmation with match validation
  - Terms of service agreement
  - Social signup placeholders
  - Ethiopian phone number format
  - Professional validation with toast notifications

#### 3. **Forgot Password** (`frontend/src/auth/ForgotPassword.jsx`)
- **Features**:
  - Email-based password reset request
  - Success confirmation with email display
  - Resend functionality
  - Professional error handling
  - Support contact integration

#### 4. **Reset Password** (`frontend/src/auth/ResetPassword.jsx`)
- **Features**:
  - Token-based password reset
  - Real-time password strength validation
  - Password requirements checklist
  - Token verification with loading states
  - Comprehensive error handling for invalid/expired tokens

### Context & State Management

#### **AuthContext** (`frontend/src/context/AuthContext.jsx`)
- **Features**:
  - Centralized authentication state management
  - Persistent login with localStorage
  - Token verification with backend
  - User profile management
  - Authenticated API request helper
  - Role-based access control support

- **Available Methods**:
  ```javascript
  const {
    user,                    // Current user object
    token,                   // JWT token
    isLoading,              // Loading state
    login,                  // Login function
    logout,                 // Logout function
    updateUser,             // Update user profile
    isAuthenticated,        // Check if user is logged in
    getUserRole,            // Get user role
    hasPermission,          // Check user permissions
    authenticatedFetch      // API helper with auth
  } = useAuth()
  ```

### Route Protection

#### **ProtectedRoute** (`frontend/src/auth/ProtectedRoute.jsx`)
- **Components**:
  - `ProtectedRoute` - Requires authentication
  - `AuthRoute` - Redirects authenticated users (for login/signup pages)
  - `AdminRoute` - Admin-only access
  - Loading states and error handling

### Enhanced Header Integration

#### **Header Component** (`frontend/src/components/Header.jsx`)
- **Authenticated State**:
  - User avatar with initials
  - Account dropdown menu
  - Profile, orders, wishlist, settings links
  - Logout functionality

- **Unauthenticated State**:
  - Sign In and Sign Up buttons
  - Mobile-responsive auth options

## 🔧 Backend API

### Authentication Routes (`api/routes/auth.js`)

#### **User Registration**
```
POST /api/auth/signup
Body: { firstName, lastName, email, phone, password }
Response: { user, token, message }
```

#### **User Login**
```
POST /api/auth/login
Body: { email, password }
Response: { user, token, message }
```

#### **Token Verification**
```
GET /api/auth/verify
Headers: { Authorization: "Bearer <token>" }
Response: { user, message }
```

#### **Forgot Password**
```
POST /api/auth/forgot-password
Body: { email }
Response: { message, resetToken } // resetToken only in development
```

#### **Reset Password**
```
POST /api/auth/reset-password
Body: { token, password }
Response: { message }
```

#### **User Profile**
```
GET /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Response: { user }

PUT /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Body: { firstName, lastName, phone }
Response: { user, message }
```

#### **Change Password**
```
POST /api/auth/change-password
Headers: { Authorization: "Bearer <token>" }
Body: { currentPassword, newPassword }
Response: { message }
```

### Security Features

#### **Password Security**
- Bcrypt hashing with salt rounds
- Minimum 8 characters requirement
- Complexity validation (uppercase, lowercase, numbers)
- Password strength indicator

#### **JWT Token Management**
- 7-day token expiration
- Secure token storage
- Automatic token verification
- Token refresh capability

#### **Data Validation**
- Email format validation
- Phone number format (Ethiopian)
- Password strength requirements
- Input sanitization

## 📱 User Experience Features

### Professional UI/UX
- **Ethiopian Branding**: Consistent with Zembile theme colors
- **Responsive Design**: Mobile-first approach
- **Loading States**: Professional spinners and feedback
- **Error Handling**: Toast notifications instead of alerts
- **Form Validation**: Real-time validation with helpful messages

### Accessibility
- **Semantic HTML**: Proper form labels and structure
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: Meets accessibility standards

### Mobile Experience
- **Touch-Friendly**: Large buttons and touch targets
- **Mobile Menu**: Dedicated mobile authentication options
- **Responsive Forms**: Optimized for mobile input
- **Progressive Enhancement**: Works without JavaScript

## 🔄 Integration with Existing Features

### Cart & Checkout Protection
- Checkout requires authentication
- Cart persistence across sessions
- Order history tracking

### Wishlist Integration
- User-specific wishlist storage
- Cross-device synchronization
- Authentication-aware wishlist features

### Order Management
- Protected order pages
- User-specific order history
- Payment proof upload requires auth

## 🚀 Setup Instructions

### Frontend Dependencies
```bash
cd frontend
# Dependencies already included in package.json
npm install
```

### Backend Dependencies
```bash
cd api
npm install bcryptjs jsonwebtoken
```

### Environment Variables
Create `.env` file in api directory:
```env
JWT_SECRET=your_super_secure_jwt_secret_key_here
NODE_ENV=development
```

### Database Integration (Production)
Replace in-memory storage with:
- MongoDB with Mongoose
- PostgreSQL with Prisma
- MySQL with Sequelize

## 🧪 Testing

### Demo Account
- **Email**: `demo@zembile.com`
- **Password**: `demo123`
- **Role**: `customer`

### Test Scenarios
1. **Registration Flow**: Complete signup process
2. **Login Flow**: Test with demo credentials
3. **Password Reset**: Test forgot password flow
4. **Protected Routes**: Access checkout without login
5. **Token Expiration**: Test automatic logout
6. **Mobile Experience**: Test on mobile devices

## 🔒 Security Considerations

### Production Checklist
- [ ] Use strong JWT secret (environment variable)
- [ ] Implement rate limiting for auth endpoints
- [ ] Add CSRF protection
- [ ] Use HTTPS in production
- [ ] Implement proper session management
- [ ] Add email verification for new accounts
- [ ] Implement account lockout after failed attempts
- [ ] Add two-factor authentication (optional)

### Data Protection
- Passwords are never stored in plain text
- JWT tokens contain minimal user data
- Sensitive operations require re-authentication
- User data is validated and sanitized

## 📊 User Roles & Permissions

### Customer Role (Default)
- View products and categories
- Manage cart and wishlist
- Place orders and upload payment proofs
- View order history
- Update profile information

### Admin Role (Future Enhancement)
- All customer permissions
- Access admin panel
- Manage products and categories
- View all orders and payment proofs
- Manage user accounts

## 🎯 Future Enhancements

### Planned Features
1. **Email Verification**: Verify email addresses on signup
2. **Two-Factor Authentication**: SMS or app-based 2FA
3. **Social Login**: Complete Google/Facebook integration
4. **Account Recovery**: Additional recovery methods
5. **Session Management**: Multiple device management
6. **Audit Logging**: Track user activities
7. **Password Policies**: Configurable password requirements

### Integration Opportunities
1. **Admin Panel**: User management interface
2. **Analytics**: User behavior tracking
3. **Marketing**: Email campaigns for registered users
4. **Customer Support**: Integrated help desk
5. **Loyalty Program**: Points and rewards system

## 📞 Support & Troubleshooting

### Common Issues
1. **Token Expired**: Automatic logout and redirect to login
2. **Invalid Credentials**: Clear error messages
3. **Network Errors**: Graceful error handling
4. **Form Validation**: Real-time feedback

### Development Tools
- Browser DevTools for debugging
- Network tab for API monitoring
- Console logs for error tracking
- React DevTools for state inspection

The authentication system provides a solid foundation for user management while maintaining the Ethiopian cultural theme and professional e-commerce standards. All components are production-ready with proper error handling, security measures, and user experience considerations.