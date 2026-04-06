#!/bin/bash

# Century 21 Property Questionnaire System - Installation Script
# This script sets up everything you need to run the application

set -e

echo "🚀 Century 21 Questionnaire System - Installation & Setup"
echo "=========================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for Node.js
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm --version)${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Check for .env.local
echo "🔐 Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo ""
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  .env.local created with placeholder values${NC}"
    echo ""
    echo "🔧 You need to configure .env.local with:"
    echo "  • Supabase URL and API keys"
    echo "  • SMTP settings (Gmail/SendGrid/AWS SES)"
    echo "  • Admin email and secrets"
    echo ""
    echo "📖 See QUICKSTART.md for detailed setup instructions"
    echo ""
else
    echo -e "${GREEN}✅ .env.local found${NC}"
fi

echo ""
echo "=========================================================="
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "  1. Configure your .env.local file with credentials"
echo "  2. Set up Supabase database (run database.sql)"
echo "  3. Run: npm run dev"
echo "  4. Open: http://localhost:3000"
echo ""
echo "📖 Quick references:"
echo "  • Getting started: START_HERE.md"
echo "  • Quick setup: QUICKSTART.md"
echo "  • Full docs: README.md"
echo "  • Deployment: DEPLOYMENT.md"
echo "  • Customization: CUSTOMIZATION.md"
echo ""
echo "=========================================================="
