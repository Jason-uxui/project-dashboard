# Core CRUD Plan Tracker

Scope: project management dashboard core features only.
Excluded: auth, pricing, AI features.

Last updated: 2026-02-27

## Progress

- [x] Phase 0: Foundation already in place
- [ ] Phase 1: Unify domain models
- [ ] Phase 2: Extend Supabase schema
- [ ] Phase 3: Expand API layer
- [ ] Phase 4: Wire `/tasks` to real CRUD
- [ ] Phase 5: Wire `/projects/[id]` to real CRUD
- [ ] Phase 6: Wire clients CRUD + project linking
- [ ] Phase 7: Wire performance to live data
- [ ] Phase 8: Hardening + QA

---

## Phase 0: Foundation already in place

- [x] Supabase SQL migration for `projects` + `tasks`
- [x] REST API CRUD in `lib/projects/api.ts`
- [x] Shared hook in `hooks/use-projects-crud.ts`
- [x] Main projects dashboard wired to real CRUD
- [x] Timeline task updates persisted (status + dates)
- [x] Initial sample data cleared for clean-state testing

## Phase 1: Unify domain models

- [ ] Replace `lib/data/project-details.ts` as runtime data source
- [ ] Define shared project/task/workstream/client types for all pages
- [ ] Remove mock-only task shape drift between pages

## Phase 2: Extend Supabase schema

- [ ] Add `clients` table
- [ ] Add `workstreams` table
- [ ] Extend `tasks` with:
  - [ ] `workstream_id` (nullable FK)
  - [ ] `description` (nullable text)
  - [ ] `priority` (enum/check)
  - [ ] `tag` (nullable text)
  - [ ] `position` (ordering)
- [ ] Add indexes + `updated_at` triggers + RLS policies
- [ ] Add migration file(s) under `supabase/`

## Phase 3: Expand API layer

- [ ] Add clients API module
- [ ] Add workstreams API module
- [ ] Add project-details aggregate fetch helpers
- [ ] Add create/update/delete task endpoints for all task fields

## Phase 4: Wire `/tasks` to real CRUD

- [ ] Refactor `MyTasksPage` to load tasks from API
- [ ] Wire `TaskQuickCreateModal` create + edit to API
- [ ] Persist task toggle, date moves, and tag/priority updates
- [ ] Keep DnD reorder stable (persist position if enabled)

## Phase 5: Wire `/projects/[id]` to real CRUD

- [ ] Replace `getProjectDetailsById` data loading
- [ ] Wire `ProjectTasksTab` actions to API
- [ ] Wire `WorkstreamTab` actions to API
- [ ] Wire project header edits to API
- [ ] Keep overview timeline and meta panels synced to DB

## Phase 6: Wire clients CRUD + project linking

- [ ] Replace in-memory `upsertClient` usage
- [ ] Wire clients list create/edit/archive to API
- [ ] Wire client details page to API
- [ ] Ensure project create/edit can link to real clients

## Phase 7: Wire performance to live data

- [ ] Replace `lib/data/projects` dependency with API data
- [ ] Recompute metrics from real projects/tasks
- [ ] Verify filters and date range logic against real DB states

## Phase 8: Hardening + QA

- [ ] Add robust loading/empty/error states on all core pages
- [ ] Add optimistic updates with rollback on mutation failure
- [ ] Remove mock toasts/logs and dead paths
- [ ] Run and pass `bun run lint`
- [ ] Run and pass `bun run build`

---

## Notes

- Check items off in this file as each phase is completed.
- If scope changes, update this tracker before implementation.
