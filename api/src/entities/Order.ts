import { Document, Types } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  subcategory?: string;
}

export interface IShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: string;
  orderNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount?: number;
  couponCode?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod: 'chapa' | 'telebirr' | 'cbe_birr' | 'm_birr' | 'bank_transfer' | 'cash_on_delivery';
  paymentReference?: string;
  shippingAddress: IShippingAddress;
  billingAddress?: IShippingAddress;
  shippingMethod: 'standard' | 'express' | 'overnight';
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderCreate {
  userId: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  billingAddress?: IShippingAddress;
  paymentMethod: 'chapa' | 'telebirr' | 'cbe_birr' | 'm_birr' | 'bank_transfer' | 'cash_on_delivery';
  shippingMethod: 'standard' | 'express' | 'overnight';
  couponCode?: string;
  notes?: string;
}

export interface IOrderUpdate {
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  paymentReference?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
}

export interface IOrderResponse {
  _id: string;
  orderNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount?: number;
  couponCode?: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentReference?: string;
  shippingAddress: IShippingAddress;
  billingAddress?: IShippingAddress;
  shippingMethod: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}