import React from 'react';
import { ArrowRight, BookOpen, Users, Compass } from 'lucide-react';
import { NavigationTab } from '../types';

interface HomeHighlightsProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const HomeHighlights: React.FC<HomeHighlightsProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 bg-slate-50/60 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Educational Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Tomorrow's Leaders
          </h2>
          <p className="text-base text-slate-600">
            Discover a learning environment that combines rigorous academic standards, modern campus infrastructure, and supportive faculty mentors.
          </p>
        </div>

        {/* 3 Pillars / Sections Grid with authentic images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Collaborative Learning */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
              <img
                src="/src/assets/images/kips_students_studying_1794464730030.jpg"
                alt="Students studying collaboratively in KIPS College library"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                  Academic Focus
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Collaborative Study &amp; Research
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Students engage in group discussions, peer mentorship, and focused inquiry across modern study spaces and resource-rich digital libraries.
                </p>
              </div>
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 pt-2"
              >
                Learn about our vision <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Interactive Classrooms */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
              <img
                src="/src/assets/images/kips_modern_classroom_1794464731180.jpg"
                alt="Modern tiered lecture hall at KIPS College"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                  Campus Facilities
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Modern Classrooms &amp; Laboratories
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our air-conditioned tiered lecture halls, multimedia presentation systems, and interactive learning tools create an engaging classroom dynamic.
                </p>
              </div>
              <button
                onClick={() => onNavigate('courses')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 pt-2"
              >
                Explore all courses <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Graduation & Achievements */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
              <img
                src="/src/assets/images/kips_graduation_achievement_1794464730584.jpg"
                alt="Graduates celebrating commencement ceremony at KIPS College"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                  Student Outcomes
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Proven Academic Milestones
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  KIPS College takes pride in our graduates, who step out with confidence, rigorous training, and readiness for higher university study and professional careers.
                </p>
              </div>
              <button
                onClick={() => onNavigate('students')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 pt-2"
              >
                View registered students <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Quick Management Banner */}
        <div className="bg-blue-700 rounded-2xl p-8 sm:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl font-bold tracking-tight">
              Ready to manage college records?
            </h3>
            <p className="text-blue-100 text-sm max-w-xl">
              Access the administrative panels to register new students, track classes, and manage the course curriculum directly with Supabase.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('students')}
              className="px-5 py-2.5 bg-white text-blue-800 hover:bg-blue-50 font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Manage Students
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-semibold text-xs rounded-xl border border-blue-600 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Manage Courses
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
