-- Migration: Add Companies and Multi-tenancy Support
-- Description: Adds companies table, company_status enum, and company_id to processes
-- Date: 2026-02-20

-- ========================================
-- 1. CREATE ENUM FOR COMPANY STATUS
-- ========================================

CREATE TYPE company_status AS ENUM (
  'lead',         -- Lead inicial
  'contact',      -- Contato estabelecido
  'proposal',     -- Proposta enviada
  'negotiation',  -- Em negociação
  'closed',       -- Fechado/Contrato assinado
  'lost'          -- Perdido (não vai avançar)
);

-- ========================================
-- 2. CREATE COMPANIES TABLE
-- ========================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Dados básicos
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  contact_person TEXT,

  -- Redes sociais
  linkedin_url TEXT,
  instagram_url TEXT,
  website_url TEXT,

  -- Informações comerciais
  estimated_value DECIMAL(12, 2), -- Valor estimado do contrato em R$
  expected_close_date DATE,       -- Data prevista de fechamento
  lead_source TEXT,               -- Origem do lead (indicação, site, LinkedIn, etc.)

  -- Status e notas
  status company_status NOT NULL DEFAULT 'lead',
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- 3. CREATE TRIGGER FOR UPDATED_AT
-- ========================================

CREATE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION fn_update_timestamp();

-- ========================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);
CREATE INDEX idx_companies_cnpj ON companies(cnpj) WHERE cnpj IS NOT NULL;

-- ========================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ========================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Open policy (replace with auth-scoped policies when auth is added)
CREATE POLICY "Allow all on companies"
  ON companies
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================================
-- 6. ADD COMPANY_ID TO PROCESSES TABLE
-- ========================================

ALTER TABLE processes
  ADD COLUMN company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- Index for filtering processes by company
CREATE INDEX idx_processes_company_id ON processes(company_id);

-- ========================================
-- 7. MIGRATE EXISTING DATA
-- ========================================

-- Create default company for legacy processes
INSERT INTO companies (id, name, status, notes, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Processos Legados',
  'closed',
  'Processos criados antes da implementação de gestão por empresa',
  NOW(),
  NOW()
);

-- Assign all existing processes to the legacy company
UPDATE processes
SET company_id = '00000000-0000-0000-0000-000000000001'
WHERE company_id IS NULL;

-- Make company_id required after migration
ALTER TABLE processes
  ALTER COLUMN company_id SET NOT NULL;

-- ========================================
-- 8. CREATE VIEW FOR COMPANY STATISTICS
-- ========================================

CREATE OR REPLACE VIEW companies_with_stats AS
SELECT
  c.id,
  c.name,
  c.cnpj,
  c.email,
  c.phone,
  c.contact_person,
  c.linkedin_url,
  c.instagram_url,
  c.website_url,
  c.estimated_value,
  c.expected_close_date,
  c.lead_source,
  c.status,
  c.notes,
  c.created_at,
  c.updated_at,

  -- Computed fields
  COUNT(DISTINCT p.id) as total_processes,
  COUNT(DISTINCT CASE WHEN p.status = 'completed' THEN p.id END) as completed_processes,
  COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_processes,
  COALESCE(AVG(p.progress), 0) as avg_progress,
  MAX(p.updated_at) as last_activity

FROM companies c
LEFT JOIN processes p ON p.company_id = c.id
GROUP BY c.id;

-- ========================================
-- 9. GRANT PERMISSIONS
-- ========================================

-- Grant access to view (for RLS compatibility)
GRANT SELECT ON companies_with_stats TO authenticated;
GRANT SELECT ON companies_with_stats TO anon;

-- ========================================
-- VERIFICATION QUERIES (for testing)
-- ========================================

-- Uncomment to test after migration:

-- SELECT * FROM companies;
-- SELECT * FROM companies_with_stats;
-- SELECT id, title, company_id FROM processes LIMIT 5;
