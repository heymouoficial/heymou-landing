import crypto from 'crypto';

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { WebhookPayload, WebhookResponse, BuildShipResponse } from '../../../../../types/buildship';

/**
 * POST /api/buildship/webhook
 * Webhook endpoint for receiving BuildShip notifications
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook secret
    const webhookSecret = process.env.BUILDSHIP_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'Webhook secret not configured',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: 500 }
      );
    }

    // Get headers
    const headersList = await headers();
    const signature = headersList.get('x-buildship-signature');
    const timestamp = headersList.get('x-buildship-timestamp');

    if (!signature || !timestamp) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required webhook headers',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: 401 }
      );
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(`${timestamp}.${rawBody}`)
      .digest('hex');

    const providedSignature = signature.replace('sha256=', '');

    if (!crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    )) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid webhook signature',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: 401 }
      );
    }

    // Verify timestamp (prevent replay attacks)
    const webhookTimestamp = parseInt(timestamp, 10);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDifference = Math.abs(currentTimestamp - webhookTimestamp);

    // Allow 5 minutes tolerance
    if (timeDifference > 300) {
      return NextResponse.json(
        {
          success: false,
          error: 'Webhook timestamp too old',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: 401 }
      );
    }

    // Parse webhook payload
    const webhookPayload: WebhookPayload = JSON.parse(rawBody);

    // Process webhook based on type
    const result = await processWebhook(webhookPayload);

    // Return success response
    const response: BuildShipResponse<WebhookResponse> = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Webhook processing error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
        timestamp: new Date().toISOString(),
      } as BuildShipResponse,
      { status: 500 }
    );
  }
}

/**
 * Process different types of webhooks
 */
async function processWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
  const { type, data } = payload;

  switch (type) {
    case 'contact.submitted':
      return await handleContactSubmission(data);
    
    case 'analytics.processed':
      return await handleAnalyticsProcessed(data);
    
    case 'content.published':
      return await handleContentPublished(data);
    
    case 'error.occurred':
      return await handleErrorNotification(data);
    
    default:
      // eslint-disable-next-line no-console
      console.warn('Unknown webhook type:', type);
      return {
        processed: true,
        type,
        timestamp: new Date().toISOString(),
        result: { message: 'Unknown webhook type processed' },
      };
  }
}

/**
 * Handle contact form submission webhook
 */
async function handleContactSubmission(data: Record<string, unknown>): Promise<WebhookResponse> {
  // eslint-disable-next-line no-console
  console.log('Contact submission processed:', data);
  
  // Here you could:
  // - Send notification emails
  // - Update CRM systems
  // - Trigger follow-up workflows
  
  return {
    processed: true,
    type: 'contact.submitted',
    timestamp: new Date().toISOString(),
    result: {
      contactId: data.id,
      status: 'processed',
    },
  };
}

/**
 * Handle analytics processing webhook
 */
async function handleAnalyticsProcessed(data: Record<string, unknown>): Promise<WebhookResponse> {
  // eslint-disable-next-line no-console
  console.log('Analytics event processed:', data);
  
  // Here you could:
  // - Update analytics dashboards
  // - Trigger marketing automation
  // - Send alerts for important events
  
  return {
    processed: true,
    type: 'analytics.processed',
    timestamp: new Date().toISOString(),
    result: {
      eventId: data.eventId,
      status: 'processed',
    },
  };
}

/**
 * Handle content publishing webhook
 */
async function handleContentPublished(data: Record<string, unknown>): Promise<WebhookResponse> {
  // eslint-disable-next-line no-console
  console.log('Content published:', data);
  
  // Here you could:
  // - Invalidate cache
  // - Update search indexes
  // - Send notifications
  
  return {
    processed: true,
    type: 'content.published',
    timestamp: new Date().toISOString(),
    result: {
      contentId: data.id,
      status: 'published',
    },
  };
}

/**
 * Handle error notification webhook
 */
async function handleErrorNotification(data: Record<string, unknown>): Promise<WebhookResponse> {
  // eslint-disable-next-line no-console
  console.error('BuildShip error notification:', data);
  
  // Here you could:
  // - Send alerts to monitoring systems
  // - Log errors for debugging
  // - Trigger recovery workflows
  
  return {
    processed: true,
    type: 'error.occurred',
    timestamp: new Date().toISOString(),
    result: {
      errorId: data.id,
      status: 'logged',
    },
  };
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-BuildShip-Signature, X-BuildShip-Timestamp',
    },
  });
}