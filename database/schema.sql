-- SQL Schema for SipakarPC Expert System

-- 1. Symptoms Table
CREATE TABLE symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Components Table
CREATE TABLE components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. KB Rules Table (Certainty Factor Rules)
CREATE TABLE kb_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symptom_code TEXT REFERENCES symptoms(code) ON DELETE CASCADE,
    component_name TEXT REFERENCES components(name) ON DELETE CASCADE,
    mb_value FLOAT NOT NULL CHECK (mb_value >= 0 AND mb_value <= 1),
    md_value FLOAT NOT NULL CHECK (md_value >= 0 AND md_value <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(symptom_code, component_name)
);

-- 4. Diagnosis History Table
CREATE TABLE diagnosis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    selected_symptoms JSONB NOT NULL, -- Array of objects {code, certainty_level}
    main_diagnosis TEXT NOT NULL,
    confidence FLOAT NOT NULL,
    all_results JSONB NOT NULL -- Array of objects {component, cf_value}
);

-- Enable Row Level Security (RLS)
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_history ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access on symptoms" ON symptoms FOR SELECT USING (true);
CREATE POLICY "Allow public read access on components" ON components FOR SELECT USING (true);
CREATE POLICY "Allow public read access on kb_rules" ON kb_rules FOR SELECT USING (true);

-- Anonymous can insert history
CREATE POLICY "Allow anonymous insert on diagnosis_history" ON diagnosis_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access on diagnosis_history" ON diagnosis_history FOR SELECT USING (true);

-- Admin write access (Assuming user role for admin management)
-- For simplicity in this demo, you might want to use service_role for admin tools or set up specific Auth policies.
