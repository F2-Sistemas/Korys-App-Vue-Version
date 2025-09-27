<template>
    <Card>
        <CardHeader>
            <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2">
                    <CalendarIcon class="h-5 w-5" />
                    Calendário de Interações
                </CardTitle>
                <div class="flex gap-2">
                    <Button
                        :variant="currentView === 'day' ? 'default' : 'outline'"
                        size="sm"
                        @click="currentView = 'day'"
                    >
                        Dia
                    </Button>
                    <Button
                        :variant="currentView === 'week' ? 'default' : 'outline'"
                        size="sm"
                        @click="currentView = 'week'"
                    >
                        Semana
                    </Button>
                    <Button
                        :variant="currentView === 'month' ? 'default' : 'outline'"
                        size="sm"
                        @click="currentView = 'month'"
                    >
                        Mês
                    </Button>
                </div>
            </div>
            <div class="flex gap-4 text-sm">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Consultas</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Exames</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Prescrições</span>
                </div>
            </div>
        </CardHeader>

        <CardContent>
            <div class="h-[500px]">
                <!-- Calendar Navigation -->
                <div class="flex items-center justify-between mb-4">
                    <Button variant="outline" size="sm" @click="navigateDate(-1)">
                        <ChevronLeft class="h-4 w-4" />
                        Anterior
                    </Button>

                    <h3 class="text-lg font-semibold">
                        {{ formattedCurrentPeriod }}
                    </h3>

                    <Button variant="outline" size="sm" @click="navigateDate(1)">
                        Próximo
                        <ChevronRight class="h-4 w-4" />
                    </Button>
                </div>

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
                                'min-h-20 p-1 border rounded-sm',
                                day.isCurrentMonth ? 'bg-background' : 'bg-muted/30',
                                day.isToday ? 'bg-primary/10 border-primary' : 'border-border',
                            ]"
                        >
                            <div class="text-sm font-medium mb-1">
                                {{ day.date.getDate() }}
                            </div>

                            <!-- Events for this day -->
                            <div class="space-y-1">
                                <div
                                    v-for="event in getEventsForDate(day.date)"
                                    :key="event.id"
                                    :class="[
                                        'text-xs p-1 rounded text-white cursor-pointer truncate flex items-center gap-1',
                                        getEventColor(event.resource.type),
                                    ]"
                                    @click="selectEvent(event)"
                                >
                                    <component
                                        :is="getEventIcon(event.resource.type)"
                                        class="h-2.5 w-2.5 flex-shrink-0"
                                    />
                                    <span class="truncate">{{ event.title }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Week/Day View -->
                <div v-else class="time-view">
                    <div :class="currentView === 'week' ? 'grid grid-cols-8 gap-1' : 'grid grid-cols-2 gap-1'">
                        <!-- Time column -->
                        <div class="border-r">
                            <div class="h-12 border-b"></div>
                            <div
                                v-for="hour in timeSlots"
                                :key="hour"
                                class="h-12 border-b text-xs text-muted-foreground p-1"
                            >
                                {{ hour }}:00
                            </div>
                        </div>

                        <!-- Days columns -->
                        <div v-for="(day, index) in getViewDays()" :key="index" class="border-r relative">
                            <div class="h-12 border-b p-2 text-center font-medium text-sm">
                                {{ formatDate(day, currentView === 'week' ? 'ddd DD/MM' : 'DD/MM/YYYY') }}
                            </div>

                            <div class="relative">
                                <div v-for="hour in timeSlots" :key="hour" class="h-12 border-b"></div>

                                <!-- Events positioned absolutely -->
                                <div
                                    v-for="event in getEventsForDate(day)"
                                    :key="event.id"
                                    :style="getEventPosition(event)"
                                    :class="[
                                        'absolute left-1 right-1 text-xs p-1 rounded text-white cursor-pointer z-10 flex items-center gap-1',
                                        getEventColor(event.resource.type),
                                    ]"
                                    @click="selectEvent(event)"
                                >
                                    <component :is="getEventIcon(event.resource.type)" class="h-3 w-3 flex-shrink-0" />
                                    <div class="truncate">
                                        <div class="font-medium">{{ event.title }}</div>
                                        <div class="text-xs opacity-90">
                                            {{
                                                event.start.toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })
                                            }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>

        <!-- Event Detail Dialog -->
        <Dialog v-model:open="showEventDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalhes do Evento</DialogTitle>
                </DialogHeader>

                <div v-if="selectedEvent" class="space-y-4">
                    <div>
                        <label class="text-sm font-medium text-muted-foreground">Tipo</label>
                        <div class="flex items-center gap-2 mt-1">
                            <component :is="getEventIcon(selectedEvent.resource.type)" class="h-4 w-4" />
                            <span class="capitalize">{{ getEventTypeLabel(selectedEvent.resource.type) }}</span>
                        </div>
                    </div>

                    <div>
                        <label class="text-sm font-medium text-muted-foreground">Título</label>
                        <p>{{ selectedEvent.title }}</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-sm font-medium text-muted-foreground">Data</label>
                            <p>{{ formatDate(selectedEvent.start, 'DD/MM/YYYY') }}</p>
                        </div>
                        <div v-if="selectedEvent.resource.type !== 'prescription'">
                            <label class="text-sm font-medium text-muted-foreground">Horário</label>
                            <p>
                                {{
                                    selectedEvent.start.toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })
                                }}
                            </p>
                        </div>
                    </div>

                    <div v-if="selectedEvent.resource.data.notes">
                        <label class="text-sm font-medium text-muted-foreground">Observações</label>
                        <p class="text-sm text-muted-foreground">{{ selectedEvent.resource.data.notes }}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" @click="showEventDialog = false">Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import moment from 'moment';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import Button from '@/components/ui/Button.vue';
