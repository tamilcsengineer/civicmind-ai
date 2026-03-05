-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create complaints table
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  location TEXT NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  priority TEXT NOT NULL DEFAULT 'medium',
  is_suspicious BOOLEAN DEFAULT FALSE,
  predicted_resolution_days INTEGER,
  assigned_department_id UUID REFERENCES departments(id),
  root_cause TEXT,
  solution_plan TEXT,
  estimated_cost_min DECIMAL(10,2),
  estimated_cost_max DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create index for tracking_id lookups
CREATE INDEX idx_complaints_tracking_id ON complaints(tracking_id);
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_priority ON complaints(priority);
CREATE INDEX idx_complaints_created_at ON complaints(created_at DESC);

-- Insert default categories
INSERT INTO categories (name, icon) VALUES
  ('Road Damage', '🛣️'),
  ('Water Supply', '💧'),
  ('Electricity', '⚡'),
  ('Sanitation', '🗑️'),
  ('Public Safety', '🚨');

-- Insert default departments
INSERT INTO departments (name) VALUES
  ('Infrastructure Maintenance'),
  ('Water Department'),
  ('Electricity Board'),
  ('Sanitation Services'),
  ('Public Safety Division');

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and departments
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read departments" ON departments FOR SELECT USING (true);

-- Public access for complaints (anonymous submission)
CREATE POLICY "Anyone can insert complaints" ON complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read complaints" ON complaints FOR SELECT USING (true);
CREATE POLICY "Anyone can update complaints" ON complaints FOR UPDATE USING (true);

-- Create storage bucket for complaint images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('app-a253br3vlssh_complaint_images', 'app-a253br3vlssh_complaint_images', true);

-- Storage policies for public upload
CREATE POLICY "Anyone can upload complaint images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'app-a253br3vlssh_complaint_images');

CREATE POLICY "Anyone can read complaint images" ON storage.objects 
FOR SELECT USING (bucket_id = 'app-a253br3vlssh_complaint_images');