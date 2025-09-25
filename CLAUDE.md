# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korys Health is a Vue 3 healthcare management system (Electronic Medical Records - EMR) converted from React. It features a modern Vue 3 architecture with Composition API, TypeScript, comprehensive UI components, and complete healthcare domain functionality with authentication and routing systems.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on port 8081)
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
- **Pages**: Main application pages in `src/pages/painel/` for dashboard content
- **Views**: Authentication and public pages in `src/views/`
- **Components**: Reusable UI components with comprehensive design system in `src/components/`
- **Layouts**: Multiple layout systems (`DashboardLayout.vue`, `BaseLayout.vue`, `BasicDashboardLayout.vue`)
- **UI System**: Complete component library in `src/components/ui/` (24 components)
- **Routing**: Vue Router 4 with nested routes, lazy loading and comprehensive navigation guards

### Healthcare Domain Features
Complete healthcare modules implemented:
- **Dashboard**: Overview with stats and quick actions
- **Patients**: Comprehensive patient management system
- **Appointments**: Appointment scheduling system
- **Agenda**: Calendar view for healthcare scheduling
- **Prescriptions**: Digital prescription management
- **Exams**: Laboratory and diagnostic request management
- **Financeiro**: Financial management and billing system
- **Reports**: Analytics and reporting system
- **Professional Network**: Healthcare professional collaboration tools
- **Profile & Settings**: User profile and notification management
- **Help & Support**: User assistance and feedback systems

### Styling & UI
- **TailwindCSS**: Utility-first CSS with custom healthcare design system
- **Component Library**: Complete UI system with 24+ reusable components
- **Design Tokens**: CSS custom properties for colors, spacing, and animations
- **Lucide Vue**: Comprehensive icon system
- **Class Variance Authority**: Type-safe component variants
- **Tailwind Merge**: Utility class optimization
- **TailwindCSS Animate**: Smooth animations and transitions
- **Responsive**: Mobile-first responsive design with drawer navigation

## Configuration Files

- **TypeScript**: `tsconfig.json` with flexible configuration and comprehensive path aliases
- **Vite**: Custom server config (port 8081, IPv6 support), extensive path aliases, Vue 3 optimizations
- **TailwindCSS**: Extended theme with custom healthcare color palette and animations
- **PostCSS**: Configured for TailwindCSS processing with typography plugin
- **ESLint**: Comprehensive linting with TypeScript and Vue support

## Code Conventions

- **Composition API**: Use `<script setup>` syntax exclusively
- **TypeScript**: Strict typing throughout, no Options API usage
- **File Naming**: PascalCase for Vue components, camelCase for utilities
- **Import Aliases**: Use `@/` for src paths
- **State**: Reactive data with `ref()` and `computed()`, Pinia for global state

## Key Implementation Notes

- **Vue 3 Optimizations**: Disabled Options API and production devtools in Vite config
- **Authentication Flow**: Supabase handles auth with automatic profile sync and initialization
- **Route Protection**: Comprehensive meta-based auth requirements with beforeEach guard
- **Nested Routing**: Dashboard routes nested under `/painel` with dedicated layout
- **Error Handling**: Comprehensive error handling in auth store and queries
- **Server Config**: Runs on `::` (all interfaces) port 8081 for development
- **Modern Dependencies**: Latest versions with Vite 6.3.6, Vue 3.5.12, and enhanced tooling

## Environment Setup

Update Supabase credentials in `src/integrations/supabase/client.ts`:
```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

Current configuration uses:
- URL: `https://vkxawxuiyckrueemjzit.supabase.co`
- Database types available in `src/integrations/supabase/types.ts`