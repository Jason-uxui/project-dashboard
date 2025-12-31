<h1 align="center">Project Dashboard · Next.js + shadcn/ui</h1>

<p align="center">
  A modern project & task management dashboard, built as a real-world UI template for founders, product designers, and full‑stack developers.
</p>

<p align="center">
  <a href="https://vercel.com/mystic-lab/v0-project-management-tool-xp"><strong>Live demo</strong></a>
  ·
  <a href="#getting-started"><strong>Run locally</strong></a>
  ·
  <a href="#architecture"><strong>Explore the architecture</strong></a>
</p>

---

## Overview

This repository is a small but opinionated **project management dashboard UI** built with:

- **Next.js App Router**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui + custom sidebar primitives**

It is designed as a **living portfolio piece**:

- You can browse the actual code, not just design mockups.
- You can clone, run, and extend the dashboard like a real product.
- It demonstrates how to combine design and engineering decisions in a clean, extensible way.

If you are a founder, indie hacker, or engineer evaluating collaboration, this repo is meant to show how I think about **systems, structure, and UI details**.

## Live Demo

The dashboard is deployed on Vercel:

- **Production**: https://vercel.com/mystic-lab/v0-project-management-tool-xp

> Note: This is a UI‑first demo. It uses mocked data and does not include authentication or a backend API.

## Features

- **Project overview layout**
  - Sidebar navigation with active states and badges.
  - Active projects list with progress visualization.

- **Responsive sidebar system**
  - Built on top of a custom `SidebarProvider` with context.
  - Keyboard shortcut to toggle sidebar.
  - Mobile behavior and state persisted via cookies.

- **Design‑system‑oriented components**
  - Base primitives from shadcn/ui.
  - Composed `AppSidebar` component using data from `lib/data`.
  - Utility helpers in `lib/utils` for consistent styling.

- **Mock data that resembles real workloads**
  - Projects with statuses, priorities, tags, and time ranges.
  - Sidebar navigation and “Active projects” summaries.

## Architecture

High‑level structure:

- `app/`
  - `layout.tsx` – Root layout, metadata, fonts, and global styles.
  - `page.tsx` – Main dashboard page wiring the `SidebarProvider`, `AppSidebar`, and page content.

- `components/`
  - `app-sidebar.tsx` – Application sidebar composed from shared sidebar primitives and data.
  - `projects-content.tsx` – Main dashboard content (project list, filters, and timeline). 
  - `progress-circle.tsx` – Small reusable visualization for project progress.
  - `ui/` – Design-system‑like primitives (buttons, sidebar primitives, input, tooltip, etc.).

- `lib/`
  - `utils.ts` – Utility helpers (e.g., class name helpers).
  - `data/projects.ts` – Seed data for projects and helpers to compute filter counts.
  - `data/sidebar.ts` – Seed data for sidebar navigation, active projects summary, and footer items.

This separation keeps:

- **UI primitives** (in `components/ui`) reusable across the app.
- **Feature components** (like `AppSidebar`) focused on composition instead of raw config.
- **Data** (in `lib/data`) decoupled from the UI, so you can easily swap mock data for real APIs later.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui, Radix UI primitives
- **Icons**: Lucide, Phosphor Icons
- **Analytics**: Vercel Analytics

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Install dependencies

\`\`\`bash
pnpm install
\`\`\`

### Run the development server

\`\`\`bash
pnpm dev
\`\`\`

The app will be available at `http://localhost:3000`.

### Build for production

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## Reuse & Customization

This project is intentionally small so you can:

- **Use it as a starting point** for your own SaaS dashboard or internal tooling.
- **Replace the mock data** in `lib/data` with real data from your API.
- **Extend the design system** by adding more components under `components/ui`.
- **Refine the information architecture** (routes under `app/`) to match your own product.

If you end up using this as a starting point, a link back or a star on the repo is always appreciated.

## About

This project was built as an **open-source, living portfolio** to demonstrate how I approach:

- Structuring small front‑end apps.
- Balancing visual design and implementation detail.
- Building reusable UI primitives that are still easy to adapt.

If you are a founder, PM, or engineer and want to talk about collaborating, feel free to reach out.
