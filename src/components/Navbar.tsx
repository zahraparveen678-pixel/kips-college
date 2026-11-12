import React, { useState } from 'react';
import { GraduationCap, Menu, X, Database } from 'lucide-react';
import { NavigationTab } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  isConfigured: boolean;
  onOpenConfig: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  isConfigured,
  onOpenConfig,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'students', label: 'Manage Students' },
    { id: 'courses', label: 'Manage Courses' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-700/20 group-hover:bg-blue-800 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors whitespace-nowrap">
                KIPS COLLEGE
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 hidden sm:block">
                Excellence in Education
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`py-1 relative whitespace-nowrap transition-colors ${
                  activeTab === item.id
                    ? 'text-blue-700 font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action / Database Connection */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenConfig}
              className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                isConfigured
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
              title="Supabase Database Status"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isConfigured ? 'Supabase Connected' : 'Setup Supabase'}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConfig();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isConfigured ? 'Supabase Connected' : 'Configure Supabase Connection'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
