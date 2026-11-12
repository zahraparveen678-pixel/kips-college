import React from 'react';
import { Users, BookOpen, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { NavigationTab } from '../types';

interface HeroProps {
  studentsCount: number;
  coursesCount: number;
  isLoadingStats: boolean;
  onRefreshStats: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const Hero: React.FC<HeroProps> = ({
  studentsCount,
  coursesCount,
  isLoadingStats,
  onRefreshStats,
  onNavigate,
}) => {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white to-white pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Academic &amp; Administrative Portal</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Welcome to <br />
                <span className="text-blue-700">KIPS College</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-700 tracking-tight">
                Empowering Students Through Quality Education
              </p>
            </div>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              KIPS College is dedicated to fostering academic excellence, intellectual curiosity, and holistic development. Our management system provides students and educators with a unified platform for curriculum administration, course discovery, and academic records.
            </p>

            {/* Two Main Navigation Options */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('students')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-700/25 hover:shadow-blue-700/35 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
              >
                <Users className="w-4 h-4" />
                <span>Manage Students</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('courses')}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-xl border border-slate-300 hover:border-slate-400 shadow-sm transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>Manage Courses</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-6 border-t border-slate-200/80">
              <div className="flex items-center justify-between max-w-md mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Live Institutional Database
                </span>
                <button
                  onClick={onRefreshStats}
                  disabled={isLoadingStats}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
                  title="Refresh statistics"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingStats ? 'animate-spin' : ''}`} />
                  <span>Sync stats</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div 
                  onClick={() => onNavigate('students')}
                  className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Registered Students</span>
                    <Users className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                    {isLoadingStats ? '...' : studentsCount}
                  </div>
                  <span className="text-[11px] text-blue-600 font-medium group-hover:underline mt-1 inline-block">
                    View student directory &rarr;
                  </span>
                </div>

                <div 
                  onClick={() => onNavigate('courses')}
                  className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">Available Courses</span>
                    <BookOpen className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                    {isLoadingStats ? '...' : coursesCount}
                  </div>
                  <span className="text-[11px] text-blue-600 font-medium group-hover:underline mt-1 inline-block">
                    Explore course catalog &rarr;
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Campus Hero Image */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-slate-100">
                <img
                  src="/src/assets/images/kips_college_campus_hero_1794464728962.jpg"
                  alt="KIPS College modern campus building with landscaped grounds"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-xs font-bold tracking-wide uppercase text-blue-200 mb-0.5">
                    Main Academic Campus
                  </div>
                  <p className="text-sm font-medium text-slate-100">
                    KIPS College Central Learning Complex &amp; Quadrangle
                  </p>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-4 sm:-left-4 bg-white p-3.5 rounded-xl shadow-xl border border-slate-100 hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Accredited Excellence</div>
                  <div className="text-[11px] text-slate-500">Quality-Assured Education</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
