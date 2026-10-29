import {
  UserProfile,
  TimetableEntry,
  Assignment,
  StudentTaskProgress,
  Announcement,
  Opportunity,
  AuditLog,
  DriftReport,
  UserRole,
  DriveResource,
} from '../types/campus';
import {
  INITIAL_USER,
  ADMIN_USER,
  INITIAL_TIMETABLE,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_OPPORTUNITIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_DRIVE_RESOURCES,
} from '../data/initialData';

const STORAGE_KEYS = {
  CURRENT_USER: 'campusos_current_user',
  TIMETABLE: 'campusos_timetable_v1',
  ASSIGNMENTS: 'campusos_assignments_v1',
  STUDENT_PROGRESS: 'campusos_student_progress_v1',
  ANNOUNCEMENTS: 'campusos_announcements_v1',
  OPPORTUNITIES: 'campusos_opportunities_v1',
  AUDIT_LOGS: 'campusos_audit_logs_v1',
  DRIFT_REPORTS: 'campusos_drift_reports_v1',
  SELECTED_DAY_CYCLE: 'campusos_selected_day_cycle',
  DRIVE_RESOURCES: 'campusos_drive_resources_v1',
};

// Listeners for multi-component reactive updates
type Listener<T> = (data: T) => void;
const listeners = {
  timetable: new Set<Listener<TimetableEntry[]>>(),
  assignments: new Set<Listener<Assignment[]>>(),
  studentProgress: new Set<Listener<Record<string, StudentTaskProgress>>>(),
  announcements: new Set<Listener<Announcement[]>>(),
  opportunities: new Set<Listener<Opportunity[]>>(),
  auditLogs: new Set<Listener<AuditLog[]>>(),
  user: new Set<Listener<UserProfile>>(),
  driveResources: new Set<Listener<DriveResource[]>>(),
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const campusStorage = {
  // Current User / Session
  getUser(): UserProfile {
    return safeGet<UserProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_USER);
  },

  setUser(user: UserProfile): void {
    safeSet(STORAGE_KEYS.CURRENT_USER, user);
    listeners.user.forEach((cb) => cb(user));
  },

  switchRole(role: UserRole): UserProfile {
    const targetUser = role === 'admin' ? ADMIN_USER : INITIAL_USER;
    this.setUser(targetUser);
    return targetUser;
  },

  subscribeUser(cb: Listener<UserProfile>): () => void {
    listeners.user.add(cb);
    return () => listeners.user.delete(cb);
  },

  // Timetable
  getTimetable(): TimetableEntry[] {
    return safeGet<TimetableEntry[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  },

  setTimetable(data: TimetableEntry[]): void {
    safeSet(STORAGE_KEYS.TIMETABLE, data);
    listeners.timetable.forEach((cb) => cb(data));
  },

  subscribeTimetable(cb: Listener<TimetableEntry[]>): () => void {
    listeners.timetable.add(cb);
    return () => listeners.timetable.delete(cb);
  },

  relocateRoom(slotId: string, newRoom: string, reason: string, updatedBy: string): boolean {
    const entries = this.getTimetable();
    const index = entries.findIndex((e) => e.id === slotId);
    if (index === -1) return false;

    const original = entries[index];
    const prevVenue = original.originalVenue || original.venue;
    const now = new Date().toISOString();

    const updatedEntry: TimetableEntry = {
      ...original,
      venue: newRoom,
      originalVenue: prevVenue,
      isRelocated: true,
      relocationReason: reason,
      relocationSource: `${updatedBy}`,
      updatedAt: now,
      updatedBy: updatedBy,
      history: [
        ...(original.history || []),
        {
          timestamp: now,
          action: 'Room Relocation Overwrite',
          author: updatedBy,
          detail: `Relocated from ${original.venue} to ${newRoom}. Reason: ${reason}`,
        },
      ],
    };

    entries[index] = updatedEntry;
    this.setTimetable(entries);

    // Also auto-generate an announcement and audit log for high transparency!
    this.addAnnouncement({
      title: `URGENT RELOCATION: ${original.subjectCode} ${original.subjectName} moved to ${newRoom}`,
      content: `Official relocation notice: ${original.subjectCode} (${original.periodLabel}) has been relocated from ${original.venue} to ${newRoom}. Reason: ${reason}. Please update your bench groups accordingly.`,
      category: 'room_change',
      author: updatedBy,
      authorRole: 'Class Rep / Authorized Faculty',
      affectedClass: 'ICE-A',
      isUrgent: true,
      isVerified: true,
      status: 'active',
    });

    this.addAuditLog({
      actionType: 'room_relocation',
      summary: `Relocated ${original.subjectCode} to ${newRoom}`,
      details: `From ${original.venue} to ${newRoom}. Reason: ${reason}`,
      performedBy: updatedBy,
      userRole: 'admin',
    });

    return true;
  },

  resetTimetableRelocation(slotId: string, updatedBy: string): boolean {
    const entries = this.getTimetable();
    const index = entries.findIndex((e) => e.id === slotId);
    if (index === -1) return false;

    const original = entries[index];
    if (!original.isRelocated || !original.originalVenue) return false;

    const now = new Date().toISOString();
    const prevRoom = original.venue;
    const restoredRoom = original.originalVenue;

    entries[index] = {
      ...original,
      venue: restoredRoom,
      isRelocated: false,
      relocationReason: undefined,
      updatedAt: now,
      updatedBy: updatedBy,
      history: [
        ...(original.history || []),
        {
          timestamp: now,
          action: 'Room Restored to Default',
          author: updatedBy,
          detail: `Restored to original venue ${restoredRoom} from ${prevRoom}`,
        },
      ],
    };

    this.setTimetable(entries);

    this.addAuditLog({
      actionType: 'room_relocation',
      summary: `Restored ${original.subjectCode} to ${restoredRoom}`,
      details: `Reverted temporary drift back to ${restoredRoom}`,
      performedBy: updatedBy,
      userRole: 'admin',
    });

    return true;
  },

  addTimetableEntry(entry: Omit<TimetableEntry, 'id'>, author: string): TimetableEntry {
    const list = this.getTimetable();
    const newEntry: TimetableEntry = {
      ...entry,
      id: `tt_${entry.day.toLowerCase().slice(0, 3)}_${entry.periodNumber}_${Date.now()}`,
      updatedAt: new Date().toISOString(),
      updatedBy: author,
      history: [
        {
          timestamp: new Date().toISOString(),
          action: 'Slot Created',
          author: author,
          detail: `Added ${entry.subjectCode} (${entry.venue})`,
        },
      ],
    };
    list.push(newEntry);
    this.setTimetable(list);

    this.addAuditLog({
      actionType: 'timetable_update',
      summary: `Added timetable slot: ${entry.subjectCode} (${entry.day} ${entry.periodLabel})`,
      details: `Venue: ${entry.venue}, Type: ${entry.type}, Faculty: ${entry.faculty}`,
      performedBy: author,
      userRole: 'admin',
    });

    return newEntry;
  },

  updateTimetableEntry(id: string, updates: Partial<TimetableEntry>, author: string): boolean {
    const list = this.getTimetable();
    const index = list.findIndex((e) => e.id === id);
    if (index === -1) return false;

    const original = list[index];
    const now = new Date().toISOString();
    list[index] = {
      ...original,
      ...updates,
      updatedAt: now,
      updatedBy: author,
      history: [
        ...(original.history || []),
        {
          timestamp: now,
          action: 'Slot Updated',
          author: author,
          detail: `Updated properties: ${Object.keys(updates).join(', ')}`,
        },
      ],
    };
    this.setTimetable(list);

    this.addAuditLog({
      actionType: 'timetable_update',
      summary: `Updated timetable slot: ${list[index].subjectCode} (${list[index].day})`,
      details: `Modified slot ID: ${id}`,
      performedBy: author,
      userRole: 'admin',
    });

    return true;
  },

  deleteTimetableEntry(id: string, author: string): boolean {
    const list = this.getTimetable();
    const target = list.find((e) => e.id === id);
    if (!target) return false;

    const updated = list.filter((e) => e.id !== id);
    this.setTimetable(updated);

    this.addAuditLog({
      actionType: 'timetable_update',
      summary: `Removed timetable slot: ${target.subjectCode} (${target.day} ${target.periodLabel})`,
      details: `Deleted slot from ${target.venue}`,
      performedBy: author,
      userRole: 'admin',
    });

    return true;
  },

  copyDayTimetable(
    fromDay: TimetableEntry['day'],
    toDay: TimetableEntry['day'],
    toCycle: number,
    author: string
  ): number {
    const list = this.getTimetable();
    const sourceSlots = list.filter((e) => e.day === fromDay);
    if (sourceSlots.length === 0) return 0;

    // Filter out existing slots for toDay
    const remaining = list.filter((e) => e.day !== toDay);
    const now = new Date().toISOString();

    const cloned = sourceSlots.map((slot) => ({
      ...slot,
      id: `tt_${toDay.toLowerCase().slice(0, 3)}_${slot.periodNumber}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      day: toDay,
      dayCycle: toCycle,
      updatedAt: now,
      updatedBy: author,
      history: [
        {
          timestamp: now,
          action: `Copied Schedule from ${fromDay}`,
          author: author,
          detail: `Replicated day template`,
        },
      ],
    }));

    const result = [...remaining, ...cloned];
    this.setTimetable(result);

    this.addAuditLog({
      actionType: 'timetable_update',
      summary: `Copied ${fromDay} schedule to ${toDay}`,
      details: `Replicated ${cloned.length} timetable periods from ${fromDay} into ${toDay} (Cycle ${toCycle})`,
      performedBy: author,
      userRole: 'admin',
    });

    return cloned.length;
  },

  // Assignments
  getAssignments(): Assignment[] {
    return safeGet<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  },

  setAssignments(data: Assignment[]): void {
    safeSet(STORAGE_KEYS.ASSIGNMENTS, data);
    listeners.assignments.forEach((cb) => cb(data));
  },

  subscribeAssignments(cb: Listener<Assignment[]>): () => void {
    listeners.assignments.add(cb);
    return () => listeners.assignments.delete(cb);
  },

  addAssignment(data: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>): Assignment {
    const assignments = this.getAssignments();
    const now = new Date().toISOString();
    const newAssignment: Assignment = {
      ...data,
      id: `asgn_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    assignments.unshift(newAssignment);
    this.setAssignments(assignments);

    this.addAuditLog({
      actionType: 'assignment_published',
      summary: `Published assignment: ${newAssignment.title}`,
      details: `Subject: ${newAssignment.subjectCode}, Due: ${newAssignment.dueDate}`,
      performedBy: data.createdBy,
      userRole: 'admin',
    });

    return newAssignment;
  },

  updateAssignment(id: string, updates: Partial<Assignment>, performedBy: string): Assignment | null {
    const assignments = this.getAssignments();
    const index = assignments.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const updated = {
      ...assignments[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    assignments[index] = updated;
    this.setAssignments(assignments);

    this.addAuditLog({
      actionType: 'assignment_published',
      summary: `Updated assignment: ${updated.title}`,
      details: `Changes applied by ${performedBy}`,
      performedBy: performedBy,
      userRole: 'admin',
    });

    return updated;
  },

  deleteAssignment(id: string, performedBy: string): boolean {
    const assignments = this.getAssignments();
    const item = assignments.find((a) => a.id === id);
    if (!item) return false;

    const filtered = assignments.filter((a) => a.id !== id);
    this.setAssignments(filtered);

    this.addAuditLog({
      actionType: 'assignment_cancelled',
      summary: `Cancelled / deleted assignment: ${item.title}`,
      details: `Assignment ${item.id} removed from official active roster`,
      performedBy: performedBy,
      userRole: 'admin',
    });

    return true;
  },

  // Student Task Completion Progress (Student-controlled)
  getStudentProgress(): Record<string, StudentTaskProgress> {
    const fallback: Record<string, StudentTaskProgress> = {
      asgn_1: {
        assignmentId: 'asgn_1',
        isCompleted: false,
        studentNotes: 'Working on Strain gauge table calculation in Excel',
      },
    };
    return safeGet<Record<string, StudentTaskProgress>>(STORAGE_KEYS.STUDENT_PROGRESS, fallback);
  },

  toggleStudentTaskCompletion(assignmentId: string, notes?: string): boolean {
    const progress = this.getStudentProgress();
    const current = progress[assignmentId];
    const willBeCompleted = !current?.isCompleted;

    progress[assignmentId] = {
      assignmentId,
      isCompleted: willBeCompleted,
      completedAt: willBeCompleted ? new Date().toISOString() : undefined,
      studentNotes: notes !== undefined ? notes : current?.studentNotes,
    };

    safeSet(STORAGE_KEYS.STUDENT_PROGRESS, progress);
    listeners.studentProgress.forEach((cb) => cb(progress));
    return willBeCompleted;
  },

  subscribeStudentProgress(cb: Listener<Record<string, StudentTaskProgress>>): () => void {
    listeners.studentProgress.add(cb);
    return () => listeners.studentProgress.delete(cb);
  },

  // Announcements
  getAnnouncements(): Announcement[] {
    return safeGet<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  setAnnouncements(data: Announcement[]): void {
    safeSet(STORAGE_KEYS.ANNOUNCEMENTS, data);
    listeners.announcements.forEach((cb) => cb(data));
  },

  subscribeAnnouncements(cb: Listener<Announcement[]>): () => void {
    listeners.announcements.add(cb);
    return () => listeners.announcements.delete(cb);
  },

  addAnnouncement(
    data: Omit<Announcement, 'id' | 'publishedAt' | 'auditTrail'>
  ): Announcement {
    const list = this.getAnnouncements();
    const now = new Date().toISOString();
    const newAnn: Announcement = {
      ...data,
      id: `ann_${Date.now()}`,
      publishedAt: now,
      auditTrail: [
        {
          action: 'created',
          timestamp: now,
          performedBy: data.author,
          details: 'Official announcement published to CampusOS feed',
        },
      ],
    };
    list.unshift(newAnn);
    this.setAnnouncements(list);

    this.addAuditLog({
      actionType: 'announcement_posted',
      summary: `Broadcasted announcement: ${newAnn.title}`,
      details: `Category: ${newAnn.category}, Affected: ${newAnn.affectedClass}`,
      performedBy: data.author,
      userRole: 'admin',
    });

    return newAnn;
  },

  updateAnnouncement(
    id: string,
    updates: Partial<Announcement>,
    performedBy: string
  ): boolean {
    const list = this.getAnnouncements();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) return false;

    const target = list[index];
    const now = new Date().toISOString();

    list[index] = {
      ...target,
      ...updates,
      status: 'updated',
      auditTrail: [
        ...(target.auditTrail || []),
        {
          action: 'edited',
          timestamp: now,
          performedBy,
          details: `Updated announcement fields: ${Object.keys(updates).join(', ')}`,
        },
      ],
    };

    this.setAnnouncements(list);

    this.addAuditLog({
      actionType: 'announcement_posted',
      summary: `Updated bulletin: ${list[index].title}`,
      details: `Modified by ${performedBy}`,
      performedBy,
      userRole: 'admin',
    });

    return true;
  },

  retractAnnouncement(id: string, reason: string, performedBy: string): boolean {
    const list = this.getAnnouncements();
    const index = list.findIndex((a) => a.id === id);
    if (index === -1) return false;

    const target = list[index];
    const now = new Date().toISOString();

    list[index] = {
      ...target,
      status: 'retracted',
      retractionReason: reason,
      auditTrail: [
        ...target.auditTrail,
        {
          action: 'retracted',
          timestamp: now,
          performedBy,
          details: `Retracted. Reason: ${reason}`,
        },
      ],
    };

    this.setAnnouncements(list);

    this.addAuditLog({
      actionType: 'announcement_retracted',
      summary: `Retracted announcement: ${target.title}`,
      details: `Reason: ${reason}`,
      performedBy,
      userRole: 'admin',
    });

    return true;
  },

  // Opportunities
  getOpportunities(): Opportunity[] {
    return safeGet<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
  },

  setOpportunities(data: Opportunity[]): void {
    safeSet(STORAGE_KEYS.OPPORTUNITIES, data);
    listeners.opportunities.forEach((cb) => cb(data));
  },

  subscribeOpportunities(cb: Listener<Opportunity[]>): () => void {
    listeners.opportunities.add(cb);
    return () => listeners.opportunities.delete(cb);
  },

  addOpportunity(data: Omit<Opportunity, 'id'>, performedBy: string): Opportunity {
    const list = this.getOpportunities();
    const newOpp: Opportunity = {
      ...data,
      id: `opp_${Date.now()}`,
    };
    list.unshift(newOpp);
    this.setOpportunities(list);

    this.addAuditLog({
      actionType: 'opportunity_added',
      summary: `Posted Opportunity: ${newOpp.title}`,
      details: `Organizer: ${newOpp.organizer}, Deadline: ${newOpp.deadline}`,
      performedBy,
      userRole: 'admin',
    });

    return newOpp;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return safeGet<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, logs);
    listeners.auditLogs.forEach((cb) => cb(logs));
    return newLog;
  },

  subscribeAuditLogs(cb: Listener<AuditLog[]>): () => void {
    listeners.auditLogs.add(cb);
    return () => listeners.auditLogs.delete(cb);
  },

  // Drift Reports (from students to class reps)
  getDriftReports(): DriftReport[] {
    return safeGet<DriftReport[]>(STORAGE_KEYS.DRIFT_REPORTS, [
      {
        id: 'drift_1',
        subjectCode: 'IC24201',
        reportedRoom: 'E-Block 102',
        actualRoom: 'E-Block 102',
        notes: 'Prof. Ramanathan instructed all benches to move from F-204 due to dead weight tester repair.',
        reportedBy: 'Karthik Raja V (24I108)',
        timestamp: '2026-10-29T08:10:00',
        status: 'verified',
      },
    ]);
  },

  submitDriftReport(report: Omit<DriftReport, 'id' | 'timestamp' | 'status'>): DriftReport {
    const reports = this.getDriftReports();
    const newReport: DriftReport = {
      ...report,
      id: `drift_${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    reports.unshift(newReport);
    safeSet(STORAGE_KEYS.DRIFT_REPORTS, reports);
    return newReport;
  },

  // Google Drive Study Vault
  getDriveResources(): DriveResource[] {
    return safeGet<DriveResource[]>(STORAGE_KEYS.DRIVE_RESOURCES, INITIAL_DRIVE_RESOURCES);
  },

  setDriveResources(data: DriveResource[]): void {
    safeSet(STORAGE_KEYS.DRIVE_RESOURCES, data);
    listeners.driveResources.forEach((cb) => cb(data));
  },

  subscribeDriveResources(cb: Listener<DriveResource[]>): () => void {
    listeners.driveResources.add(cb);
    return () => listeners.driveResources.delete(cb);
  },

  addDriveResource(
    item: Omit<DriveResource, 'id' | 'updatedAt'>,
    author: string
  ): DriveResource {
    const list = this.getDriveResources();
    const newResource: DriveResource = {
      ...item,
      id: `drive_${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newResource);
    this.setDriveResources(list);

    this.addAuditLog({
      actionType: 'opportunity_added',
      summary: `Added Google Drive Link: ${item.title}`,
      details: `Folder linked under [${item.category}]: ${item.url}`,
      performedBy: author,
      userRole: 'admin',
    });

    return newResource;
  },

  updateDriveResource(
    id: string,
    updates: Partial<DriveResource>,
    author: string
  ): void {
    const list = this.getDriveResources();
    const index = list.findIndex((r) => r.id === id);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: author,
      };
      this.setDriveResources(list);

      this.addAuditLog({
        actionType: 'opportunity_added',
        summary: `Updated Google Drive Resource: ${list[index].title}`,
        details: `Updated parameters for folder ID: ${id}`,
        performedBy: author,
        userRole: 'admin',
      });
    }
  },

  deleteDriveResource(id: string, author: string): void {
    const list = this.getDriveResources();
    const target = list.find((r) => r.id === id);
    const updated = list.filter((r) => r.id !== id);
    this.setDriveResources(updated);

    if (target) {
      this.addAuditLog({
        actionType: 'opportunity_added',
        summary: `Removed Google Drive Resource: ${target.title}`,
        details: `Deleted link for folder ${target.url}`,
        performedBy: author,
        userRole: 'admin',
      });
    }
  },

  // Reset to initial demo dataset
  resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.TIMETABLE);
    localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.OPPORTUNITIES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.DRIFT_REPORTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.DRIVE_RESOURCES);

    this.setUser(INITIAL_USER);
    this.setTimetable(INITIAL_TIMETABLE);
    this.setAssignments(INITIAL_ASSIGNMENTS);
    this.setAnnouncements(INITIAL_ANNOUNCEMENTS);
    this.setOpportunities(INITIAL_OPPORTUNITIES);
    this.setDriveResources(INITIAL_DRIVE_RESOURCES);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    listeners.auditLogs.forEach((cb) => cb(INITIAL_AUDIT_LOGS));
  },
};
