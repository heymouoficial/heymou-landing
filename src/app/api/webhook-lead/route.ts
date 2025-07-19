import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema de validación para lead capture
const leadSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  message: z.string().min(10, 'Mensaje debe tener al menos 10 caracteres').max(1000),
  source: z.string().default('landing_page'),
  timestamp: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse y validar datos del request
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    // URL del webhook BuildShip (debe estar en variables de entorno)
    const buildshipWebhookUrl = process.env.BUILDSHIP_LEAD_WEBHOOK_URL;
    
    if (!buildshipWebhookUrl) {
      console.error('BUILDSHIP_LEAD_WEBHOOK_URL not configured');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuración de webhook no disponible' 
        },
        { status: 500 }
      );
    }

    // Headers para BuildShip
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Agregar autenticación si está configurada
    if (process.env.BUILDSHIP_WEBHOOK_SECRET) {
      headers['Authorization'] = `Bearer ${process.env.BUILDSHIP_WEBHOOK_SECRET}`;
    }

    // Enviar a BuildShip webhook
    const buildshipResponse = await fetch(buildshipWebhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        leadData: validatedData,
        metadata: {
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          referer: request.headers.get('referer'),
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!buildshipResponse.ok) {
      const errorText = await buildshipResponse.text();
      console.error('BuildShip webhook error:', errorText);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error al procesar la solicitud' 
        },
        { status: 500 }
      );
    }

    const buildshipData = await buildshipResponse.json();

    // Log exitoso (sin datos sensibles)
    console.log('Lead captured successfully:', {
      leadId: buildshipData.leadId,
      email: validatedData.email,
      source: validatedData.source,
      timestamp: validatedData.timestamp,
    });

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      data: {
        leadId: buildshipData.leadId,
        timestamp: validatedData.timestamp,
      },
    });

  } catch (error) {
    console.error('Lead capture error:', error);

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

    // Error genérico
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// Método OPTIONS para CORS (si es necesario)
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
