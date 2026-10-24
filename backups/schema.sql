-- ==============================================================================
-- EduPulse AI — Supabase PostgreSQL Database Schema
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    department TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. STUDENTS TABLE (Master Academic & Risk Telemetry)
CREATE TABLE IF NOT EXISTS public.students (
    student_id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    semester TEXT NOT NULL,
    
    -- Academic Metrics
    cgpa NUMERIC(4, 2),
    internal_marks NUMERIC(5, 2),
    backlogs INTEGER DEFAULT 0,
    
    -- Attendance Metrics
    overall_attendance NUMERIC(5, 2),
    
    -- LMS & Engagement Metrics
    lms_logins INTEGER DEFAULT 0,
    assignment_completion NUMERIC(5, 2),
    events_participated INTEGER DEFAULT 0,
    club_participation INTEGER DEFAULT 0,
    hackathons INTEGER DEFAULT 0,
    certifications INTEGER DEFAULT 0,
    
    -- Placement Assessments
    aptitude_score NUMERIC(5, 2),
    coding_score NUMERIC(5, 2),
    mock_interview_score NUMERIC(5, 2),
    placement_preparation_participation BOOLEAN DEFAULT FALSE,
    
    -- Skills & Feedback
    technical_skill_score NUMERIC(5, 2),
    soft_skill_score NUMERIC(5, 2),
    student_satisfaction NUMERIC(3, 2),
    faculty_feedback TEXT,
    
    -- Computed Risk Metadata
    ai_risk_level TEXT DEFAULT 'Low',
    data_completeness_pct INTEGER DEFAULT 100,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FACULTY TABLE
CREATE TABLE IF NOT EXISTS public.faculty (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    subjects TEXT[] DEFAULT '{}',
    students_count INTEGER DEFAULT 0,
    avatar_initials TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROBLEM REQUESTS TABLE (Student to Faculty Inquiries)
CREATE TABLE IF NOT EXISTS public.problem_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT REFERENCES public.students(student_id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    faculty_name TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('Normal', 'Important')) DEFAULT 'Normal',
    status TEXT CHECK (status IN ('Pending', 'In Progress', 'Resolved')) DEFAULT 'Pending',
    reply TEXT,
    next_step TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INTERVENTIONS TABLE (Proctor/Dean Action Plans)
CREATE TABLE IF NOT EXISTS public.interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT REFERENCES public.students(student_id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    faculty_assigned TEXT NOT NULL,
    target_date DATE NOT NULL,
    status TEXT CHECK (status IN ('Planned', 'In Progress', 'Completed', 'Follow-up Needed')) DEFAULT 'Planned',
    outcome_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;

-- 8. POLICIES (Allow public/authenticated read for campus dashboard display)
CREATE POLICY "Allow public read access to students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert/update to students" ON public.students FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to faculty" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert/update to faculty" ON public.faculty FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow profile update by owner" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow read problem requests" ON public.problem_requests FOR SELECT USING (true);
CREATE POLICY "Allow insert problem requests" ON public.problem_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update problem requests" ON public.problem_requests FOR UPDATE USING (true);

CREATE POLICY "Allow read interventions" ON public.interventions FOR SELECT USING (true);
CREATE POLICY "Allow manage interventions" ON public.interventions FOR ALL USING (true);

-- 9. TRIGGER: Automatic profile generation when user registers in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
