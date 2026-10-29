import React from 'react';
import { UserProfile } from '../../types/campus';

interface AdminActionsToolbarProps {
  user: UserProfile;
  onOpenEditSlot: () => void;
  onOpenPostNotice: () => void;
  onOpenWhatsAppModal: () => void;
  onOpenDatabaseSync: () => void;
}

export const AdminActionsToolbar: React.FC<AdminActionsToolbarProps> = ({
  user,
  onOpenEditSlot,
  onOpenPostNotice,
  onOpenWhatsAppModal,
  onOpenDatabaseSync,
}) => {
  return (
    <div className="bg-[#101D30] border border-[#4F8CFF]/30 rounded-xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#4F8CFF]/15 border border-[#4F8CFF]/30 flex items-center justify-center text-[#4F8CFF] shrink-0">
            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading font-semibold text-sm sm:text-base text-white">
                Admin Actions Toolbar
              </span>
              <span className="bg-[#4F8CFF]/20 text-[#afc6ff] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[#4F8CFF]/30">
                CR / HOD Desk
              </span>
            </div>
            <span className="text-xs text-[#8c909f]">
              Manage ICE timetable overrides, publish department alerts, and commit updates without touching code
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onOpenEditSlot}
            className="bg-[#16202f] hover:bg-[#212a39] border border-[#424753]/40 text-[#d9e3f7] hover:text-[#4F8CFF] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-xs font-semibold cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm text-[#4F8CFF]">edit_calendar</span>
            <span>+ Edit Period Slot</span>
          </button>

          <button
            type="button"
            onClick={onOpenPostNotice}
            className="bg-[#16202f] hover:bg-[#212a39] border border-[#424753]/40 text-[#d9e3f7] hover:text-[#00daf3] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-xs font-semibold cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm text-[#00daf3]">campaign</span>
            <span>+ Post Class Notice</span>
          </button>

          <button
            type="button"
            onClick={onOpenWhatsAppModal}
            className="bg-[#00a572]/15 hover:bg-[#00a572]/25 border border-[#4edea3]/40 text-[#4edea3] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors text-xs font-semibold cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">sync_alt</span>
            <span>WhatsApp Webhook Settings</span>
          </button>

          <button
            type="button"
            onClick={onOpenDatabaseSync}
            className="bg-[#4F8CFF] text-[#001a43] hover:bg-[#528dff] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors text-xs font-bold cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            <span>Database / Supabase Sync</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Automation & Ingestion Status Bar */}
      <div className="bg-[#16202f] rounded-lg p-3 border border-[#424753]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#4edea3]/15 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3] shrink-0">
            <span className="material-symbols-outlined text-base">webhook</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-white">
                WhatsApp Sync Webhook &amp; Automation
              </span>
              <span className="bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 px-1.5 py-0.2 rounded text-[10px] font-bold">
                CONNECTED · AUTOMATIC
              </span>
            </div>
            <span className="text-xs text-[#8c909f]">
              Forwarded department notifications &amp; room swap messages are auto-parsed into verified CampusOS bulletins without manual entry.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <span className="font-mono text-[11px] text-[#4edea3] font-semibold flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            Auto-Parsing: ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};
