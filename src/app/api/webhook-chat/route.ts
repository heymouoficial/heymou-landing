import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema de validación para chat interaction
const chatSchema = z.object({
  message: z.string().min(1, 'Mensaje no puede estar vacío').max(1000),
  sessionId: z.string().optional(),
  userId: z.string().optional(),
  timestamp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse y validar datos del request
    const body = await request.json();
    const validatedData = chatSchema.parse(body);

    // URL del webhook BuildShip para chatbot
    const buildshipChatWebhookUrl = process.env.BUILDSHIP_CHAT_WEBHOOK_URL;
    
    if (!buildshipChatWebhookUrl) {
      console.error('BUILDSHIP_CHAT_WEBHOOK_URL not configured');
      
      // Respuesta de fallback cuando BuildShip no está configurado
      return NextResponse.json({
        success: true,
        data: {
          chatReply: 'Gracias por tu mensaje. En este momento estoy en modo de desarrollo. Para contactarme directamente, puedes escribir a hello@heymou.com y te responderé en menos de 24 horas.',
          sessionId: validatedData.sessionId,
          nextAction: 'continue',
        },
      });
    }

    // Headers para BuildShip
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Agregar autenticación si está configurada
    if (process.env.BUILDSHIP_WEBHOOK_SECRET) {
      headers['Authorization'] = `Bearer ${process.env.BUILDSHIP_WEBHOOK_SECRET}`;
    }

    // Payload para BuildShip con contexto adicional
    const buildshipPayload = {
      chatData: validatedData,
      context: {
        brand: 'HeyMou',
        personality: 'consultor estratégico, directo, empático, minimalista',
        expertise: ['consultoría estratégica', 'arquitectura de sistemas', 'diseño UX/UI', 'desarrollo full-stack'],
        tone: 'profesional pero humano, claro y directo',
        language: 'español',
      },
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        referer: request.headers.get('referer'),
        timestamp: new Date().toISOString(),
      },
    };

    // Enviar a BuildShip webhook
    const buildshipResponse = await fetch(buildshipChatWebhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(buildshipPayload),
    });

    if (!buildshipResponse.ok) {
      const errorText = await buildshipResponse.text();
      console.error('BuildShip chat webhook error:', errorText);
      
      // Respuesta de fallback en caso de error
      return NextResponse.json({
        success: true,
        data: {
          chatReply: 'Disculpa, hubo un problema técnico. Por favor intenta nuevamente o contáctame directamente a hello@heymou.com',
          sessionId: validatedData.sessionId,
          nextAction: 'retry',
        },
      });
    }

    const buildshipData = await buildshipResponse.json();

    // Log exitoso (sin datos sensibles)
    console.log('Chat interaction processed:', {
      sessionId: validatedData.sessionId,
      messageLength: validatedData.message.length,
      timestamp: validatedData.timestamp,
      hasReply: !!buildshipData.chatReply,
    });

    return NextResponse.json({
      success: true,
      data: {
        chatReply: buildshipData.chatReply || 'Gracias por tu mensaje. ¿Hay algo más en lo que pueda ayudarte?',
        sessionId: validatedData.sessionId,
        nextAction: buildshipData.nextAction || 'continue',
        metadata: {
          responseTime: Date.now(),
          processed: true,
        },
      },
    });

  } catch (error) {
    console.error('Chat interaction error:', error);

    // Error de validación
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.issues[0]?.message || 'Datos inválidos' 
        },
        { status: 400 }
      );
    }

    // Error de parsing JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Formato de datos inválido' 
        },
        { status: 400 }
      );
    }

    // Error genérico con respuesta de fallback
    return NextResponse.json({
      success: true,
      data: {
        chatReply: 'Disculpa, hubo un problema técnico. Por favor intenta nuevamente más tarde o contáctame directamente a hello@heymou.com',
        sessionId: 'error_session',
        nextAction: 'contact_direct',
      },
    });
  }
}

// Método OPTIONS para CORS
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
