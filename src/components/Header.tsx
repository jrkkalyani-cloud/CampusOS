import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types/campus';
import { useLiveClock } from '../hooks/useLiveClock';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  user: UserProfile;
  onRoleSwitch: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  selectedClass: string;
  onSelectClass: (cls: string) => void;
  onNavigateToProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onRoleSwitch,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount,
  selectedClass,
  onSelectClass,
  onNavigateToProfile,
}) => {
  const { istTimeString } = useLiveClock();
  const isOnline = useOnlineStatus();
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const availableClasses = [
    { id: 'ICE-SEM1', label: 'PSG Tech · BE ICE Semester 1 (Batch: 60)', dept: 'Instrumentation & Control' },
    { id: 'ICE-SEM2', label: 'PSG Tech · BE ICE Semester 2', dept: 'Instrumentation & Control' },
    { id: 'EEE-SEM1', label: 'PSG Tech · BE EEE Semester 1', dept: 'Electrical & Electronics' },
    { id: 'ECE-SEM1', label: 'PSG Tech · BE ECE Semester 1', dept: 'Electronics & Communication' },
    { id: 'MECH-SEM1', label: 'PSG Tech · BE Mech Semester 1', dept: 'Mechanical Engineering' },
  ];

  return (
    <header className="fixed top-0 left-0 md:left-72 right-0 h-16 bg-[#050e1c]/85 backdrop-blur-xl border-b border-[#424753]/30 z-30 flex items-center justify-between px-3 md:px-6 select-none">
      {/* Left: Class Selection & Global Search */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Logo Brand */}
        <div className="flex md:hidden items-center gap-2 mr-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4F8CFF] to-[#00daf3] flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-[#0a1422] rounded-[5px] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#4F8CFF] text-sm">hub</span>
            </div>
          </div>
          <span className="font-heading font-bold text-sm tracking-tight text-[#d9e3f7]">
            Campus<span className="text-[#4F8CFF]">OS</span>
          </span>
        </div>

        {/* Scalable Class & Department Selector */}
        <div className="relative">
          <button
            onClick={() => setShowClassDropdown(!showClassDropdown)}
            className="flex items-center gap-1.5 bg-[#16202f] hover:bg-[#212a39] border border-[#424753]/40 px-2.5 py-1 rounded-full text-xs font-mono transition-colors text-[#d9e3f7]"
          >
            <span className="material-symbols-outlined text-[#4F8CFF] text-sm">school</span>
            <span className="max-w-[130px] sm:max-w-[200px] truncate">{selectedClass}</span>
            <span className="material-symbols-outlined text-[#8c909f] text-sm">arrow_drop_down</span>
          </button>

          {showClassDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-[#101D30] border border-[#424753]/60 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8c909f]">
                Select Department &amp; Section
              </div>
              {availableClasses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectClass(c.id);
                    setShowClassDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex flex-col hover:bg-[#16202f] transition-colors ${
                    selectedClass === c.id ? 'bg-[#528dff]/10 border-l-2 border-[#4F8CFF]' : ''
                  }`}
                >
                  <span className="text-xs font-semibold text-[#d9e3f7]">{c.label}</span>
                  <span className="text-[10px] text-[#8c909f]">{c.dept}</span>
                </button>
              ))}
              <div className="border-t border-[#424753]/30 mt-1 pt-1.5 px-3">
                <span className="text-[10px] text-[#00daf3] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">add</span>
                  Expandable to all PSG Tech Batches
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Global Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden lg:flex items-center gap-2 bg-[#121c2a] hover:bg-[#16202f] border border-[#424753]/30 px-3 py-1.5 rounded-full w-64 text-[#8c909f] transition-colors"
        >
          <span className="material-symbols-outlined text-base">search</span>
          <span className="text-xs text-[#8c909f] flex-1 text-left truncate">
            Search labs, rooms, notes...
          </span>
          <kbd className="font-mono text-[10px] bg-[#212a39] px-1.5 py-0.5 rounded border border-[#424753]/40 text-[#c2c6d6]">
            /
          </kbd>
        </button>
      </div>

      {/* Right Controls: IST Clock, Offline, PWA, Notifications, User & Role */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Offline Indicator */}
        {!isOnline && (
          <div className="flex items-center gap-1 bg-[#93000a] text-[#ffdad6] px-2 py-0.5 rounded-md text-[11px] font-semibold animate-pulse">
            <span className="material-symbols-outlined text-xs">cloud_off</span>
            <span className="hidden sm:inline">Offline</span>
          </div>
        )}

        {/* Live IST Clock */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#121c2a] border border-[#424753]/30 px-2.5 py-1 rounded-lg">
          <span className="h-2 w-2 rounded-full bg-[#4edea3] animate-pulse"></span>
          <div className="flex flex-col">
            <span className="text-[9px] text-[#8c909f] uppercase tracking-wider leading-none">
              PSG Tech IST
            </span>
            <span className="font-mono text-[11px] text-[#4edea3] font-semibold leading-tight">
              {istTimeString}
            </span>
          </div>
        </div>

        {/* Admin Mode Toggle Button */}
        <button
          type="button"
          onClick={() => onRoleSwitch(user.role === 'admin' ? 'student' : 'admin')}
          className={`flex items-center gap-1.5 border px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs font-semibold ${
            user.role === 'admin'
              ? 'bg-[#528dff]/20 border-[#528dff]/40 text-[#afc6ff]'
              : 'bg-[#121c2a] hover:bg-[#16202f] border-[#4F8CFF]/40 text-[#4F8CFF]'
          }`}
          title="Click to toggle between Student Mode and Class Representative / HOD Mode"
        >
          <span className="material-symbols-outlined text-base text-[#4F8CFF]">
            admin_panel_settings
          </span>
          <span className="hidden md:inline font-mono">
            {user.role === 'admin' ? 'Admin: CR Active' : 'Admin Mode: CR / HOD'}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#4F8CFF] animate-pulse ml-0.5"></span>
        </button>

        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Quick Search on mobile */}
        <button
          onClick={onOpenSearch}
          className="flex lg:hidden p-2 rounded-lg bg-[#121c2a] border border-[#424753]/30 text-[#c2c6d6] hover:text-white"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-lg">search</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={onOpenNotifications}
            aria-label="Alerts"
            className="p-2 rounded-lg bg-[#121c2a] border border-[#424753]/30 text-[#c2c6d6] hover:text-white hover:bg-[#16202f] transition-colors relative"
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#ff5555] border border-[#050e1c]"></span>
            )}
          </button>
        </div>

        <div className="h-6 w-px bg-[#424753]/30 hidden sm:block"></div>

        {/* Role Switcher & Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
          >
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-xs font-semibold text-[#d9e3f7] leading-tight flex items-center gap-1 justify-end">
                {user.name} ({user.rollNo})
                {user.role === 'admin' && (
                  <span className="text-[9px] bg-[#528dff]/20 text-[#afc6ff] px-1 py-0.2 rounded border border-[#528dff]/30 font-bold">
                    ADMIN
                  </span>
                )}
              </span>
              <span className="font-mono text-[10px] text-[#4edea3] leading-tight">
                {user.role === 'admin' ? 'Class Representative · ICE Sem 1' : 'Private Student Account · ICE Sem 1'}
              </span>
            </div>
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#424753]/60 group-hover:border-[#4F8CFF] transition-colors"
              src={user.avatarUrl}
            />
            <span className="material-symbols-outlined text-[#8c909f] text-sm hidden sm:inline">
              expand_more
            </span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-[#101D30] border border-[#424753]/60 rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#424753]/30">
                <div className="text-xs font-bold text-white">{user.name}</div>
                <div className="text-[11px] font-mono text-[#4F8CFF]">{user.rollNo} · {user.section}</div>
                <div className="text-[10px] text-[#8c909f] mt-0.5">{user.department}</div>
              </div>

              {/* Role Switch Section */}
              <div className="px-3 py-2 border-b border-[#424753]/30">
                <div className="text-[10px] font-bold text-[#8c909f] uppercase tracking-wider mb-1.5">
                  Simulate User Role
                </div>
                <div className="grid grid-cols-2 gap-1 bg-[#0a1422] p-1 rounded-lg">
                  <button
                    onClick={() => {
                      onRoleSwitch('student');
                      setShowRoleMenu(false);
                    }}
                    className={`py-1 text-xs rounded font-medium transition-colors ${
                      user.role === 'student'
                        ? 'bg-[#528dff] text-[#001a43] font-bold'
                        : 'text-[#8c909f] hover:text-white'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    onClick={() => {
                      onRoleSwitch('admin');
                      setShowRoleMenu(false);
                    }}
                    className={`py-1 text-xs rounded font-medium transition-colors ${
                      user.role === 'admin'
                        ? 'bg-[#528dff] text-[#001a43] font-bold'
                        : 'text-[#8c909f] hover:text-white'
                    }`}
                  >
                    Class Rep
                  </button>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigateToProfile();
                    setShowRoleMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-[#d9e3f7] hover:bg-[#16202f] flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm text-[#4F8CFF]">
                    account_circle
                  </span>
                  Full Profile &amp; Attendance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
