// BuildShip Client - Maneja todas las integraciones vía webhooks
// Siguiendo el workflow: frontend → BuildShip webhook → servicios

export interface LeadData {
  name: string;
  email: string;
  message: string;
  source: string;
  timestamp: string;
}

export interface ChatMessage {
  message: string;
  sessionId?: string;
  userId?: string;
  timestamp: string;
}

export interface BuildShipResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Tipos específicos para respuestas de BuildShip
export interface ChatResponse {
  chatReply: string;
  sessionId?: string;
  context?: string;
}

export interface LeadResponse {
  leadId: string;
  status: 'received' | 'processed' | 'error';
  timestamp: string;
}

export interface DashboardResponse {
  totalLeads: number;
  totalChats: number;
  conversionRate: number;
  lastUpdated: string;
}

class BuildShipClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BUILDSHIP_URL || '';
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

  // Chatbot interaction via BuildShip webhook
  async chatInteractionWebhook(chatData: ChatMessage): Promise<BuildShipResponse<ChatResponse>> {
    try {
      const response = await fetch('/api/webhook-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error in chat interaction:', error);
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

export const formatChatMessage = (
  message: string,
  sessionId?: string,
  userId?: string
): ChatMessage => {
  return {
    message: message.trim(),
    sessionId,
    userId,
    timestamp: new Date().toISOString(),
  };
};
