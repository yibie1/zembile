#!/bin/bash

# Zembile Marketplace Setup Script
# This script helps set up the development environment

echo "🛒 Setting up Zembile Marketplace..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please update Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install API dependencies
echo "📦 Installing API dependencies..."
cd api
npm install
cd ..

# Create .env file for API if it doesn't exist
if [ ! -f "api/.env" ]; then
    echo "🔧 Creating API environment file..."
    cat > api/.env << EOL
# JWT Secret - Change this in production!
JWT_SECRET=zembile_jwt_secret_development_key_$(date +%s)

# Environment
NODE_ENV=development

# Server Port
PORT=4000

# Chapa Payment Gateway (Test Mode)
# Get your keys from https://dashboard.chapa.co/
CHAPA_SECRET_KEY=your_chapa_secret_key_here
CHAPA_PUBLIC_KEY=your_chapa_public_key_here
EOL
    echo "✅ Created api/.env file"
    echo "⚠️  Please update Chapa API keys in api/.env for payment integration"
else
    echo "✅ API environment file already exists"
fi

# Create uploads directory
mkdir -p api/uploads
echo "✅ Created uploads directory"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start development:"
echo "   npm run dev              # Start both frontend and backend"
echo "   npm run dev:frontend     # Start only frontend (port 3000)"
echo "   npm run dev:api          # Start only backend (port 4000)"
echo ""
echo "🔗 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo ""
echo "👤 Demo Account:"
echo "   Email:    demo@zembile.com"
echo "   Password: demo123"
echo ""
echo "📚 Documentation:"
echo "   README.md                    # Main documentation"
echo "   AUTHENTICATION_SYSTEM_GUIDE.md"
echo "   PAYMENT_INTEGRATION_GUIDE.md"
echo ""
echo "Happy coding! 🇪🇹"