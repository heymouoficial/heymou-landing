import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { BuildShipResponse } from '../../../../../types/buildship';

interface ChatbotRequest {
  message: string;
  sessionId?: string;
  locale?: 'es' | 'en';
  context?: Record<string, unknown>;
}

interface ChatbotResponse {
  response: string;
  sessionId: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

/**
 * POST /api/buildship/chatbot
 * Proxy endpoint for chatbot interactions to BuildShip
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ChatbotRequest = await request.json();

    // Validate required fields
    if (!body.message?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message is required',
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

    // Prepare data for BuildShip chatbot workflow
    const buildShipPayload = {
      origen: 'website_chat',
      mensajePayload: {
        message: body.message.trim(),
        sessionId: body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        locale: body.locale || 'es',
        context: body.context || {},
        metadata: {
          userAgent,
          referer,
          timestamp: new Date().toISOString(),
          ip: clientIP,
          source: 'website_chatbot',
        },
      },
      telegramChatId: '', // Not used for website chat
    };

    // BuildShip endpoint configuration
    const buildShipUrl = 'https://2m5s5r.buildship.run/executeWorkflow/P8FqOO35EihjfxhgWdUW/f3941596-6c47-40f7-8dc1-f27f99a78bd5';
    const apiKey = process.env.BUILDSHIP_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'BuildShip API key not configured',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: 500 }
      );
    }

    // Make request to BuildShip chatbot workflow
    const buildShipResponse = await fetch(buildShipUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BUILDSHIP_API_KEY': apiKey,
      },
      body: JSON.stringify(buildShipPayload),
    });

    if (!buildShipResponse.ok) {
      const errorText = await buildShipResponse.text();

      // Log error for debugging in development
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('BuildShip chatbot request failed:', {
          status: buildShipResponse.status,
          statusText: buildShipResponse.statusText,
          error: errorText,
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process chatbot message',
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: buildShipResponse.status }
      );
    }

    const result = await buildShipResponse.json();

    // Return success response
    const response: BuildShipResponse<ChatbotResponse> = {
      success: true,
      data: {
        response: result.response || 'Lo siento, no pude procesar tu mensaje en este momento.',
        sessionId: buildShipPayload.mensajePayload.sessionId,
        timestamp: new Date().toISOString(),
        context: result.context,
      },
      timestamp: new Date().toISOString(),
      requestId: result.requestId,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    // Log error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Chatbot proxy error:', error);
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