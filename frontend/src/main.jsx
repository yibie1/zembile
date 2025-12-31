import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PaymentProof from './pages/PaymentProof'
import About from './pages/About'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Careers from './pages/Careers'
import Shipping from './pages/Shipping'
import Returns from './pages/Returns'
import Terms from './pages/Terms'
import Account from './pages/Account'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<Home />} />
          <Route path="products" element={<ProductList />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-proof" element={<PaymentProof />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="careers" element={<Careers />} />
          <Route path="shipping" element={<Shipping />} />
          <Route path="returns" element={<Returns />} />
          <Route path="terms" element={<Terms />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
