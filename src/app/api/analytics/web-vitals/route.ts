import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the incoming data
    const { name, value, rating, id, url, timestamp } = body;
    
    if (!name || typeof value !== 'number' || !rating || !id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Store this data in your database
    // 2. Send to analytics services (Google Analytics, etc.)
    // 3. Aggregate metrics for monitoring dashboards

    // For now, we'll just log the metrics in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('📊 Web Vitals Metric Received:', {
        name,
        value: Math.round(value),
        rating,
        id,
        url,
        timestamp: new Date(timestamp).toISOString()
      });
    }

    // Example: Send to external analytics service
    if (process.env.ANALYTICS_WEBHOOK_URL) {
      try {
        await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ANALYTICS_API_KEY}`
          },
          body: JSON.stringify({
            metric_name: name,
            metric_value: value,
            metric_rating: rating,
            metric_id: id,
            page_url: url,
            timestamp,
            user_agent: request.headers.get('user-agent'),
            ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            site: 'heymou.com'
          })
        });
      } catch {
        // Silently fail external analytics
      }
    }

    // Store in database (example with hypothetical database)
    // await db.webVitals.create({
    //   data: {
    //     name,
    //     value,
    //     rating,
    //     metricId: id,
    //     url,
    //     timestamp: new Date(timestamp),
    //     userAgent: request.headers.get('user-agent'),
    //     ipAddress: request.ip || request.headers.get('x-forwarded-for')
    //   }
    // });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}