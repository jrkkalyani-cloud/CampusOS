import React, { useState } from 'react';
import { TimetableEntry, UserProfile } from '../types/campus';
import { campusStorage } from '../services/campusStorage';
import { MasterMatrixTable } from '../components/dashboard/MasterMatrixTable';

interface TimetablePageProps {
  timetable: TimetableEntry[];
  user: UserProfile;
  onOpenRouteMap: (dest?: string, src?: string) => void;
  onOpenLabSheet: () => void;
  onOpenCalendarSync: () => void;
}

export const TimetablePage: React.FC<TimetablePageProps> = ({
  timetable,
  user,
  onOpenRouteMap,
  onOpenLabSheet,
  onOpenCalendarSync,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSlotForRelocate, setSelectedSlotForRelocate] = useState<TimetableEntry | null>(
    null
  );
  const [newRoom, setNewRoom] = useState('');
  const [relocateReason, setRelocateReason] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState<TimetableEntry | null>(null);

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredEntries = timetable.filter((entry) => {
    if (selectedDay !== 'All' && entry.day !== selectedDay) return false;
    if (typeFilter === 'relocated' && !entry.isRelocated) return false;
    if (typeFilter === 'lab' && entry.type !== 'lab') return false;
    if (typeFilter === 'lecture' && entry.type !== 'lecture') return false;
    if (typeFilter === 'special' && entry.type !== 'library' && entry.type !== 'extra_class')
      return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject =
        entry.subjectCode.toLowerCase().includes(q) || entry.subjectName.toLowerCase().includes(q);
      const matchVenue = entry.venue.toLowerCase().includes(q);
      const matchFaculty = entry.faculty.toLowerCase().includes(q);
      if (!matchSubject && !matchVenue && !matchFaculty) return false;
    }

    return true;
  });

  const handleExecuteRelocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotForRelocate || !newRoom) return;

    campusStorage.relocateRoom(
      selectedSlotForRelocate.id,
      newRoom,
      relocateReason || 'Scheduled venue maintenance & lab apparatus setup',
      `${user.name} (${user.rollNo})`
    );

    setSelectedSlotForRelocate(null);
    setNewRoom('');
    setRelocateReason('');
  };

  const handleResetRelocation = (slot: TimetableEntry) => {
    campusStorage.resetTimetableRelocation(slot.id, `${user.name} (${user.rollNo})`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#424753]/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Class Timetable Matrix
            </h1>
            <span className="bg-[#00a572]/20 text-[#4edea3] font-mono text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#00a572]/30">
              BE ICE Semester 1 · Strength: 60
            </span>
          </div>
          <p className="text-xs text-[#8c909f] mt-1">
            Weekly official schedule for BE Instrumentation &amp; Control Engineering · PSG College of Technology, Coimbatore
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCalendarSync}
            className="bg-[#121c2a] hover:bg-[#16202f] border border-[#424753]/40 text-[#d9e3f7] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-[#4F8CFF]">event</span>
            <span>Sync to iCal</span>
          </button>
        </div>
      </div>

      {/* Official Master 5-Day Grid */}
      <MasterMatrixTable />

      {/* Filter and Search Bar */}
      <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        {/* Day Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors shrink-0 ${
                selectedDay === d
                  ? 'bg-[#528dff] text-[#001a43] font-bold shadow-md'
                  : 'text-[#8c909f] hover:text-white hover:bg-[#16202f]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#0a1422] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-[#d9e3f7] focus:outline-none focus:border-[#4F8CFF]"
          >
            <option value="all">All Session Types</option>
            <option value="relocated">Relocated / Moved Only</option>
            <option value="lab">Laboratories Only</option>
            <option value="lecture">Lectures Only</option>
            <option value="special">Library &amp; Special</option>
          </select>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#8c909f] text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search code or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0a1422] border border-[#424753]/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#d9e3f7] placeholder-[#8c909f] focus:outline-none focus:border-[#4F8CFF] w-48"
            />
          </div>
        </div>
      </div>

      {/* Timetable List Grid */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-12 text-center text-[#8c909f]">
            <span className="material-symbols-outlined text-4xl mb-2 text-[#4F8CFF]">schedule</span>
            <p className="text-sm font-semibold text-white">No timetable sessions found</p>
            <p className="text-xs text-[#8c909f] mt-1">Try adjusting your day or session filter</p>
          </div>
        ) : (
          filteredEntries.map((slot) => {
            const isBreak = slot.type === 'break' || slot.type === 'lunch';

            if (isBreak) {
              return (
                <div
                  key={slot.id}
                  className="bg-[#050e1c]/70 border border-[#424753]/20 rounded-xl px-4 py-2.5 flex items-center justify-between text-[#8c909f]"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#8c909f] min-w-[120px]">
                      {slot.day.slice(0, 3)} {slot.startTime} – {slot.endTime}
                    </span>
                    <span className="text-xs font-semibold text-[#c2c6d6] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#4F8CFF]">
                        {slot.type === 'lunch' ? 'restaurant' : 'local_cafe'}
                      </span>
                      {slot.subjectName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8c909f] hidden sm:inline">
                    {slot.venue}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={slot.id}
                className={`bg-[#101D30] rounded-2xl p-5 border transition-all shadow-md ${
                  slot.isRelocated
                    ? 'border-[#ff5555]/60 hover:border-[#ff5555]'
                    : 'border-[#424753]/30 hover:border-[#4F8CFF]/50'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Column: Day, Period & Subject */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="flex flex-col min-w-[125px]">
                      <span className="text-xs font-bold text-white font-mono">
                        {slot.day}
                      </span>
                      <span className="font-mono text-xs text-[#00daf3] font-semibold">
                        {slot.startTime} – {slot.endTime}
                      </span>
                      <span className="text-[10px] font-mono text-[#8c909f] uppercase mt-0.5">
                        {slot.periodLabel}
                      </span>
                    </div>

                    <div className="h-10 w-px bg-[#424753]/30 hidden md:block"></div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold bg-[#16202f] text-[#4F8CFF] px-2 py-0.5 rounded border border-[#4F8CFF]/30">
                          {slot.subjectCode}
                        </span>
                        <h3 className="font-heading font-bold text-base text-white">
                          {slot.subjectName}
                        </h3>

                        {slot.isRelocated && (
                          <span className="text-[10px] bg-[#93000a] text-[#ffdad6] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                            <span className="material-symbols-outlined text-[11px]">
                              swap_horiz
                            </span>
                            Shifted to {slot.venue}
                          </span>
                        )}

                        <span className="text-[10px] font-mono uppercase bg-[#212a39] text-[#c2c6d6] px-2 py-0.5 rounded">
                          {slot.type.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#8c909f] flex-wrap mt-0.5">
                        <span>
                          Classroom / Lab:{' '}
                          <strong
                            className={
                              slot.isRelocated ? 'text-[#00daf3] font-bold' : 'text-white'
                            }
                          >
                            {slot.venue}
                          </strong>
                          {slot.originalVenue && (
                            <span className="text-[#8c909f] line-through ml-2">
                              (Original: {slot.originalVenue})
                            </span>
                          )}
                        </span>
                        <span>·</span>
                        <span>{slot.faculty} ({slot.facultyDept})</span>
                      </div>

                      {slot.relocationReason && (
                        <div className="bg-[#0a1422] border border-[#ff5555]/30 rounded-lg px-2.5 py-1 text-xs text-[#ffdad6] mt-1">
                          <strong>Relocation Note:</strong> {slot.relocationReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-start md:self-center shrink-0 flex-wrap">
                    {slot.labSheetId && (
                      <button
                        onClick={onOpenLabSheet}
                        className="bg-[#16202f] hover:bg-[#212a39] text-[#d9e3f7] border border-[#424753]/40 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs text-[#4F8CFF]">
                          description
                        </span>
                        <span>Lab Sheet</span>
                      </button>
                    )}

                    {slot.isRelocated && (
                      <button
                        onClick={() => onOpenRouteMap(slot.venue, 'Room E-301')}
                        className="bg-[#00daf3]/10 hover:bg-[#00daf3]/20 text-[#00daf3] border border-[#00daf3]/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">navigation</span>
                        <span>Walking Route</span>
                      </button>
                    )}

                    {slot.history && slot.history.length > 0 && (
                      <button
                        onClick={() => setShowHistoryModal(slot)}
                        className="bg-[#16202f] hover:bg-[#212a39] text-[#8c909f] hover:text-[#d9e3f7] border border-[#424753]/30 px-2.5 py-1.5 rounded-xl text-xs font-mono"
                        title="View audit history"
                      >
                        <span className="material-symbols-outlined text-xs">history</span>
                      </button>
                    )}

                    {/* Admin Relocation Control */}
                    {user.role === 'admin' ? (
                      slot.isRelocated ? (
                        <button
                          onClick={() => handleResetRelocation(slot)}
                          className="bg-[#212a39] hover:bg-[#93000a] text-[#ffdad6] px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#424753]/40 transition-colors"
                        >
                          Revert Room
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedSlotForRelocate(slot);
                            setNewRoom('');
                            setRelocateReason('');
                          }}
                          className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                        >
                          Relocate Room
                        </button>
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Relocate Room Modal (Admin Only) */}
      {selectedSlotForRelocate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <h3 className="font-heading font-bold text-base text-white">
                Relocate {selectedSlotForRelocate.subjectCode} Venue
              </h3>
              <button
                onClick={() => setSelectedSlotForRelocate(null)}
                className="text-[#8c909f] hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleExecuteRelocation} className="space-y-4 mt-4">
              <div className="bg-[#0a1422] p-3 rounded-xl border border-[#424753]/30 text-xs text-[#c2c6d6]">
                <span className="text-[#8c909f]">Current Venue:</span>{' '}
                <strong className="text-white">{selectedSlotForRelocate.venue}</strong> (
                {selectedSlotForRelocate.day} {selectedSlotForRelocate.startTime} -{' '}
                {selectedSlotForRelocate.endTime})
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  New Room / Laboratory <span className="text-[#ff5555]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-Block 102 (Robotics Ctr)"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Reason for Room Shift <span className="text-[#ff5555]">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Calibrator maintenance in F-Block, moved to Robotics Lab"
                  value={relocateReason}
                  onChange={(e) => setRelocateReason(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#4F8CFF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSlotForRelocate(null)}
                  className="bg-[#16202f] text-[#c2c6d6] px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Confirm &amp; Broadcast Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-lg w-full shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <h3 className="font-heading font-bold text-base text-white">
                Change History: {showHistoryModal.subjectCode}
              </h3>
              <button
                onClick={() => setShowHistoryModal(null)}
                className="text-[#8c909f] hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 mt-4 max-h-60 overflow-y-auto">
              {showHistoryModal.history && showHistoryModal.history.length > 0 ? (
                showHistoryModal.history.map((h, i) => (
                  <div
                    key={i}
                    className="bg-[#0a1422] p-3 rounded-xl border border-[#424753]/30 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#8c909f]">
                      <span>{new Date(h.timestamp).toLocaleString()}</span>
                      <span className="text-[#4F8CFF]">By: {h.author}</span>
                    </div>
                    <div className="font-bold text-[#d9e3f7] mt-1">{h.action}</div>
                    <p className="text-[#c2c6d6] text-[11px] mt-0.5">{h.detail}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8c909f]">No modifications on record.</p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(null)}
                className="bg-[#16202f] text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
