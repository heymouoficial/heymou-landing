// TypeScript definitions para integraciones BuildShip
// Siguiendo el workflow: frontend → BuildShip webhook → servicios

export interface LeadFormData {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

export interface LeadSubmissionState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
  sessionId: string;
  error: string | null;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'typing' | 'error';
}

export interface BuildShipWebhookPayload {
  leadCapture?: {
    name: string;
    email: string;
    message: string;
    source: string;
    timestamp: string;
  };
  chatInteraction?: {
    message: string;
    sessionId: string;
    userId?: string;
    timestamp: string;
  };
}

export interface BuildShipWebhookResponse {
  success: boolean;
  data?: string;
  error?: string;
  message?: string;
  leadId?: string;
  chatReply?: string;
  nextAction?: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  leadsToday: number;
  conversionRate: number;
  chatInteractions: number;
  averageResponseTime: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  createdAt: string;
  updatedAt: string;
}

export interface FormValidationErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}
