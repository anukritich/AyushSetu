-- Systems (Ayurveda, Siddha, Unani)
CREATE TABLE medical_systems (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL  -- e.g., Ayurveda, Siddha, Unani
);

-- Terms (main dictionary table)
CREATE TABLE medical_terms (
    id SERIAL PRIMARY KEY,
    sanskrit_name VARCHAR(255),
    english_name VARCHAR(255),
    local_name VARCHAR(255),           -- if different vernacular name exists
    ayush_code VARCHAR(50),            -- AYUSH code (Namaste code)
    icd_code VARCHAR(50),              -- ICD mapping
    who_code VARCHAR(50),              -- WHO mapping
    description TEXT,
    system_id INT REFERENCES medical_systems(id) ON DELETE CASCADE
);

-- Indexes for fast searching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_sanskrit_trgm ON medical_terms USING gin (sanskrit_name gin_trgm_ops);
CREATE INDEX idx_english_trgm  ON medical_terms USING gin (english_name gin_trgm_ops);
CREATE INDEX idx_local_trgm    ON medical_terms USING gin (local_name gin_trgm_ops);
CREATE INDEX idx_icd_code      ON medical_terms (icd_code);
CREATE INDEX idx_ayush_code    ON medical_terms (ayush_code);
