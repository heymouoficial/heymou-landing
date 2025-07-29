import { NextRequest, NextResponse } from 'next/server';

interface ErrorLog {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  buildId?: string;
  locale?: string;
  additionalContext?: Record<string, unknown>;
}

interface APIErrorLog {
  endpoint: string;
  method: string;
  status: number;
  statusText: string;
  responseBody?: string;
  requestBody?: string;
  duration: number;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the incoming data
    if (!body.message && !body.endpoint) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add request metadata
    const errorLog = {
      ...body,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      request_user_agent: request.headers.get('user-agent'),
      request_timestamp: Date.now(),
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('🚨 Error Report Received:', {
        type: body.endpoint ? 'API Error' : 'JavaScript Error',
        message: body.message || `${body.method} ${body.endpoint} - ${body.status}`,
        timestamp: new Date(body.timestamp).toISOString(),
        url: body.url || body.endpoint,
        sessionId: body.sessionId,
      });
    }

    // In production, you would:
    // 1. Store errors in database for analysis
    // 2. Send to external monitoring services (Sentry, LogRocket, etc.)
    // 3. Set up alerts for critical errors
    // 4. Aggregate error metrics for dashboards

    // Example: Store in database
    // await db.errorLogs.create({
    //   data: {
    //     type: body.endpoint ? 'api_error' : 'javascript_error',
    //     message: body.message || `${body.method} ${body.endpoint}`,
    //     stack: body.stack,
    //     url: body.url || body.endpoint,
    //     userAgent: body.userAgent || request.headers.get('user-agent'),
    //     sessionId: body.sessionId,
    //     timestamp: new Date(body.timestamp),
    //     metadata: errorLog,
    //   }
    // });

    // Example: Send to external monitoring service
    if (process.env.ERROR_MONITORING_WEBHOOK_URL) {
      try {
        await fetch(process.env.ERROR_MONITORING_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ERROR_MONITORING_API_KEY}`,
          },
          body: JSON.stringify({
            ...errorLog,
            environment: process.env.NODE_ENV,
            site: 'heymou.com',
          }),
        });
      } catch {
        // Silently fail external monitoring
      }
    }

    // Example: Send critical errors to Slack/Discord
    if (isCriticalError(body)) {
      await sendCriticalErrorAlert(errorLog);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error processing error log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to determine if error is critical
function isCriticalError(errorData: ErrorLog | APIErrorLog): boolean {
  // API errors with 5xx status codes
  if ('status' in errorData && errorData.status >= 500) {
    return true;
  }

  // JavaScript errors in critical components
  if ('errorBoundary' in errorData && errorData.errorBoundary && ['App', 'Layout', 'ContactForm'].includes(errorData.errorBoundary)) {
    return true;
  }

  // Errors affecting core functionality
  const criticalKeywords = ['payment', 'auth', 'database', 'security'];
  if ('message' in errorData && errorData.message && criticalKeywords.some(keyword => 
    errorData.message.toLowerCase().includes(keyword)
  )) {
    return true;
  }

  return false;
}

// Helper function to send critical error alerts
async function sendCriticalErrorAlert(errorLog: (ErrorLog | APIErrorLog) & { ip_address?: string | null }) {
  const webhookUrl = process.env.CRITICAL_ERROR_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const message = {
      text: `🚨 Critical Error Detected`,
      attachments: [
        {
          color: 'danger',
          fields: [
            {
              title: 'Error Message',
              value: ('message' in errorLog ? errorLog.message : 'API Error') || 'Unknown error',
              short: false,
            },
            {
              title: 'URL',
              value: ('url' in errorLog ? errorLog.url : 'endpoint' in errorLog ? errorLog.endpoint : 'Unknown') || 'Unknown',
              short: true,
            },
            {
              title: 'Timestamp',
              value: new Date(errorLog.timestamp).toISOString(),
              short: true,
            },
            {
              title: 'Session ID',
              value: ('sessionId' in errorLog ? errorLog.sessionId : 'Unknown') || 'Unknown',
              short: true,
            },
            {
              title: 'User Agent',
              value: ('userAgent' in errorLog ? errorLog.userAgent : 'Unknown') || 'Unknown',
              short: false,
            },
          ],
        },
      ],
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  } catch {
    // Silently fail alert sending
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