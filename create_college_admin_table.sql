-- Create the table to assign college administrators and admins
CREATE TABLE IF NOT EXISTS "unisimplify-college-admin" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('college', 'admin')),
  college_name TEXT,
  college_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE "unisimplify-college-admin" ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read assignments (to check roles on login)
CREATE POLICY "Allow public read access" ON "unisimplify-college-admin"
  FOR SELECT USING (true);

-- Allow authenticated admins to modify assignments
CREATE POLICY "Allow admins to insert/update/delete" ON "unisimplify-college-admin"
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "unisimplify-college-admin"
      WHERE email = auth.jwt()->>'email' AND role = 'admin'
    )
  );

-- Insert Sayak as the default super admin
INSERT INTO "unisimplify-college-admin" (email, role)
VALUES ('sayak@kgphustlehouse.com', 'admin')
ON CONFLICT (email) DO UPDATE SET
  role = 'admin';

-- Insert Sai University test account as a college admin representative
INSERT INTO "unisimplify-college-admin" (email, role, college_name, college_url)
VALUES ('sai-college-test@gmail.com', 'college', 'Sai University', 'https://saiuniversity.edu.in')
ON CONFLICT (email) DO UPDATE SET
  role = 'college',
  college_name = 'Sai University',
  college_url = 'https://saiuniversity.edu.in';
