#!/bin/bash

# Production environment verification script
set -e

SITE_URL=${1:-"https://heymou.com"}

echo "🔍 Verifying production deployment at: $SITE_URL"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Check if site is accessible
print_status "Checking site accessibility..."
if curl -f -s "$SITE_URL" > /dev/null; then
    print_status "Site is accessible"
else
    print_error "Site is not accessible"
    exit 1
fi

# 2. Check SSL certificate
print_status "Checking SSL certificate..."
if curl -f -s -I "$SITE_URL" | grep -q "HTTP/2 200"; then
    print_status "SSL certificate is valid"
else
    print_warning "SSL certificate issues detected"
fi

# 3. Check response headers
print_status "Checking security headers..."
HEADERS=$(curl -s -I "$SITE_URL")

if echo "$HEADERS" | grep -q "X-Content-Type-Options"; then
    print_status "X-Content-Type-Options header present"
else
    print_warning "X-Content-Type-Options header missing"
fi

if echo "$HEADERS" | grep -q "X-Frame-Options"; then
    print_status "X-Frame-Options header present"
else
    print_warning "X-Frame-Options header missing"
fi

if echo "$HEADERS" | grep -q "X-XSS-Protection"; then
    print_status "X-XSS-Protection header present"
else
    print_warning "X-XSS-Protection header missing"
fi

# 4. Check internationalization
print_status "Checking internationalization..."
if curl -f -s "$SITE_URL/es" > /dev/null; then
    print_status "Spanish locale accessible"
else
    print_warning "Spanish locale not accessible"
fi

if curl -f -s "$SITE_URL/en" > /dev/null; then
    print_status "English locale accessible"
else
    print_warning "English locale not accessible"
fi

# 5. Check sitemap
print_status "Checking sitemap..."
if curl -f -s "$SITE_URL/sitemap.xml" > /dev/null; then
    print_status "Sitemap accessible"
else
    print_warning "Sitemap not accessible"
fi

# 6. Check robots.txt
print_status "Checking robots.txt..."
if curl -f -s "$SITE_URL/robots.txt" > /dev/null; then
    print_status "Robots.txt accessible"
else
    print_warning "Robots.txt not accessible"
fi

# 7. Check contact form endpoint
print_status "Checking contact form endpoint..."
CONTACT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SITE_URL/api/contact" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","message":"Test"}')

if [ "$CONTACT_RESPONSE" = "200" ] || [ "$CONTACT_RESPONSE" = "400" ]; then
    print_status "Contact form endpoint responding"
else
    print_warning "Contact form endpoint issues (HTTP $CONTACT_RESPONSE)"
fi

# 8. Performance check
print_status "Running basic performance check..."
LOAD_TIME=$(curl -o /dev/null -s -w "%{time_total}" "$SITE_URL")
LOAD_TIME_MS=$(echo "$LOAD_TIME * 1000" | bc)

if (( $(echo "$LOAD_TIME < 3.0" | bc -l) )); then
    print_status "Page load time: ${LOAD_TIME}s (Good)"
else
    print_warning "Page load time: ${LOAD_TIME}s (Slow)"
fi

echo ""
print_status "🎉 Production verification completed!"
echo ""
echo "Next steps:"
echo "1. Monitor error logs and performance metrics"
echo "2. Test all forms and user interactions manually"
echo "3. Verify analytics and tracking are working"
echo "4. Check email notifications are being received"
echo "5. Test on various devices and browsers"