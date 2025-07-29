import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { ContentData, ContentResponse, BuildShipResponse } from '../../../../../types/buildship';

/**
 * POST /api/buildship/content
 * Proxy endpoint for content management to BuildShip
 */
export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const buildShipEndpoint = process.env.BUILDSHIP_CONTENT_ENDPOINT;
    const webhookSecret = process.env.BUILDSHIP_WEBHOOK_SECRET;

    if (!buildShipEndpoint || !webhookSecret) {
      return NextResponse.json(
        {
          success: false,
          error: 'BuildShip content configuration missing',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: 500 }
      );
    }

    // Parse request body
    const contentData: ContentData = await request.json();

    // Validate required fields
    if (!contentData.type || !contentData.slug || !contentData.locale || !contentData.title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, slug, locale, title',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: 400 }
      );
    }

    // Get client metadata
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const referer = headersList.get('referer') || '';
    const clientIP = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

    // Prepare data for BuildShip
    const buildShipPayload = {
      ...contentData,
      metadata: {
        ...contentData.metadata,
        userAgent,
        referer,
        timestamp: new Date().toISOString(),
        ip: clientIP,
        source: 'website_content_management',
        lastModified: new Date().toISOString(),
      },
    };

    // Make request to BuildShip workflow
    const buildShipResponse = await fetch(buildShipEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${webhookSecret}`,
        'X-Source': 'nextjs-proxy',
      },
      body: JSON.stringify(buildShipPayload),
    });

    if (!buildShipResponse.ok) {
      const errorText = await buildShipResponse.text();
      // eslint-disable-next-line no-console
      console.error('BuildShip content management failed:', {
        status: buildShipResponse.status,
        statusText: buildShipResponse.statusText,
        error: errorText,
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process content management request',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: buildShipResponse.status }
      );
    }

    const result = await buildShipResponse.json();

    // Return success response
    const response: BuildShipResponse<ContentResponse> = {
      success: true,
      data: {
        id: result.id || `content_${Date.now()}`,
        slug: contentData.slug,
        status: contentData.status === 'published' ? 'published' : 'created',
        publishedAt: contentData.status === 'published' ? new Date().toISOString() : undefined,
        url: result.url || `/${contentData.locale}/${contentData.type}/${contentData.slug}`,
      },
      timestamp: new Date().toISOString(),
      requestId: result.requestId,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Content management proxy error:', error);

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