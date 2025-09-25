# Korys Health - Vue 3 Version

A comprehensive Vue 3 healthcare management system (Electronic Medical Records - EMR) built with modern Vue 3 architecture, featuring complete UI components, authentication system, and healthcare domain functionality.

## 🚀 Features

- **Vue 3 + Composition API + TypeScript** - Modern Vue development with strict typing
- **Vue Router 4** - Complete nested routing with comprehensive navigation guards
- **Pinia** - Advanced state management for Vue with authentication store
- **TanStack Vue Query** - Server state management with optimizations
- **Complete UI System** - 24+ reusable components with design system
- **TailwindCSS** - Utility-first CSS with custom healthcare theme
- **Supabase Integration** - Full authentication and database integration
- **Healthcare Domain** - Complete EMR system with all healthcare modules
- **Modern Tooling** - Vite 6.3.6, ESLint, Prettier, and advanced build system

## 🛠️ Tech Stack

- **Frontend Framework:** Vue 3.5.12
- **Language:** TypeScript with flexible configuration
- **State Management:** Pinia 2.2.4
- **Routing:** Vue Router 4.4.5
- **Server State:** TanStack Vue Query 5.83.0
- **Styling:** TailwindCSS 3.4.17 with custom healthcare theme
- **UI Components:** 24+ reusable components with Class Variance Authority
- **Icons:** Lucide Vue Next 0.462.0
- **Utilities:** VueUse, Tailwind Merge, Zod validation
- **Database:** Supabase with type-safe integration
- **Build Tool:** Vite 6.3.6 with optimized configuration
- **Additional Tools:** date-fns, Moment.js, html2canvas, jsPDF

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8081`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Vue components
│   └── ui/             # Complete UI component library (24+ components)
├── pages/              # Application pages
│   └── painel/         # Dashboard pages (main app content)
├── views/              # Public pages (auth, legal)
├── layouts/            # Layout components (Dashboard, Base, BasicDashboard)
├── router/             # Vue Router with nested routing
├── stores/             # Pinia stores (auth management)
├── composables/        # Vue composables (profiles, toast)
├── integrations/       # External services (Supabase)
├── assets/            # Static assets
├── App.vue            # Root component
├── main.ts            # App entry point
└── index.css          # Global styles with TailwindCSS
```

## 🔑 Key Components

### Core Healthcare Features
- **Dashboard** - Healthcare overview with stats and quick actions
- **Patients** - Comprehensive patient management system
- **Appointments** - Appointment scheduling system
- **Agenda** - Calendar view for healthcare scheduling
- **Prescriptions** - Digital prescription management
- **Exams** - Laboratory and diagnostic request management
- **Financeiro** - Financial management and billing system
- **Professional Network** - Healthcare collaboration tools
- **Reports** - Analytics and healthcare reporting

### Authentication & User Management
- **Login/Logout** - Complete Supabase authentication flow
- **Password Recovery** - Email-based password reset system
- **User Profile** - Profile management and settings
- **Profile Settings** - Advanced user configuration
- **Notification Settings** - Customizable notification preferences

### System & Support
- **Status Dashboard** - System health and performance monitoring
- **Notification Center** - Centralized notification management
- **Help & Support** - User assistance and support system
- **Feedback** - User feedback collection system

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔐 Environment Setup

Update the Supabase credentials in `src/integrations/supabase/client.ts` with your project details:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Vue 3 Best Practices Implemented

- ✅ Composition API with `<script setup>` syntax exclusively
- ✅ TypeScript with comprehensive typing and strict configuration
- ✅ Pinia for advanced state management with authentication store
- ✅ Vue Router 4 with nested routing and comprehensive navigation guards
- ✅ Lazy loading for all routes and components
- ✅ Proper component composition with reusable composables
- ✅ Clean code patterns with early returns and proper error handling
- ✅ Reactive data with `ref()`, `computed()`, and VueUse utilities
- ✅ Complete UI component library with design system
- ✅ Modern build optimization with Vite 6.3.6
- ✅ Type-safe Supabase integration with automatic profile management

## 📋 Current Status & Future Development

The current version includes a complete healthcare application foundation with:

### ✅ Completed
- Complete Vue 3 architecture with Composition API and TypeScript
- Full authentication system with Supabase integration
- Comprehensive UI component library (24+ components)
- Complete routing system with nested routes and guards
- Healthcare domain structure with all core modules
- Modern build system and development tooling
- Responsive design with mobile drawer navigation

### 🚧 Future Development Focus
1. Implementing full healthcare business logic in components
2. Adding comprehensive form validation with VeeValidate
3. Implementing real-time features with Supabase subscriptions
4. Adding comprehensive error handling and loading states
5. Setting up automated testing (unit, integration, e2e)
6. Performance optimization and bundle analysis
7. Accessibility improvements (WCAG compliance)
8. Advanced mobile features and PWA capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure TypeScript compilation passes
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is private and confidential.