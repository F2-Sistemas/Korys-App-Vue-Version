# Korys Health - Vue 3 Version

A Vue 3 conversion of the React-based healthcare management system, built with modern Vue 3 features and best practices.

## 🚀 Features

- **Vue 3 + Composition API + TypeScript** - Modern Vue development
- **Vue Router 4** - Complete routing with navigation guards
- **Pinia** - State management for Vue
- **TanStack Vue Query** - Server state management
- **TailwindCSS** - Utility-first CSS framework
- **Supabase Integration** - Authentication and database
- **Healthcare Domain** - Electronic Medical Records (EMR) system

## 🛠️ Tech Stack

- **Frontend Framework:** Vue 3.5.12
- **Language:** TypeScript
- **State Management:** Pinia 2.2.4
- **Routing:** Vue Router 4.4.5
- **Server State:** TanStack Vue Query 5.83.0
- **Styling:** TailwindCSS 3.4.17
- **Icons:** Lucide Vue Next 0.462.0
- **Database:** Supabase
- **Build Tool:** Vite 5.4.0

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Install missing dependencies:
```bash
npm install tailwindcss-animate date-fns
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── components/          # Vue components
├── views/              # Route pages
├── router/             # Vue Router configuration
├── stores/             # Pinia stores
├── composables/        # Vue composables
├── integrations/       # External services (Supabase)
├── assets/            # Static assets
├── App.vue            # Root component
├── main.ts            # App entry point
└── index.css          # Global styles
```

## 🔑 Key Components

### Core Features
- **Dashboard** - Overview with stats and quick actions
- **Patients** - Patient management system
- **Appointments** - Scheduling and calendar view
- **Prescriptions** - Digital prescription management
- **Exam Requests** - Laboratory and diagnostic requests
- **Financial** - Billing and accounts receivable
- **Professional Network** - Collaboration tools

### Authentication
- **Login/Logout** - Supabase authentication
- **Password Recovery** - Email-based password reset
- **User Profile** - Profile management

### System
- **Status Dashboard** - System health monitoring
- **Reports** - Analytics and reporting
- **Notifications** - Real-time notifications
- **Help & Support** - User assistance

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

- ✅ Composition API with `<script setup>`
- ✅ TypeScript with proper typing
- ✅ Pinia for state management
- ✅ Vue Router with navigation guards
- ✅ Lazy loading for routes and components
- ✅ Proper component composition
- ✅ Clean code patterns with early returns
- ✅ Reactive data with `ref()` and `computed()`

## 📋 TODO

The current version includes all main routes and components as placeholders. Future development should focus on:

1. Implementing full component functionality
2. Adding form validation with VeeValidate
3. Implementing real-time features with Supabase subscriptions
4. Adding comprehensive error handling
5. Setting up automated testing
6. Optimizing bundle size
7. Adding accessibility features
8. Mobile responsive improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure TypeScript compilation passes
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is private and confidential.