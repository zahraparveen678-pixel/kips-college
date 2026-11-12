export interface Student {
  id: string; // Auto-generated UUID
  full_name: string;
  email: string;
  class_name: string;
  registration_date: string; // ISO timestamp
}

export interface Course {
  id: string; // Auto-generated UUID
  course_name: string;
  course_description: string;
  creation_date: string; // ISO timestamp
}

export type NavigationTab = 'home' | 'about' | 'students' | 'courses' | 'contact';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface SupabaseConfig {
  url: string;
  publishableKey: string;
  isConfigured: boolean;
}
