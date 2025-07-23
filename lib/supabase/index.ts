// Supabase integration utilities
// Note: Direct Supabase access will be through BuildShip proxy only

export interface SupabaseResponse<T = unknown> {
  data: T | null;
  error: unknown;
}

// Placeholder types for database tables
export interface ContentRow {
  id: string;
  type: string;
  slug: string;
  locale: string;
  title: string;
  description: string;
  content: unknown;
  metadata: unknown;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmissionRow {
  id: string;
  name: string;
  email: string;
  company?: string;
  project_type?: string;
  message: string;
  budget?: string;
  timeline?: string;
  locale: string;
  status: string;
  created_at: string;
  metadata?: unknown;
}

// These functions will proxy through BuildShip
export async function getPublishedContent(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _type: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _locale: string
): Promise<SupabaseResponse<ContentRow[]>> {
  // TODO: Implement via BuildShip proxy in task 3
  throw new Error('Supabase access must go through BuildShip proxy');
}

export async function submitContactForm(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: ContactSubmissionRow
): Promise<SupabaseResponse<ContactSubmissionRow>> {
  // TODO: Implement via BuildShip proxy in task 7.2
  throw new Error('Supabase access must go through BuildShip proxy');
}
