export type UserRole = 'student' | 'admin';

export type SessionType = 'lecture' | 'lab' | 'library' | 'extra_class' | 'tutorial' | 'break' | 'lunch';

export interface SubjectAttendance {
  subjectCode: string;
  name: string;
  percentage: number;
  attended: number;
  total: number;
  faculty: string;
  room: string;
}

export interface UserProfile {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  department: string;
  deptCode: string;
  section: string;
  batch: string;
  semester: number;
  role: UserRole;
  avatarUrl: string;
  benchGroup: string;
  tutor: {
    name: string;
    cabin: string;
    phone: string;
    email: string;
  };
  attendance: {
    overall: number;
    minRequired: number;
    bunkBufferPeriods: number;
    subjects: SubjectAttendance[];
  };
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  dayCycle: number;
  periodLabel: string;
  periodNumber: number;
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "09:20"
  subjectCode: string;
  subjectName: string;
  faculty: string;
  facultyDept: string;
  venue: string;
  type: SessionType;
  isRelocated?: boolean;
  originalVenue?: string;
  relocationReason?: string;
  relocationSource?: string;
  updatedAt?: string;
  updatedBy?: string;
  notes?: string;
  labSheetId?: string;
  history?: {
    timestamp: string;
    action: string;
    author: string;
    detail: string;
  }[];
}

export interface Assignment {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  instructions: string;
  dueDate: string; // ISO string
  priority: 'urgent' | 'medium' | 'low';
  submissionType: 'physical' | 'online_portal' | 'matlab_code' | 'moodle';
  submissionLocation: string;
  attachmentName?: string;
  attachmentSize?: string;
  attachmentUrl?: string;
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  targetClass: string;
}

export interface StudentTaskProgress {
  assignmentId: string;
  isCompleted: boolean;
  completedAt?: string;
  studentNotes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category:
    | 'urgent'
    | 'timetable_change'
    | 'room_change'
    | 'library'
    | 'extra_class'
    | 'academic'
    | 'exam'
    | 'general';
  author: string;
  authorRole: string;
  affectedClass: string;
  publishedAt: string;
  isUrgent: boolean;
  isVerified: boolean;
  status: 'active' | 'retracted' | 'updated';
  retractionReason?: string;
  auditTrail: {
    action: 'created' | 'edited' | 'retracted';
    timestamp: string;
    performedBy: string;
    details: string;
  }[];
}

export interface Opportunity {
  id: string;
  title: string;
  category: 'hackathon' | 'workshop' | 'internship' | 'research' | 'competition' | 'club_event';
  organizer: string;
  deadline: string;
  eventDate: string;
  eligibility: string;
  perks: string;
  description: string;
  registrationUrl: string;
  isFeatured: boolean;
  tags: string[];
}

export interface AuditLog {
  id: string;
  actionType:
    | 'room_relocation'
    | 'timetable_update'
    | 'assignment_published'
    | 'assignment_cancelled'
    | 'announcement_posted'
    | 'announcement_retracted'
    | 'opportunity_added';
  summary: string;
  details: string;
  performedBy: string;
  userRole: string;
  timestamp: string;
}

export interface DriftReport {
  id: string;
  subjectCode: string;
  reportedRoom: string;
  actualRoom: string;
  notes: string;
  reportedBy: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
}

export type DriveCategory =
  | 'Lab Manuals'
  | 'Question Banks'
  | 'Lecture Notes'
  | 'Reference Books'
  | 'Master Drive';

export interface DriveResource {
  id: string;
  title: string;
  category: DriveCategory;
  url: string;
  size?: string;
  filesCount?: string;
  description: string;
  rootPath?: string;
  visibility?: string;
  updatedAt: string;
  updatedBy: string;
}

