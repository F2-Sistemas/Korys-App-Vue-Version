<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-3xl font-bold tracking-tight">Consultas</h1>
                <p class="text-muted-foreground">Gerencie os agendamentos e consultas médicas</p>
            </div>
            <div class="flex gap-2">
                <Button variant="outline" size="sm">
                    <Calendar class="mr-2 h-4 w-4" />
                    Ver Calendário
                </Button>
                <Button @click="openAddAppointmentDialog">
                    <CalendarPlus class="mr-2 h-4 w-4" />
                    Agendar Consulta
                </Button>
            </div>
        </div>

        <!-- Filters and Search -->
        <Card>
            <CardContent class="p-6">
                <div class="flex flex-col gap-4 md:flex-row md:items-center">
                    <div class="flex-1">
                        <Input
                            v-model="searchQuery"
                            placeholder="Buscar por paciente, médico ou procedimento..."
                            class="max-w-sm"
                        />
                    </div>
                    <div class="flex gap-2">
                        <Badge
                            v-for="status in statusFilters"
                            :key="status.value"
                            :variant="status.active ? 'default' : 'outline'"
                            class="cursor-pointer"
                            @click="toggleStatusFilter(status.value)"
                        >
                            {{ status.label }}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card class="cursor-pointer hover:shadow-md transition-shadow" @click="showTodayAppointments">
                <CardContent class="p-6">
                    <div class="flex items-center space-x-4">
                        <div class="p-2 rounded-lg bg-appointment/10">
                            <Calendar class="h-6 w-6 text-appointment" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ todayAppointments.length }}</p>
                            <p class="text-sm text-muted-foreground">Consultas Hoje</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card class="cursor-pointer hover:shadow-md transition-shadow" @click="showUpcomingAppointments">
                <CardContent class="p-6">
                    <div class="flex items-center space-x-4">
                        <div class="p-2 rounded-lg bg-success/10">
                            <Clock class="h-6 w-6 text-success" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ upcomingAppointments.length }}</p>
                            <p class="text-sm text-muted-foreground">Próximas Consultas</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card class="cursor-pointer hover:shadow-md transition-shadow" @click="showPendingAppointments">
                <CardContent class="p-6">
                    <div class="flex items-center space-x-4">
                        <div class="p-2 rounded-lg bg-warning/10">
                            <AlertCircle class="h-6 w-6 text-warning" />
                        </div>
                        <div>
                            <p class="text-2xl font-bold">{{ pendingAppointments.length }}</p>
                            <p class="text-sm text-muted-foreground">Aguardando Confirmação</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Appointments Table -->
        <Card>
            <CardHeader>
                <CardTitle>Lista de Consultas</CardTitle>
                <CardDescription>Total de {{ filteredAppointments.length }} consultas encontradas</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[200px]">Paciente</TableHead>
                            <TableHead>Médico</TableHead>
                            <TableHead>Data e Hora</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Duração</TableHead>
                            <TableHead class="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="appointment in filteredAppointments" :key="appointment.id">
                            <TableCell class="font-medium">
                                <div class="flex items-center space-x-3">
                                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-patient/10">
                                        <User class="h-4 w-4 text-patient" />
                                    </div>
                                    <div>
                                        <div class="font-medium">{{ appointment.patientName }}</div>
                                        <div class="text-sm text-muted-foreground">
                                            {{ appointment.patientPhone }}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{{ appointment.doctorName }}</TableCell>
                            <TableCell>
                                <div>
                                    <div class="font-medium">{{ formatDateTime(appointment.datetime) }}</div>
                                    <div class="text-sm text-muted-foreground">
                                        {{ formatTime(appointment.datetime) }}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{{ appointment.type }}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge :variant="getStatusVariant(appointment.status)">
                                    {{ appointment.status }}
                                </Badge>
                            </TableCell>
                            <TableCell>{{ appointment.duration }} min</TableCell>
                            <TableCell>
                                <div class="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon" @click="viewAppointment(appointment)">
                                        <Eye class="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" @click="editAppointment(appointment)">
                                        <Edit class="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        @click="cancelAppointment(appointment)"
                                        class="text-destructive hover:text-destructive"
                                    >
                                        <X class="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { CalendarPlus, Calendar, Clock, AlertCircle, User, Eye, Edit, X } from 'lucide-vue-next';
// import { cn } from '@/lib/utils';

// Import UI components
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import Input from '@/components/ui/Input.vue';
import Table from '@/components/ui/Table.vue';
import TableBody from '@/components/ui/TableBody.vue';
import TableCell from '@/components/ui/TableCell.vue';
import TableHead from '@/components/ui/TableHead.vue';
import TableHeader from '@/components/ui/TableHeader.vue';
import TableRow from '@/components/ui/TableRow.vue';

// Data and state
const searchQuery = ref('');

