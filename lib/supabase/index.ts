// Supabase integration utilities
// Supports both direct client access and BuildShip proxy

import { createClient } from '@supabase/supabase-js';

// Environment validation is handled in security.ts on import

export interface SupabaseResponse<T = unknown> {
  data: T | null;
  error: Error | null;
}

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  throw new Error('Invalid NEXT_PUBLIC_SUPABASE_URL format');
}

// Create Supabase client with security options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'heymou-landing',
    },
  },
});

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

export interface TodoRow {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  user_id?: string;
  metadata?: unknown;
}

// Direct Supabase functions for dynamic features
export async function getTodos(): Promise<SupabaseResponse<TodoRow[]>> {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error: error as Error | null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function createTodo(todo: Omit<TodoRow, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseResponse<TodoRow>> {
  try {
    const { data, error } = await supabase
      .from('todos')
      .insert([todo])
      .select()
      .single();

    return { data, error: error as Error | null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateTodo(id: string, updates: Partial<TodoRow>): Promise<SupabaseResponse<TodoRow>> {
  try {
    const { data, error } = await supabase
      .from('todos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { data, error: error as Error | null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteTodo(id: string): Promise<SupabaseResponse<null>> {
  try {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    return { data: null, error: error as Error | null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

// BuildShip proxy functions (existing)
export async function getPublishedContent(
  type: string,
  locale: string
): Promise<SupabaseResponse<ContentRow[]>> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('type', type)
      .eq('locale', locale)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    return { data, error: error as Error | null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function submitContactForm(
  data: Omit<ContactSubmissionRow, 'id' | 'created_at'>
): Promise<SupabaseResponse<ContactSubmissionRow>> {
  try {
    const { data: result, error } = await supabase
      .from('contact_submissions')
      .insert([data])
      .select()
      .single();

    return { data: result, error: error as Error | null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}
