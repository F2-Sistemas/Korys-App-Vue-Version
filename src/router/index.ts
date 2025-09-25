import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// import BaseLayout from '@/layouts/BaseLayout.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';

import painelRoutes from '@/router/painel-routes';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Index',
            redirect: '/painel',
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
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: () => import('@/pages/errors/NotFound.vue'),
        },
        {
            path: '/painel',
            component: DashboardLayout,
            children: painelRoutes || [],
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
        return '/painel';
    }

    return true;
});

export default router;
