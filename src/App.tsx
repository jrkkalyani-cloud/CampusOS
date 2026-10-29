import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  TimetableEntry,
  Assignment,
  StudentTaskProgress,
  Announcement,
  Opportunity,
  AuditLog,
  DriftReport,
  DriveResource,
  UserRole,
} from './types/campus';
import { campusStorage } from './services/campusStorage';
import { useLiveClock } from './hooks/useLiveClock';
import { Sidebar, PageId } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { BroadcastBanner } from './components/BroadcastBanner';
import { SearchModal } from './components/SearchModal';
import { LabSheetModal } from './components/LabSheetModal';
import { BenchGroupModal } from './components/BenchGroupModal';
import { ReportDriftModal } from './components/ReportDriftModal';
import { QuickRouteModal } from './components/QuickRouteModal';
import { CalendarExportModal } from './components/CalendarExportModal';
import { WhatsAppSyncModal } from './components/WhatsAppSyncModal';
import { DatabaseSyncModal } from './components/DatabaseSyncModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { TimetablePage } from './pages/TimetablePage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { AdminHubPage } from './pages/AdminHubPage';
import { ProfilePage } from './pages/ProfilePage';
import { DriveVaultSection } from './components/dashboard/DriveVaultSection';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [user, setUser] = useState<UserProfile>(() => campusStorage.getUser());
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() =>
    campusStorage.getTimetable()
  );
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    campusStorage.getAssignments()
  );
  const [studentProgress, setStudentProgress] = useState<
    Record<string, StudentTaskProgress>
  >(() => campusStorage.getStudentProgress());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    campusStorage.getAnnouncements()
  );
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() =>
    campusStorage.getOpportunities()
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    campusStorage.getAuditLogs()
  );
  const [driftReports, setDriftReports] = useState<DriftReport[]>(() =>
    campusStorage.getDriftReports()
  );
  const [driveResources, setDriveResources] = useState<DriveResource[]>(() =>
    campusStorage.getDriveResources()
  );

  const [selectedDayCycle, setSelectedDayCycle] = useState<number>(3); // Wednesday Cycle 3 as in Stitch
  const [selectedClass, setSelectedClass] = useState<string>('PSG Tech · BE ICE Semester 1 (Batch: 60)');

  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLabSheetOpen, setIsLabSheetOpen] = useState(false);
  const [isBenchGroupOpen, setIsBenchGroupOpen] = useState(false);
  const [isReportDriftOpen, setIsReportDriftOpen] = useState(false);
  const [isCalendarSyncOpen, setIsCalendarSyncOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isDatabaseSyncOpen, setIsDatabaseSyncOpen] = useState(false);

  const [routeModalData, setRouteModalData] = useState<{
    isOpen: boolean;
    destination?: string;
    source?: string;
  }>({ isOpen: false });

  const { getTimeRemainingString } = useLiveClock();

  // Listen to live updates from campusStorage
  useEffect(() => {
    const unsubUser = campusStorage.subscribeUser(setUser);
    const unsubTimetable = campusStorage.subscribeTimetable(setTimetable);
    const unsubAssignments = campusStorage.subscribeAssignments(setAssignments);
    const unsubProgress = campusStorage.subscribeStudentProgress(setStudentProgress);
    const unsubAnnouncements = campusStorage.subscribeAnnouncements(setAnnouncements);
    const unsubOpportunities = campusStorage.subscribeOpportunities(setOpportunities);
    const unsubAudit = campusStorage.subscribeAuditLogs(setAuditLogs);
    const unsubDrive = campusStorage.subscribeDriveResources(setDriveResources);

    // Global keyboard shortcut '/' to open search
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);

    return () => {
      unsubUser();
      unsubTimetable();
      unsubAssignments();
      unsubProgress();
      unsubAnnouncements();
      unsubOpportunities();
      unsubAudit();
      unsubDrive();
      window.removeEventListener('keydown', handleGlobalKey);
    };
  }, []);

  const handleRoleSwitch = (role: UserRole) => {
    campusStorage.switchRole(role);
  };

  const handleToggleCompleteAssignment = (id: string, notes?: string) => {
    campusStorage.toggleStudentTaskCompletion(id, notes);
  };

  const handleOpenRouteMap = (dest?: string, src?: string) => {
    setRouteModalData({
      isOpen: true,
      destination: dest || 'E-Block 102 (Robotics & Sensors Lab)',
      source: src || 'Room E-301 (3rd Floor Lecture Hall)',
    });
  };

  const urgentAnnouncement = announcements.find((a) => a.isUrgent && a.status === 'active');
  const urgentCount = announcements.filter((a) => a.isUrgent && a.status === 'active').length;
  const dueCount = assignments.filter((a) => !studentProgress[a.id]?.isCompleted).length;

  return (
    <div className="min-h-screen bg-[#07111F] text-[#d9e3f7] flex">
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        user={user}
        urgentCount={urgentCount}
        dueCount={dueCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-72 flex flex-col min-w-0">
        {/* Fixed Top Header */}
        <Header
          user={user}
          onRoleSwitch={handleRoleSwitch}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setCurrentPage('announcements')}
          unreadNotificationsCount={urgentCount}
          selectedClass={selectedClass}
          onSelectClass={setSelectedClass}
          onNavigateToProfile={() => setCurrentPage('profile')}
        />

        {/* Content Body */}
        <main className="w-full pt-16 min-h-screen bg-[#07111F]">
          {/* Interactive Top Broadcast Alert Toast */}
          <BroadcastBanner
            urgentAnnouncement={urgentAnnouncement}
            onViewRoute={() => handleOpenRouteMap('E-Block 102', 'Room E-301')}
          />

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {currentPage === 'dashboard' && (
              <DashboardPage
                user={user}
                timetable={timetable}
                assignments={assignments}
                studentProgress={studentProgress}
                announcements={announcements}
                driveResources={driveResources}
                selectedDayCycle={selectedDayCycle}
                onSelectDayCycle={setSelectedDayCycle}
                onToggleCompleteAssignment={handleToggleCompleteAssignment}
                onNavigate={setCurrentPage}
                onOpenLabSheet={() => setIsLabSheetOpen(true)}
                onOpenBenchGroup={() => setIsBenchGroupOpen(true)}
                onOpenRouteMap={handleOpenRouteMap}
                onOpenReportDrift={() => setIsReportDriftOpen(true)}
                onOpenCalendarSync={() => setIsCalendarSyncOpen(true)}
                onSelectAnnouncement={() => setCurrentPage('announcements')}
                onOpenWhatsAppModal={() => setIsWhatsAppModalOpen(true)}
                onOpenDatabaseSync={() => setIsDatabaseSyncOpen(true)}
                onRoleSwitch={handleRoleSwitch}
                timeRemainingText={getTimeRemainingString('10:30')}
              />
            )}

            {currentPage === 'admin' && (
              <AdminHubPage
                user={user}
                timetable={timetable}
                auditLogs={auditLogs}
                driftReports={driftReports}
                onRoleSwitch={handleRoleSwitch}
                onOpenCreateAssignment={() => setCurrentPage('assignments')}
                onOpenBroadcastAnnouncement={() => setCurrentPage('announcements')}
                onOpenDatabaseSync={() => setIsDatabaseSyncOpen(true)}
              />
            )}

            {currentPage === 'timetable' && (
              <TimetablePage
                timetable={timetable}
                user={user}
                onOpenRouteMap={handleOpenRouteMap}
                onOpenLabSheet={() => setIsLabSheetOpen(true)}
                onOpenCalendarSync={() => setIsCalendarSyncOpen(true)}
              />
            )}

            {currentPage === 'assignments' && (
              <AssignmentsPage
                assignments={assignments}
                studentProgress={studentProgress}
                user={user}
                onToggleComplete={handleToggleCompleteAssignment}
                onOpenLabSheet={() => setIsLabSheetOpen(true)}
              />
            )}

            {currentPage === 'gdrive' && (
              <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
                <div className="flex items-center justify-between pb-3 border-b border-[#424753]/20">
                  <div>
                    <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                      Google Drive Study Vault
                    </h1>
                    <p className="text-xs text-[#8c909f] mt-1">
                      Direct cloud repository for lecture slides, solved exam question papers, lab observation formats, and textbook PDFs.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="bg-[#16202f] hover:bg-[#212a39] text-[#c2c6d6] px-3.5 py-1.5 rounded-xl text-xs font-mono transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
                <DriveVaultSection resources={driveResources} user={user} />
              </div>
            )}

            {currentPage === 'announcements' && (
              <AnnouncementsPage
                announcements={announcements}
                user={user}
                onOpenRouteMap={handleOpenRouteMap}
              />
            )}

            {currentPage === 'opportunities' && (
              <OpportunitiesPage opportunities={opportunities} user={user} />
            )}

            {currentPage === 'profile' && (
              <ProfilePage
                user={user}
                onRoleSwitch={handleRoleSwitch}
                onOpenReportDrift={() => setIsReportDriftOpen(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        urgentCount={urgentCount}
        dueCount={dueCount}
        isAdmin={user.role === 'admin'}
      />

      {/* Global Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        timetable={timetable}
        assignments={assignments}
        announcements={announcements}
        opportunities={opportunities}
        onSelectResult={(type) => {
          if (type === 'timetable') setCurrentPage('timetable');
          else if (type === 'assignment') setCurrentPage('assignments');
          else if (type === 'announcement') setCurrentPage('announcements');
          else if (type === 'opportunity') setCurrentPage('opportunities');
        }}
      />

      <LabSheetModal
        isOpen={isLabSheetOpen}
        onClose={() => setIsLabSheetOpen(false)}
      />

      <BenchGroupModal
        isOpen={isBenchGroupOpen}
        onClose={() => setIsBenchGroupOpen(false)}
        benchGroupName={user.benchGroup}
      />

      <ReportDriftModal
        isOpen={isReportDriftOpen}
        onClose={() => setIsReportDriftOpen(false)}
        userName={user.name}
        userRoll={user.rollNo}
      />

      <QuickRouteModal
        isOpen={routeModalData.isOpen}
        destination={routeModalData.destination}
        source={routeModalData.source}
        onClose={() => setRouteModalData({ isOpen: false })}
      />

      <CalendarExportModal
        isOpen={isCalendarSyncOpen}
        onClose={() => setIsCalendarSyncOpen(false)}
        timetable={timetable}
      />

      <WhatsAppSyncModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        user={user}
      />

      <DatabaseSyncModal
        isOpen={isDatabaseSyncOpen}
        onClose={() => setIsDatabaseSyncOpen(false)}
      />
    </div>
  );
}
