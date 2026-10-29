import React, { useState } from 'react';
import { UserProfile } from '../types/campus';

export type PageId =
  | 'dashboard'
  | 'admin'
  | 'timetable'
  | 'assignments'
  | 'gdrive'
  | 'announcements'
  | 'opportunities'
  | 'profile';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  user: UserProfile;
  urgentCount: number;
  dueCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  user,
  urgentCount,
  dueCount,
}) => {
  const [showHotlineModal, setShowHotlineModal] = useState(false);
  const [hotlineCopied, setHotlineCopied] = useState(false);

  const navItems = [
    {
      id: 'dashboard' as PageId,
      label: 'Dashboard',
      icon: 'grid_view',
      badge: <span className="font-mono text-[11px] text-[#8c909f] font-medium">01</span>,
    },
    {
      id: 'admin' as PageId,
      label: 'Admin Management',
      icon: 'shield_person',
      badge: (
        <span className="bg-[#4F8CFF]/20 text-[#afc6ff] border border-[#4F8CFF]/30 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold">
          CR
        </span>
      ),
    },
    {
      id: 'timetable' as PageId,
      label: 'Timetable',
      icon: 'schedule',
      badge: (
        <span className="bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/40 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider">
          LIVE
        </span>
      ),
    },
    {
      id: 'assignments' as PageId,
      label: 'Assignments & Labs',
      icon: 'fact_check',
      badge: (
        <span className="bg-[#93000a] text-[#ffdad6] text-[10px] font-bold px-1.5 py-0.5 rounded">
          {dueCount} due
        </span>
      ),
    },
    {
      id: 'gdrive' as PageId,
      label: 'GDrive Study Vault',
      icon: 'add_to_drive',
      badge: (
        <span className="bg-[#00daf3]/20 text-[#00daf3] border border-[#00daf3]/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
          DRIVE
        </span>
      ),
    },
    {
      id: 'announcements' as PageId,
      label: 'Announcements',
      icon: 'campaign',
      badge: urgentCount > 0 ? (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F8CFF] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4F8CFF]"></span>
        </span>
      ) : null,
    },
    {
      id: 'opportunities' as PageId,
      label: 'Opportunities',
      icon: 'rocket_launch',
      badge: (
        <span className="text-[10px] text-[#c2c6d6] border border-[#424753]/50 px-1.5 py-0.5 rounded font-mono font-medium">
          HACKS
        </span>
      ),
    },
    {
      id: 'profile' as PageId,
      label: 'Profile & Settings',
      icon: 'manage_accounts',
    },
  ];

  return (
    <>
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#050e1c] border-r border-[#424753]/30 z-40 hidden md:flex flex-col justify-between select-none">
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="h-16 px-4 border-b border-[#424753]/20 flex items-center justify-between">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F8CFF] to-[#00daf3] flex items-center justify-center p-0.5 shadow-md">
                <div className="w-full h-full bg-[#0a1422] rounded-[6px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#4F8CFF] text-lg font-bold">
                    hub
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg tracking-tight text-[#d9e3f7] leading-none">
                  Campus<span className="text-[#4F8CFF]">OS</span>
                </span>
                <span className="font-mono text-[11px] text-[#8c909f] leading-tight">
                  v4.2.0-ice
                </span>
              </div>
            </button>
          </div>

          {/* Core System Telemetry */}
          <div className="px-4 py-3">
            <div className="bg-[#121c2a] border border-[#424753]/30 rounded-xl px-3 py-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#8c909f] uppercase tracking-wider">
                Node Core
              </span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                <span className="font-mono text-[11px] text-[#4edea3] font-medium">
                  PSG Tech Online
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-3 mt-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-150 text-left group ${
                    isActive
                      ? 'bg-[#528dff] text-[#001a43] font-semibold shadow-sm'
                      : 'text-[#c2c6d6] hover:bg-[#212a39] hover:text-[#d9e3f7]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-xl transition-colors ${
                        isActive
                          ? 'text-[#001a43]'
                          : 'text-[#8c909f] group-hover:text-[#d9e3f7]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.badge}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Hardware & Campus Network Info */}
        <div className="p-4 border-t border-[#424753]/20 flex flex-col gap-2.5 bg-[#050e1c]">
          <div className="bg-[#121c2a] border border-[#424753]/30 rounded-xl p-2.5 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#8c909f] uppercase">Network</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#4edea3] text-sm">wifi</span>
                <span className="font-mono text-[11px] text-[#4edea3] font-semibold">EDUROAM</span>
              </div>
            </div>
            <div className="text-[#8c909f] text-xs truncate">PSG Tech Campus · Auto-Sync</div>
          </div>

          <div className="bg-[#121c2a] border border-[#424753]/30 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4F8CFF] text-base">privacy_tip</span>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-[#d9e3f7] leading-none">
                  Privacy Mode
                </span>
                <span className="font-mono text-[10px] text-[#4edea3] leading-tight">
                  Peer Profiles Hidden
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-[#212a39] text-[#4edea3] px-2 py-0.5 rounded border border-[#424753]/40 font-mono">
              ACTIVE
            </span>
          </div>
        </div>
      </aside>

      {/* CR Hotline Modal */}
      {showHotlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#101D30] border border-[#424753]/50 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#528dff]/20 text-[#4F8CFF] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">contact_phone</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">Class Emergency Contacts</h3>
                  <p className="text-xs text-[#8c909f]">ICE-A Batch 2024-2028 · PSG Tech</p>
                </div>
              </div>
              <button
                onClick={() => setShowHotlineModal(false)}
                className="text-[#8c909f] hover:text-white p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="bg-[#16202f] border border-[#424753]/40 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#8c909f] uppercase">Class Representative</div>
                  <div className="text-sm font-bold text-[#d9e3f7]">Dhanush R (CR)</div>
                  <div className="font-mono text-xs text-[#4F8CFF]">+91 98421 54321</div>
                </div>
                <a
                  href="tel:+919842154321"
                  className="bg-[#528dff] text-[#001a43] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#afc6ff] transition-colors"
                >
                  Call
                </a>
              </div>

              <div className="bg-[#16202f] border border-[#424753]/40 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#8c909f] uppercase">Class Tutor</div>
                  <div className="text-sm font-bold text-[#d9e3f7]">{user.tutor.name}</div>
                  <div className="font-mono text-xs text-[#4edea3]">{user.tutor.phone}</div>
                  <div className="text-[11px] text-[#8c909f]">Cabin: {user.tutor.cabin}</div>
                </div>
                <a
                  href={`tel:${user.tutor.phone.replace(/[^0-9+]/g, '')}`}
                  className="bg-[#212a39] text-[#d9e3f7] hover:bg-[#2c3545] border border-[#424753]/50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  Call Cabin
                </a>
              </div>

              <div className="bg-[#16202f] border border-[#424753]/40 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#8c909f] uppercase">ICE Department Office</div>
                  <div className="text-sm font-bold text-[#d9e3f7]">F-Block Ground Floor Office</div>
                  <div className="font-mono text-xs text-[#8c909f]">Ext: 4220 / 4221</div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('0422-2572177 Ext: 4220');
                    setHotlineCopied(true);
                    setTimeout(() => setHotlineCopied(false), 2000);
                  }}
                  className="bg-[#212a39] text-[#d9e3f7] px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#2c3545]"
                >
                  {hotlineCopied ? 'Copied' : 'Copy Ext'}
                </button>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setShowHotlineModal(false)}
                className="w-full bg-[#16202f] hover:bg-[#212a39] text-[#d9e3f7] py-2.5 rounded-xl text-sm font-medium border border-[#424753]/40"
              >
                Close Hotline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
