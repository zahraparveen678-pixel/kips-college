import React, { useState, useEffect } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, RefreshCw, Key, Globe, Shield, Terminal } from 'lucide-react';
import {
  getActiveSupabaseCredentials,
  saveRuntimeCredentials,
  clearRuntimeCredentials,
  testConnection,
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
  onOpenSqlModal: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigChanged,
  onOpenSqlModal,
}) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [source, setSource] = useState<'env' | 'custom' | 'none'>('none');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; tablesExist?: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const creds = getActiveSupabaseCredentials();
      setUrl(creds.url);
      setKey(creds.key);
      setSource(creds.source);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    // If source is not env, save to runtime storage
    if (source !== 'env') {
      saveRuntimeCredentials(url, key);
    }

    const res = await testConnection();
    setTestResult(res);
    setTesting(false);
    onConfigChanged();
  };

  const handleClear = () => {
    clearRuntimeCredentials();
    setUrl('');
    setKey('');
    setSource('none');
    setTestResult(null);
    onConfigChanged();
  };

  const handleQuickTest = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testConnection();
    setTestResult(res);
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Supabase Connection Settings</h3>
              <p className="text-xs text-slate-500">Connect to your Supabase Project</p>
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
          {source === 'env' && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Loaded from environment variables: <code className="font-mono font-semibold">VITE_SUPABASE_URL</code></span>
            </div>
          )}

          {source === 'none' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">No connection detected yet.</p>
                <p className="text-amber-800 mt-0.5">
                  Enter your project details below to test immediately, or add <code className="font-mono bg-white/70 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="font-mono bg-white/70 px-1 py-0.5 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code> to your <code className="font-mono">.env</code> file.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSaveAndTest} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Supabase Project URL
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                Supabase Publishable / Anon Key
              </label>
              <input
                type="password"
                required
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Found in: Project Settings &gt; API &gt; Project API keys (<span className="text-blue-700 font-medium">anon / public</span>). Never use your secret service_role key.
              </p>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  testResult.success
                    ? testResult.tablesExist === false
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {testResult.success ? (
                    testResult.tablesExist === false ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold">{testResult.success ? 'Connection Successful' : 'Connection Failed'}</p>
                    <p className="mt-0.5">{testResult.message}</p>
                    {testResult.tablesExist === false && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenSqlModal();
                        }}
                        className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        View & Copy SQL Schema Script
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={testing || !url || !key}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <Database className="w-3.5 h-3.5" />
                    Save & Test Connection
                  </>
                )}
              </button>

              {source === 'custom' && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => {
                onClose();
                onOpenSqlModal();
              }}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Terminal className="w-3.5 h-3.5" />
              View Database SQL Setup Script
            </button>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Shield className="w-3 h-3" />
              Anon key safe for client-side
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
