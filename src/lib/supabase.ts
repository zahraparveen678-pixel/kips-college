import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Student, Course } from '../types';

// Read from Vite environment variables
const ENV_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
const ENV_KEY = (
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
)?.trim() || '';

// Runtime session fallback storage in case user wants to test credentials directly in UI
const STORAGE_URL_KEY = 'kips_runtime_supabase_url';
const STORAGE_KEY_KEY = 'kips_runtime_supabase_key';

let cachedClient: SupabaseClient | null = null;

export function getActiveSupabaseCredentials(): { url: string; key: string; source: 'env' | 'custom' | 'none' } {
  if (ENV_URL && ENV_KEY) {
    return { url: ENV_URL, key: ENV_KEY, source: 'env' };
  }
  const customUrl = sessionStorage.getItem(STORAGE_URL_KEY) || localStorage.getItem(STORAGE_URL_KEY) || '';
  const customKey = sessionStorage.getItem(STORAGE_KEY_KEY) || localStorage.getItem(STORAGE_KEY_KEY) || '';
  if (customUrl && customKey) {
    return { url: customUrl, key: customKey, source: 'custom' };
  }
  return { url: '', key: '', source: 'none' };
}

export function saveRuntimeCredentials(url: string, key: string): boolean {
  try {
    const cleanUrl = url.trim();
    const cleanKey = key.trim();
    if (!cleanUrl || !cleanKey) return false;
    sessionStorage.setItem(STORAGE_URL_KEY, cleanUrl);
    sessionStorage.setItem(STORAGE_KEY_KEY, cleanKey);
    localStorage.setItem(STORAGE_URL_KEY, cleanUrl);
    localStorage.setItem(STORAGE_KEY_KEY, cleanKey);
    cachedClient = null; // reset cached client
    return true;
  } catch {
    return false;
  }
}

export function clearRuntimeCredentials(): void {
  try {
    sessionStorage.removeItem(STORAGE_URL_KEY);
    sessionStorage.removeItem(STORAGE_KEY_KEY);
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
    cachedClient = null;
  } catch {
    // no-op
  }
}

export function getSupabase(): SupabaseClient | null {
  const { url, key } = getActiveSupabaseCredentials();
  if (!url || !key) {
    return null;
  }
  if (!cachedClient) {
    try {
      cachedClient = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getActiveSupabaseCredentials();
  return Boolean(url && key);
}

// SQL Schema for the two tables as specified
export const SUPABASE_SQL_SCHEMA = `-- =========================================================
-- KIPS College Database Schema: Exactly Two Tables
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- =========================================================

-- 1. Create 'students' table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    class_name TEXT NOT NULL,
    registration_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create 'courses' table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_name TEXT NOT NULL,
    course_description TEXT NOT NULL,
    creation_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies for 'students' (Allows public access using anon key)
DROP POLICY IF EXISTS "Allow public read access on students" ON public.students;
CREATE POLICY "Allow public read access on students"
    ON public.students FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public insert access on students" ON public.students;
CREATE POLICY "Allow public insert access on students"
    ON public.students FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access on students" ON public.students;
CREATE POLICY "Allow public update access on students"
    ON public.students FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete access on students" ON public.students;
CREATE POLICY "Allow public delete access on students"
    ON public.students FOR DELETE
    USING (true);

-- 5. Set RLS Policies for 'courses' (Allows public access using anon key)
DROP POLICY IF EXISTS "Allow public read access on courses" ON public.courses;
CREATE POLICY "Allow public read access on courses"
    ON public.courses FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public insert access on courses" ON public.courses;
CREATE POLICY "Allow public insert access on courses"
    ON public.courses FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access on courses" ON public.courses;
CREATE POLICY "Allow public update access on courses"
    ON public.courses FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete access on courses" ON public.courses;
CREATE POLICY "Allow public delete access on courses"
    ON public.courses FOR DELETE
    USING (true);
`;

// Helper: Test connection to Supabase
export async function testConnection(): Promise<{ success: boolean; message: string; tablesExist?: boolean }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file or connection settings.',
    };
  }

  try {
    const { error: studentErr } = await client.from('students').select('id').limit(1);
    if (studentErr) {
      if (studentErr.code === '42P01') { // PostgreSQL table does not exist
        return {
          success: true,
          tablesExist: false,
          message: 'Connected to Supabase successfully, but the "students" and "courses" tables do not exist yet. Please run the SQL schema script.',
        };
      }
      return { success: false, message: `Supabase error: ${studentErr.message}` };
    }
    return { success: true, tablesExist: true, message: 'Successfully connected to Supabase and tables are verified.' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown network error';
    return { success: false, message: `Connection test failed: ${msg}` };
  }
}

