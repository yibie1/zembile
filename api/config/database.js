const mongoose = require('mongoose')

// MongoDB connection configuration
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zembile'
    
    const conn = await mongoose.connect(mongoURI)

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    })

    return true

  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    
    // In development, continue with mock data if MongoDB is not available
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Continuing with mock data (MongoDB not available)')
      return false
    } else {
      process.exit(1)
    }
  }
}

module.exports = connectDB