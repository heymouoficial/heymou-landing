#!/bin/bash

# Deployment script for HeyMou Platform
# This script runs comprehensive tests before deployment

set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Type checking
print_status "Running TypeScript type checking..."
npm run type-check

# Linting
print_status "Running ESLint..."
npm run lint

# Code formatting check
print_status "Checking code formatting..."
npm run format:check

# Unit tests
print_status "Running unit tests..."
npm run test:ci

# Build the application
print_status "Building application..."
npm run build

# Start the application for testing
print_status "Starting application for testing..."
npm run start &
SERVER_PID=$!

# Wait for server to start
sleep 10

# Check if server is running
if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_error "Server failed to start"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Run accessibility tests
print_status "Running accessibility tests..."
npm run test:accessibility || print_warning "Accessibility tests failed"

# Run Lighthouse performance tests
print_status "Running Lighthouse performance tests..."
npm run test:lighthouse || print_warning "Lighthouse tests failed"

# Run cross-browser tests
print_status "Running cross-browser tests..."
npm run test:cross-browser || print_warning "Cross-browser tests failed"

# Stop the test server
kill $SERVER_PID 2>/dev/null || true

# Deploy to Vercel
print_status "Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
    print_status "Deployment completed successfully!"
else
    print_warning "Vercel CLI not found. Please install it with: npm i -g vercel"
    print_status "Manual deployment required. Run: vercel --prod"
fi

echo ""
print_status "🎉 Deployment process completed!"
echo ""
echo "Next steps:"
echo "1. Verify the deployment at your production URL"
echo "2. Test all forms and integrations in production"
echo "3. Monitor performance and error logs"
echo "4. Update DNS settings if needed"