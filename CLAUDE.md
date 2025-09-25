# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korys Health is a Vue 3 healthcare management system (Electronic Medical Records - EMR) converted from React. It uses modern Vue 3 features including the Composition API, TypeScript, and a comprehensive healthcare-focused architecture.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on port 8080)
npm run dev

# Build for production (includes TypeScript compilation)
npm run build

# Build for development mode
npm run build:dev

# Lint and fix code issues
npm run lint

# Preview production build
npm run preview
```

## Architecture Overview

### State Management
- **Pinia**: Main state management with `src/stores/auth.ts` handling authentication
- **TanStack Vue Query**: Server state management with 5-minute stale time and retry logic
- **Composables**: Reusable composition functions in `src/composables/`

### Authentication & Backend
- **Supabase Integration**: Database and authentication via `src/integrations/supabase/`
- **Profile Management**: Automatic profile creation and sync in auth store
- **Route Guards**: Authentication required for main app routes, guest-only for login/register

### Component Architecture
- **Views**: Page-level components in `src/views/`
- **Components**: Reusable UI components in `src/components/`
- **Layout**: `AppLayout.vue` provides main application shell
- **Routing**: Vue Router 4 with lazy loading and navigation guards

### Healthcare Domain Features
Core healthcare modules include:
- **Dashboard**: Overview with stats and quick actions
- **Patients**: Patient management system
- **Appointments**: Scheduling with calendar view
- **Prescriptions**: Digital prescription management
- **Exam Requests**: Laboratory and diagnostic requests
- **Financial**: Billing and accounts receivable
- **Professional Network**: Collaboration tools

### Styling & UI
- **TailwindCSS**: Utility-first CSS with custom design system
- **CSS Custom Properties**: Design tokens for colors, spacing, and animations
- **Lucide Vue**: Icon system
- **Responsive**: Mobile-first responsive design

## Configuration Files

- **TypeScript**: `tsconfig.json` with strict mode and path aliases (`@/` → `src/`)
- **Vite**: Custom server config (port 8080, IPv6 support), Vue 3 optimizations
- **TailwindCSS**: Extended theme with custom color palette and animations
- **PostCSS**: Configured for TailwindCSS processing

## Code Conventions

- **Composition API**: Use `<script setup>` syntax exclusively
- **TypeScript**: Strict typing throughout, no Options API usage
- **File Naming**: PascalCase for Vue components, camelCase for utilities
- **Import Aliases**: Use `@/` for src paths
- **State**: Reactive data with `ref()` and `computed()`, Pinia for global state

## Key Implementation Notes

- **Vue 3 Optimizations**: Disabled Options API and production devtools in Vite config
- **Authentication Flow**: Supabase handles auth with automatic profile sync
- **Route Protection**: Meta-based auth requirements with beforeEach guard
- **Error Handling**: Comprehensive error handling in auth store and queries
- **Server Config**: Runs on `::` (all interfaces) port 8080 for development

## Environment Setup

Update Supabase credentials in `src/integrations/supabase/client.ts`:
```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

Current configuration uses:
- URL: `https://vkxawxuiyckrueemjzit.supabase.co`
- Database types available in `src/integrations/supabase/types.ts`