// ----------------- STUDENTS CRUD -----------------

export async function fetchStudents(): Promise<{ data: Student[]; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { data: [], error: 'Supabase client is not configured. Please configure your Supabase URL and Publishable Key.' };
  }

  try {
    const { data, error } = await client
      .from('students')
      .select('*')
      .order('registration_date', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as Student[]) || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch students' };
  }
}

export async function addStudent(newStudent: { full_name: string; email: string; class_name: string }): Promise<{ data: Student | null; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { data: null, error: 'Supabase client is not configured.' };
  }

  try {
    const { data, error } = await client
      .from('students')
      .insert([
        {
          full_name: newStudent.full_name.trim(),
          email: newStudent.email.trim(),
          class_name: newStudent.class_name.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Student, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to add student' };
  }
}

export async function updateStudent(id: string, updates: { full_name: string; email: string; class_name: string }): Promise<{ data: Student | null; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { data: null, error: 'Supabase client is not configured.' };
  }

  try {
    const { data, error } = await client
      .from('students')
      .update({
        full_name: updates.full_name.trim(),
        email: updates.email.trim(),
        class_name: updates.class_name.trim(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Student, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to update student' };
  }
}

export async function deleteStudent(id: string): Promise<{ success: boolean; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { success: false, error: 'Supabase client is not configured.' };
  }

  try {
    const { error } = await client
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete student' };
  }
}

// ----------------- COURSES CRUD -----------------

export async function fetchCourses(): Promise<{ data: Course[]; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { data: [], error: 'Supabase client is not configured. Please configure your Supabase URL and Publishable Key.' };
  }

  try {
    const { data, error } = await client
      .from('courses')
      .select('*')
      .order('creation_date', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as Course[]) || [], error: null };
  } catch (err: unknown) {
    return { data: [], error: err instanceof Error ? err.message : 'Failed to fetch courses' };
  }
}

export async function addCourse(newCourse: { course_name: string; course_description: string }): Promise<{ data: Course | null; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { data: null, error: 'Supabase client is not configured.' };
  }

  try {
    const { data, error } = await client
      .from('courses')
      .insert([
        {
          course_name: newCourse.course_name.trim(),
          course_description: newCourse.course_description.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Course, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to add course' };
  }
}

export async function updateCourse(id: string, updates: { course_name: string; course_description: string }): Promise<{ data: Course | null; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { data: null, error: 'Supabase client is not configured.' };
  }

  try {
    const { data, error } = await client
      .from('courses')
      .update({
        course_name: updates.course_name.trim(),
        course_description: updates.course_description.trim(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Course, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Failed to update course' };
  }
}

export async function deleteCourse(id: string): Promise<{ success: boolean; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { success: false, error: 'Supabase client is not configured.' };
  }

  try {
    const { error } = await client
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete course' };
  }
}

// ----------------- STATS HELPER -----------------

export async function fetchStats(): Promise<{ studentCount: number; courseCount: number; error: string | null }> {
  const client = getSupabase();
  if (!client) {
    return { studentCount: 0, courseCount: 0, error: 'Not configured' };
  }

  try {
    const [studentsRes, coursesRes] = await Promise.all([
      client.from('students').select('*', { count: 'exact', head: true }),
      client.from('courses').select('*', { count: 'exact', head: true }),
    ]);

    const studentCount = studentsRes.count ?? 0;
    const courseCount = coursesRes.count ?? 0;
    const error = studentsRes.error?.message || coursesRes.error?.message || null;

    return { studentCount, courseCount, error };
  } catch (err: unknown) {
    return {
      studentCount: 0,
      courseCount: 0,
      error: err instanceof Error ? err.message : 'Failed to fetch statistics',
    };
  }
}
