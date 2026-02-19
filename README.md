# Folia PM — Sistema de Gestão de Processos

Sistema web para consultores gerenciarem projetos, criarem tarefas e acompanharem progresso via dashboard em tempo real.

## Stack

- **Next.js 16 (App Router + TypeScript)** — SSR + RSC
- **Tailwind CSS + shadcn/ui** — componentes com code-ownership
- **Zustand** — estado global com Realtime
- **@hello-pangea/dnd** — drag-and-drop acessível
- **Recharts** — gráficos de progresso
- **react-hook-form + Zod** — validação compartilhada client/server
- **Supabase (PostgreSQL)** — banco com Realtime + RLS

## Setup Rápido

### 1. Instale dependências

```bash
cd folia-pm
npm install
```

### 2. Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Acesse o **SQL Editor** e execute: `supabase/migrations/0001_initial_schema.sql`
3. O seed já está incluído (3 processos + 8 tarefas de exemplo)

### 3. Configure variáveis de ambiente

Edite `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
```

Valores em: Supabase Dashboard → Project Settings → API

### 4. Inicie o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Funcionalidades

| Área | Funcionalidade |
|------|---------------|
| Dashboard | 4 cards de resumo, anéis de progresso por Recharts, feed de atividade |
| Processos | Tabela sortável (Notion-style) + Kanban por status (Trello-style) |
| Tarefas | Kanban 4 colunas com drag-and-drop entre colunas e dentro da coluna |
| Realtime | Atualizações automáticas via Supabase subscriptions |
| Dark Mode | Tema claro/escuro com `next-themes` |
| Progresso | Calculado automaticamente via trigger SQL (sem lógica no frontend) |

## Estrutura

```
folia-pm/
├── supabase/migrations/        # Schema SQL + seed
├── app/
│   ├── layout.tsx              # Sidebar + TopBar + ThemeProvider
│   ├── page.tsx                # Dashboard
│   ├── processes/page.tsx      # Lista de processos
│   ├── processes/new/page.tsx  # Criar processo
│   ├── processes/[id]/page.tsx # Detalhe + TaskBoard
│   └── api/                    # BFF API Routes
├── components/
│   ├── layout/                 # Sidebar, TopBar, ThemeToggle
│   ├── dashboard/              # SummaryCards, ProcessProgressRing, RecentActivity
│   ├── processes/              # ProcessTable, ProcessKanban, ViewToggle, ProcessForm
│   ├── tasks/                  # TaskBoard, TaskColumn, TaskCard, TaskDialog
│   └── shared/                 # ProgressBar, DeadlineBadge, EmptyState, ConfirmDialog
├── stores/                     # Zustand stores (processStore, taskStore)
├── hooks/                      # useProcesses, useTasks, useViewToggle
├── lib/                        # supabase/, validations.ts, constants.ts, utils.ts
└── types/                      # database.types.ts
```
