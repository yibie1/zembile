const express = require('express')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const DatabaseService = require('../services/database')
const router = express.Router()

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'zembile_jwt_secret_key_2024'

// Mock reset tokens for non-MongoDB mode
let resetTokens = []

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id || user.id, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Access token required' })
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' })
      }

      // Get user from database
      const user = await DatabaseService.findUserById(decoded.id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      req.user = decoded
      req.userDetails = user
      next()
    })
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ message: 'Authentication failed' })
  }
}

// User Registration
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long'
      })
    }

    // Check if user already exists
    const existingUser = await DatabaseService.findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      })
    }

    // Create new user
    const userData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password, // Will be hashed by the model pre-save hook
      role: 'customer',
      isVerified: true // In production, implement email verification
    }

    const newUser = await DatabaseService.createUser(userData)

    // Generate token
    const token = generateToken(newUser)

    // Return user data (password excluded by model toJSON transform)
    res.status(201).json({
      message: 'Account created successfully',
      user: newUser,
      token
    })
  } catch (error) {
    console.error('Signup error:', error)
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Email already exists'
      })
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        message: 'Validation failed',
        errors
      })
    }
    
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    // Find user
    const user = await DatabaseService.findUserByEmail(email)
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    // Check password
    let isPasswordValid = false
    if (DatabaseService.isUsingMongoDB()) {
      isPasswordValid = await user.comparePassword(password)
    } else {
      // For mock data, use bcrypt directly
      const bcrypt = require('bcryptjs')
      isPasswordValid = await bcrypt.compare(password, user.password)
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    // Update last login
    await DatabaseService.updateUser(user._id || user.id, { 
      lastLogin: new Date() 
    })

    // Generate token
    const token = generateToken(user)

    // Return user data (password excluded)
    const { password: _, ...userWithoutPassword } = user.toObject ? user.toObject() : user

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Verify Token
router.get('/verify', authenticateToken, (req, res) => {
  try {
    // Return user data (password excluded)
    const { password, ...userWithoutPassword } = req.userDetails.toObject ? 
      req.userDetails.toObject() : req.userDetails

    res.json({
      message: 'Token is valid',
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      })
    }

    // Find user
    const user = await DatabaseService.findUserByEmail(email)
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        message: 'If an account with that email exists, we have sent password reset instructions.'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    if (DatabaseService.isUsingMongoDB()) {
      // Update user with reset token
      await DatabaseService.updateUser(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry
      })
    } else {
      // Store reset token in memory for mock mode
      resetTokens.push({
        email: user.email,
        token: resetToken,
        expiresAt: resetTokenExpiry,
        used: false
      })
    }

    // In production, send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`)
    console.log(`Reset link: ${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`)

    res.json({
      message: 'If an account with that email exists, we have sent password reset instructions.',
      // For development only - remove in production
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Verify Reset Token
router.get('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({
        message: 'Reset token is required'
      })
    }

    let isValidToken = false

    if (DatabaseService.isUsingMongoDB()) {
      // Check in database
      const User = require('../models/User')
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      })
      isValidToken = !!user
    } else {
      // Check in memory for mock mode
      const resetTokenData = resetTokens.find(rt => 
        rt.token === token && 
        !rt.used && 
        new Date() < new Date(rt.expiresAt)
      )
      isValidToken = !!resetTokenData
    }

    if (!isValidToken) {
      return res.status(400).json({
        message: 'Invalid or expired reset token'
      })
    }

    res.json({
      message: 'Reset token is valid'
    })
  } catch (error) {
    console.error('Reset token verification error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        message: 'Token and new password are required'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long'
      })
    }

    let user = null

    if (DatabaseService.isUsingMongoDB()) {
      // Find user by reset token
      const User = require('../models/User')
      user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      })

      if (!user) {
        return res.status(400).json({
          message: 'Invalid or expired reset token'
        })
      }

      // Update password and clear reset token
      user.password = password // Will be hashed by pre-save hook
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save()
    } else {
      // Find and validate reset token in memory
      const resetTokenData = resetTokens.find(rt => 
        rt.token === token && 
        !rt.used && 
        new Date() < new Date(rt.expiresAt)
      )

      if (!resetTokenData) {
        return res.status(400).json({
          message: 'Invalid or expired reset token'
        })
      }

      // Find user and update password
      user = await DatabaseService.findUserByEmail(resetTokenData.email)
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        })
      }

      // Hash password and update user
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash(password, 12)
      await DatabaseService.updateUser(user.id, { password: hashedPassword })

      // Mark token as used
      resetTokenData.used = true
    }

    res.json({
      message: 'Password reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Get User Profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const { password, ...userWithoutPassword } = req.userDetails.toObject ? 
      req.userDetails.toObject() : req.userDetails

    res.json({
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Update User Profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body

    const updateData = {}
    if (firstName) updateData.firstName = firstName
    if (lastName) updateData.lastName = lastName
    if (phone) updateData.phone = phone

    const updatedUser = await DatabaseService.updateUser(req.user.id, updateData)
    
    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const { password, ...userWithoutPassword } = updatedUser.toObject ? 
      updatedUser.toObject() : updatedUser

    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Change Password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required'
      })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters long'
      })
    }

    const user = req.userDetails

    // Verify current password
    let isCurrentPasswordValid = false
    if (DatabaseService.isUsingMongoDB()) {
      isCurrentPasswordValid = await user.comparePassword(currentPassword)
    } else {
      const bcrypt = require('bcryptjs')
      isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    }

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      })
    }

    // Update password
    if (DatabaseService.isUsingMongoDB()) {
      const User = require('../models/User')
      const dbUser = await User.findById(user._id)
      dbUser.password = newPassword // Will be hashed by pre-save hook
      await dbUser.save()
    } else {
      const bcrypt = require('bcryptjs')
      const hashedNewPassword = await bcrypt.hash(newPassword, 12)
      await DatabaseService.updateUser(user.id, { password: hashedNewPassword })
    }

    res.json({
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Logout (client-side token removal, but we can log it)
router.post('/logout', authenticateToken, (req, res) => {
  // In a production app with refresh tokens, you'd invalidate the refresh token here
  res.json({
    message: 'Logged out successfully'
  })
})

module.exports = router