import Dialog from '@/components/ui/Dialog.vue';
import DialogContent from '@/components/ui/DialogContent.vue';
import DialogHeader from '@/components/ui/DialogHeader.vue';
import DialogTitle from '@/components/ui/DialogTitle.vue';
import DialogFooter from '@/components/ui/DialogFooter.vue';
import { CalendarIcon, ChevronLeft, ChevronRight, Stethoscope, FileText, Pill, Clock } from 'lucide-vue-next';

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: {
        type: 'appointment' | 'exam' | 'prescription';
        data: any;
    };
}

interface Props {
    patientId: string;
    appointments: any[];
    examRequests: any[];
    prescriptions: any[];
}

const props = defineProps<Props>();

const currentView = ref<'day' | 'week' | 'month'>('month');
const currentDate = ref(new Date());
const showEventDialog = ref(false);
const selectedEvent = ref<CalendarEvent | null>(null);

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

const events = computed((): CalendarEvent[] => {
    const calendarEvents: CalendarEvent[] = [];

    // Add appointments
    props.appointments.forEach((appointment) => {
        const appointmentDate = new Date(appointment.appointment_date);
        const [hours, minutes] = appointment.appointment_time.split(':');
        appointmentDate.setHours(parseInt(hours), parseInt(minutes));

        const endDate = new Date(appointmentDate);
        endDate.setMinutes(endDate.getMinutes() + (appointment.duration || 60));

        calendarEvents.push({
            id: `appointment-${appointment.id}`,
            title: `Consulta: ${appointment.appointment_type}`,
            start: appointmentDate,
            end: endDate,
            resource: {
                type: 'appointment',
                data: appointment,
            },
        });
    });

    // Add exam requests (scheduled ones)
    props.examRequests
        .filter((exam) => exam.scheduled_date)
        .forEach((exam) => {
            const examDate = new Date(exam.scheduled_date);
            if (exam.scheduled_time) {
                const [hours, minutes] = exam.scheduled_time.split(':');
                examDate.setHours(parseInt(hours), parseInt(minutes));
            }

            const endDate = new Date(examDate);
            endDate.setHours(endDate.getHours() + 1); // Default 1 hour duration

            calendarEvents.push({
                id: `exam-${exam.id}`,
                title: `Exame: ${exam.exam_type}`,
                start: examDate,
                end: endDate,
                resource: {
                    type: 'exam',
                    data: exam,
                },
            });
        });

    // Add prescriptions (by creation date)
    props.prescriptions.forEach((prescription) => {
        const prescriptionDate = new Date(prescription.prescription_date);

        calendarEvents.push({
            id: `prescription-${prescription.id}`,
            title: `Prescrição: ${prescription.medications?.length || 0} medicamento(s)`,
            start: prescriptionDate,
            end: prescriptionDate,
            resource: {
                type: 'prescription',
                data: prescription,
            },
        });
    });

    return calendarEvents;
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
};

const formatDate = (date: Date, format: string) => {
    return moment(date).format(format);
};

const getViewDays = () => {
    if (currentView.value === 'week') {
        const start = moment(currentDate.value).startOf('week');
        return Array.from({ length: 7 }, (_, i) => start.clone().add(i, 'day').toDate());
    } else {
        return [currentDate.value];
    }
};

const getEventsForDate = (date: Date) => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    return events.value.filter((event) => {
        const eventDateStr = moment(event.start).format('YYYY-MM-DD');
        return eventDateStr === dateStr;
    });
};

const getEventPosition = (event: CalendarEvent) => {
    if (event.resource.type === 'prescription') {
        // Prescriptions appear at top of day
        return {
            top: '2px',
            height: '20px',
        };
    }

    const startHours = event.start.getHours();
    const startMinutes = event.start.getMinutes();
    const totalStartMinutes = startHours * 60 + startMinutes;
    const startSlotMinutes = 6 * 60; // 6:00 AM
    const pixelsPerMinute = 48 / 60; // 48px per hour / 60 minutes

    const top = (totalStartMinutes - startSlotMinutes) * pixelsPerMinute;
    const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60); // minutes
    const height = Math.max(duration * pixelsPerMinute, 20);

    return {
        top: `${Math.max(top, 0)}px`,
        height: `${height}px`,
    };
};

const getEventColor = (type: string) => {
    switch (type) {
        case 'appointment':
            return 'bg-green-500';
        case 'exam':
            return 'bg-yellow-500';
        case 'prescription':
            return 'bg-purple-500';
        default:
            return 'bg-blue-500';
    }
};

const getEventIcon = (type: string) => {
    switch (type) {
        case 'appointment':
            return Stethoscope;
        case 'exam':
            return FileText;
        case 'prescription':
            return Pill;
        default:
            return Clock;
    }
};

const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
        appointment: 'Consulta',
        exam: 'Exame',
        prescription: 'Prescrição',
    };
    return labels[type] || type;
};

const selectEvent = (event: CalendarEvent) => {
    selectedEvent.value = event;
    showEventDialog.value = true;
};
</script>

<style scoped>
.month-view,
.time-view {
    font-size: 12px;
}

@media (min-width: 640px) {
    .month-view,
    .time-view {
        font-size: 14px;
    }
}
</style>
