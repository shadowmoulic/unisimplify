-- Create the table for storing student application profiles
CREATE TABLE IF NOT EXISTS "unisimplify-profiles" (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  dob TEXT,
  phone TEXT,
  caste TEXT,
  category_cert_url TEXT,
  minority_status TEXT,
  is_diabetic TEXT,
  birth_place TEXT,
  is_twin TEXT,
  school_board TEXT,
  percentage_10 NUMERIC,
  percentage_12 NUMERIC,
  stream TEXT,
  subjects_12 JSONB, -- List of subjects and marks
  jee_main_score NUMERIC,
  neet_score NUMERIC,
  cuet_score NUMERIC,
  id_proof_url TEXT,
  photo_url TEXT,
  id_type TEXT,
  preferred_course TEXT,
  preferred_state TEXT,
  budget TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE "unisimplify-profiles" ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own profile
CREATE POLICY "Allow users to read their own profile" ON "unisimplify-profiles"
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to create/update only their own profile
CREATE POLICY "Allow users to insert/update their own profile" ON "unisimplify-profiles"
  FOR ALL USING (auth.uid() = user_id);

-- Allow admins and college representatives to read all student profiles
CREATE POLICY "Allow admins and college reps to read profiles" ON "unisimplify-profiles"
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "unisimplify-college-admin"
      WHERE email = auth.jwt()->>'email' AND role IN ('admin', 'college')
    )
  );
