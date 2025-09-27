<template>
    <div class="space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 class="text-3xl font-bold text-foreground">Agenda</h1>
                <p class="text-muted-foreground mt-2">Visualize e gerencie seus agendamentos</p>
            </div>
        </div>

        <Card v-if="loading" class="w-full">
            <CardContent class="flex items-center justify-center py-12">
                <div class="text-muted-foreground">Carregando agenda...</div>
            </CardContent>
        </Card>

        <Card class="h-full">
            <CardHeader class="pb-3">
                <div class="flex flex-col gap-3">
                    <!-- View Controls - Mobile Optimized -->
                    <div class="flex gap-1 w-full">
                        <Button
                            :variant="currentView === 'day' ? 'default' : 'outline'"
                            size="sm"
                            class="flex-1 text-xs px-2"
                            @click="currentView = 'day'"
                        >
                            Dia
                        </Button>
                        <Button
                            :variant="currentView === 'week' ? 'default' : 'outline'"
                            size="sm"
                            class="flex-1 text-xs px-2"
                            @click="currentView = 'week'"
                        >
                            Semana
                        </Button>
                        <Button
                            :variant="currentView === 'month' ? 'default' : 'outline'"
                            size="sm"
                            class="flex-1 text-xs px-2"
                            @click="currentView = 'month'"
                        >
                            Mês
                        </Button>
                    </div>

                    <!-- Navigation -->
                    <div class="flex items-center justify-between">
                        <Button variant="outline" size="sm" @click="navigateDate(-1)">
                            <ChevronLeft class="h-4 w-4" />
                            Anterior
                        </Button>

                        <div class="text-lg font-semibold">
                            {{ formattedCurrentPeriod }}
                        </div>

                        <Button variant="outline" size="sm" @click="navigateDate(1)">
                            Próximo
                            <ChevronRight class="h-4 w-4" />
                        </Button>
                    </div>

                    <!-- Legend - Mobile Optimized -->
                    <div class="flex items-center justify-center gap-4 text-xs">
                        <div class="flex items-center gap-1">
                            <div class="w-2 h-2 rounded bg-primary"></div>
                            <span class="text-muted-foreground">Agendado</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="w-2 h-2 rounded bg-green-500"></div>
                            <span class="text-muted-foreground">Confirmado</span>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent class="p-3 pt-0">
                <!-- Calendar Grid -->
                <div class="calendar-container">
                    <!-- Month View -->
                    <div v-if="currentView === 'month'" class="month-view">
                        <!-- Month Header -->
                        <div class="grid grid-cols-7 gap-1 mb-2">
                            <div
                                v-for="day in weekDays"
                                :key="day"
                                class="text-center py-2 text-sm font-medium text-muted-foreground border-b"
                            >
                                {{ day }}
                            </div>
                        </div>

                        <!-- Month Grid -->
                        <div class="grid grid-cols-7 gap-1">
                            <div
                                v-for="day in monthDays"
                                :key="day.key"
                                :class="[
                                    'min-h-24 p-1 border rounded-sm',
                                    day.isCurrentMonth ? 'bg-background' : 'bg-muted/30',
                                    day.isToday ? 'bg-primary/10 border-primary' : 'border-border',
                                ]"
                            >
                                <div class="text-sm font-medium mb-1">
                                    {{ day.date.getDate() }}
                                </div>

                                <!-- Appointments for this day -->
                                <div class="space-y-1">
                                    <div
                                        v-for="appointment in getAppointmentsForDate(day.date)"
                                        :key="appointment.id"
                                        :class="[
                                            'text-xs p-1 rounded text-white cursor-pointer truncate',
                                            appointment.status === 'confirmed' ? 'bg-green-500' : 'bg-primary',
                                        ]"
                                        @click="selectAppointment(appointment)"
                                    >
                                        <div class="flex items-center gap-1">
                                            <User class="h-2.5 w-2.5 flex-shrink-0" />
                                            <span class="truncate">
                                                {{ appointment.patient?.name || 'Paciente' }} -
                                                {{ appointment.appointment_type }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Week View -->
                    <div v-if="currentView === 'week'" class="week-view">
                        <div class="grid grid-cols-8 gap-1">
                            <!-- Time column -->
                            <div class="border-r">
                                <div class="h-12 border-b"></div>
                                <div
                                    v-for="hour in timeSlots"
                                    :key="hour"
                                    class="h-16 border-b text-xs text-muted-foreground p-1"
                                >
                                    {{ hour }}:00
                                </div>
                            </div>

                            <!-- Days columns -->
                            <div v-for="day in weekDays" :key="day" class="border-r">
                                <div class="h-12 border-b p-2 text-center font-medium">
                                    {{ day }}
                                </div>

                                <div class="relative">
                                    <div v-for="hour in timeSlots" :key="hour" class="h-16 border-b"></div>

                                    <!-- Appointments positioned absolutely -->
                                    <div
                                        v-for="appointment in getAppointmentsForWeekDay(day)"
                                        :key="appointment.id"
                                        :style="getAppointmentPosition(appointment)"
                                        :class="[
                                            'absolute left-1 right-1 text-xs p-1 rounded text-white cursor-pointer z-10',
                                            appointment.status === 'confirmed' ? 'bg-green-500' : 'bg-primary',
                                        ]"
                                        @click="selectAppointment(appointment)"
                                    >
                                        <div class="truncate">
                                            {{ appointment.patient?.name || 'Paciente' }}
                                        </div>
                                        <div class="truncate">
                                            {{ appointment.appointment_type }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Day View -->
                    <div v-if="currentView === 'day'" class="day-view">
                        <div class="grid grid-cols-2 gap-1">
                            <!-- Time column -->
                            <div class="border-r">
                                <div class="h-12 border-b p-2 text-center font-medium">Horário</div>
                                <div
                                    v-for="hour in timeSlots"
                                    :key="hour"
                                    class="h-16 border-b text-sm text-muted-foreground p-2"
                                >
                                    {{ hour }}:00
                                </div>
                            </div>

                            <!-- Day column -->
                            <div>
                                <div class="h-12 border-b p-2 text-center font-medium">
                                    {{ formatDate(currentDate, 'DD/MM/YYYY') }}
                                </div>

                                <div class="relative">
                                    <div v-for="hour in timeSlots" :key="hour" class="h-16 border-b"></div>

                                    <!-- Appointments positioned absolutely -->
                                    <div
                                        v-for="appointment in getAppointmentsForDate(currentDate)"
                                        :key="appointment.id"
                                        :style="getAppointmentPosition(appointment)"
                                        :class="[
                                            'absolute left-1 right-1 text-sm p-2 rounded text-white cursor-pointer z-10',
                                            appointment.status === 'confirmed' ? 'bg-green-500' : 'bg-primary',
                                        ]"
                                        @click="selectAppointment(appointment)"
                                    >
                                        <div class="font-medium">
                                            {{ appointment.appointment_time }}
                                        </div>
                                        <div class="truncate">
                                            {{ appointment.patient?.name || 'Paciente' }}
                                        </div>
                                        <div class="truncate text-xs">
                                            {{ appointment.appointment_type }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <!-- Appointment Detail Dialog -->
        <Dialog v-model:open="showAppointmentDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalhes do Agendamento</DialogTitle>
                </DialogHeader>

                <div v-if="selectedAppointment" class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-muted-foreground">Paciente</label>
                        <p class="text-lg">{{ selectedAppointment.patient?.name || 'Não informado' }}</p>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-muted-foreground">Tipo de Consulta</label>
                        <p>{{ selectedAppointment.appointment_type }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Data</label>
                            <p>{{ formatDate(new Date(selectedAppointment.appointment_date), 'DD/MM/YYYY') }}</p>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Horário</label>
                            <p>{{ selectedAppointment.appointment_time }}</p>
                        </div>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-muted-foreground">Status</label>
                        <Badge :class="[selectedAppointment.status === 'confirmed' ? 'bg-green-500' : 'bg-primary']">
                            {{ getStatusLabel(selectedAppointment.status) }}
                        </Badge>
                    </div>

                    <div v-if="selectedAppointment.notes">
                        <label class="text-sm font-medium text-muted-foreground">Observações</label>
                        <p class="text-sm text-muted-foreground">{{ selectedAppointment.notes }}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="showAppointmentDialog = false">Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { ChevronLeft, ChevronRight, User } from 'lucide-vue-next';
import moment from 'moment';

import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import Dialog from '@/components/ui/Dialog.vue';
import DialogContent from '@/components/ui/DialogContent.vue';
import DialogFooter from '@/components/ui/DialogFooter.vue';
import DialogHeader from '@/components/ui/DialogHeader.vue';
import DialogTitle from '@/components/ui/DialogTitle.vue';
import { type Appointment, useAppointments } from '@/composables/useAppointments';
import { supabase } from '@/integrations/supabase/client';

// Set moment locale to Portuguese
moment.locale('pt-br');

const currentView = ref<'day' | 'week' | 'month'>('month');
const currentDate = ref(new Date());
const showAppointmentDialog = ref(false);
const selectedAppointment = ref<Appointment | null>(null);

const { appointments, scheduledAppointments, loading, fetchAppointments, setupRealtimeSubscription } =
    useAppointments();

// Week days in Portuguese
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Time slots for day/week view
const timeSlots = Array.from({ length: 16 }, (_, i) => i + 6); // 6:00 to 21:00

const formattedCurrentPeriod = computed(() => {
    if (currentView.value === 'month') {
        return moment(currentDate.value).format('MMMM YYYY');
    } else if (currentView.value === 'week') {
        const startOfWeek = moment(currentDate.value).startOf('week');
        const endOfWeek = moment(currentDate.value).endOf('week');
        return `${startOfWeek.format('DD/MM')} - ${endOfWeek.format('DD/MM/YYYY')}`;
    } else {
        return moment(currentDate.value).format('DD/MM/YYYY - dddd');
    }
});

const monthDays = computed(() => {
    const start = moment(currentDate.value).startOf('month').startOf('week');
    const end = moment(currentDate.value).endOf('month').endOf('week');
    const days = [];
    let current = start.clone();

    while (current.isSameOrBefore(end)) {
        days.push({
            key: current.format('YYYY-MM-DD'),
            date: current.toDate(),
            isCurrentMonth: current.month() === moment(currentDate.value).month(),
            isToday: current.isSame(moment(), 'day'),
        });
        current.add(1, 'day');
    }

    return days;
});

const navigateDate = (direction: number) => {
    const newDate = moment(currentDate.value);

    if (currentView.value === 'month') {
        newDate.add(direction, 'month');
    } else if (currentView.value === 'week') {
        newDate.add(direction, 'week');
    } else {
        newDate.add(direction, 'day');
    }

    currentDate.value = newDate.toDate();

    // Fetch appointments for the new date range
    fetchAppointmentsForCurrentView();
};

const fetchAppointmentsForCurrentView = async () => {
    console.log('fetchAppointmentsForCurrentView called with view:', currentView.value);

    let startDate: string;
    let endDate: string;

    if (currentView.value === 'month') {
        // Get the entire month view including overflow days
        const start = moment(currentDate.value).startOf('month').startOf('week');
        const end = moment(currentDate.value).endOf('month').endOf('week');
        startDate = start.format('YYYY-MM-DD');
        endDate = end.format('YYYY-MM-DD');
    } else if (currentView.value === 'week') {
        const start = moment(currentDate.value).startOf('week');
        const end = moment(currentDate.value).endOf('week');
        startDate = start.format('YYYY-MM-DD');
        endDate = end.format('YYYY-MM-DD');
    } else {
        // Day view - just get the current day
        startDate = moment(currentDate.value).format('YYYY-MM-DD');
        endDate = startDate;
    }

    console.log('Fetching appointments from', startDate, 'to', endDate);
    await fetchAppointments(startDate, endDate);
};

const formatDate = (date: Date, format: string) => {
    return moment(date).format(format);
};

const getAppointmentsForDate = (date: Date) => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    return scheduledAppointments.value.filter((appointment) => appointment.appointment_date === dateStr);
};

const getAppointmentsForWeekDay = (dayName: string) => {
    // Implementation depends on week view logic
    const weekStart = moment(currentDate.value).startOf('week');
    const dayIndex = weekDays.indexOf(dayName);
    const targetDate = weekStart.clone().add(dayIndex, 'day');
    return getAppointmentsForDate(targetDate.toDate());
};

const getAppointmentPosition = (appointment: Appointment) => {
    const [hours, minutes] = appointment.appointment_time.split(':');
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const startMinutes = 6 * 60; // 6:00 AM
    const pixelsPerMinute = 64 / 60; // 64px per hour / 60 minutes

    const top = (totalMinutes - startMinutes) * pixelsPerMinute;
    const height = (appointment.duration || 60) * pixelsPerMinute;

    return {
        top: `${top}px`,
        height: `${Math.max(height, 20)}px`,
    };
};

const selectAppointment = (appointment: Appointment) => {
    selectedAppointment.value = appointment;
    showAppointmentDialog.value = true;
};

const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
        scheduled: 'Agendado',
        confirmed: 'Confirmado',
        in_progress: 'Em Andamento',
        completed: 'Concluído',
        cancelled: 'Cancelado',
        pending: 'Pendente',
    };
    return labels[status] || status;
};

// Watch for view changes to fetch appropriate data
const currentViewWatcher = watch(currentView, () => {
    console.log('View changed to:', currentView.value);
    fetchAppointmentsForCurrentView();
});

let realtimeChannel: any = null;

onMounted(async () => {
    console.log('AgendaCalendar mounted!');

    await fetchAppointments('2025-09-01', '2025-09-30');

    // Initial load with current view optimization
    await fetchAppointmentsForCurrentView();

    // Setup realtime subscription
    realtimeChannel = setupRealtimeSubscription();
});

onUnmounted(async () => {
    console.log('AgendaCalendar unmounted');

    // Stop watcher
    if (currentViewWatcher) {
        currentViewWatcher();
    }

    // Cleanup realtime subscription
    if (realtimeChannel && typeof realtimeChannel.unsubscribe === 'function') {
        realtimeChannel.unsubscribe();
    }
});
</script>

<style scoped>
.calendar-container {
    min-height: 400px;
    max-height: 600px;
    overflow: auto;
}

.month-view,
.week-view,
.day-view {
    font-size: 12px;
}

@media (min-width: 640px) {
    .month-view,
    .week-view,
    .day-view {
        font-size: 14px;
    }
}
</style>
