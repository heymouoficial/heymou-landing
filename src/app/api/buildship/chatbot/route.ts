import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { BuildShipResponse } from '../../../../../types/buildship';
import { findBestResponse, getSuggestedQuestions } from '../../../../../lib/chatbot-knowledge';

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

    // Try BuildShip first, fallback to local knowledge base
    const buildShipUrl = 'https://2m5s5r.buildship.run/executeWorkflow/P8FqOO35EihjfxhgWdUW/f3941596-6c47-40f7-8dc1-f27f99a78bd5';
    const apiKey = process.env.BUILDSHIP_API_KEY;
    
    let chatbotResponse: string;
    let responseSource = 'knowledge_base';
    let suggestions: string[] = [];

    // Simulate thinking delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Try BuildShip if API key is available
    if (apiKey) {
      try {
        const buildShipResponse = await fetch(buildShipUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'BUILDSHIP_API_KEY': apiKey,
          },
          body: JSON.stringify(buildShipPayload),
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (buildShipResponse.ok) {
          const result = await buildShipResponse.json();
          chatbotResponse = result.response;
          responseSource = 'buildship';
          
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ BuildShip response received');
          }
        } else {
          throw new Error(`BuildShip API error: ${buildShipResponse.status}`);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️ BuildShip unavailable, using local knowledge base:', error);
        }
        // Fallback to local knowledge base
        chatbotResponse = findBestResponse(body.message, body.locale);
        suggestions = Math.random() > 0.7 ? getSuggestedQuestions(body.locale).slice(0, 3) : [];
      }
    } else {
      // Use local knowledge base when no API key
      if (process.env.NODE_ENV === 'development') {
        console.log('💡 Using local knowledge base (no BuildShip API key)');
      }
      chatbotResponse = findBestResponse(body.message, body.locale);
      suggestions = Math.random() > 0.7 ? getSuggestedQuestions(body.locale).slice(0, 3) : [];
    }

    // Return success response
    const response: BuildShipResponse<ChatbotResponse> = {
      success: true,
      data: {
        response: chatbotResponse,
        sessionId: buildShipPayload.mensajePayload.sessionId,
        timestamp: new Date().toISOString(),
        context: {
          source: responseSource,
          suggestions,
          locale: body.locale,
        },
      },
      timestamp: new Date().toISOString(),
      requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
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