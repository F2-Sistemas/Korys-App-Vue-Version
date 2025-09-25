<template>
    <div v-if="!authStore.user" class="flex min-h-screen items-center justify-center">
        <div class="flex flex-col items-center gap-4">
            <img src="@/assets/korys-health-logo.png" alt="Korys Health Logo" class="h-10 w-auto" />
            <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>
    </div>

    <AppLayout
        v-else
        :current-page="currentPage"
        :user="authStore.user"
        :profile="authStore.profile"
        @navigate="setCurrentPage"
        @logout="handleLogout"
        @navigate-to-profile="() => $router.push('/profile')"
        @navigate-to-help="() => $router.push('/help-support')"
        @navigate-to-feedback="() => $router.push('/feedback')"
    >
        <component :is="currentComponent" />
    </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { supabase } from '@/integrations/supabase/client';

// Lazy-loaded components
import AppLayout from '@/components/AppLayout.vue';

const Dashboard = () => import('@/pages/painel/Dashboard.vue');
const Patients = () => import('@/pages/painel/Patients.vue');
const Appointments = () => import('@/pages/painel/Appointments.vue');
const AgendaCalendar = () => import('@/pages/painel/AgendaCalendar.vue');
const Prescriptions = () => import('@/pages/painel/Prescriptions.vue');
const ExamRequests = () => import('@/pages/painel/ExamRequests.vue');
const Financeiro = () => import('@/pages/painel/Financeiro.vue');
const Reports = () => import('@/pages/painel/Reports.vue');
const Status = () => import('@/pages/painel/Status.vue');
const ProfessionalNetwork = () => import('@/pages/painel/ProfessionalNetwork.vue');
const ProfileSettings = () => import('@/pages/painel/ProfileSettings.vue');
const NotificationCenter = () => import('@/pages/painel/NotificationCenter.vue');
const NotificationSettings = () => import('@/pages/painel/NotificationSettings.vue');

const router = useRouter();
const authStore = useAuthStore();

const currentPage = ref('dashboard');

const components = {
    dashboard: Dashboard,
    patients: Patients,
    appointments: Appointments,
    agenda: AgendaCalendar,
    prescriptions: Prescriptions,
    exams: ExamRequests,
    financeiro: Financeiro,
    reports: Reports,
    status: Status,
    'rede-profissional': ProfessionalNetwork,
    perfil: ProfileSettings,
    notificacoes: NotificationCenter,
    'configuracoes-notificacao': NotificationSettings,
};

const currentComponent = computed(async () => {
    return components[currentPage.value as keyof typeof components] || Dashboard;
});

const setCurrentPage = (page: string) => {
    currentPage.value = page;
};

const handleLogout = async () => {
    await authStore.signOut();
    router.push('/login');
};

const createAdminUser = async () => {
    try {
        await supabase.functions.invoke('create-admin');
    } catch (error) {
        // Silently handle error
    }
};

onMounted(() => {
    createAdminUser();
});
</script>
