# React Architect Lab

[![CI](https://github.com/andrewteece/react-architect-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/andrewteece/react-architect-lab/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-000?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=000)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss&logoColor=000)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack-Query-FF4154)](https://tanstack.com/query/latest)
[![Vitest](https://img.shields.io/badge/Vitest-Unit%2FIntegration-6e9f18?logo=vitest&logoColor=fff)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2ead33?logo=playwright&logoColor=fff)](https://playwright.dev/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220?logo=pnpm&logoColor=fff)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-Unlicensed-lightgrey)](#license)

> Prep & reusable patterns for **React / Next.js / TypeScript** consulting interviews and proctored tests.

This lab is a compact, production-ish playground to rehearse core competencies:

- Data fetching & **caching** with TanStack Query (optimistic updates, invalidation)
- **Dark mode** via CSS variables, no FOUC (flash of unstyled color)
- **i18n** (pluralization, formatting, locale switching)
- **SSR/ISR** with Next.js App Router
- **Testing** at Unit/Integration (Vitest + RTL + MSW) and optional E2E (Playwright)
- Class → **Hooks** migrations
- Clean architecture, checklists, and ADRs

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Install](#install)
  - [Run Dev](#run-dev)
  - [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
  - [.env Example](#env-example)
  - [VS Code Settings](#vs-code-settings)
- [Core Features](#core-features)
  - [Data Fetching & Caching](#data-fetching--caching)
  - [Dark Mode (No FOUC)](#dark-mode-no-fouc)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [SSR / ISR](#ssr--isr)
  - [Testing](#testing)
- [Accessibility & Performance](#accessibility--performance)
- [CI/CD](#cicd)
- [Architecture Decision Records (ADR)](#architecture-decision-records-adr)
- [Branching & Commits](#branching--commits)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Tech Stack

- **Framework**: Next.js (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS + CSS variables (theme tokens)
- **Data**: TanStack Query (+ Devtools)
- **State**: Local/Context; optional Zustand for global client state
- **i18n**: `next-intl` (or `react-i18next` if preferred)
- **Testing**: Vitest, React Testing Library, MSW; Playwright for E2E (optional)
- **Tooling**: ESLint, pnpm

---

## Requirements

- Node **20+** (Node 22 recommended)
- pnpm **8+** (10.x works great)
- Git, VS Code (recommended)

Check your versions:
```bash
node -v
pnpm -v
git --version
```

---

## Getting Started

### Install
```bash
pnpm install
```

### Run Dev
```bash
pnpm dev
# visit http://localhost:3000
```

### Available Scripts
```bash
pnpm dev          # Next.js dev server
pnpm build        # Production build
pnpm start        # Start production server (after build)
pnpm lint         # ESLint

pnpm test         # Run unit/integration tests (Vitest)
pnpm test:watch   # Watch mode for tests

# (optional if you enable Playwright)
pnpm e2e          # Run Playwright E2E tests
```

---

## Project Structure

```
src/
  app/
    layout.tsx
    page.tsx
    (features)/
      todos/
        page.tsx
        TodoList.tsx
        TodoForm.tsx
        useTodos.ts        # TanStack Query hooks
      settings/
        ThemeToggle.tsx
  components/
    ui/
      Button.tsx
      Card.tsx
  lib/
    fetcher.ts             # typed fetch helpers
    i18n.ts                # i18n bootstrapping (when added)
    theme.ts               # theme helpers
  styles/
    globals.css
  tests/
    setup.ts               # Vitest/RTL/MSW setup
    testServer.ts          # MSW server handlers
    todos.test.tsx         # example integration test
```

> Prefer **Server Components** by default in App Router; add `"use client"` only where needed (forms, interactivity, React Query provider, etc.).

---

## Configuration

### .env Example
Create `.env.local` for local settings (if/when needed). Nothing is required yet, but this template is handy:
```dotenv
# Example only ─ replace with real values when features need them
NEXT_PUBLIC_APP_NAME="React Architect Lab"
# API bases, feature flags, etc.
# NEXT_PUBLIC_API_BASE="http://localhost:3000"
```

### VS Code Settings
> (Optional) Recommended workspace settings & extensions.

`.vscode/extensions.json`
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

`.vscode/settings.json`
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.eol": "\n"
}
```

---

## Core Features

### Data Fetching & Caching
- Use **TanStack Query** for server state:
  - Unique `queryKey`s, set `staleTime` intentionally
  - **Optimistic updates** with rollback on error
  - **Invalidation** after writes to keep cache fresh
- Keep **UI/client state** (form inputs, UI toggles) outside Query (local state/Context/Zustand).

**Provider (client boundary)**
```tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export default function QueryProviders({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

### Dark Mode (No FOUC)
- Theme is set **before paint** via an inline script in `layout.tsx`.
- Tokens defined as **CSS variables**; Tailwind consumes them.
- Persist preference with `localStorage` and respect `prefers-color-scheme`.

**Inline theme script**
```html
<script>
(function(){
  try {
    const key='theme';
    const stored=localStorage.getItem(key);
    const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch(e){}
})();
</script>
```

### Internationalization (i18n)
- `next-intl` recommended for App Router.
- Keep **messages** in locale files; no hard-coded UI strings in components.
- Cover **pluralization**/**interpolation**; use `Intl` for dates/numbers/currency.
- Locale routing: `/en`, `/es`… or domain-based mapping.

### SSR / ISR
- Server Components by default; client components only when necessary.
- Use `fetch` with `{ next: { revalidate: N } }` for ISR.
- Add **Metadata API** (title, canonical, OG) for SEO.
- Stream with `<Suspense>` where it improves TTFB/LCP.

### Testing
- **Unit/Integration**: Vitest + React Testing Library + MSW.
  - Test **behavior** (roles/labels, `userEvent`) instead of implementation details.
  - Mock network with **MSW**.
- **E2E (optional)**: Playwright for one “happy path”.

**Vitest config sketch**
```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { environment: 'jsdom', setupFiles: ['./src/tests/setup.ts'], css: true }
});
```

**MSW test server sketch**
```ts
// src/tests/testServer.ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const server = setupServer(
  http.get('/api/todos', () => HttpResponse.json([{ id:'1', title:'Seed', done:false }]))
);
```

---

## Accessibility & Performance
- Landmarks, roles, labels; keyboard navigation; visible focus states.
- Contrast meets **WCAG 2.2**.
- **Core Web Vitals**:
  - Avoid large synchronous work on the client
  - Optimize images, self-host fonts carefully
  - Stream where possible; split code prudently
- No sensitive env vars in client code.

---

## CI/CD

The project includes automated continuous integration using GitHub Actions. The workflow is configured to:

### 📋 CI Pipeline Features

- **PNPM Setup**: Properly installs PNPM before attempting to use it for caching
- **Node.js 22**: Configured for the latest Node.js LTS version
- **Dependency Caching**: Leverages PNPM's efficient caching for faster builds
- **Quality Checks**: Runs ESLint for code quality
- **Build Verification**: Compiles the Next.js application
- **Testing**: Executes available test suites (unit/integration/e2e)

### 🚀 Workflow Triggers

The CI workflow runs on:
- Pushes to `main` and `develop` branches
- Pull requests targeting `main` and `develop` branches

### ⚙️ Workflow Steps

1. **Checkout**: Retrieves the repository code
2. **PNPM Setup**: Installs PNPM package manager (version 9)
3. **Node.js Setup**: Installs Node.js 22 with PNPM caching
4. **Dependencies**: Installs project dependencies with frozen lockfile
5. **Lint**: Runs ESLint for code quality checks
6. **Build**: Compiles the Next.js application
7. **Test**: Runs available test suites (gracefully handles missing tests)
8. **E2E Tests**: Runs Playwright tests if configuration exists

### 🔧 Configuration

The workflow file is located at `.github/workflows/ci.yml` and includes:
- Error handling for missing test scripts
- Conditional Playwright test execution
- Disabled Next.js telemetry for CI environment
- Continue-on-error for optional steps

---

## Architecture Decision Records (ADR)
Keep short ADRs under `docs/adr/`:

```
# Decision: <title>

## Context
Why this decision? Constraints and goals.

## Options
- Option A
- Option B
- Option C

## Decision
Chosen option & rationale.

## Consequences
Trade-offs, risks, follow-ups.
```

Example topics: “TanStack Query for server state”, “next-intl for i18n”, “CSS variables for theming”.

---

## Branching & Commits
- Branches: `feat/*`, `fix/*`, `chore/*`, `docs/*`
- **Conventional Commits**:
  - `feat: add optimistic updates to todos`
  - `fix: prevent double fetch on toggle`
  - `chore(deps): bump @tanstack/query`
  - `docs: add testing guide`

---

## Troubleshooting

**Dark mode flashes on load**  
Ensure the inline theme script is injected with `strategy="beforeInteractive"` and sets `data-theme` on `<html>`.

**Tests can’t find fetch/API**  
Ensure MSW server is set up in `setup.ts`; verify relative URL `/api/...` matches handlers.

**Unexpected double effects**  
React Strict Mode in dev intentionally double-invokes certain lifecycles. Make side effects idempotent and add proper cleanup.

**404 on nested routes**  
In App Router, make sure you’ve placed `page.tsx` (or `route.ts`) at the correct segment and restarted dev server.

---

## Roadmap
- [ ] Todos CRUD with optimistic updates
- [ ] Dark mode toggle + tokens
- [ ] i18n (`/en`, `/es`) with pluralization & formatting
- [ ] SSR page with ISR (`revalidate`) and Metadata API
- [ ] Vitest + RTL + MSW integration tests
- [ ] (Optional) Playwright one happy-path E2E flow
- [ ] Storybook + a11y addon (optional, later)
- [ ] ADRs for key decisions

---

## Contributing
This repo is primarily a personal lab, but PRs/issues are welcome for:
- Additional practice prompts
- Testing patterns & accessibility improvements
- Docs/README enhancements

Please follow Conventional Commits & keep diffs focused.

---

## License
**Unlicensed (all rights reserved).**  
If you intend to share or reuse, add a license (e.g., MIT) and update this section.

---

## Author
**Andrew Teece**  
- Portfolio: https://andrewteece.com  
- GitHub: https://github.com/andrewteece  
- LinkedIn: https://www.linkedin.com/in/andrew-teece
