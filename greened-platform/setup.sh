#!/bin/bash

# GreenEd Platform Setup Script
echo "🌱 Setting up GreenEd Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install

# Go back to root
cd ..

# Copy environment file
echo "⚙️ Setting up environment..."
if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "✅ Created server/.env file"
else
    echo "✅ server/.env already exists"
fi

# Set up database
echo "🗄️ Setting up database..."
cd server
npx prisma generate
npx prisma db push
npx prisma db seed

echo "✅ Database setup complete"

# Go back to root
cd ..

echo ""
echo "🎉 Setup complete! You can now run the following commands:"
echo ""
echo "  Development mode:"
echo "    npm run dev"
echo ""
echo "  Or run separately:"
echo "    Server: npm run server:dev"
echo "    Client: npm run client:dev"
echo ""
echo "  Access the application:"
echo "    Frontend: http://localhost:5173"
echo "    Backend:  http://localhost:5000"
echo ""
echo "  Default login credentials:"
echo "    Email: admin@greened.com"
echo "    Password: password123"
echo ""
echo "🌱 Happy coding with GreenEd Platform!"