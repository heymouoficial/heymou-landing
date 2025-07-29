import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { ContactFormData, ContactSubmissionResponse, BuildShipResponse } from '../../../../../types/buildship';
import { validateContactFormData, handleBuildShipError, logBuildShipCall } from '../../../../../lib/buildship/utils';

/**
 * POST /api/buildship/contact
 * Proxy endpoint for contact form submissions to BuildShip
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let requestData: Partial<ContactFormData> = {};

  try {
    // Validate environment variables
    const buildShipEndpoint = process.env.BUILDSHIP_CONTACT_ENDPOINT;
    const apiKey = process.env.BUILDSHIP_API_KEY;

    if (!buildShipEndpoint || !apiKey) {
      logBuildShipCall('/contact', 'POST', {}, null, 'BuildShip configuration missing');
      return NextResponse.json(
        {
          success: false,
          error: 'BuildShip configuration missing',
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
    const contactDataWithMetadata = {
      ...requestData,
      metadata: {
        userAgent,
        referer,
        timestamp: new Date().toISOString(),
        ip: clientIP,
      },
    };

    // Validate contact form data
    const validatedData = validateContactFormData(contactDataWithMetadata);

    // Prepare data for BuildShip contact workflow
    const buildShipPayload = {
      origen: 'website_contact',
      contactPayload: {
        ...validatedData,
        metadata: {
          ...validatedData.metadata,
          source: 'website_contact_form',
          processingTime: Date.now() - startTime,
        },
      },
    };

    logBuildShipCall('/contact', 'POST', buildShipPayload);

    // Make request to BuildShip contact workflow
    const buildShipResponse = await fetch(buildShipEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BUILDSHIP_API_KEY': apiKey,
        'X-Source': 'nextjs-contact-proxy',
        'X-Request-ID': `contact_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      },
      body: JSON.stringify(buildShipPayload),
    });

    if (!buildShipResponse.ok) {
      const errorText = await buildShipResponse.text();
      const error = `BuildShip contact submission failed: ${buildShipResponse.status} ${buildShipResponse.statusText} - ${errorText}`;
      
      logBuildShipCall('/contact', 'POST', buildShipPayload, null, error);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process contact submission',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: buildShipResponse.status }
      );
    }

    const result = await buildShipResponse.json();
    
    logBuildShipCall('/contact', 'POST', buildShipPayload, result);

    // Track analytics event for successful contact submission
    try {
      await fetch('/api/buildship/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'contact_form_submitted',
          eventData: {
            projectType: validatedData.projectType,
            budget: validatedData.budget,
            timeline: validatedData.timeline,
            hasCompany: !!validatedData.company,
          },
          metadata: {
            userAgent,
            referer,
            timestamp: new Date().toISOString(),
            ip: clientIP,
            locale: validatedData.locale,
          },
        }),
      });
    } catch (analyticsError) {
      // Don't fail the contact submission if analytics fails
      logBuildShipCall('/analytics', 'POST', {}, null, `Analytics tracking failed: ${analyticsError}`);
    }

    // Return success response
    const response: BuildShipResponse<ContactSubmissionResponse> = {
      success: true,
      data: {
        id: result.id || result.contactId || `contact_${Date.now()}`,
        status: result.status || 'received',
        submittedAt: new Date().toISOString(),
        estimatedResponseTime: result.estimatedResponseTime || '24 hours',
      },
      timestamp: new Date().toISOString(),
      requestId: result.requestId,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    logBuildShipCall('/contact', 'POST', requestData, null, error);

    // Handle validation errors specifically
    if (error instanceof Error && error.name === 'BuildShipApiError') {
      const locale = (requestData as ContactFormData)?.locale || 'es';
      return NextResponse.json(
        {
          success: false,
          error: handleBuildShipError(error, locale),
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