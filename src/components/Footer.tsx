import React from 'react';
import { GraduationCap, Database, Terminal } from 'lucide-react';
import { NavigationTab } from '../types';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenSqlModal: () => void;
  onOpenConfig: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenSqlModal,
  onOpenConfig,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">
                  KIPS COLLEGE
                </span>
                <span className="text-xs text-blue-400 font-medium tracking-wide uppercase">
                  Empowering Students Through Quality Education
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Providing modern college administration and academic curriculum management. Built with React, TypeScript, Tailwind CSS, and direct Supabase database integration.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Institutional Navigation
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('students');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Manage Students
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('courses');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Manage Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Database Tools & Supabase Helpers */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Database &amp; Schema Administration
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Supabase with Row Level Security (RLS) configured across 2 primary tables: <code>students</code> and <code>courses</code>.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={onOpenSqlModal}
                className="inline-flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>View Supabase SQL Schema</span>
              </button>
              <button
                onClick={onOpenConfig}
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Configure Supabase Connection</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KIPS College. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>Academic Integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
