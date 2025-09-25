<template>
    <div class="flex h-screen bg-gray-100">
        <!-- Mobile sidebar overlay -->
        <Teleport to="body">
            <Transition name="overlay">
                <div v-if="mobileMenuOpen" class="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true">
                    <Transition name="backdrop">
                        <div
                            v-if="mobileMenuOpen"
                            class="fixed inset-0 bg-gray-600 bg-opacity-75"
                            @click="mobileMenuOpen = false"
                        ></div>
                    </Transition>

                    <!-- Mobile sidebar -->
                    <Transition name="slide-right">
                        <div v-if="mobileMenuOpen" class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                            <div class="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    type="button"
                                    class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                                    @click="mobileMenuOpen = false"
                                >
                                    <span class="sr-only">Fechar sidebar</span>
                                    <X class="h-6 w-6 text-white" />
                                </button>
                            </div>

                            <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div class="flex-shrink-0 flex items-center px-4">
                                    <img class="h-8 w-auto" src="@/assets/korys-health-logo.png" alt="Korys Health" />
                                </div>
                                <nav class="mt-5 px-2 space-y-1">
                                    <template v-for="item in navigation" :key="item.name">
                                        <router-link
                                            :class="[
                                                item.current
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                                'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-200',
                                            ]"
                                            :to="item.href"
                                            @click="mobileMenuOpen = false"
                                        >
                                            <component :is="item.icon" class="mr-4 flex-shrink-0 h-6 w-6" />
                                            {{ item.name }}
                                        </router-link>
                                    </template>
                                </nav>
                            </div>
                        </div>
                    </Transition>

                    <div class="flex-shrink-0 w-14">
                        <!-- Force sidebar to shrink to fit close icon -->
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Static sidebar for desktop -->
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
                <div class="flex items-center">
                    <!-- Mobile menu button -->
                    <button
                        type="button"
                        class="mobile-menu-btn md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-200"
                        @click="mobileMenuOpen = true"
                    >
                        <span class="sr-only">Abrir menu</span>
                        <Menu class="h-6 w-6 transition-transform duration-200" />
                    </button>
                    <h1 class="ml-2 md:ml-0 text-lg font-semibold text-gray-900">
                        {{ currentPageTitle }}
                    </h1>
                </div>

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
            <main class="flex-1 overflow-y-auto p-4 md:p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
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
    Menu,
    X,
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

// Mobile menu state
const mobileMenuOpen = ref(false);

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

const handleLogout = async () => {
    await authStore.signOut();
    await router.push('/login');
    emit('logout');
};
</script>

<style scoped>
/* Overlay transitions */
.overlay-enter-active,
.overlay-leave-active {
    transition: all 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
    opacity: 0;
}

/* Backdrop fade transitions */
.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}

/* Sidebar slide transitions */
.slide-right-enter-active,
.slide-right-leave-active {
    transition: transform 0.3s ease-out;
}

.slide-right-enter-from,
.slide-right-leave-to {
    transform: translateX(-100%);
}

/* Mobile menu button hover effect */
.mobile-menu-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: scale(1.05);
}

/* Enhanced focus states for accessibility */
.mobile-menu-btn:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* Smooth transitions for navigation links */
.nav-link {
    transition: all 0.2s ease-in-out;
}

.nav-link:hover {
    transform: translateX(4px);
}
</style>
