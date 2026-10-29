import React, { useState } from 'react';
import { UserProfile } from '../../types/campus';

interface HubShortcutsProps {
  user: UserProfile;
  onOpenWhatsAppModal?: () => void;
}

export const HubShortcuts: React.FC<HubShortcutsProps> = ({ user, onOpenWhatsAppModal }) => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Toast Feedback */}
      {toast && (
        <div className="bg-[#121c2a] border border-[#00daf3]/40 text-[#00daf3] px-3.5 py-2 rounded-xl text-xs flex items-center justify-between shadow-lg">
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-[#8c909f] hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <h2 className="font-heading font-bold text-xl lg:text-2xl text-white tracking-tight">
        ICE Hub Shortcuts
      </h2>

      <div className="bg-[#101D30] border border-[#424753]/30 rounded-xl p-4 sm:p-5 flex flex-col gap-2.5 shadow-md">
        {/* Link 1: ERP Portal */}
        <a
          href="https://ecampus.psgtech.ac.in"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#121c2a] hover:bg-[#16202f] p-3 rounded-lg flex items-center justify-between transition-colors group border border-[#424753]/20"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4F8CFF] text-xl">lan</span>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-xs text-white group-hover:text-[#4F8CFF] transition-colors">
                PSG Tech Portal (ERP)
              </span>
              <span className="font-mono text-[11px] text-[#8c909f]">
                Attendance, Hall Tickets, Exam Fee
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8c909f] group-hover:text-[#4F8CFF] text-base transition-colors">
            open_in_new
          </span>
        </a>

        {/* Link 2: Instrumentation Inventory */}
        <button
          type="button"
          onClick={() =>
            showToast('Instrumentation Inventory: 24 Bench setups active in Circuits Lab (E-Block 102).')
          }
          className="bg-[#121c2a] hover:bg-[#16202f] p-3 rounded-lg flex items-center justify-between transition-colors group border border-[#424753]/20 text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00daf3] text-xl">memory</span>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-xs text-white group-hover:text-[#00daf3] transition-colors">
                Instrumentation Inventory
              </span>
              <span className="font-mono text-[11px] text-[#8c909f]">
                DAQ, OP-AMP IC741, Digital Multimeters
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8c909f] group-hover:text-[#00daf3] text-base transition-colors">
            open_in_new
          </span>
        </button>

        {/* Link 3: WhatsApp Live Channel */}
        <button
          type="button"
          onClick={onOpenWhatsAppModal}
          className="bg-[#121c2a] hover:bg-[#16202f] p-3 rounded-lg flex items-center justify-between transition-colors group border border-[#4edea3]/30 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined text-[#4edea3] text-xl">chat</span>
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#4edea3] animate-ping"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-semibold text-xs text-white group-hover:text-[#4edea3] transition-colors">
                  WhatsApp Live Sync Channel
                </span>
                <span className="bg-[#4edea3]/20 text-[#4edea3] text-[10px] font-mono px-1 py-0.2 rounded font-bold">
                  LIVE
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#4edea3]">
                Synced 2m ago · 14 messages parsed today
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#4edea3] text-base">sync</span>
        </button>

        {/* Link 4: Google Drive Study Vault */}
        <a
          href="#drive-vault-section"
          className="bg-[#121c2a] hover:bg-[#16202f] p-3 rounded-lg flex items-center justify-between transition-colors group border border-[#00daf3]/30"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#00daf3] text-xl">add_to_drive</span>
            <div className="flex flex-col">
              <span className="font-heading font-semibold text-xs text-white group-hover:text-[#00daf3] transition-colors">
                Google Drive Study Vault
              </span>
              <span className="font-mono text-[11px] text-[#00daf3]">
                5 Shared Folders · 7.95 GB
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#8c909f] group-hover:text-[#00daf3] text-base transition-colors">
            east
          </span>
        </a>

        {/* Official Contact Channel */}
        <div className="p-3 rounded-lg bg-[#050e1c] border border-[#424753]/30 flex items-center justify-between mt-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8c909f]">
              Official Contact Channel
            </span>
            <span className="text-xs font-semibold text-white">
              Department Office · F-Block
            </span>
          </div>
          <span className="font-mono text-[10px] bg-[#16202f] text-[#8c909f] px-2 py-1 rounded border border-[#424753]/40">
            Portal Request
          </span>
        </div>
      </div>
    </div>
  );
};
