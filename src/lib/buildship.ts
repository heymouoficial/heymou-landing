// BuildShip Client - Maneja la captura de leads vía webhooks
// Siguiendo el workflow: frontend → BuildShip webhook → servicios

export interface LeadData {
  name: string;
  email: string;
  message: string;
  source: string;
  timestamp: string;
}

export interface BuildShipResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LeadResponse {
  leadId: string;
  status: 'received' | 'processed' | 'error';
  timestamp: string;
}

class BuildShipClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BUILDSHIP_URL || '';
    
    // Throw a more descriptive error if the URL is not configured
    if (!this.baseUrl && typeof window !== 'undefined') {
      console.error('BuildShip URL is not configured. Please set NEXT_PUBLIC_BUILDSHIP_URL environment variable.');
    }
  }

  // Lead Capture via BuildShip webhook
  async captureLeadWebhook(leadData: LeadData): Promise<BuildShipResponse> {
    try {
      const response = await fetch('/api/webhook-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error capturing lead:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Dashboard data via BuildShip webhook
  async getDashboardDataWebhook(): Promise<BuildShipResponse> {
    try {
      const response = await fetch('/api/webhook-dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

// Singleton instance
export const buildshipClient = new BuildShipClient();

// Utility functions
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatLeadData = (
  name: string,
  email: string,
  message: string,
  source: string = 'landing_page'
): LeadData => {
  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
    source,
    timestamp: new Date().toISOString(),
  };
};


