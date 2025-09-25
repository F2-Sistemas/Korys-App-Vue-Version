<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div class="text-sm text-gray-500">Bem-vindo, {{ profile?.name || 'Usuário' }}!</div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="stat in stats" :key="stat.name" class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <component :is="stat.icon" class="h-8 w-8 text-primary" />
                    </div>
                    <div class="ml-5 w-0 flex-1">
                        <dl>
                            <dt class="text-sm font-medium text-gray-500 truncate">
                                {{ stat.name }}
                            </dt>
                            <dd class="flex items-baseline">
                                <div class="text-2xl font-semibold text-gray-900">
                                    {{ stat.value }}
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Ações Rápidas</h3>
                <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                        v-for="action in quickActions"
                        :key="action.name"
                        class="relative block w-full bg-white p-6 border-2 border-gray-300 border-dashed rounded-lg text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        @click="action.onClick"
                    >
                        <component :is="action.icon" class="mx-auto h-12 w-12 text-gray-400" />
                        <span class="mt-2 block text-sm font-medium text-gray-900">
                            {{ action.name }}
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Atividade Recente</h3>
                <div class="flow-root">
                    <ul class="-mb-8">
                        <li v-for="(activity, activityIdx) in recentActivity" :key="activity.id">
                            <div class="relative pb-8">
                                <span
                                    v-if="activityIdx !== recentActivity.length - 1"
                                    class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                />
                                <div class="relative flex items-start space-x-3">
                                    <div class="relative">
                                        <component
                                            :is="activity.icon"
                                            class="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                                        />
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <div>
                                            <div class="text-sm">
                                                <span class="font-medium text-gray-900">
                                                    {{ activity.title }}
                                                </span>
                                            </div>
                                            <p class="mt-0.5 text-sm text-gray-500">
                                                {{ activity.time }}
                                            </p>
                                        </div>
                                        <div class="mt-2 text-sm text-gray-700">
                                            <p>{{ activity.description }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Users, Calendar, Pill, FileText, UserPlus, CalendarPlus, PlusCircle, Activity } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const profile = computed(() => authStore.profile);

const stats = ref([
    { name: 'Total Pacientes', value: '24', icon: Users },
    { name: 'Consultas Hoje', value: '8', icon: Calendar },
    { name: 'Prescrições Ativas', value: '12', icon: Pill },
    { name: 'Exames Pendentes', value: '5', icon: FileText },
]);

const quickActions = ref([
    {
        name: 'Novo Paciente',
        icon: UserPlus,
        onClick: () => console.log('Novo paciente'),
    },
    {
        name: 'Agendar Consulta',
        icon: CalendarPlus,
        onClick: () => console.log('Agendar consulta'),
    },
    {
        name: 'Nova Prescrição',
        icon: PlusCircle,
        onClick: () => console.log('Nova prescrição'),
    },
]);

const recentActivity = ref([
    {
        id: 1,
        title: 'Consulta agendada',
        description: 'Paciente João Silva agendou consulta para amanhã',
        time: 'Há 2 horas',
        icon: Calendar,
    },
    {
        id: 2,
        title: 'Novo paciente cadastrado',
        description: 'Maria Santos foi adicionada ao sistema',
        time: 'Há 4 horas',
        icon: Users,
    },
    {
        id: 3,
        title: 'Prescrição enviada',
        description: 'Prescrição para Paulo Oliveira foi enviada',
        time: 'Há 6 horas',
        icon: Pill,
    },
]);
</script>
