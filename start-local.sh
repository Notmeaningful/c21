#!/bin/bash

# Century 21 Questionnaire - Local Hosting Startup Script
# This script starts the development server locally

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Century 21 Questionnaire - Local Development Server  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "To install Node.js:"
    echo "  1. Go to https://nodejs.org/"
    echo "  2. Download LTS version"
    echo "  3. Run the installer"
    echo "  4. Restart your terminal"
    echo ""
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ npm $(npm --version) detected"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (first time setup)..."
    npm install
    echo ""
fi

# Start the development server
echo "🚀 Starting development server..."
echo ""
echo "📍 Access the application at:"
echo "   http://localhost:3000"
echo ""
echo "📝 Available pages:"
echo "   • Landing: http://localhost:3000"
echo "   • Form: http://localhost:3000/form"
echo "   • Admin: http://localhost:3000/admin/login"
echo ""
echo "⏹️  Press Ctrl+C to stop the server"
echo ""
echo "════════════════════════════════════════════════════════"
echo ""

npm run dev
