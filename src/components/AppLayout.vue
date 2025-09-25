<template>
    <div class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <div class="hidden md:flex md:w-64 md:flex-col">
            <div class="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r">
                <div class="flex items-center flex-shrink-0 px-4">
                    <img class="h-8 w-auto" src="@/assets/korys-health-logo.png" alt="Korys Health" />
                </div>
                <nav class="mt-5 flex-1 px-2 bg-white space-y-1">
                    <template v-for="item in navigation" :key="item.name">
                        <router-link
                            :class="[
                                item.current
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                'group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left',
                            ]"
                            @old-click="$emit('navigate', item.href)"
                            :to="item.href"
                        >
                            <component :is="item.icon" class="mr-3 flex-shrink-0 h-5 w-5" />
                            {{ item.name }}
                        </router-link>
                    </template>
                </nav>
            </div>
        </div>

        <!-- Main content -->
        <div class="flex flex-col flex-1">
            <!-- Top bar -->
            <div class="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
                <h1 class="text-lg font-semibold text-gray-900">
                    {{ currentPageTitle }}
                </h1>

                <!-- User menu -->
                <div class="flex items-center space-x-4">
                    <NotificationBell />
                    <UserDropdown
                        :user="user"
                        :profile="profile"
                        @logout="handleLogout"
                        @navigate-to-profile="$emit('navigate-to-profile')"
                        @navigate-to-help="$emit('navigate-to-help')"
                        @navigate-to-feedback="$emit('navigate-to-feedback')"
                    />
                </div>
            </div>

            <!-- Page content -->
            <main class="flex-1 overflow-y-auto p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '@supabase/supabase-js';
import {
    Home,
    Users,
    Calendar,
    CalendarDays,
    Pill,
    FileText,
    DollarSign,
    BarChart3,
    Activity,
    Network,
    Settings,
    Bell,
    Cog,
} from 'lucide-vue-next';

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import NotificationBell from '@/components/NotificationBell.vue';
import UserDropdown from '@/components/UserDropdown.vue';

interface Props {
    currentPage: string;
    user: User | null;
    profile: any;
}

interface Emits {
    navigate: [page: string];
    logout: [];
    'navigate-to-profile': [];
    'navigate-to-help': [];
    'navigate-to-feedback': [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();
const authStore = useAuthStore();

const profile = computed(() => authStore.profile);
const user = computed(() => authStore.user);

const navigation = computed(() => [
    { name: 'Dashboard', href: 'dashboard', icon: Home, current: props.currentPage === 'dashboard' },
    { name: 'Pacientes', href: 'patients', icon: Users, current: props.currentPage === 'patients' },
    { name: 'Consultas', href: 'appointments', icon: Calendar, current: props.currentPage === 'appointments' },
    { name: 'Agenda', href: 'agenda', icon: CalendarDays, current: props.currentPage === 'agenda' },
    { name: 'Prescrições', href: 'prescriptions', icon: Pill, current: props.currentPage === 'prescriptions' },
    { name: 'Exames', href: 'exams', icon: FileText, current: props.currentPage === 'exams' },
    { name: 'Financeiro', href: 'financeiro', icon: DollarSign, current: props.currentPage === 'financeiro' },
    { name: 'Relatórios', href: 'reports', icon: BarChart3, current: props.currentPage === 'reports' },
    { name: 'Status', href: 'status', icon: Activity, current: props.currentPage === 'status' },
    {
        name: 'Rede Profissional',
        href: 'rede-profissional',
        icon: Network,
        current: props.currentPage === 'rede-profissional',
    },
    { name: 'Perfil', href: 'perfil', icon: Settings, current: props.currentPage === 'perfil' },
    { name: 'Notificações', href: 'notificacoes', icon: Bell, current: props.currentPage === 'notificacoes' },
    {
        name: 'Config. Notificação',
        href: 'configuracoes-notificacao',
        icon: Cog,
        current: props.currentPage === 'configuracoes-notificacao',
    },
]);

const pageTitle = computed(() => {
    const titles = {
        dashboard: 'Dashboard',
        patients: 'Pacientes',
        appointments: 'Consultas',
        agenda: 'Agenda',
        prescriptions: 'Prescrições',
        exams: 'Exames',
        financeiro: 'Financeiro',
        reports: 'Relatórios',
        status: 'Status do Sistema',
        'rede-profissional': 'Rede Profissional',
        perfil: 'Configurações do Perfil',
        notificacoes: 'Central de Notificações',
        'configuracoes-notificacao': 'Configurações de Notificação',
    };
    return titles[props.currentPage as keyof typeof titles] || 'Dashboard';
});

const currentPageTitle = computed(() => pageTitle.value);

const handleLogout = async (e: any) => {
    await authStore.signOut();
    await router.push('/login');
    emit('logout');
};
</script>
