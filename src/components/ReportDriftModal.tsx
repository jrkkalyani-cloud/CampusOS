import React, { useState } from 'react';
import { campusStorage } from '../services/campusStorage';

interface ReportDriftModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRoll: string;
}

export const ReportDriftModal: React.FC<ReportDriftModalProps> = ({
  isOpen,
  onClose,
  userName,
  userRoll,
}) => {
  const [subjectCode, setSubjectCode] = useState('IC24201');
  const [reportedRoom, setReportedRoom] = useState('E-Block 102');
  const [actualRoom, setActualRoom] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualRoom) return;

    campusStorage.submitDriftReport({
      subjectCode,
      reportedRoom,
      actualRoom,
      notes,
      reportedBy: `${userName} (${userRoll})`,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#424753]/40 bg-[#0a1422] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5555]/20 text-[#ff5555] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">flag</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Report Timetable Drift
              </h3>
              <p className="text-xs text-[#8c909f]">Signal room or schedule discrepancy to CR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c909f] hover:text-white p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-[#00a572]/20 text-[#4edea3] rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h4 className="font-bold text-white text-base">Drift Dispatched!</h4>
            <p className="text-xs text-[#c2c6d6]">
              Your report has been forwarded to Class Rep Dhanush R and logged in the CampusOS audit radar.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                Subject
              </label>
              <select
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-[#d9e3f7] focus:outline-none focus:border-[#4F8CFF]"
              >
                <option value="IC24201">IC24201 — Transducers &amp; Sensors Lab</option>
                <option value="MA24102">MA24102 — Transforms &amp; PDE</option>
                <option value="PH24151">PH24151 — Physics for Measurement Sciences</option>
                <option value="EE24103">EE24103 — Circuit Theory &amp; Network Analysis</option>
                <option value="IC24101">IC24101 — Basics of ICE</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Scheduled Room
                </label>
                <input
                  type="text"
                  value={reportedRoom}
                  onChange={(e) => setReportedRoom(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-[#d9e3f7] focus:outline-none focus:border-[#4F8CFF]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Actual Observed Venue <span className="text-[#ff5555]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-Block 102"
                  value={actualRoom}
                  onChange={(e) => setActualRoom(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#ff5555]/60 rounded-xl px-3 py-2 text-xs text-[#d9e3f7] focus:outline-none focus:border-[#4F8CFF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                Details / Reason (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Lab assistant noted calibrator under maintenance in F-Block..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-2 text-xs text-[#d9e3f7] focus:outline-none focus:border-[#4F8CFF]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#16202f] hover:bg-[#212a39] text-[#c2c6d6] px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
