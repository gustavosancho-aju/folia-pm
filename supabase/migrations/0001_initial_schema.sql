-- ============================================================
-- Folia PM - Initial Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS process_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS processes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  color TEXT DEFAULT '#6366f1',
  deadline TIMESTAMPTZ,
  category_id UUID REFERENCES process_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assignee TEXT,
  deadline TIMESTAMPTZ,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_processes_updated_at
  BEFORE UPDATE ON processes
  FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- Auto-recalculate process progress based on done tasks
CREATE OR REPLACE FUNCTION fn_recalc_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_process_id UUID;
  v_total INTEGER;
  v_done INTEGER;
  v_progress INTEGER;
BEGIN
  -- Determine which process to update
  IF TG_OP = 'DELETE' THEN
    v_process_id := OLD.process_id;
  ELSE
    v_process_id := NEW.process_id;
  END IF;

  -- Count total and done tasks
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'done')
  INTO v_total, v_done
  FROM tasks
  WHERE process_id = v_process_id;

  -- Calculate progress (0 if no tasks)
  IF v_total = 0 THEN
    v_progress := 0;
  ELSE
    v_progress := ROUND((v_done::NUMERIC / v_total) * 100);
  END IF;

  -- Update the process
  UPDATE processes
  SET progress = v_progress, updated_at = NOW()
  WHERE id = v_process_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalc_progress
  AFTER INSERT OR UPDATE OF status OR DELETE ON tasks
  FOR EACH ROW EXECUTE FUNCTION fn_recalc_progress();

-- ============================================================
-- VIEWS
-- ============================================================

CREATE OR REPLACE VIEW process_summary AS
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'active') AS active,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed,
  COUNT(*) FILTER (WHERE deadline < NOW() AND status != 'completed') AS overdue
FROM processes;

CREATE OR REPLACE VIEW processes_with_task_counts AS
SELECT
  p.*,
  COALESCE(t.total_tasks, 0) AS total_tasks,
  COALESCE(t.todo_count, 0) AS todo_count,
  COALESCE(t.in_progress_count, 0) AS in_progress_count,
  COALESCE(t.review_count, 0) AS review_count,
  COALESCE(t.done_count, 0) AS done_count
FROM processes p
LEFT JOIN (
  SELECT
    process_id,
    COUNT(*) AS total_tasks,
    COUNT(*) FILTER (WHERE status = 'todo') AS todo_count,
    COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_count,
    COUNT(*) FILTER (WHERE status = 'review') AS review_count,
    COUNT(*) FILTER (WHERE status = 'done') AS done_count
  FROM tasks
  GROUP BY process_id
) t ON p.id = t.process_id;

-- ============================================================
-- ROW LEVEL SECURITY (Open - Ready for auth)
-- ============================================================

ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_categories ENABLE ROW LEVEL SECURITY;

-- Open policies (replace with user-scoped policies when auth is added)
CREATE POLICY "Allow all on processes" ON processes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on process_categories" ON process_categories FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO process_categories (id, name, color) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Desenvolvimento', '#6366f1'),
  ('22222222-2222-2222-2222-222222222222', 'Marketing', '#f59e0b'),
  ('33333333-3333-3333-3333-333333333333', 'Operações', '#10b981');

INSERT INTO processes (id, title, description, status, color, deadline, category_id) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Redesign do Portal do Cliente',
    'Modernização completa da interface do portal com foco em UX e performance',
    'active',
    '#6366f1',
    NOW() + INTERVAL '30 days',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Campanha Q1 2026',
    'Planejamento e execução da campanha de marketing do primeiro trimestre',
    'active',
    '#f59e0b',
    NOW() + INTERVAL '15 days',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Migração de Infraestrutura',
    'Migração dos servidores legados para cloud AWS com zero downtime',
    'paused',
    '#10b981',
    NOW() + INTERVAL '60 days',
    '33333333-3333-3333-3333-333333333333'
  );

INSERT INTO tasks (process_id, title, description, status, priority, assignee, deadline, order_index) VALUES
  -- Process A tasks
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Levantamento de requisitos', 'Entrevistar stakeholders e documentar requisitos funcionais', 'done', 'high', 'Ana Silva', NOW() - INTERVAL '5 days', 0),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Wireframes e protótipos', 'Criar wireframes de baixa fidelidade e protótipo interativo no Figma', 'done', 'high', 'Carlos Mendes', NOW() - INTERVAL '2 days', 1),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Desenvolvimento frontend', 'Implementar componentes React baseados nos protótipos aprovados', 'in_progress', 'critical', 'Ana Silva', NOW() + INTERVAL '10 days', 2),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Testes de usabilidade', 'Conduzir testes com usuários reais e coletar feedback', 'todo', 'medium', 'Carlos Mendes', NOW() + INTERVAL '20 days', 3),

  -- Process B tasks
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Definição de personas', 'Mapear personas de clientes alvo para a campanha', 'done', 'high', 'Maria Costa', NOW() - INTERVAL '7 days', 0),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Criação de conteúdo', 'Produzir textos, imagens e vídeos para os canais digitais', 'in_progress', 'high', 'João Oliveira', NOW() + INTERVAL '5 days', 1),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Configuração de anúncios', 'Configurar campanhas no Google Ads e Meta Ads', 'review', 'medium', 'Maria Costa', NOW() + INTERVAL '8 days', 2),

  -- Process C tasks
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Auditoria de infraestrutura atual', 'Documentar toda infraestrutura existente e identificar dependências', 'done', 'critical', 'Pedro Santos', NOW() - INTERVAL '10 days', 0);
