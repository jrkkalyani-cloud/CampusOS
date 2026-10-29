import React from 'react';
import {
  UserProfile,
  TimetableEntry,
  Assignment,
  StudentTaskProgress,
  Announcement,
  DriveResource,
  UserRole,
} from '../types/campus';
import { NextClassHero } from '../components/dashboard/NextClassHero';
import { AdminActionsToolbar } from '../components/dashboard/AdminActionsToolbar';
import { TimetableSection } from '../components/dashboard/TimetableSection';
import { MasterMatrixTable } from '../components/dashboard/MasterMatrixTable';
import { DriveVaultSection } from '../components/dashboard/DriveVaultSection';
import { DeliverablesRadar } from '../components/dashboard/DeliverablesRadar';
import { AcademicHealthWidget } from '../components/dashboard/AcademicHealthWidget';
import { BulletinsFeed } from '../components/dashboard/BulletinsFeed';
import { HubShortcuts } from '../components/dashboard/HubShortcuts';
import { MiniNavigator } from '../components/dashboard/MiniNavigator';
import { PageId } from '../components/Sidebar';

interface DashboardPageProps {
  user: UserProfile;
  timetable: TimetableEntry[];
  assignments: Assignment[];
  studentProgress: Record<string, StudentTaskProgress>;
  announcements: Announcement[];
  driveResources: DriveResource[];
  selectedDayCycle: number;
  onSelectDayCycle: (cycle: number) => void;
  onToggleCompleteAssignment: (id: string) => void;
  onNavigate: (page: PageId) => void;
  onOpenLabSheet: () => void;
  onOpenBenchGroup: () => void;
  onOpenRouteMap: (dest?: string, src?: string) => void;
  onOpenReportDrift: () => void;
  onOpenCalendarSync: () => void;
  onSelectAnnouncement: (announcement: Announcement) => void;
  onOpenWhatsAppModal: () => void;
  onOpenDatabaseSync: () => void;
  onRoleSwitch: (role: UserRole) => void;
  timeRemainingText: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  timetable,
  assignments,
  studentProgress,
  announcements,
  driveResources,
  selectedDayCycle,
  onSelectDayCycle,
  onToggleCompleteAssignment,
  onNavigate,
  onOpenLabSheet,
  onOpenBenchGroup,
  onOpenRouteMap,
  onOpenCalendarSync,
  onSelectAnnouncement,
  onOpenWhatsAppModal,
  onOpenDatabaseSync,
  onRoleSwitch,
  timeRemainingText,
}) => {
  // Find immediate next class (Wednesday Period 5-8 lab 23U111)
  const nextClass =
    timetable.find((t) => t.id === 'tt_wed_5_8') ||
    timetable.find((t) => t.isRelocated) ||
    timetable[0];

  const urgentAssignment = assignments[0];
  const isUrgentDone = urgentAssignment
    ? studentProgress[urgentAssignment.id]?.isCompleted || false
    : false;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full pb-16">
      {/* EXECUTIVE GREETING & OPERATIONAL STATUS */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-2 border-b border-[#424753]/20">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#4edea3]"></span>
            <span className="font-mono text-xs uppercase text-[#4edea3] font-bold tracking-wider">
              PSG COLLEGE OF TECHNOLOGY · COIMBATORE 641 004
            </span>
            <span className="text-[#8c909f] text-xs">/</span>
            <span className="font-mono text-xs text-[#c2c6d6]">Strength: 60</span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              BE Instrumentation &amp; Control Engineering
            </h1>
            <span className="font-mono text-xs bg-[#16202f] border border-[#4F8CFF]/30 px-2.5 py-1 rounded-lg text-[#00daf3] font-bold">
              Semester 1 Timetable Hub
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#8c909f]">
            Official schedule mapped directly from PSG Tech academic records · Peer directories &amp; public ranks disabled for privacy.
          </p>
        </div>

        {/* Quick Action Pill Group */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Admin Mode Toggle */}
          <button
            type="button"
            onClick={() => onRoleSwitch(user.role === 'admin' ? 'student' : 'admin')}
            className="flex items-center gap-1.5 bg-[#121c2a] hover:bg-[#16202f] border border-[#4F8CFF]/40 px-2.5 py-1.5 rounded-lg text-[#4F8CFF] transition-colors cursor-pointer group text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-base text-[#4F8CFF]">
              admin_panel_settings
            </span>
            <span>Admin Mode: CR / HOD</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F8CFF] animate-pulse ml-0.5"></span>
          </button>

          <span className="bg-[#101D30] border border-[#424753]/40 text-[#c2c6d6] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-mono">
            <span className="material-symbols-outlined text-sm text-[#4edea3]">shield</span>
            <span>Student Portal · BE ICE</span>
          </span>

          <a
            href="#full-matrix"
            className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md transition-colors text-xs font-bold active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">table_chart</span>
            <span>View 5-Day Full Matrix</span>
          </a>
        </div>
      </header>

      {/* SECTION 1: THE 3 CORE QUESTIONS BENTO HERO */}
      <NextClassHero
        nextClass={nextClass}
        urgentAssignment={urgentAssignment}
        isCompleted={isUrgentDone}
        onToggleCompleteAssignment={onToggleCompleteAssignment}
        onOpenLabSheet={onOpenLabSheet}
        onOpenBenchGroup={onOpenBenchGroup}
        onOpenRouteMap={() => onOpenRouteMap(nextClass.venue, 'Classroom E-301')}
        onInspectDeliverables={() => onNavigate('assignments')}
        timeRemainingText={timeRemainingText}
      />

      {/* SECTION 2: ADMIN ACTIONS TOOLBAR (NO CODING FOR EVERYDAY UPDATES) */}
      <AdminActionsToolbar
        user={user}
        onOpenEditSlot={() => onNavigate('admin')}
        onOpenPostNotice={() => onNavigate('announcements')}
        onOpenWhatsAppModal={onOpenWhatsAppModal}
        onOpenDatabaseSync={onOpenDatabaseSync}
      />

      {/* SECTION 3: TODAY'S TIMETABLE (CHRONOLOGICAL HIGH-DENSITY TRACK) */}
      <TimetableSection
        entries={timetable}
        selectedDayCycle={selectedDayCycle}
        onSelectDayCycle={onSelectDayCycle}
        onOpenWeekMatrix={() => onNavigate('timetable')}
        onOpenLabSheet={onOpenLabSheet}
        onOpenRouteMap={onOpenRouteMap}
      />

      {/* SECTION 4: OFFICIAL PSG COLLEGE OF TECHNOLOGY BE ICE SEMESTER 1 MASTER MATRIX & SUBJECT KEY */}
      <MasterMatrixTable />

      {/* SECTION 5: GOOGLE DRIVE STUDY VAULT & COURSE MATERIALS */}
      <DriveVaultSection resources={driveResources} user={user} />

      {/* SECTION 6: SUBMISSION RADAR & ATTENDANCE TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="submissions-section">
        <div className="lg:col-span-8">
          <DeliverablesRadar
            assignments={assignments}
            studentProgress={studentProgress}
            onToggleComplete={onToggleCompleteAssignment}
            onViewAll={() => onNavigate('assignments')}
            onOpenLabSheet={onOpenLabSheet}
          />
        </div>
        <div className="lg:col-span-4">
          <AcademicHealthWidget user={user} onViewDetails={() => onNavigate('profile')} />
        </div>
      </div>

      {/* SECTION 7: CAMPUS BULLETINS & DEPARTMENT STORE STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <BulletinsFeed
            announcements={announcements}
            user={user}
            onViewAllAnnouncements={() => onNavigate('announcements')}
            onSelectAnnouncement={onSelectAnnouncement}
          />
        </div>
        <div className="lg:col-span-4">
          <HubShortcuts user={user} onOpenWhatsAppModal={onOpenWhatsAppModal} />
        </div>
      </div>

      {/* SECTION 8: CAMPUS SPATIAL MINI-NAVIGATOR (STANDARDS & COMPLIANCE) */}
      <MiniNavigator
        onOpenRouteMap={() =>
          onOpenRouteMap('Circuits & Devices Lab (E-102)', 'Classroom E-301')
        }
      />
    </div>
  );
};
