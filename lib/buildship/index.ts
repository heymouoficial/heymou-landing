// BuildShip integration utilities
// This will be configured in task 3

export interface BuildShipResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export class BuildShipClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // Placeholder methods - will be implemented in task 3
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async submitContactForm(_data: unknown): Promise<BuildShipResponse> {
    // TODO: Implement in task 7.2
    throw new Error('BuildShip integration not yet implemented');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createBlogPost(_data: unknown): Promise<BuildShipResponse> {
    // TODO: Implement in task 8.2
    throw new Error('BuildShip integration not yet implemented');
  }
}

// Export singleton instance (will be configured with environment variables)
export const buildShipClient = new BuildShipClient(
  process.env.NEXT_PUBLIC_BUILDSHIP_API_URL || '',
  process.env.BUILDSHIP_WEBHOOK_SECRET || ''
);
