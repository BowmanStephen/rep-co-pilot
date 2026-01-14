#!/bin/bash

# ========================================
# Rep Co-Pilot - Production Deployment Script
# ========================================
#
# Usage:
#   ./scripts/deploy.sh          # Deploy to Vercel
#   ./scripts/deploy.sh preview  # Deploy preview branch
#

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Rep Co-Pilot Deployment Script${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found${NC}"
    echo "Install it first: npm install -g vercel"
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local not found${NC}"
    echo "Creating from .env.example..."
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  Please add your OPENROUTER_API_KEY to .env.local${NC}"
    exit 1
fi

# Validate required environment variables
echo -e "${GREEN}✓ Checking environment variables...${NC}"
if grep -q "sk-or-v1-your-key-here" .env.local; then
    echo -e "${RED}❌ OPENROUTER_API_KEY not set in .env.local${NC}"
    exit 1
fi

# Run build to verify everything works
echo -e "${GREEN}✓ Building for production...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful!${NC}"
echo ""

# Deploy to Vercel
echo -e "${GREEN}✓ Deploying to Vercel...${NC}"
vercel --prod

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 View analytics: https://vercel.com/dashboard"
echo "🔧 Manage project: https://vercel.com/dashboard"
echo ""
