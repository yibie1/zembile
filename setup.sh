#!/bin/bash

# Zembile Marketplace Setup Script
# This script helps set up the development environment

echo "🛒 Setting up Zembile Marketplace..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please update Node.js: https://nodejs.org/"
    exit 1
fi

print_status "Node.js $(node -v) detected"

# Install root dependencies
print_info "Installing root dependencies..."
npm install

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install API dependencies
print_info "Installing API dependencies..."
cd api
npm install

# Fix any security vulnerabilities
print_info "Fixing security vulnerabilities..."
npm audit fix --force 2>/dev/null || true

cd ..

# Create .env file for API if it doesn't exist
if [ ! -f "api/.env" ]; then
    print_info "Creating API environment file..."
    cat > api/.env << EOL
# JWT Secret - Change this in production!
JWT_SECRET=zembile_jwt_secret_development_key_$(date +%s)

# Environment
NODE_ENV=development

# Server Configuration
PORT=4000
FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://localhost:4000

# Chapa Payment Gateway Configuration
# Get your keys from https://dashboard.chapa.co/
CHAPA_SECRET_KEY=your_chapa_secret_key_here
CHAPA_PUBLIC_KEY=your_chapa_public_key_here
CHAPA_WEBHOOK_SECRET=your_chapa_webhook_secret_here

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Email Configuration (Optional - for password reset)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EOL
    print_status "Created api/.env file"
    print_warning "Please update Chapa API keys in api/.env for payment integration"
else
    print_status "API environment file already exists"
fi

# Create uploads directory structure
mkdir -p api/uploads/payment-proofs
print_status "Created uploads directory structure"

# Create development scripts
print_info "Creating development scripts..."

# Create start-dev.sh script
cat > start-dev.sh << 'EOF'
#!/bin/bash

# Start all development servers concurrently

echo "🚀 Starting Zembile Development Environment..."
echo "=============================================="

# Function to kill all background processes on exit
cleanup() {
    echo "Stopping all servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start API server
echo "Starting API server on port 4000..."
cd api && npm run dev &
API_PID=$!

# Wait a moment for API to start
sleep 3

# Start Frontend
echo "Starting Frontend on port 3000..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Development servers started!"
echo "==============================="
echo "📋 API Server:     http://localhost:4000"
echo "🛍️  Frontend:       http://localhost:3000"
echo ""
echo "👤 Demo Account:"
echo "   Email:    demo@zembile.com"
echo "   Password: demo123"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for all background processes
wait
EOF

chmod +x start-dev.sh
print_status "Created start-dev.sh script"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start development:"
echo "   ./start-dev.sh           # Start both frontend and API (recommended)"
echo "   npm run dev              # Alternative: Start both servers"
echo "   npm run dev:frontend     # Start only frontend (port 3000)"
echo "   npm run dev:api          # Start only backend (port 4000)"
echo ""
echo "🔗 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   API:      http://localhost:4000"
echo ""
echo "👤 Demo Account:"
echo "   Email:    demo@zembile.com"
echo "   Password: demo123"
echo ""
echo "💳 Payment Integration:"
echo "   Primary:   Chapa Payment Gateway (instant)"
echo "   Secondary: Bank Transfer + Payment Proof Upload"
echo "   Banks:     CBE, Dashen, Awash, Bank of Abyssinia"
echo ""
echo "📚 Documentation:"
echo "   README.md                      # Main documentation"
echo "   PAYMENT_INTEGRATION_GUIDE.md   # Payment system guide"
echo "   AUTHENTICATION_SYSTEM_GUIDE.md # Auth system guide"
echo "   CONTRIBUTING.md                # Development guidelines"
echo ""
echo "🔧 Important Configuration:"
print_warning "Update api/.env with your Chapa credentials for payment testing"
print_warning "Chapa Test Mode: Use test cards from Chapa documentation"
print_warning "Bank Transfer: Upload sample receipts for testing admin verification"
echo ""
echo "Happy coding! 🇪🇹"