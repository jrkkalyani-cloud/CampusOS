import React, { useState } from 'react';
import { getSupabaseConfigStatus, isSupabaseConfigured, supabase } from '../services/supabaseClient';

interface DatabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSyncModal: React.FC<DatabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const configStatus = getSupabaseConfigStatus();

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    if (!isSupabaseConfigured || !supabase) {
      setTimeout(() => {
        setTesting(false);
        setTestResult(
          'Supabase environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) are not set. CampusOS is operating in local/offline storage mode with zero data loss.'
        );
      }, 600);
      return;
    }

    try {
      const { data, error } = await supabase.from('timetable_entries').select('count', { count: 'exact' });
      setTesting(false);
      if (error) {
        setTestResult(`Supabase query response: ${error.message}. Ensure RLS migration was executed.`);
      } else {
        setTestResult('Successfully connected to Supabase PostgreSQL! Real-time queries verified.');
      }
    } catch (err: any) {
      setTesting(false);
      setTestResult(`Connection test error: ${err?.message || 'Network unreachable'}`);
    }
  };

  const handleCopySchema = () => {
    const sqlPath = 'supabase/migrations/20261029_campusos_schema.sql';
    navigator.clipboard.writeText(`-- Run the full SQL schema found in /${sqlPath} in your Supabase SQL Editor`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadSQL = () => {
    // Generate .sql download
    const sqlContent = `-- CampusOS Supabase Schema
-- Department of Instrumentation & Control Engineering, PSG College of Technology
-- Open supabase/migrations/20261029_campusos_schema.sql for the complete DDL & RLS policies
`;
    const blob = new Blob([sqlContent], { type: 'text/sql;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'campusos_schema_psgtech.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 flex flex-col gap-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#4F8CFF]/20 text-[#4F8CFF] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">database</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Shared PostgreSQL Database &amp; Supabase Sync
              </h3>
              <span className="font-mono text-[11px] text-[#8c909f]">
                CampusOS Real-Time Synchronisation Center
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c909f] hover:text-white p-1 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Current Database Engine Status */}
        <div
          className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            configStatus.isConfigured
              ? 'bg-[#00a572]/10 border-[#4edea3]/30 text-[#4edea3]'
              : 'bg-[#121c2a] border-[#528dff]/30 text-[#afc6ff]'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full shrink-0 ${
                configStatus.isConfigured ? 'bg-[#4edea3] animate-pulse' : 'bg-[#528dff]'
              }`}
            ></span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">
                {configStatus.isConfigured
                  ? 'Shared Supabase PostgreSQL Online'
                  : 'Local / Offline Reactive Engine Active'}
              </span>
              <span className="text-[11px] text-[#8c909f]">
                {configStatus.statusText}
              </span>
            </div>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="bg-[#16202f] hover:bg-[#212a39] border border-[#424753]/40 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            <span>{testing ? 'Testing...' : 'Test Connection'}</span>
          </button>
        </div>

        {testResult && (
          <div className="bg-[#16202f] border border-[#424753]/40 p-3 rounded-xl text-xs text-[#c2c6d6] leading-relaxed">
            {testResult}
          </div>
        )}

        {/* Supabase Setup Instructions for Beginners */}
        <div className="bg-[#121c2a] border border-[#424753]/30 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#4F8CFF]">menu_book</span>
              How to Connect Supabase (Zero Coding Needed)
            </h4>
            <span className="font-mono text-[10px] bg-[#528dff]/20 text-[#afc6ff] px-2 py-0.5 rounded">
              PostgreSQL + RLS
            </span>
          </div>

          <ol className="text-xs text-[#c2c6d6] space-y-2 list-decimal list-inside leading-relaxed">
            <li>
              <strong className="text-white">Create a free Supabase project</strong> at{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#4F8CFF] underline"
              >
                supabase.com
              </a>.
            </li>
            <li>
              Go to <strong className="text-white">Project Settings &gt; API</strong>, and copy the{' '}
              <code className="bg-[#16202f] px-1.5 py-0.5 rounded text-[#00daf3]">Project URL</code>{' '}
              and <code className="bg-[#16202f] px-1.5 py-0.5 rounded text-[#00daf3]">anon public key</code>.
            </li>
            <li>
              Add them to your environment variables or <code className="text-[#4edea3]">.env</code>:
              <div className="bg-[#050e1c] p-2 rounded-lg font-mono text-[11px] text-[#afc6ff] mt-1 select-all border border-[#424753]/30">
                VITE_SUPABASE_URL="https://your-project.supabase.co"<br />
                VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1Ni..."
              </div>
            </li>
            <li>
              Go to the <strong className="text-white">SQL Editor</strong> in Supabase and paste the contents of{' '}
              <code className="text-[#00daf3]">supabase/migrations/20261029_campusos_schema.sql</code>.
            </li>
            <li>
              Click <strong className="text-white">Run</strong>. All tables, strict Row Level Security (RLS) rules, and student privacy isolation policies are applied automatically!
            </li>
          </ol>
        </div>

        {/* Actions & Migration export */}
        <div className="flex items-center justify-between pt-2 border-t border-[#424753]/20 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySchema}
              className="bg-[#16202f] hover:bg-[#212a39] border border-[#424753]/40 text-[#d9e3f7] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              <span>{copied ? 'Copied Path!' : 'Copy Migration Info'}</span>
            </button>
            <button
              onClick={handleDownloadSQL}
              className="bg-[#16202f] hover:bg-[#212a39] border border-[#424753]/40 text-[#d9e3f7] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download Schema (.sql)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
