import mongoose, { Schema } from 'mongoose';
import { IUser } from '@/entities/User';

const AddressSchema = new Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zipCode: { type: String, trim: true },
  country: { type: String, trim: true, default: 'Ethiopia' }
}, { _id: false });

const NotificationPreferencesSchema = new Schema({
  email: { type: Boolean, default: true },
  sms: { type: Boolean, default: false },
  push: { type: Boolean, default: true }
}, { _id: false });

const PreferencesSchema = new Schema({
  language: { type: String, default: 'en', enum: ['en', 'am', 'or'] },
  currency: { type: String, default: 'ETB', enum: ['ETB', 'USD'] },
  notifications: { type: NotificationPreferencesSchema, default: () => ({}) }
}, { _id: false });

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    match: [
      /^(\+251|0)?[79]\d{8}$/,
      'Please provide a valid Ethiopian phone number'
    ]
  },
  address: {
    type: AddressSchema,
    default: () => ({})
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'seller'],
    default: 'customer'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    type: PreferencesSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete (ret as any).password;
      delete (ret as any).emailVerificationToken;
      delete (ret as any).passwordResetToken;
      delete (ret as any).passwordResetExpires;
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full name (if needed)
UserSchema.virtual('fullName').get(function() {
  return this.name;
});

// Pre-save middleware for password hashing (if password is modified)
UserSchema.pre('save', function() {
  // Only hash password if it's modified and not already hashed
  if (!this.isModified('password')) return;
  
  // Password hashing is handled in the service layer
});

// Instance method to check if user has role
UserSchema.methods.hasRole = function(role: string): boolean {
  return this.role === role;
};

// Instance method to check if user is admin
UserSchema.methods.isAdmin = function(): boolean {
  return this.role === 'admin';
};

// Static method to find active users
UserSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Static method to find by email
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export const UserModel = mongoose.model<IUser>('User', UserSchema);