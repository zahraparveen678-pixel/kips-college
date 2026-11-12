/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HomeHighlights } from './components/HomeHighlights';
import { AboutSection } from './components/AboutSection';
import { ManageStudents } from './components/ManageStudents';
import { ManageCourses } from './components/ManageCourses';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { SqlSchemaModal } from './components/SqlSchemaModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { NavigationTab, Student, Course, ToastMessage } from './types';
import {
  isSupabaseConfigured,
  fetchStudents,
  fetchCourses,
  fetchStats,
} from './lib/supabase';
import { Database, AlertCircle, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isConfigured, setIsConfigured] = useState<boolean>(isSupabaseConfigured());
  
  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [coursesCount, setCoursesCount] = useState<number>(0);

  // Loading & error states
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // Modals
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch all students from Supabase
  const loadStudents = useCallback(async () => {
    setIsLoadingStudents(true);
    setStudentsError(null);
    const { data, error } = await fetchStudents();
    setIsLoadingStudents(false);
    if (error) {
      setStudentsError(error);
    } else {
      setStudents(data);
      setStudentsCount(data.length);
    }
  }, []);

  // Fetch all courses from Supabase
  const loadCourses = useCallback(async () => {
    setIsLoadingCourses(true);
    setCoursesError(null);
    const { data, error } = await fetchCourses();
    setIsLoadingCourses(false);
    if (error) {
      setCoursesError(error);
    } else {
      setCourses(data);
      setCoursesCount(data.length);
    }
  }, []);

  // Refresh counts
  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    const { studentCount, courseCount } = await fetchStats();
    setIsLoadingStats(false);
    setStudentsCount(studentCount);
    setCoursesCount(courseCount);
  }, []);

  // Refresh all
  const refreshAll = useCallback(() => {
    loadStudents();
    loadCourses();
    loadStats();
    setIsConfigured(isSupabaseConfigured());
  }, [loadStudents, loadCourses, loadStats]);

  // Initial load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // When switching tabs, ensure data is fresh
  const handleNavigate = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (tab === 'students') {
      loadStudents();
    } else if (tab === 'courses') {
      loadCourses();
    } else if (tab === 'home') {
      loadStats();
    }
  };

  const handleConfigChanged = () => {
    setIsConfigured(isSupabaseConfigured());
    refreshAll();
    showToast('info', 'Supabase connection status updated.');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Configuration Advisory Banner if Supabase not configured */}
      {!isConfigured && (
        <div className="bg-amber-500 text-white px-4 py-2.5 text-xs sm:text-sm font-medium shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Supabase credentials not configured:</strong> Connect your Supabase project to enable live student &amp; course records.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="px-3 py-1 bg-white text-amber-900 rounded-md font-semibold text-xs hover:bg-amber-50 transition-colors shadow-xs"
              >
                Connect Supabase
              </button>
              <button
                onClick={() => setIsSqlModalOpen(true)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-semibold text-xs transition-colors flex items-center gap-1"
              >
                <Terminal className="w-3.5 h-3.5" />
                View SQL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        isConfigured={isConfigured}
        onOpenConfig={() => setIsConfigModalOpen(true)}
      />

      {/* Main Content Sections based on Active Tab */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              studentsCount={studentsCount}
              coursesCount={coursesCount}
              isLoadingStats={isLoadingStats}
              onRefreshStats={loadStats}
              onNavigate={handleNavigate}
            />
            <HomeHighlights onNavigate={handleNavigate} />
          </>
        )}

        {activeTab === 'about' && (
          <AboutSection />
        )}

        {activeTab === 'students' && (
          <ManageStudents
            students={students}
            isLoading={isLoadingStudents}
            error={studentsError}
            onRefresh={loadStudents}
            onShowToast={showToast}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
          />
        )}

        {activeTab === 'courses' && (
          <ManageCourses
            courses={courses}
            isLoading={isLoadingCourses}
            error={coursesError}
            onRefresh={loadCourses}
            onShowToast={showToast}
            onOpenSqlModal={() => setIsSqlModalOpen(true)}
          />
        )}

        {activeTab === 'contact' && (
          <ContactSection />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenConfig={() => setIsConfigModalOpen(true)}
      />

      {/* Modals & Overlays */}
      <SqlSchemaModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onConfigChanged={handleConfigChanged}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
      />

      {/* Toast Notification Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}
