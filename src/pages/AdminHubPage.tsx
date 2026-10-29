import React, { useState } from 'react';
import { UserProfile, TimetableEntry, AuditLog, DriftReport, SessionType } from '../types/campus';
import { campusStorage } from '../services/campusStorage';

interface AdminHubPageProps {
  user: UserProfile;
  timetable: TimetableEntry[];
  auditLogs: AuditLog[];
  driftReports: DriftReport[];
  onRoleSwitch: (role: 'student' | 'admin') => void;
  onOpenCreateAssignment: () => void;
  onOpenBroadcastAnnouncement: () => void;
  onOpenDatabaseSync?: () => void;
}

export const AdminHubPage: React.FC<AdminHubPageProps> = ({
  user,
  timetable,
  auditLogs,
  driftReports,
  onRoleSwitch,
  onOpenCreateAssignment,
  onOpenBroadcastAnnouncement,
  onOpenDatabaseSync,
}) => {
  const isAdmin = user.role === 'admin';
  const [activeTab, setActiveTab] = useState<'timetable' | 'drifts' | 'copy_day' | 'audit'>(
    'timetable'
  );

  // Quick Room Relocation Form
  const [selectedSlotId, setSelectedSlotId] = useState(timetable[3]?.id || timetable[0]?.id || '');
  const [targetVenue, setTargetVenue] = useState('E-Block 102 (Central Robotics Lab)');
  const [shiftReason, setShiftReason] = useState(
    'Standard dead weight pressure calibrator overhaul in F-204.'
  );

  // Slot Management Form State (Add / Edit)
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotDay, setSlotDay] = useState<TimetableEntry['day']>('Wednesday');
  const [slotDayCycle, setSlotDayCycle] = useState(3);
  const [slotPeriodNum, setSlotPeriodNum] = useState(1);
  const [slotPeriodLabel, setSlotPeriodLabel] = useState('Period 1');
  const [slotStartTime, setSlotStartTime] = useState('8.30');
  const [slotEndTime, setSlotEndTime] = useState('9.20');
  const [slotSubjectCode, setSlotSubjectCode] = useState('23U101');
  const [slotSubjectName, setSlotSubjectName] = useState('Calculus and its Applications');
  const [slotFaculty, setSlotFaculty] = useState('Dr. V. Malathi');
  const [slotFacultyDept, setSlotFacultyDept] = useState('Dept. of Mathematics');
  const [slotVenue, setSlotVenue] = useState('Classroom E-301');
  const [slotType, setSlotType] = useState<SessionType>('lecture');

  // Copy Day Timetable Form State
  const [fromDay, setFromDay] = useState<TimetableEntry['day']>('Wednesday');
  const [toDay, setToDay] = useState<TimetableEntry['day']>('Thursday');
  const [toCycle, setToCycle] = useState(4);

  // Confirmation modals
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleQuickRelocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId || !targetVenue) return;

    campusStorage.relocateRoom(
      selectedSlotId,
      targetVenue,
      shiftReason,
      `${user.name} (${user.rollNo})`
    );

    showToast(`Class relocated to ${targetVenue}. Changes synced across campus devices.`);
  };

  const handleApproveDrift = (report: DriftReport) => {
    const slot = timetable.find((t) => t.subjectCode === report.subjectCode);
    if (slot) {
      campusStorage.relocateRoom(
        slot.id,
        report.actualRoom,
        `Student verified drift: ${report.notes}`,
        `${user.name} (${user.rollNo})`
      );
    }
    showToast(`Drift approved and timetable updated to ${report.actualRoom}!`);
  };

  const handleOpenAddSlot = () => {
    setEditingSlotId(null);
    setSlotDay('Wednesday');
    setSlotPeriodNum(1);
    setSlotPeriodLabel('Period 1');
    setSlotStartTime('8.30');
    setSlotEndTime('9.20');
    setSlotSubjectCode('23U101');
    setSlotSubjectName('Calculus and its Applications');
    setSlotVenue('Classroom E-301');
    setSlotFaculty('Dr. V. Malathi');
    setSlotFacultyDept('Dept. of Mathematics');
    setSlotType('lecture');
    setShowSlotModal(true);
  };

  const handleOpenEditSlot = (slot: TimetableEntry) => {
    setEditingSlotId(slot.id);
    setSlotDay(slot.day);
    setSlotDayCycle(slot.dayCycle);
    setSlotPeriodNum(slot.periodNumber);
    setSlotPeriodLabel(slot.periodLabel);
    setSlotStartTime(slot.startTime);
    setSlotEndTime(slot.endTime);
    setSlotSubjectCode(slot.subjectCode);
    setSlotSubjectName(slot.subjectName);
    setSlotVenue(slot.venue);
    setSlotFaculty(slot.faculty);
    setSlotFacultyDept(slot.facultyDept);
    setSlotType(slot.type);
    setShowSlotModal(true);
  };

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotSubjectCode || !slotVenue) return;

    if (editingSlotId) {
      campusStorage.updateTimetableEntry(
        editingSlotId,
        {
          day: slotDay,
          dayCycle: slotDayCycle,
          periodNumber: slotPeriodNum,
          periodLabel: slotPeriodLabel,
          startTime: slotStartTime,
          endTime: slotEndTime,
          subjectCode: slotSubjectCode,
          subjectName: slotSubjectName,
          venue: slotVenue,
          faculty: slotFaculty,
          facultyDept: slotFacultyDept,
          type: slotType,
        },
        `${user.name} (${user.rollNo})`
      );
      showToast(`Updated slot ${slotSubjectCode} (${slotDay} ${slotPeriodLabel})`);
    } else {
      campusStorage.addTimetableEntry(
        {
          day: slotDay,
          dayCycle: slotDayCycle,
          periodNumber: slotPeriodNum,
          periodLabel: slotPeriodLabel,
          startTime: slotStartTime,
          endTime: slotEndTime,
          subjectCode: slotSubjectCode,
          subjectName: slotSubjectName,
          venue: slotVenue,
          faculty: slotFaculty,
          facultyDept: slotFacultyDept,
          type: slotType,
        },
        `${user.name} (${user.rollNo})`
      );
      showToast(`Added new slot ${slotSubjectCode} to ${slotDay}`);
    }

    setShowSlotModal(false);
    setEditingSlotId(null);
  };

  const handleDeleteSlot = () => {
    if (!deletingSlotId) return;
    campusStorage.deleteTimetableEntry(deletingSlotId, `${user.name} (${user.rollNo})`);
    setDeletingSlotId(null);
    showToast('Timetable slot deleted successfully.');
  };

  const handleCopyDaySchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromDay === toDay) {
      showToast('Source day and target day must be different.');
      return;
    }

    const count = campusStorage.copyDayTimetable(
      fromDay,
      toDay,
      toCycle,
      `${user.name} (${user.rollNo})`
    );

    showToast(`Successfully copied ${count} slots from ${fromDay} to ${toDay} (Cycle ${toCycle})!`);
  };

  const handleResetData = () => {
    campusStorage.resetToDefault();
    setShowResetConfirm(false);
    showToast('CampusOS database reset to initial PSG Tech ICE Sem 1 benchmark.');
  };

  const subjectsList = [
    { code: '23U101', name: 'Calculus and its Applications', dept: 'Mathematics' },
    { code: '23U102', name: 'Physics', dept: 'Physics' },
    { code: '23U103', name: 'Electric Circuits', dept: 'EEE' },
    { code: '23U104', name: 'Electronic Devices & Circuits', dept: 'ICE' },
    { code: '23U110', name: 'Engineering Graphics', dept: 'CAD Center' },
    { code: '23U111', name: 'Circuits and Devices Laboratory', dept: 'ICE' },
    { code: '23G105', name: 'English Language Proficiency', dept: 'Humanities' },
    { code: 'LIB', name: 'Library', dept: 'Central Library' },
    { code: 'TWM', name: 'Tutor Ward Meeting', dept: 'ICE' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-[#1b2b44] border border-[#528dff]/40 rounded-xl px-4 py-3 flex items-center justify-between shadow-xl animate-fade-in text-xs text-[#d9e3f7]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4edea3] text-base">check_circle</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#8c909f] hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#424753]/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Class Representative &amp; Admin Hub
            </h1>
            <span
              className={`font-mono text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                isAdmin
                  ? 'bg-[#528dff]/20 text-[#afc6ff] border-[#528dff]/30'
                  : 'bg-[#93000a]/20 text-[#ff5555] border-[#ff5555]/30'
              }`}
            >
              {isAdmin ? 'AUTHORISED CREDENTIALS' : 'RESTRICTED VIEW'}
            </span>
          </div>
          <p className="text-xs text-[#8c909f] mt-1">
            Visual governance portal for timetable changes, room drifts, broadcast alerts, and audit histories. No coding needed.
          </p>
        </div>

        {/* Quick Role Elevation */}
        {!isAdmin ? (
          <button
            onClick={() => onRoleSwitch('admin')}
            className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition-colors shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">vpn_key</span>
            <span>Switch to Class Rep (Admin)</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRoleSwitch('student')}
              className="bg-[#16202f] hover:bg-[#212a39] border border-[#424753]/40 text-[#c2c6d6] px-3 py-1.5 rounded-xl text-xs font-mono transition-colors"
            >
              Exit to Student Mode
            </button>
            {onOpenDatabaseSync && (
              <button
                onClick={onOpenDatabaseSync}
                className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">database</span>
                <span>Supabase Sync</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Permission Restriction Alert if in Student Mode */}
      {!isAdmin && (
        <div className="bg-[#93000a]/20 border border-[#ff5555]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#ffdad6]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#ff5555] text-xl shrink-0">
              shield_person
            </span>
            <div>
              <strong>Role Access Notice:</strong> You are currently previewing in Student Mode (Karthik Raja V). Official content modifications require Class Representative or Faculty credentials. Click Elevate below to test admin controls.
            </div>
          </div>
          <button
            onClick={() => onRoleSwitch('admin')}
            className="bg-[#ff5555] text-[#001a43] px-3.5 py-1.5 rounded-xl font-bold font-mono self-start sm:self-center shrink-0"
          >
            Elevate to Admin
          </button>
        </div>
      )}

      {/* Management Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#424753]/30 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('timetable')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'timetable'
              ? 'bg-[#4F8CFF] text-[#001a43] font-bold shadow-md'
              : 'text-[#8c909f] hover:text-white hover:bg-[#16202f]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          <span>Timetable &amp; Slot Management</span>
        </button>

        <button
          onClick={() => setActiveTab('copy_day')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'copy_day'
              ? 'bg-[#4F8CFF] text-[#001a43] font-bold shadow-md'
              : 'text-[#8c909f] hover:text-white hover:bg-[#16202f]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">content_copy</span>
          <span>Copy Day Timetable</span>
        </button>

        <button
          onClick={() => setActiveTab('drifts')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'drifts'
              ? 'bg-[#4F8CFF] text-[#001a43] font-bold shadow-md'
              : 'text-[#8c909f] hover:text-white hover:bg-[#16202f]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">swap_horiz</span>
          <span>Room Relocations &amp; Drifts ({driftReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'audit'
              ? 'bg-[#4F8CFF] text-[#001a43] font-bold shadow-md'
              : 'text-[#8c909f] hover:text-white hover:bg-[#16202f]'
          }`}
        >
          <span className="material-symbols-outlined text-sm">history_edu</span>
          <span>Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: TIMETABLE & SLOT MANAGEMENT */}
      {activeTab === 'timetable' && (
        <div className="flex flex-col gap-6">
          {/* Quick Actions Row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Active Timetable Slots</h3>
              <p className="text-xs text-[#8c909f]">
                Manage period slots for Monday through Friday. Add special lab blocks, library hours, or extra lectures.
              </p>
            </div>
            <button
              onClick={handleOpenAddSlot}
              disabled={!isAdmin}
              className="bg-[#4F8CFF] hover:bg-[#528dff] disabled:opacity-50 text-[#001a43] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
            >
              <span className="material-symbols-outlined text-sm font-bold">add</span>
              <span>+ Add New Slot</span>
            </button>
          </div>

          {/* Slots Table */}
          <div className="bg-[#101D30] border border-[#424753]/30 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#16202f] border-b border-[#424753]/40 text-[#8c909f] font-mono text-[11px]">
                    <th className="p-3">Day</th>
                    <th className="p-3">Time &amp; Period</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Room / Venue</th>
                    <th className="p-3">Faculty</th>
                    <th className="p-3">Type</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#424753]/20 text-[#d9e3f7]">
                  {timetable
                    .filter((t) => t.type !== 'break' && t.type !== 'lunch')
                    .slice(0, 15)
                    .map((slot) => (
                      <tr key={slot.id} className="hover:bg-[#16202f]/50 transition-colors">
                        <td className="p-3 font-semibold text-white">{slot.day}</td>
                        <td className="p-3 font-mono text-[11px] text-[#00daf3]">
                          {slot.startTime}–{slot.endTime} ({slot.periodLabel})
                        </td>
                        <td className="p-3">
                          <span className="font-mono font-bold text-[#4F8CFF] mr-1.5">
                            {slot.subjectCode}
                          </span>
                          <span className="text-white">{slot.subjectName}</span>
                        </td>
                        <td className="p-3">
                          <span
                            className={
                              slot.isRelocated ? 'text-[#ff5555] font-bold' : 'text-[#c2c6d6]'
                            }
                          >
                            {slot.venue}
                          </span>
                          {slot.isRelocated && (
                            <span className="ml-1 text-[10px] bg-[#93000a]/30 text-[#ffb4ab] px-1 py-0.2 rounded border border-[#ff5555]/30">
                              RELOCATED
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[#8c909f]">{slot.faculty}</td>
                        <td className="p-3">
                          <span className="bg-[#16202f] text-[#4edea3] px-2 py-0.5 rounded text-[10px] uppercase font-mono border border-[#424753]/40">
                            {slot.type}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEditSlot(slot)}
                            disabled={!isAdmin}
                            title="Edit Slot"
                            className="p-1 px-2 rounded-lg bg-[#16202f] hover:bg-[#212a39] text-[#4F8CFF] hover:text-white transition-colors disabled:opacity-40"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingSlotId(slot.id)}
                            disabled={!isAdmin}
                            title="Delete Slot"
                            className="p-1 px-2 rounded-lg bg-[#16202f] hover:bg-[#93000a]/30 text-[#8c909f] hover:text-[#ff5555] transition-colors disabled:opacity-40"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COPY DAY TIMETABLE */}
      {activeTab === 'copy_day' && (
        <div className="bg-[#101D30] border border-[#424753]/30 rounded-xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
          <div className="border-b border-[#424753]/20 pb-3">
            <h3 className="font-heading font-bold text-lg text-white">
              Copy Existing Day's Timetable
            </h3>
            <p className="text-xs text-[#8c909f]">
              Replicate an entire day's schedule template to another day in seconds without retyping slots.
            </p>
          </div>

          <form onSubmit={handleCopyDaySchedule} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Source Day (Copy From)
                </label>
                <select
                  value={fromDay}
                  onChange={(e) => setFromDay(e.target.value as any)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Target Day (Copy To)
                </label>
                <select
                  value={toDay}
                  onChange={(e) => setToDay(e.target.value as any)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                Target Day Cycle (1 to 5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={toCycle}
                onChange={(e) => setToCycle(Number(e.target.value))}
                className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isAdmin}
                className="bg-[#4F8CFF] hover:bg-[#528dff] disabled:opacity-50 text-[#001a43] px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-lg active:scale-95"
              >
                Execute Day Replication
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: ROOM RELOCATIONS & DRIFTS */}
      {activeTab === 'drifts' && (
        <div className="flex flex-col gap-6">
          {/* Quick Relocation Tool Form */}
          <div
            id="quick-relocate-form"
            className="bg-[#101D30] border border-[#424753]/40 rounded-xl p-5 sm:p-6 shadow-xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff5555] text-xl">swap_horiz</span>
                <h2 className="font-heading font-bold text-lg text-white">
                  Execute Immediate Room Relocation
                </h2>
              </div>
              <span className="text-xs text-[#8c909f] font-mono">Live Sync</span>
            </div>

            <form onSubmit={handleQuickRelocate} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Select Class / Slot to Relocate
                  </label>
                  <select
                    disabled={!isAdmin}
                    value={selectedSlotId}
                    onChange={(e) => setSelectedSlotId(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4F8CFF] disabled:opacity-50"
                  >
                    {timetable
                      .filter((t) => t.type !== 'break' && t.type !== 'lunch')
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.day} {t.startTime} — {t.subjectCode} ({t.subjectName}) · Current: {t.venue}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    New Target Venue <span className="text-[#ff5555]">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    required
                    placeholder="e.g. E-Block 102 (Central Robotics Lab)"
                    value={targetVenue}
                    onChange={(e) => setTargetVenue(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4F8CFF] disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Official Reason / Notice to Students <span className="text-[#ff5555]">*</span>
                </label>
                <textarea
                  rows={2}
                  disabled={!isAdmin}
                  required
                  value={shiftReason}
                  onChange={(e) => setShiftReason(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4F8CFF] disabled:opacity-50"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#8c909f]">
                  Logged under: <strong className="text-white">{user.name}</strong> ({user.rollNo})
                </span>
                <button
                  type="submit"
                  disabled={!isAdmin}
                  className="bg-[#528dff] hover:bg-[#afc6ff] disabled:opacity-50 text-[#001a43] px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-lg active:scale-95"
                >
                  Broadcast Relocation
                </button>
              </div>
            </form>
          </div>

          {/* Student Drift Reports Review */}
          <div className="bg-[#101D30] border border-[#424753]/30 rounded-xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f59e0b] text-xl">flag</span>
                <h2 className="font-heading font-bold text-lg text-white">
                  Incoming Student Drift Reports
                </h2>
              </div>
              <span className="text-xs font-mono bg-[#f59e0b]/20 text-[#f59e0b] px-2 py-0.5 rounded">
                {driftReports.length} Dispatched
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {driftReports.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#0a1422] p-4 rounded-xl border border-[#424753]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#4F8CFF]">{r.subjectCode}</span>
                      <span className="text-[#8c909f]">
                        Reported Room: <strong className="text-[#4edea3]">{r.actualRoom}</strong>
                      </span>
                      <span className="text-[10px] font-mono text-[#8c909f]">By: {r.reportedBy}</span>
                    </div>
                    <p className="text-[#c2c6d6] text-[11px]">{r.notes}</p>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApproveDrift(r)}
                        className="bg-[#00a572]/20 hover:bg-[#00a572]/40 text-[#4edea3] border border-[#00a572]/40 px-3 py-1.5 rounded-lg font-mono font-bold transition-colors"
                      >
                        Approve &amp; Apply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-[#101D30] border border-[#424753]/30 rounded-xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4edea3] text-xl">history_edu</span>
              <h2 className="font-heading font-bold text-lg text-white">
                CampusOS Governance Audit Trail
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8c909f]">
              {auditLogs.length} immutable records
            </span>
          </div>

          <div className="space-y-2.5 mt-4 max-h-96 overflow-y-auto">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#0a1422] p-3 rounded-xl border border-[#424753]/20 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#4F8CFF] text-base shrink-0 mt-0.5">
                    history
                  </span>
                  <div>
                    <div className="font-bold text-white">{log.summary}</div>
                    <div className="text-[11px] text-[#c2c6d6] mt-0.5">{log.details}</div>
                    <div className="text-[10px] font-mono text-[#8c909f] mt-1">
                      Executed by: <strong className="text-[#afc6ff]">{log.performedBy}</strong> ({log.userRole})
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-[#8c909f] shrink-0">
                  {new Date(log.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Timetable Slot Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <h3 className="font-heading font-bold text-base text-white">
                {editingSlotId ? 'Edit Timetable Slot' : 'Add New Timetable Slot'}
              </h3>
              <button
                onClick={() => setShowSlotModal(false)}
                className="text-[#8c909f] hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">Day</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value as any)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Period Label
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Period 1"
                    value={slotPeriodLabel}
                    onChange={(e) => setSlotPeriodLabel(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="8.30"
                    value={slotStartTime}
                    onChange={(e) => setSlotStartTime(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="9.20"
                    value={slotEndTime}
                    onChange={(e) => setSlotEndTime(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    value={slotSubjectCode}
                    onChange={(e) => setSlotSubjectCode(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    value={slotSubjectName}
                    onChange={(e) => setSlotSubjectName(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Classroom E-301"
                    value={slotVenue}
                    onChange={(e) => setSlotVenue(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Session Type
                  </label>
                  <select
                    value={slotType}
                    onChange={(e) => setSlotType(e.target.value as any)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="lab">Laboratory (Practical)</option>
                    <option value="library">Library Session</option>
                    <option value="extra_class">Extra Class</option>
                    <option value="tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">Faculty</label>
                  <input
                    type="text"
                    value={slotFaculty}
                    onChange={(e) => setSlotFaculty(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={slotFacultyDept}
                    onChange={(e) => setSlotFacultyDept(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#424753]/30">
                <button
                  type="button"
                  onClick={() => setShowSlotModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-[#8c909f] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-4 py-1.5 rounded-xl text-xs font-bold transition-colors"
                >
                  {editingSlotId ? 'Save Changes' : 'Create Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Slot Confirmation Modal */}
      {deletingSlotId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#101D30] border border-[#ff5555]/50 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3">
            <h3 className="font-heading font-bold text-sm text-white">Delete Timetable Slot?</h3>
            <p className="text-xs text-[#c2c6d6]">
              Are you sure you want to delete this period slot? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingSlotId(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-[#8c909f] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSlot}
                className="bg-[#93000a] hover:bg-[#ff5555] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold"
              >
                Delete Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Destructive Benchmark Reset */}
      <div className="bg-[#93000a]/10 border border-[#93000a]/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-base text-white">
            Reset Demo Database
          </h3>
          <p className="text-xs text-[#c2c6d6] mt-1">
            Restores all timetable slots, assignments, announcements, and audit records back to the pristine PSG Tech benchmark.
          </p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="bg-[#93000a] hover:bg-[#ff5555] text-white px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors shrink-0"
        >
          Reset CampusOS
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#101D30] border border-[#ff5555]/60 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-[#93000a]/20 text-[#ff5555] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Reset All Platform Records?
              </h3>
              <p className="text-xs text-[#c2c6d6] mt-1 leading-relaxed">
                This will revert all modified room relocations, restore initial assignments, and reload default verified dispatches.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="bg-[#16202f] text-[#c2c6d6] px-3.5 py-2 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="bg-[#93000a] hover:bg-[#ff5555] text-white px-3.5 py-2 rounded-xl text-xs font-bold"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
