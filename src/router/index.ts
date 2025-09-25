import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Index',
            component: () => import('@/views/Index.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('@/views/Login.vue'),
            meta: { requiresGuest: true },
        },
        {
            path: '/forgot-password',
            name: 'ForgotPassword',
            component: () => import('@/views/ForgotPassword.vue'),
            meta: { requiresGuest: true },
        },
        {
            path: '/reset-password',
            name: 'ResetPassword',
            component: () => import('@/views/ResetPassword.vue'),
            meta: { requiresGuest: true },
        },
        {
            path: '/terms-of-use',
            name: 'TermsOfUse',
            component: () => import('@/views/TermsOfUse.vue'),
        },
        {
            path: '/privacy-policy',
            name: 'PrivacyPolicy',
            component: () => import('@/views/PrivacyPolicy.vue'),
        },
        {
            path: '/profile',
            name: 'Profile',
            component: () => import('@/views/Profile.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/status',
            name: 'Status',
            component: () => import('@/views/Status.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/help-support',
            name: 'HelpSupport',
            component: () => import('@/views/HelpSupport.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/feedback',
            name: 'Feedback',
            component: () => import('@/views/Feedback.vue'),
            meta: { requiresAuth: true },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/views/NotFound.vue'),
        },
    ],
});

// Navigation guards
router.beforeEach(async (to) => {
    const authStore = useAuthStore();

    // Ensure auth is initialized before checking routes
    await authStore.initialize();

    if (to.meta.requiresAuth && !authStore.user) {
        return '/login';
    }

    if (to.meta.requiresGuest && authStore.user) {
        return '/';
    }

    return true;
});

export default router;
