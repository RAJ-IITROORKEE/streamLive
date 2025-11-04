#!/usr/bin/env bash

# LiveStream Vercel Deployment Script
# This script helps you deploy to Vercel quickly

echo "🚀 LiveStream Vercel Deployment Helper"
echo "========================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "⚠️  Vercel CLI is not installed."
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is ready!"
echo ""

# Navigate to the livestream directory
cd "$(dirname "$0")/livestream" || exit

echo "📍 Current directory: $(pwd)"
echo ""

# Check for environment variables
if [ ! -f .env.local ]; then
    echo "⚠️  No .env.local file found!"
    echo "Creating .env.local from .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local"
        echo "⚠️  Please update NEXT_PUBLIC_API_URL in .env.local with your backend URL"
        echo ""
    fi
fi

# Ask user for deployment type
echo "Choose deployment type:"
echo "1) Preview deployment (test before going live)"
echo "2) Production deployment"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "🚀 Deploying to preview..."
    vercel
elif [ "$choice" = "2" ]; then
    echo ""
    echo "⚠️  This will deploy to PRODUCTION!"
    read -p "Are you sure? (y/n): " confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo ""
        echo "🚀 Deploying to production..."
        vercel --prod
    else
        echo "❌ Deployment cancelled."
        exit 0
    fi
else
    echo "❌ Invalid choice. Deployment cancelled."
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app should be live now!"
echo ""
echo "Next steps:"
echo "1. Visit your Vercel URL to test"
echo "2. Make sure backend CORS includes your Vercel URL"
echo "3. Test all features (camera add, snapshot, assets)"
echo ""
