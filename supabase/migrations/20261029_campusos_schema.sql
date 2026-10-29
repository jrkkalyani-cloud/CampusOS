-- ==============================================================================
-- CAMPUSOS DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) FOR SUPABASE POSTGRESQL
-- Department of Instrumentation and Control Engineering, PSG College of Technology
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_type AS ENUM ('lecture', 'lab', 'library', 'extra_class', 'tutorial', 'break', 'lunch');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('urgent', 'medium', 'low');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    roll_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL DEFAULT 'Instrumentation & Control Engineering',
    dept_code TEXT NOT NULL DEFAULT 'ICE',
    section TEXT NOT NULL DEFAULT 'ICE-A',
    batch TEXT NOT NULL DEFAULT '2024-2028',
    semester INTEGER NOT NULL DEFAULT 1,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TIMETABLE ENTRIES
CREATE TABLE IF NOT EXISTS public.timetable_entries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    day TEXT NOT NULL, -- 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
    day_cycle INTEGER NOT NULL DEFAULT 1,
    period_label TEXT NOT NULL,
    period_number INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    faculty TEXT NOT NULL,
    faculty_dept TEXT NOT NULL,
    venue TEXT NOT NULL,
    type session_type NOT NULL DEFAULT 'lecture',
    is_relocated BOOLEAN NOT NULL DEFAULT FALSE,
    original_venue TEXT,
    relocation_reason TEXT,
    relocation_source TEXT,
    notes TEXT,
    updated_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TIMETABLE AUDIT / RELOCATION HISTORY
CREATE TABLE IF NOT EXISTS public.timetable_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id TEXT NOT NULL REFERENCES public.timetable_entries(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    author TEXT NOT NULL,
    detail TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    author_role TEXT NOT NULL DEFAULT 'Class Representative / Admin',
    affected_class TEXT NOT NULL DEFAULT 'ICE-A',
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'retracted', 'updated'
    retraction_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.assignments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    priority priority_level NOT NULL DEFAULT 'medium',
    submission_type TEXT NOT NULL DEFAULT 'physical',
    submission_location TEXT NOT NULL,
    attachment_name TEXT,
    attachment_url TEXT,
    status TEXT NOT NULL DEFAULT 'published',
    target_class TEXT NOT NULL DEFAULT 'ICE-A',
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. PRIVATE STUDENT COMPLETION RECORDS (Data Isolation Enforced)
CREATE TABLE IF NOT EXISTS public.student_task_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id TEXT NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    student_notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, assignment_id)
);

-- 9. OPPORTUNITIES & HACKATHONS
CREATE TABLE IF NOT EXISTS public.opportunities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    organizer TEXT NOT NULL,
    deadline TEXT NOT NULL,
    event_date TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    perks TEXT NOT NULL,
    description TEXT NOT NULL,
    registration_url TEXT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. GOOGLE DRIVE STUDY VAULT RESOURCES
CREATE TABLE IF NOT EXISTS public.drive_resources (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    url TEXT NOT NULL,
    size TEXT,
    files_count TEXT,
    root_path TEXT,
    description TEXT NOT NULL,
    visibility TEXT NOT NULL DEFAULT 'Batch ICE Sem 1 (60 Students)',
    updated_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. ADMINISTRATIVE AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    action_type TEXT NOT NULL,
    summary TEXT NOT NULL,
    details TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    user_role TEXT NOT NULL DEFAULT 'admin',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_task_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drive_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile. Admins can view all profiles in their batch.
CREATE POLICY "Profiles read policy" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Profiles update policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Timetable: Anyone authenticated (or public read for registered students) can read.
CREATE POLICY "Timetable public read" ON public.timetable_entries
    FOR SELECT USING (true);

CREATE POLICY "Timetable admin manage" ON public.timetable_entries
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Announcements: Public read for published notices; admin manage for publishing/retracting
CREATE POLICY "Announcements public read" ON public.announcements
    FOR SELECT USING (status != 'draft' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Announcements admin manage" ON public.announcements
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Assignments: Public read; admin manage
CREATE POLICY "Assignments public read" ON public.assignments
    FOR SELECT USING (status = 'published' OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Assignments admin manage" ON public.assignments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Student Task Progress: STRICT PRIVACY ISOLATION
-- Students can ONLY view and update their own progress. Zero peer leaks!
CREATE POLICY "Student progress isolated read" ON public.student_task_progress
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Student progress isolated write" ON public.student_task_progress
    FOR ALL USING (auth.uid() = student_id);

-- Opportunities: Public read; admin manage
CREATE POLICY "Opportunities read" ON public.opportunities
    FOR SELECT USING (true);

CREATE POLICY "Opportunities admin manage" ON public.opportunities
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Google Drive Vault: Public read for students; admin manage
CREATE POLICY "Drive resources read" ON public.drive_resources
    FOR SELECT USING (true);

CREATE POLICY "Drive resources admin manage" ON public.drive_resources
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Audit logs: Read by all authenticated users for transparency; insert by admin
CREATE POLICY "Audit logs read" ON public.audit_logs
    FOR SELECT USING (true);

CREATE POLICY "Audit logs insert" ON public.audit_logs
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );
