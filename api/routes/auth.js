const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const router = express.Router()

// Mock database - In production, use a real database
let users = [
  {
    id: 1,
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@zembile.com',
    phone: '+251-9-12-34-56-78',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: demo123
    role: 'customer',
    isVerified: true,
    createdAt: new Date().toISOString()
  }
]

let resetTokens = []

// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'zembile_jwt_secret_key_2024'

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Helper function to hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

// Helper function to compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
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
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const newUser = {
      id: users.length + 1,
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: 'customer',
      isVerified: true, // In production, implement email verification
      createdAt: new Date().toISOString()
    }

    users.push(newUser)

    // Generate token
    const token = generateToken(newUser)

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser

    res.status(201).json({
      message: 'Account created successfully',
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Signup error:', error)
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
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    // Generate token
    const token = generateToken(user)

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

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
    // Find user by ID from token
    const user = users.find(u => u.id === req.user.id)
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

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
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        message: 'If an account with that email exists, we have sent password reset instructions.'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store reset token (in production, store in database)
    resetTokens.push({
      email: user.email,
      token: resetToken,
      expiresAt: resetTokenExpiry,
      used: false
    })

    // In production, send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`)
    console.log(`Reset link: http://localhost:3000/auth/reset-password?token=${resetToken}`)

    res.json({
      message: 'If an account with that email exists, we have sent password reset instructions.',
      // For development only - remove in production
      resetToken: resetToken
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      message: 'Internal server error'
    })
  }
})

// Verify Reset Token
router.get('/verify-reset-token', (req, res) => {
  try {
    const { token } = req.query

    if (!token) {
      return res.status(400).json({
        message: 'Reset token is required'
      })
    }

    // Find reset token
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

    // Find and validate reset token
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

    // Find user
    const userIndex = users.findIndex(u => u.email === resetTokenData.email)
    if (userIndex === -1) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // Hash new password
    const hashedPassword = await hashPassword(password)

    // Update user password
    users[userIndex].password = hashedPassword

    // Mark token as used
    resetTokenData.used = true

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
    const user = users.find(u => u.id === req.user.id)
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const { password: _, ...userWithoutPassword } = user

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

    const userIndex = users.findIndex(u => u.id === req.user.id)
    if (userIndex === -1) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // Update user data
    if (firstName) users[userIndex].firstName = firstName
    if (lastName) users[userIndex].lastName = lastName
    if (phone) users[userIndex].phone = phone

    const { password: _, ...userWithoutPassword } = users[userIndex]

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

    const userIndex = users.findIndex(u => u.id === req.user.id)
    if (userIndex === -1) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, users[userIndex].password)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      })
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update password
    users[userIndex].password = hashedNewPassword

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