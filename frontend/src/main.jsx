import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import ToastProvider from './components/ToastProvider'

import App from './App'
import AuthLayout from './auth/AuthLayout'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PaymentProof from './pages/PaymentProof'
import Wishlist from './pages/Wishlist'
import Orders from './pages/Orders'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Careers from './pages/Careers'
import Shipping from './pages/Shipping'
import Returns from './pages/Returns'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Cookies from './pages/Cookies'
import Accessibility from './pages/Accessibility'
import Account from './pages/Account'
import NotFound from './pages/NotFound'

// Auth components
import Login from './auth/Login'
import Signup from './auth/Signup'
import ForgotPassword from './auth/ForgotPassword'
import ResetPassword from './auth/ResetPassword'
import ProtectedRoute, { AuthRoute } from './auth/ProtectedRoute'

import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Main app routes with Header/Footer */}
              <Route path="/" element={<App />}> 
                <Route index element={<Home />} />
                <Route path="products" element={<ProductList />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                
                {/* Protected routes - require authentication */}
                <Route path="checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="payment-proof" element={
                  <ProtectedRoute>
                    <PaymentProof />
                  </ProtectedRoute>
                } />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="account/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="account" element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } />
                
                {/* Public routes */}
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="careers" element={<Careers />} />
                <Route path="shipping" element={<Shipping />} />
                <Route path="returns" element={<Returns />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="cookies" element={<Cookies />} />
                <Route path="accessibility" element={<Accessibility />} />
              </Route>
              
              {/* Auth routes with separate layout (no Header/Footer) */}
              <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={
                  <AuthRoute>
                    <Login />
                  </AuthRoute>
                } />
                <Route path="signup" element={
                  <AuthRoute>
                    <Signup />
                  </AuthRoute>
                } />
                <Route path="forgot-password" element={
                  <AuthRoute>
                    <ForgotPassword />
                  </AuthRoute>
                } />
                <Route path="reset-password" element={
                  <AuthRoute>
                    <ResetPassword />
                  </AuthRoute>
                } />
              </Route>
              
              {/* 404 - Catch all unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastProvider />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
