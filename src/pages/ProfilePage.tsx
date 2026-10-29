import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types/campus';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { PWAInstallButton } from '../components/PWAInstallButton';

interface ProfilePageProps {
  user: UserProfile;
  onRoleSwitch: (role: UserRole) => void;
  onOpenReportDrift: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onRoleSwitch,
  onOpenReportDrift,
}) => {
  const isOnline = useOnlineStatus();
  const [bunkCalcSubject, setBunkCalcSubject] = useState(user.attendance.subjects[0].subjectCode);
  const [hypotheticalMissed, setHypotheticalMissed] = useState(1);

  const selectedSubjectData =
    user.attendance.subjects.find((s) => s.subjectCode === bunkCalcSubject) ||
    user.attendance.subjects[0];

  // Calculate simulated attendance if student misses X more classes
  const simulatedAttended = selectedSubjectData.attended;
  const simulatedTotal = selectedSubjectData.total + hypotheticalMissed;
  const simulatedPercentage = ((simulatedAttended / simulatedTotal) * 100).toFixed(1);
  const willFallBelow75 = parseFloat(simulatedPercentage) < 75;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#424753]/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Student Profile &amp; Governance Settings
            </h1>
            <span className="bg-[#528dff]/20 text-[#afc6ff] font-mono text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#528dff]/30">
              PSG Tech ICE-A
            </span>
          </div>
          <p className="text-xs text-[#8c909f] mt-1">
            Personal identity credentials, academic health tracking, tutor communication, and offline PWA cache controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton />
        </div>
      </div>

      {/* Profile Overview Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Card (5 Cols) */}
        <div className="lg:col-span-5 bg-[#101D30] border border-[#424753]/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#528dff]/40 shadow-lg"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl text-white">{user.name}</h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    user.role === 'admin'
                      ? 'bg-[#528dff]/20 text-[#afc6ff] border border-[#528dff]/30'
                      : 'bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/30'
                  }`}
                >
                  {user.role === 'admin' ? 'Class Rep' : 'Student'}
                </span>
              </div>
              <span className="font-mono text-xs text-[#00daf3] mt-0.5">
                Roll No: {user.rollNo} · {user.email}
              </span>
              <span className="text-xs text-[#8c909f] mt-1 leading-snug">
                {user.department}
              </span>
            </div>
          </div>

          <div className="bg-[#0a1422] p-4 rounded-xl border border-[#424753]/30 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#8c909f] uppercase text-[10px] font-mono">Academic Batch</span>
              <div className="text-white font-semibold font-mono">{user.batch} (Sem {user.semester})</div>
            </div>
            <div>
              <span className="text-[#8c909f] uppercase text-[10px] font-mono">Assigned Section</span>
              <div className="text-white font-semibold font-mono">{user.section} (First Year)</div>
            </div>
            <div>
              <span className="text-[#8c909f] uppercase text-[10px] font-mono">Lab Station</span>
              <div className="text-[#4edea3] font-semibold">{user.benchGroup}</div>
            </div>
            <div>
              <span className="text-[#8c909f] uppercase text-[10px] font-mono">Campus Connectivity</span>
              <div className="text-[#00daf3] font-mono flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-sm">wifi</span>
                EDUROAM Online
              </div>
            </div>
          </div>

          {/* Role Switching Section */}
          <div className="border-t border-[#424753]/20 pt-4">
            <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
              <span>Simulate Platform Role</span>
              <span className="text-[10px] text-[#8c909f] font-mono">RBAC Testing</span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-[#0a1422] p-1.5 rounded-xl border border-[#424753]/30">
              <button
                onClick={() => onRoleSwitch('student')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  user.role === 'student'
                    ? 'bg-[#528dff] text-[#001a43] shadow-md'
                    : 'text-[#8c909f] hover:text-white'
                }`}
              >
                Student (Karthik Raja)
              </button>
              <button
                onClick={() => onRoleSwitch('admin')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  user.role === 'admin'
                    ? 'bg-[#528dff] text-[#001a43] shadow-md'
                    : 'text-[#8c909f] hover:text-white'
                }`}
              >
                Class Rep (Dhanush R)
              </button>
            </div>
            <p className="text-[11px] text-[#8c909f] mt-2">
              Switching roles allows you to verify that official actions (room shifts, assignments, dispatches) are restricted exclusively to authorised personnel.
            </p>
          </div>
        </div>

        {/* Class Tutor & Academic Health Panel (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Class Tutor Card */}
          <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4F8CFF] text-xl">contact_mail</span>
                <h3 className="font-heading font-bold text-base text-white">
                  Designated Class Tutor &amp; Mentor
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-[#212a39] text-[#4edea3] px-2 py-0.5 rounded font-bold">
                Available Today
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
              <div>
                <h4 className="text-sm font-bold text-white">{user.tutor.name}</h4>
                <div className="text-xs text-[#8c909f]">Dept. of Instrumentation &amp; Control Engineering</div>
                <div className="text-xs text-[#c2c6d6] mt-1">
                  Cabin: <strong className="text-white">{user.tutor.cabin}</strong> · Phone: <span className="font-mono text-[#4F8CFF]">{user.tutor.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${user.tutor.phone.replace(/[^0-9+]/g, '')}`}
                  className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  <span>Call Tutor</span>
                </a>
                <button
                  onClick={onOpenReportDrift}
                  className="bg-[#16202f] hover:bg-[#212a39] border border-[#424753]/40 text-[#d9e3f7] px-3.5 py-2 rounded-xl text-xs font-semibold"
                >
                  Report Drift
                </button>
              </div>
            </div>
          </div>

          {/* Bunk Buffer Simulator */}
          <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-xl">calculate</span>
                <h3 className="font-heading font-bold text-base text-white">
                  PSG Tech 75% Attendance &amp; Bunk Buffer Calculator
                </h3>
              </div>
              <span className="text-xs font-mono text-[#8c909f]">Simulation Tool</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Select Subject
                </label>
                <select
                  value={bunkCalcSubject}
                  onChange={(e) => setBunkCalcSubject(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {user.attendance.subjects.map((s) => (
                    <option key={s.subjectCode} value={s.subjectCode}>
                      {s.subjectCode} — {s.name} ({s.percentage}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Hypothetical Missed Classes: <span className="text-[#00daf3] font-bold">{hypotheticalMissed}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={hypotheticalMissed}
                  onChange={(e) => setHypotheticalMissed(parseInt(e.target.value, 10))}
                  className="w-full mt-2 accent-[#4F8CFF]"
                />
              </div>
            </div>

            <div className="bg-[#0a1422] p-4 rounded-xl border border-[#424753]/30 mt-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs text-[#8c909f]">Current Attendance:</span>{' '}
                <strong className="text-white">{selectedSubjectData.percentage}%</strong> ({selectedSubjectData.attended}/{selectedSubjectData.total} classes)
              </div>
              <div>
                <span className="text-xs text-[#8c909f]">Projected:</span>{' '}
                <strong className={willFallBelow75 ? 'text-[#ff5555]' : 'text-[#4edea3]'}>
                  {simulatedPercentage}%
                </strong>
                {willFallBelow75 ? (
                  <span className="text-[10px] bg-[#93000a] text-[#ffdad6] px-1.5 py-0.5 rounded font-bold ml-2">
                    CRITICAL WARNING
                  </span>
                ) : (
                  <span className="text-[10px] bg-[#00a572]/20 text-[#4edea3] px-1.5 py-0.5 rounded font-bold ml-2">
                    SAFE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Breakdown Grid */}
      <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4F8CFF] text-xl">analytics</span>
            <h2 className="font-heading font-bold text-lg text-white">
              Official Subject Attendance Roster
            </h2>
          </div>
          <span className="font-mono text-xs text-[#4edea3]">Overall: {user.attendance.overall}%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {user.attendance.subjects.map((sub) => {
            const isRisk = sub.percentage < 80;
            return (
              <div
                key={sub.subjectCode}
                className="bg-[#0a1422] p-4 rounded-xl border border-[#424753]/30 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#4F8CFF]">
                    {sub.subjectCode}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      isRisk ? 'text-[#ff5555]' : 'text-[#4edea3]'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{sub.name}</h4>
                <div className="text-[11px] text-[#8c909f] flex items-center justify-between">
                  <span>Attended: {sub.attended} / {sub.total}</span>
                  <span>Room: {sub.room}</span>
                </div>
                <div className="w-full bg-[#16202f] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isRisk ? 'bg-[#ff5555]' : 'bg-[#4edea3]'}`}
                    style={{ width: `${sub.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PWA & System Health Diagnostics */}
      <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00daf3] text-xl">phonelink_setup</span>
            <h2 className="font-heading font-bold text-lg text-white">
              PWA &amp; Device Architecture Status
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8c909f]">CampusOS Engine</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="bg-[#0a1422] p-3 rounded-xl border border-[#424753]/30 space-y-1">
            <span className="text-[#8c909f] uppercase text-[10px] font-mono">Network Connectivity</span>
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <span
                className={`h-2 w-2 rounded-full ${isOnline ? 'bg-[#4edea3]' : 'bg-[#ff5555]'}`}
              ></span>
              <span>{isOnline ? 'Active Online (Fast)' : 'Offline Caching Active'}</span>
            </div>
            <p className="text-[11px] text-[#8c909f]">Auto-synced with PSG Tech Edge server.</p>
          </div>

          <div className="bg-[#0a1422] p-3 rounded-xl border border-[#424753]/30 space-y-1">
            <span className="text-[#8c909f] uppercase text-[10px] font-mono">Service Worker Cache</span>
            <div className="text-[#4edea3] font-semibold flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-sm">verified</span>
              Precached Assets v4.2.0
            </div>
            <p className="text-[11px] text-[#8c909f]">Supports instant load without network connection.</p>
          </div>

          <div className="bg-[#0a1422] p-3 rounded-xl border border-[#424753]/30 space-y-1">
            <span className="text-[#8c909f] uppercase text-[10px] font-mono">Display Standard</span>
            <div className="text-white font-semibold font-mono">Standalone Web App</div>
            <p className="text-[11px] text-[#8c909f]">Clean native shell on Android &amp; Desktop.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
