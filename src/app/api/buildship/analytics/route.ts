import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { AnalyticsEventData, AnalyticsResponse, BuildShipResponse } from '../../../../../types/buildship';
import { validateAnalyticsEventData, handleBuildShipError, logBuildShipCall } from '../../../../../lib/buildship/utils';

/**
 * POST /api/buildship/analytics
 * Proxy endpoint for analytics events to BuildShip
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let requestData: Partial<AnalyticsEventData> = {};

  try {
    // Validate environment variables
    const buildShipEndpoint = process.env.BUILDSHIP_ANALYTICS_ENDPOINT;
    const apiKey = process.env.BUILDSHIP_API_KEY;

    if (!buildShipEndpoint || !apiKey) {
      logBuildShipCall('/analytics', 'POST', {}, null, 'BuildShip analytics configuration missing');
      return NextResponse.json(
        {
          success: false,
          error: 'BuildShip analytics configuration missing',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: 500 }
      );
    }

    // Parse and validate request body
    requestData = await request.json();
    
    // Get client metadata
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const referer = headersList.get('referer') || '';
    const clientIP = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    
    // Add metadata to request data
    const analyticsDataWithMetadata = {
      ...requestData,
      metadata: {
        ...requestData.metadata,
        userAgent,
        referer,
        timestamp: new Date().toISOString(),
        ip: clientIP,
        locale: requestData.metadata?.locale || 'es',
      },
    };

    // Validate analytics event data
    const validatedData = validateAnalyticsEventData(analyticsDataWithMetadata);

    // Prepare data for BuildShip analytics workflow
    const buildShipPayload = {
      origen: 'website_analytics',
      analyticsPayload: {
        ...validatedData,
        metadata: {
          ...validatedData.metadata,
          source: 'website_analytics_tracking',
          processingTime: Date.now() - startTime,
        },
      },
    };

    logBuildShipCall('/analytics', 'POST', buildShipPayload);

    // Make request to BuildShip analytics workflow
    const buildShipResponse = await fetch(buildShipEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BUILDSHIP_API_KEY': apiKey,
        'X-Source': 'nextjs-analytics-proxy',
        'X-Request-ID': `analytics_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      },
      body: JSON.stringify(buildShipPayload),
    });

    if (!buildShipResponse.ok) {
      const errorText = await buildShipResponse.text();
      const error = `BuildShip analytics submission failed: ${buildShipResponse.status} ${buildShipResponse.statusText} - ${errorText}`;
      
      logBuildShipCall('/analytics', 'POST', buildShipPayload, null, error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process analytics event',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: buildShipResponse.status }
      );
    }

    const result = await buildShipResponse.json();
    
    logBuildShipCall('/analytics', 'POST', buildShipPayload, result);

    // Return success response
    const response: BuildShipResponse<AnalyticsResponse> = {
      success: true,
      data: {
        eventId: result.eventId || result.id || `analytics_${Date.now()}`,
        processed: result.processed || true,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
      requestId: result.requestId,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    logBuildShipCall('/analytics', 'POST', requestData, null, error);

    // Handle validation errors specifically
    if (error instanceof Error && error.name === 'BuildShipApiError') {
      const locale = (requestData as AnalyticsEventData)?.metadata?.locale || 'es';
      return NextResponse.json(
        {
          success: false,
          error: handleBuildShipError(error, locale as 'es' | 'en'),
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      } as BuildShipResponse,
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}