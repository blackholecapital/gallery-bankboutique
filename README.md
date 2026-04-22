# Local-First Social Prototype


## Purpose
This repository scaffolds a local-first social application prototype with clear boundaries between routes, pages, features, domain contracts, and repository access. Pass 1 establishes structure and guardrails only.

## Core Constraints
- **Local-first:** all runtime data is expected to originate locally during the prototype phase.
- **Repository-only data access:** pages, features, and UI layers must not read storage directly; all data access flows through repository interfaces.
- **Contract-first build:** domain types, schemas, validators, and repository contracts are introduced before implementation details.
- **No business logic in Pass 1:** this pass intentionally avoids feature code, database code, UI implementation, and workflow logic.

## Route / Page Separation
- `src/routes/` holds route entry definitions and route-level wiring.
- `src/pages/` holds page-level screens grouped by product area.
- `src/features/` holds feature modules used by pages and routes.
- `src/components/` holds reusable UI building blocks only.

## Naming Conventions
- **PascalCase:** components
- **camelCase:** hooks, utilities, helpers
- **kebab-case:** route files
- Keep domain and repository contracts explicit, narrow, and reusable.

## Planned 6-Pass Build Order
1. **Pass 1 — Structure & guardrails:** create the full tree, baseline docs, env placeholders, and global stylesheet scaffold.
2. **Pass 2 — Domain / repositories / lib-db contracts:** add domain types, validation contracts, repository interfaces, and local data boundaries.
3. **Pass 3 — App shell & routing spine:** add app providers, router setup, route definitions, and extensible spine architecture.
4. **Pass 4 — Feature slices & entities:** implement onboarding, auth, profile, discovery, inbox, settings, and interaction flows against repository contracts.
5. **Pass 5 — Seed, mocks, fixtures, and local integration:** wire local seed data, mock content, factories, and developer-ready test flows.
6. **Pass 6 — Hardening & QA scaffolds:** finish e2e support, QA checklists, docs updates, and handoff polish for downstream refinement.

## Pass 1 Status
This pass is complete when every directory exists, every otherwise-empty directory contains a `.gitkeep`, root scaffold files are present, and the project is ready for Pass 2 without refactoring.