interface Appointment {
    id: string;
    patientName: string;
    patientPhone: string;
    doctorName: string;
    datetime: string;
    type: string;
    status: 'Confirmado' | 'Pendente' | 'Cancelado' | 'Concluído';
    duration: number;
}

const appointments = ref<Appointment[]>([
    {
        id: '1',
        patientName: 'João Silva Santos',
        patientPhone: '(11) 99999-9999',
        doctorName: 'Dr. Carlos Medeiros',
        datetime: '2024-01-25T09:00:00',
        type: 'Consulta Geral',
        status: 'Confirmado',
        duration: 30,
    },
    {
        id: '2',
        patientName: 'Maria Santos Oliveira',
        patientPhone: '(11) 88888-8888',
        doctorName: 'Dra. Ana Costa',
        datetime: '2024-01-25T10:30:00',
        type: 'Cardiologia',
        status: 'Confirmado',
        duration: 45,
    },
    {
        id: '3',
        patientName: 'Pedro Costa Lima',
        patientPhone: '(11) 77777-7777',
        doctorName: 'Dr. Roberto Silva',
        datetime: '2024-01-25T14:00:00',
        type: 'Neurologia',
        status: 'Pendente',
        duration: 60,
    },
    {
        id: '4',
        patientName: 'Ana Paula Silva',
        patientPhone: '(11) 66666-6666',
        doctorName: 'Dra. Fernanda Lima',
        datetime: '2024-01-26T08:30:00',
        type: 'Dermatologia',
        status: 'Confirmado',
        duration: 30,
    },
    {
        id: '5',
        patientName: 'Carlos Eduardo',
        patientPhone: '(11) 55555-5555',
        doctorName: 'Dr. Paulo Santos',
        datetime: '2024-01-26T15:00:00',
        type: 'Ortopedia',
        status: 'Concluído',
        duration: 45,
    },
]);

const statusFilters = ref([
    { label: 'Todos', value: 'all', active: true },
    { label: 'Confirmados', value: 'Confirmado', active: false },
    { label: 'Pendentes', value: 'Pendente', active: false },
    { label: 'Concluídos', value: 'Concluído', active: false },
]);

// Computed properties
const filteredAppointments = computed(() => {
    let filtered = appointments.value;

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
            (appointment) =>
                appointment.patientName.toLowerCase().includes(query) ||
                appointment.doctorName.toLowerCase().includes(query) ||
                appointment.type.toLowerCase().includes(query)
        );
    }

    // Filter by status
    const activeStatusFilters = statusFilters.value.filter((filter) => filter.active);
    if (activeStatusFilters.length > 0 && !activeStatusFilters.some((filter) => filter.value === 'all')) {
        filtered = filtered.filter((appointment) =>
            activeStatusFilters.some((filter) => filter.value === appointment.status)
        );
    }

    return filtered;
});

const todayAppointments = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.value.filter((app) => app.datetime.startsWith(today));
});

const upcomingAppointments = computed(() => {
    const now = new Date();
    return appointments.value.filter((app) => new Date(app.datetime) > now && app.status === 'Confirmado');
});

const pendingAppointments = computed(() => {
    return appointments.value.filter((app) => app.status === 'Pendente');
});

// Methods
const toggleStatusFilter = (value: string) => {
    const filter = statusFilters.value.find((f) => f.value === value);
    if (filter) {
        if (value === 'all') {
            statusFilters.value.forEach((f) => {
                f.active = f.value === 'all';
            });
        } else {
            const allFilter = statusFilters.value.find((f) => f.value === 'all');
            if (allFilter) allFilter.active = false;

            filter.active = !filter.active;

            const hasActiveFilters = statusFilters.value.some((f) => f.value !== 'all' && f.active);
            if (!hasActiveFilters && allFilter) {
                allFilter.active = true;
            }
        }
    }
};

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
};

const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Confirmado':
            return 'success';
        case 'Pendente':
            return 'warning';
        case 'Cancelado':
            return 'destructive';
        case 'Concluído':
            return 'outline';
        default:
            return 'outline';
    }
};

// Action methods
const openAddAppointmentDialog = () => {
    console.log('Opening add appointment dialog');
    // TODO: Implement dialog
};

const viewAppointment = (appointment: Appointment) => {
    console.log('Viewing appointment:', appointment);
    // TODO: Navigate to appointment details page
};

const editAppointment = (appointment: Appointment) => {
    console.log('Editing appointment:', appointment);
    // TODO: Open edit appointment dialog
};

const cancelAppointment = (appointment: Appointment) => {
    console.log('Canceling appointment:', appointment);
    // TODO: Show confirmation dialog and cancel appointment
};

const showTodayAppointments = () => {
    console.log('Showing today appointments');
    // TODO: Filter to show only today appointments
};

const showUpcomingAppointments = () => {
    console.log('Showing upcoming appointments');
    // TODO: Filter to show only upcoming appointments
};

const showPendingAppointments = () => {
    console.log('Showing pending appointments');
    // TODO: Filter to show only pending appointments
};
</script>
