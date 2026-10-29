import React, { useState } from 'react';
import { Assignment, StudentTaskProgress, UserProfile } from '../types/campus';
import { campusStorage } from '../services/campusStorage';

interface AssignmentsPageProps {
  assignments: Assignment[];
  studentProgress: Record<string, StudentTaskProgress>;
  user: UserProfile;
  onToggleComplete: (id: string, notes?: string) => void;
  onOpenLabSheet: () => void;
}

export const AssignmentsPage: React.FC<AssignmentsPageProps> = ({
  assignments,
  studentProgress,
  user,
  onToggleComplete,
  onOpenLabSheet,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'completed' | 'urgent'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);

  // Form State
  const [formSubjectCode, setFormSubjectCode] = useState('23U111');
  const [formSubjectName, setFormSubjectName] = useState('Circuits and Devices Laboratory');
  const [formTitle, setFormTitle] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formPriority, setFormPriority] = useState<'urgent' | 'medium' | 'low'>('medium');
  const [formSubmissionType, setFormSubmissionType] = useState<
    'physical' | 'online_portal' | 'matlab_code' | 'moodle'
  >('physical');
  const [formLocation, setFormLocation] = useState('Circuits Lab / Staff Desk');
  const [formAttachmentName, setFormAttachmentName] = useState('Experiment_5_Observation.pdf');

  // Student Note Editor
  const [editingNoteForId, setEditingNoteForId] = useState<string | null>(null);
  const [studentNoteInput, setStudentNoteInput] = useState('');

  const subjects = [
    'all',
    '23U101',
    '23U102',
    '23U103',
    '23U104',
    '23U110',
    '23U111',
    '23G105',
    'LIB',
    'TWM',
  ];

  const filteredAssignments = assignments.filter((a) => {
    const isDone = studentProgress[a.id]?.isCompleted || false;

    if (filterTab === 'pending' && isDone) return false;
    if (filterTab === 'completed' && !isDone) return false;
    if (filterTab === 'urgent' && a.priority !== 'urgent') return false;

    if (selectedSubject !== 'all' && a.subjectCode !== selectedSubject) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchSub = a.subjectCode.toLowerCase().includes(q) || a.subjectName.toLowerCase().includes(q);
      const matchInstr = a.instructions.toLowerCase().includes(q);
      if (!matchTitle && !matchSub && !matchInstr) return false;
    }

    return true;
  });

  const handleOpenCreate = () => {
    setEditingAssignment(null);
    setFormTitle('');
    setFormInstructions('');
    setFormDueDate('2026-11-05T17:00');
    setFormPriority('medium');
    setFormSubmissionType('physical');
    setFormLocation('ICE Dept Office');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (asgn: Assignment) => {
    setEditingAssignment(asgn);
    setFormSubjectCode(asgn.subjectCode);
    setFormSubjectName(asgn.subjectName);
    setFormTitle(asgn.title);
    setFormInstructions(asgn.instructions);
    setFormDueDate(asgn.dueDate.slice(0, 16));
    setFormPriority(asgn.priority);
    setFormSubmissionType(asgn.submissionType);
    setFormLocation(asgn.submissionLocation);
    setFormAttachmentName(asgn.attachmentName || '');
    setShowCreateModal(true);
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDueDate) return;

    if (editingAssignment) {
      campusStorage.updateAssignment(
        editingAssignment.id,
        {
          subjectCode: formSubjectCode,
          subjectName: formSubjectName,
          title: formTitle,
          instructions: formInstructions,
          dueDate: formDueDate,
          priority: formPriority,
          submissionType: formSubmissionType,
          submissionLocation: formLocation,
          attachmentName: formAttachmentName,
        },
        `${user.name} (${user.rollNo})`
      );
    } else {
      campusStorage.addAssignment({
        subjectCode: formSubjectCode,
        subjectName: formSubjectName,
        title: formTitle,
        instructions: formInstructions,
        dueDate: formDueDate,
        priority: formPriority,
        submissionType: formSubmissionType,
        submissionLocation: formLocation,
        attachmentName: formAttachmentName,
        status: 'published',
        createdBy: `${user.name} (${user.rollNo})`,
        targetClass: 'ICE-A',
      });
    }

    setShowCreateModal(false);
  };

  const handleConfirmDelete = () => {
    if (!deletingAssignment) return;
    campusStorage.deleteAssignment(deletingAssignment.id, `${user.name} (${user.rollNo})`);
    setDeletingAssignment(null);
  };

  const handleSaveStudentNote = (asgnId: string) => {
    onToggleComplete(asgnId, studentNoteInput);
    setEditingNoteForId(null);
    setStudentNoteInput('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#424753]/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Assignments &amp; Lab Submissions
            </h1>
            <span className="bg-[#93000a] text-[#ffdad6] font-mono text-xs px-2.5 py-0.5 rounded-full font-bold">
              {assignments.length} Official Tasks
            </span>
          </div>
          <p className="text-xs text-[#8c909f] mt-1">
            Track official deadlines, lab report formats, and mark your personal completion status.
          </p>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={handleOpenCreate}
            className="bg-[#4F8CFF] hover:bg-[#528dff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <span className="material-symbols-outlined text-sm">add_task</span>
            <span>Create Assignment</span>
          </button>
        )}
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-[#0a1422] p-1 rounded-xl">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTab === 'all'
                ? 'bg-[#528dff] text-[#001a43] font-bold shadow-sm'
                : 'text-[#8c909f] hover:text-white'
            }`}
          >
            All Tasks ({assignments.length})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTab === 'pending'
                ? 'bg-[#528dff] text-[#001a43] font-bold shadow-sm'
                : 'text-[#8c909f] hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTab === 'completed'
                ? 'bg-[#528dff] text-[#001a43] font-bold shadow-sm'
                : 'text-[#8c909f] hover:text-white'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterTab('urgent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterTab === 'urgent'
                ? 'bg-[#93000a] text-[#ffdad6] font-bold shadow-sm'
                : 'text-[#ff5555] hover:text-white'
            }`}
          >
            Urgent Only
          </button>
        </div>

        {/* Subject Filter & Search */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-[#0a1422] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-[#d9e3f7] focus:outline-none focus:border-[#4F8CFF]"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Subjects' : s}
              </option>
            ))}
          </select>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#8c909f] text-sm">
              search
            </span>
            <input
              type="text"
              placeholder="Search assignment title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0a1422] border border-[#424753]/40 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#d9e3f7] placeholder-[#8c909f] focus:outline-none focus:border-[#4F8CFF] w-48"
            />
          </div>
        </div>
      </div>

      {/* Assignment Cards Grid */}
      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-[#101D30] border border-[#424753]/30 rounded-2xl p-12 text-center text-[#8c909f]">
            <span className="material-symbols-outlined text-4xl mb-2 text-[#4edea3]">task_alt</span>
            <p className="text-sm font-semibold text-white">No assignments match your filter</p>
            <p className="text-xs text-[#8c909f] mt-1">All filtered tasks are cleared or none found.</p>
          </div>
        ) : (
          filteredAssignments.map((asgn) => {
            const progress = studentProgress[asgn.id];
            const isDone = progress?.isCompleted || false;
            const isUrgent = asgn.priority === 'urgent';
            const dueDateFormatted = new Date(asgn.dueDate).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={asgn.id}
                className={`bg-[#101D30] rounded-2xl p-5 border transition-all shadow-md ${
                  isDone
                    ? 'border-[#00a572]/40 opacity-80'
                    : isUrgent
                    ? 'border-[#ff5555]/60 hover:border-[#ff5555]'
                    : 'border-[#424753]/30 hover:border-[#4F8CFF]/50'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Subject, Title & Instructions */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold bg-[#16202f] text-[#4F8CFF] px-2 py-0.5 rounded border border-[#4F8CFF]/30">
                        {asgn.subjectCode}
                      </span>
                      <span className="text-xs text-[#8c909f] font-mono">{asgn.subjectName}</span>

                      {/* Priority Badge */}
                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                          isUrgent
                            ? 'bg-[#93000a] text-[#ffdad6]'
                            : asgn.priority === 'medium'
                            ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                            : 'bg-[#212a39] text-[#c2c6d6]'
                        }`}
                      >
                        {asgn.priority} Priority
                      </span>

                      {/* Submission Type */}
                      <span className="text-[10px] font-mono uppercase bg-[#212a39] text-[#00daf3] px-2 py-0.5 rounded border border-[#00daf3]/30">
                        {asgn.submissionType.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-lg text-white leading-snug">
                      {asgn.title}
                    </h3>

                    <p className="text-xs text-[#c2c6d6] leading-relaxed">
                      {asgn.instructions}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#8c909f] pt-1 flex-wrap font-mono">
                      <span className="text-[#d9e3f7] flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#4F8CFF]">location_on</span>
                        Submission Desk: <strong className="text-white">{asgn.submissionLocation}</strong>
                      </span>

                      {asgn.attachmentName && (
                        <button
                          onClick={() => {
                            if (asgn.subjectCode === 'IC24201') onOpenLabSheet();
                            else alert(`Opening attachment: ${asgn.attachmentName}`);
                          }}
                          className="text-[#00daf3] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span className="material-symbols-outlined text-sm">attach_file</span>
                          {asgn.attachmentName} {asgn.attachmentSize ? `(${asgn.attachmentSize})` : ''}
                        </button>
                      )}
                    </div>

                    {/* Student Personal Notes */}
                    <div className="bg-[#0a1422] p-2.5 rounded-xl border border-[#424753]/30 mt-2 text-xs">
                      {editingNoteForId === asgn.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Add your personal note or progress reminder..."
                            value={studentNoteInput}
                            onChange={(e) => setStudentNoteInput(e.target.value)}
                            className="w-full bg-[#16202f] border border-[#424753]/50 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveStudentNote(asgn.id)}
                            className="bg-[#528dff] text-[#001a43] px-2.5 py-1 rounded-lg text-xs font-bold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNoteForId(null)}
                            className="text-[#8c909f] hover:text-white px-1.5"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-[#8c909f] text-[11px]">
                            <strong className="text-[#c2c6d6]">Student Checklist Note:</strong>{' '}
                            {progress?.studentNotes || 'No custom notes added.'}
                          </span>
                          <button
                            onClick={() => {
                              setEditingNoteForId(asgn.id);
                              setStudentNoteInput(progress?.studentNotes || '');
                            }}
                            className="text-[10px] text-[#4F8CFF] hover:underline ml-2"
                          >
                            Edit Note
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Due Date, Completion Toggle & Admin Controls */}
                  <div className="flex flex-col items-start md:items-end justify-between gap-3 shrink-0">
                    <div className="flex flex-col md:text-right">
                      <span className="text-[10px] font-mono text-[#8c909f] uppercase">
                        Due Cutoff
                      </span>
                      <span
                        className={`font-mono text-xs font-bold ${
                          isUrgent && !isDone ? 'text-[#ff5555]' : 'text-white'
                        }`}
                      >
                        {dueDateFormatted}
                      </span>
                    </div>

                    {/* Student Mark Completed Toggle */}
                    <button
                      onClick={() => onToggleComplete(asgn.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                        isDone
                          ? 'bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/50 hover:bg-[#00a572]/30'
                          : 'bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] shadow-md'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isDone ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>{isDone ? 'Completed by You' : 'Mark Completed'}</span>
                    </button>

                    {/* Admin Actions */}
                    {user.role === 'admin' && (
                      <div className="flex items-center gap-1 pt-1 border-t border-[#424753]/20 w-full justify-end">
                        <button
                          onClick={() => handleOpenEdit(asgn)}
                          className="text-xs text-[#8c909f] hover:text-[#4F8CFF] p-1 font-mono flex items-center gap-0.5"
                          title="Edit assignment"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletingAssignment(asgn)}
                          className="text-xs text-[#8c909f] hover:text-[#ff5555] p-1 font-mono flex items-center gap-0.5"
                          title="Cancel assignment"
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal (Admin Only) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#101D30] border border-[#424753]/60 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#424753]/30">
              <h3 className="font-heading font-bold text-base text-white">
                {editingAssignment ? 'Edit Assignment' : 'Publish New Assignment'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#8c909f] hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubjectCode}
                    onChange={(e) => setFormSubjectCode(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) =>
                      setFormPriority(e.target.value as 'urgent' | 'medium' | 'low')
                    }
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Subject Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formSubjectName}
                  onChange={(e) => setFormSubjectName(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Assignment Title <span className="text-[#ff5555]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sensors Lab Record #5"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Instructions &amp; Requirements
                </label>
                <textarea
                  rows={3}
                  required
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Due Date &amp; Time <span className="text-[#ff5555]">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                    Submission Mode
                  </label>
                  <select
                    value={formSubmissionType}
                    onChange={(e) =>
                      setFormSubmissionType(
                        e.target.value as 'physical' | 'online_portal' | 'matlab_code' | 'moodle'
                      )
                    }
                    className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="physical">Physical Note</option>
                    <option value="online_portal">Student Portal</option>
                    <option value="matlab_code">MATLAB Script</option>
                    <option value="moodle">PSG Moodle</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8c909f] mb-1">
                  Submission Location Desk
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full bg-[#16202f] border border-[#424753]/40 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#424753]/30">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-[#16202f] text-[#c2c6d6] px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#528dff] hover:bg-[#afc6ff] text-[#001a43] px-4 py-2 rounded-xl text-xs font-bold"
                >
                  {editingAssignment ? 'Save Changes' : 'Publish Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#101D30] border border-[#ff5555]/60 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-[#93000a]/20 text-[#ff5555] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">warning</span>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Cancel Assignment?
              </h3>
              <p className="text-xs text-[#c2c6d6] mt-1 leading-relaxed">
                Are you sure you want to retract and cancel{' '}
                <strong className="text-white">&quot;{deletingAssignment.title}&quot;</strong>? This
                action will be permanently recorded in the CampusOS audit trail.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingAssignment(null)}
                className="bg-[#16202f] text-[#c2c6d6] px-3.5 py-2 rounded-xl text-xs font-semibold"
              >
                No, Keep
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-[#93000a] hover:bg-[#ff5555] text-white px-3.5 py-2 rounded-xl text-xs font-bold"
              >
                Yes, Cancel Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
