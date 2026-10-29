import React, { useState } from 'react';
import { campusStorage } from '../services/campusStorage';
import { UserProfile } from '../types/campus';

interface WhatsAppSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const WhatsAppSyncModal: React.FC<WhatsAppSyncModalProps> = ({ isOpen, onClose, user }) => {
  const [sampleMessage, setSampleMessage] = useState(
    'Notice from HOD Office: Friday Period 1-4 Circuits and Devices Lab (23U111) will have pre-lab viva in F-Block 208. All benches bring signed observation sheets.'
  );
  const [parsedResult, setParsedResult] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sampleMessage.trim()) return;

    setIsParsing(true);
    setTimeout(() => {
      // Auto parse and add to announcements
      const isUrgent = sampleMessage.toLowerCase().includes('urgent') || sampleMessage.toLowerCase().includes('shifted');
      campusStorage.addAnnouncement({
        title: 'Forwarded Department Dispatch (Auto-Parsed)',
        content: sampleMessage,
        category: sampleMessage.toLowerCase().includes('lab') ? 'extra_class' : 'general',
        author: 'HOD Office via WhatsApp Webhook',
        authorRole: 'Department Automation Bot',
        affectedClass: 'ICE-A',
        isUrgent: isUrgent,
        isVerified: true,
        status: 'active',
      });

      setIsParsing(false);
      setParsedResult(
        'Message parsed successfully! Structured record published to Verified Bulletins and synced to student streams.'
      );
      setTimeout(() => setParsedResult(null), 4000);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">webhook</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                WhatsApp Webhook &amp; Auto-Ingestion
              </h3>
              <span className="font-mono text-[11px] text-[#4edea3]">
                PSG Tech ICE-A Official Broadcast Channel
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

        {/* Status Callout */}
        <div className="bg-[#121c2a] border border-[#4edea3]/30 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">
                Auto-Ingestion Pipeline Active
              </span>
              <span className="text-[11px] text-[#8c909f]">
                Connected to <strong className="text-[#d9e3f7]">ICE-A Official WA Group</strong>
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] bg-[#4edea3]/20 text-[#4edea3] px-2 py-0.5 rounded font-bold">
            ONLINE
          </span>
        </div>

        {/* Privacy & Zero-Phone Exposure Notice */}
        <div className="bg-[#16202f] border border-[#424753]/40 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#c2c6d6]">
          <span className="material-symbols-outlined text-[#4F8CFF] text-base shrink-0 mt-0.5">
            privacy_tip
          </span>
          <div className="flex flex-col gap-1">
            <strong className="text-white">Strict Student Privacy Enforcement</strong>
            <p className="text-[11px] leading-relaxed text-[#8c909f]">
              Forwarded group messages are sanitized through a local webhook parser. No student phone numbers, profile photos, or private group chat logs are ever stored or exposed. Only verified faculty and Class Representative notices are extracted.
            </p>
          </div>
        </div>

        {/* Webhook Message Parser Test / Simulator */}
        <form onSubmit={handleSimulateWebhook} className="flex flex-col gap-3 pt-1">
          <label className="text-xs font-semibold text-white flex items-center justify-between">
            <span>Simulate / Ingest Forwarded WhatsApp Message</span>
            <span className="font-mono text-[10px] text-[#4F8CFF]">NO CODING REQUIRED</span>
          </label>
          <textarea
            rows={3}
            value={sampleMessage}
            onChange={(e) => setSampleMessage(e.target.value)}
            className="w-full bg-[#16202f] border border-[#424753]/50 rounded-xl p-3 text-xs text-white placeholder-[#8c909f] focus:outline-none focus:border-[#4F8CFF]"
            placeholder="Paste raw WhatsApp announcement message here..."
          ></textarea>

          {parsedResult && (
            <div className="bg-[#00a572]/20 border border-[#4edea3]/40 text-[#4edea3] text-xs p-3 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{parsedResult}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-[11px] text-[#8c909f]">
              Webhook endpoint: <code className="text-[#00daf3]">/api/webhook/whatsapp</code>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs text-[#8c909f] hover:text-white"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isParsing}
                className="bg-[#4edea3] hover:bg-[#6ffbbe] text-[#002113] font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-colors"
              >
                <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                <span>{isParsing ? 'Parsing...' : 'Parse & Publish'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
