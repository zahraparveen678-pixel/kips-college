import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Supabase SQL Schema</h3>
              <p className="text-xs text-slate-500">Exactly 2 tables: students & courses with RLS enabled</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600">
          <div className="flex items-start gap-3 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-blue-950">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold text-blue-900">How to run in Supabase:</span>
              <ol className="list-decimal list-inside mt-1 space-y-0.5 text-blue-800">
                <li>Log in to your <strong>Supabase Dashboard</strong>.</li>
                <li>Navigate to <strong>SQL Editor</strong> on the left sidebar.</li>
                <li>Click <strong>New query</strong>, paste the SQL below, and click <strong>Run</strong>.</li>
              </ol>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between bg-slate-800 text-slate-200 px-4 py-2 rounded-t-xl text-xs font-mono">
              <span>kips_schema.sql</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-white font-sans text-xs transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-b-xl text-xs font-mono overflow-x-auto max-h-72 leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">Schema highlights:</div>
            <div>• <code className="font-mono text-blue-700">students</code>: id (UUID PK), full_name, email, class_name, registration_date</div>
            <div>• <code className="font-mono text-blue-700">courses</code>: id (UUID PK), course_name, course_description, creation_date</div>
            <div>• Row Level Security (RLS) is enabled with public SELECT, INSERT, UPDATE, DELETE policies for the anon key.</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Open Supabase Dashboard
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
