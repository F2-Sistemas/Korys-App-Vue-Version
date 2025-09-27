import { createRouter, createWebHistory } from 'vue-router';

// import BaseLayout from '@/layouts/BaseLayout.vue';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import painelRoutes from '@/router/painel-routes';
import { useAuthStore } from '@/stores/auth';

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

    // Garante que auth está inicializado
    await authStore.initialize();

    if (to.meta.requiresAuth && !authStore.user) {
        return {
            path: '/login',
            query: { redirect_to: to.fullPath }, // guarda a rota de intenção
        };
    }

    if (to.meta.requiresGuest && authStore.user) {
        return '/painel';
    }

    return true;
});

export default router;
