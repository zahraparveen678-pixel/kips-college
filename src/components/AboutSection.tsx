import React from 'react';
import { Target, Compass, Award, HeartHandshake, CheckCircle2, BookOpen } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Title & Intro Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
            About KIPS College
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Nurturing Inquiring Minds &amp; Inspired Futures
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            KIPS College is an established educational institution dedicated to delivering transformative secondary and collegiate education. We combine structured academic frameworks with comprehensive student support to help learners achieve their highest potential.
          </p>
        </div>

        {/* Feature Split with Campus & Library Photography */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Our Educational Heritage &amp; Philosophy
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              At KIPS College, education is viewed as a catalyst for personal growth, ethical leadership, and intellectual discovery. Our campus culture encourages curiosity, critical reasoning, and disciplined inquiry.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Through guided mentoring, interactive pedagogy, and a rigorous syllabus, we provide students with the foundational mastery needed to excel in competitive academic landscapes and dynamic global careers.
            </p>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">Student-centric instructional approaches tailored to diverse learning speeds</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">Comprehensive curriculum designed to bridge foundational concepts with practical mastery</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-700">Active culture of collaborative inquiry and analytical problem-solving</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3] bg-slate-100">
              <img
                src="/src/assets/images/kips_students_studying_1794464730030.jpg"
                alt="Students collaborating at KIPS College study tables"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {/* Mission */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Educational Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To provide an inclusive, inspiring, and intellectually challenging educational environment where every student develops strong analytical skills, moral integrity, and a lifelong commitment to learning and societal contribution.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Educational Vision</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              To be recognized as a benchmark institution of learning that empowers youth through progressive education, ethical responsibility, and academic excellence, preparing graduates to succeed in an ever-evolving world.
            </p>
          </div>
        </div>

        {/* Commitment to Quality Education & Student Development */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Core Principles
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Commitment to Quality &amp; Student Development
            </h3>
            <p className="text-sm text-slate-600">
              We continually evaluate and refine our instructional practices to uphold the highest benchmarks of collegiate education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Academic Excellence</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clear syllabi, regular formative assessments, and dedicated academic counseling ensure students continually progress toward their academic targets.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center mb-3">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Student Development</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Beyond textbook learning, we focus on communication skills, leadership development, character building, and collaborative teamwork.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Curricular Innovation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Courses are organized systematically to balance foundational theory with real-world applications, preparing students for university entrance and professional life.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
