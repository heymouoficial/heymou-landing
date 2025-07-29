import { NextResponse } from 'next/server';

import { BuildShipResponse } from '../../../../../types/buildship';
import { logBuildShipCall } from '../../../../../lib/buildship/utils';

/**
 * GET /api/buildship/health
 * Health check endpoint for BuildShip integration
 */
export async function GET() {
  try {
    // Check if required environment variables are present
    const buildShipContactEndpoint = process.env.BUILDSHIP_CONTACT_ENDPOINT;
    const buildShipAnalyticsEndpoint = process.env.BUILDSHIP_ANALYTICS_ENDPOINT;
    const apiKey = process.env.BUILDSHIP_API_KEY;

    const missingConfig = [];
    if (!buildShipContactEndpoint) missingConfig.push('BUILDSHIP_CONTACT_ENDPOINT');
    if (!buildShipAnalyticsEndpoint) missingConfig.push('BUILDSHIP_ANALYTICS_ENDPOINT');
    if (!apiKey) missingConfig.push('BUILDSHIP_API_KEY');

    if (missingConfig.length > 0) {
      logBuildShipCall('/health', 'GET', {}, null, `Missing configuration: ${missingConfig.join(', ')}`);
      
      return NextResponse.json(
        {
          success: false,
          error: `Missing BuildShip configuration: ${missingConfig.join(', ')}`,
          timestamp: new Date().toISOString(),
        } as BuildShipResponse,
        { status: 503 }
      );
    }

    // Test connectivity to BuildShip endpoints (optional ping)
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        contact: !!buildShipContactEndpoint,
        analytics: !!buildShipAnalyticsEndpoint,
        authentication: !!apiKey,
      },
      environment: process.env.NODE_ENV,
    };

    logBuildShipCall('/health', 'GET', {}, healthData);

    const response: BuildShipResponse<typeof healthData> = {
      success: true,
      data: healthData,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    logBuildShipCall('/health', 'GET', {}, null, error);

    return NextResponse.json(
      {
        success: false,
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      } as BuildShipResponse,
      { status: 500 }
    );
  }
}