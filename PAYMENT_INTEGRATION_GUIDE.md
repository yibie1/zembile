# Payment Integration Guide - Zembile Marketplace

## Overview
This guide documents the payment integration for the Zembile Ethiopian e-commerce marketplace, featuring both Chapa payment gateway and manual bank transfer with payment proof upload.

## Payment Methods

### 1. Chapa Payment Gateway
- **Integration**: Chapa API for Ethiopian mobile money and banking
- **Supported Services**: Telebirr, CBE Birr, Amole, and other Ethiopian payment services
- **Flow**: Instant payment processing with automatic verification
- **Documentation**: https://developer.chapa.co/integrations/test-mode-vs-live-mode

### 2. Bank Transfer with Payment Proof
- **Method**: Manual transfer to Ethiopian bank accounts
- **Verification**: Customer uploads payment receipt for manual verification
- **Processing Time**: 1-2 business days for verification
- **Banks Supported**: CBE, Dashen Bank, Awash Bank, Bank of Abyssinia

## Implementation Details

### Frontend Components

#### Enhanced Cart Page (`frontend/src/pages/Cart.jsx`)
- Professional styling with wishlist integration
- Toast notifications for user actions
- Order summary with shipping calculations
- Empty cart state with call-to-action

#### Comprehensive Checkout Page (`frontend/src/pages/Checkout.jsx`)
- Customer information form with Ethiopian regions
- Payment method selection (Chapa vs Bank Transfer)
- Bank account selection for manual transfers
- Real-time order summary
- Copy-to-clipboard functionality for bank details

#### Professional Payment Proof Page (`frontend/src/pages/PaymentProof.jsx`)
- Drag-and-drop file upload with preview
- Bank account details display
- Transaction reference and date fields
- File validation (images and PDFs, max 5MB)
- Process timeline explanation

#### Order Tracking Page (`frontend/src/pages/Orders.jsx`)
- Order history with status tracking
- Payment proof upload links for pending orders
- Professional order cards with item details

### Backend API Routes

#### Payment Routes (`api/routes/payments.js`)
- `POST /api/chapa/initialize` - Initialize Chapa payment
- `POST /api/chapa/callback` - Handle Chapa webhooks
- `POST /api/orders` - Create order for bank transfer
- `GET /api/orders/:orderId` - Get order details
- `POST /api/payment-proof` - Handle payment proof submission

#### Upload Routes (`api/routes/uploads.js`)
- `POST /api/uploads/payment-proof` - Upload payment proof files
- `GET /api/uploads/file/:filename` - Retrieve uploaded files
- File validation and security measures
- Multer configuration for secure uploads

## Ethiopian Bank Accounts

The system supports transfers to major Ethiopian banks:

1. **Commercial Bank of Ethiopia (CBE)**
   - Account: 1000123456789
   - Swift: CBETETAA
   - Branch: Addis Ababa Main Branch

2. **Dashen Bank**
   - Account: 0012345678901
   - Swift: DASHETET
   - Branch: Bole Branch

3. **Awash Bank**
   - Account: 01320000123456
   - Swift: AWASETET
   - Branch: Kazanchis Branch

4. **Bank of Abyssinia**
   - Account: 123456789012
   - Swift: ABYSETAA
   - Branch: Piazza Branch

## Order Status Flow

1. **pending_payment** - Order created, awaiting payment
2. **payment_proof_uploaded** - Customer uploaded payment proof
3. **paid** - Payment verified (Chapa) or approved (manual)
4. **processing** - Order being prepared
5. **shipped** - Order dispatched
6. **delivered** - Order completed
7. **cancelled** - Order cancelled

## Security Features

- File type validation (images and PDFs only)
- File size limits (5MB maximum)
- Secure file storage with unique filenames
- Input validation and sanitization
- CORS protection
- Error handling and logging

## Toast Notification System

Integrated react-hot-toast for professional user feedback:
- Success notifications for completed actions
- Error messages for failed operations
- Loading states for async operations
- Custom styling matching Ethiopian theme

## Setup Instructions

### Frontend Dependencies
```bash
cd frontend
npm install react-hot-toast
```

### Backend Dependencies
```bash
cd api
npm install multer
```

### Environment Variables
Create `.env` file in api directory:
```
CHAPA_SECRET_KEY=your_chapa_secret_key
CHAPA_PUBLIC_KEY=your_chapa_public_key
```

### Running the Application
```bash
# Start API server
cd api
npm run dev

# Start frontend
cd frontend
npm run dev
```

## Testing

### Chapa Integration Testing
- Use Chapa test mode for development
- Test with Ethiopian phone numbers
- Verify webhook handling

### Payment Proof Testing
- Upload various file formats
- Test file size limits
- Verify order status updates

## Production Considerations

1. **Database Integration**: Replace in-memory storage with MongoDB/PostgreSQL
2. **File Storage**: Use cloud storage (AWS S3, Google Cloud) for production
3. **Security**: Implement proper authentication and authorization
4. **Monitoring**: Add logging and error tracking
5. **Backup**: Regular database and file backups
6. **SSL**: Ensure HTTPS for all payment operations

## Cultural Considerations

- Ethiopian Birr (ETB) currency formatting
- Ethiopian regions in address forms
- Local bank account formats
- Cultural design elements (Zembile basket theme)
- Ethiopian flag colors in branding

## Support

For technical support or questions about the payment integration:
- Check Chapa documentation: https://developer.chapa.co/
- Review Ethiopian banking regulations
- Test thoroughly in staging environment before production deployment