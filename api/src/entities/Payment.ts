import { Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: 'chapa' | 'telebirr' | 'cbe_birr' | 'm_birr' | 'bank_transfer' | 'cash_on_delivery';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  transactionId?: string;
  reference: string;
  gatewayResponse?: Record<string, any>;
  failureReason?: string;
  processedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  fees?: {
    gateway: number;
    platform: number;
    total: number;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPaymentProof extends Document {
  _id: Types.ObjectId;
  orderId: string;
  userId: string;
  transactionId?: string;
  paymentMethod: 'bank_transfer' | 'cash_deposit';
  bankName?: string;
  accountNumber?: string;
  referenceNumber: string;
  amount: number;
  currency: string;
  proofImage: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionCreate {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: 'chapa' | 'telebirr' | 'cbe_birr' | 'm_birr' | 'bank_transfer' | 'cash_on_delivery';
  reference: string;
  metadata?: Record<string, any>;
}

export interface ITransactionUpdate {
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
  failureReason?: string;
  processedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  fees?: {
    gateway: number;
    platform: number;
    total: number;
  };
}

export interface IPaymentProofCreate {
  orderId: string;
  userId: string;
  paymentMethod: 'bank_transfer' | 'cash_deposit';
  bankName?: string;
  accountNumber?: string;
  referenceNumber: string;
  amount: number;
  currency: string;
  proofImage: string;
  notes?: string;
}

export interface IPaymentProofUpdate {
  status?: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
  notes?: string;
}

export interface IChapaPaymentRequest {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
  customization?: {
    title?: string;
    description?: string;
    logo?: string;
  };
}

export interface IChapaPaymentResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
  };
}

export interface IChapaWebhookPayload {
  event: string;
  data: {
    id: string;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string;
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string;
    ip: string;
    narration: string;
    status: string;
    payment_type: string;
    created_at: string;
    account_id: number;
    customer: {
      id: number;
      name: string;
      phone_number: string;
      email: string;
      created_at: string;
    };
  };
}