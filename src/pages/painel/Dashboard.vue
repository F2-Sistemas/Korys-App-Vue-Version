<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
            <div class="text-sm text-muted-foreground">
                Bem-vindo, {{ profile?.name || 'Usuário' }}! 👋
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card v-for="stat in stats" :key="stat.name" class="hover:shadow-md transition-shadow">
                <CardContent class="flex items-center p-6">
                    <div class="flex-shrink-0">
                        <div :class="cn('p-2 rounded-lg', stat.bgColor)">
                            <component :is="stat.icon" :class="cn('h-6 w-6', stat.iconColor)" />
                        </div>
                    </div>
                    <div class="ml-4 flex-1 min-w-0">
                        <p class="text-sm font-medium text-muted-foreground truncate">
                            {{ stat.name }}
                        </p>
                        <div class="flex items-baseline">
                            <p class="text-2xl font-semibold">
                                {{ stat.value }}
                            </p>
                            <Badge v-if="stat.trend" :variant="stat.trendType" class="ml-2">
                                {{ stat.trend }}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Quick Actions -->
        <Card>
            <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Acesse rapidamente as funcionalidades mais utilizadas</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button
                        v-for="action in quickActions"
                        :key="action.name"
                        :variant="action.variant"
                        class="h-auto p-6 flex-col space-y-2 text-center"
                        @click="action.onClick"
                    >
                        <component :is="action.icon" class="h-8 w-8" />
                        <span class="text-sm font-medium">{{ action.name }}</span>
                    </Button>
                </div>
            </CardContent>
        </Card>

        <!-- Recent Activity -->
        <Card>
            <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Últimas ações realizadas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    <div
                        v-for="(activity, activityIdx) in recentActivity"
                        :key="activity.id"
                        class="flex items-start space-x-4"
                    >
                        <div class="flex-shrink-0">
                            <div :class="cn('p-2 rounded-lg', activity.bgColor)">
                                <component :is="activity.icon" :class="cn('h-4 w-4', activity.iconColor)" />
                            </div>
                        </div>
                        <div class="flex-1 space-y-1">
                            <p class="text-sm font-medium">{{ activity.title }}</p>
                            <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
                            <div class="flex items-center space-x-2">
                                <Badge variant="outline" class="text-xs">{{ activity.time }}</Badge>
                                <Badge :variant="activity.statusVariant" class="text-xs">
                                    {{ activity.status }}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Users, Calendar, Pill, FileText, UserPlus, CalendarPlus, PlusCircle, Activity, TrendingUp } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { cn } from '@/lib/utils';

// Import UI components
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';

const authStore = useAuthStore();

const profile = computed(() => authStore.profile);

const stats = ref([
    {
        name: 'Total Pacientes',
        value: '24',
        icon: Users,
        trend: '+12%',
        trendType: 'success',
        bgColor: 'bg-patient/10',
        iconColor: 'text-patient',
    },
    {
        name: 'Consultas Hoje',
        value: '8',
        icon: Calendar,
        trend: '+5%',
        trendType: 'success',
        bgColor: 'bg-appointment/10',
        iconColor: 'text-appointment',
    },
    {
        name: 'Prescrições Ativas',
        value: '12',
        icon: Pill,
        trend: '-2%',
        trendType: 'warning',
        bgColor: 'bg-prescription/10',
        iconColor: 'text-prescription',
    },
    {
        name: 'Exames Pendentes',
        value: '5',
        icon: FileText,
        trend: '+3%',
        trendType: 'success',
        bgColor: 'bg-exam/10',
        iconColor: 'text-exam',
    },
]);

const quickActions = ref([
    {
        name: 'Novo Paciente',
        icon: UserPlus,
        variant: 'outline',
        onClick: () => console.log('Novo paciente'),
    },
    {
        name: 'Agendar Consulta',
        icon: CalendarPlus,
        variant: 'outline',
        onClick: () => console.log('Agendar consulta'),
    },
    {
        name: 'Nova Prescrição',
        icon: PlusCircle,
        variant: 'outline',
        onClick: () => console.log('Nova prescrição'),
    },
]);

const recentActivity = ref([
    {
        id: 1,
        title: 'Consulta agendada',
        description: 'Paciente João Silva agendou consulta para amanhã',
        time: 'Há 2 horas',
        status: 'Confirmado',
        statusVariant: 'success',
        icon: Calendar,
        bgColor: 'bg-appointment/10',
        iconColor: 'text-appointment',
    },
    {
        id: 2,
        title: 'Novo paciente cadastrado',
        description: 'Maria Santos foi adicionada ao sistema',
        time: 'Há 4 horas',
        status: 'Ativo',
        statusVariant: 'success',
        icon: Users,
        bgColor: 'bg-patient/10',
        iconColor: 'text-patient',
    },
    {
        id: 3,
        title: 'Prescrição enviada',
        description: 'Prescrição para Paulo Oliveira foi enviada',
        time: 'Há 6 horas',
        status: 'Enviada',
        statusVariant: 'success',
        icon: Pill,
        bgColor: 'bg-prescription/10',
        iconColor: 'text-prescription',
    },
    {
        id: 4,
        title: 'Exame solicitado',
        description: 'Hemograma completo para Ana Costa',
        time: 'Há 8 horas',
        status: 'Pendente',
        statusVariant: 'warning',
        icon: FileText,
        bgColor: 'bg-exam/10',
        iconColor: 'text-exam',
    },
]);
</script>
