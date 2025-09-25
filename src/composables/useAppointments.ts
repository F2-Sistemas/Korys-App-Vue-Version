import { ref, computed } from 'vue';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/stores/auth';

export interface Appointment {
    id: string;
    patient_id: string;
    doctor_id?: string;
    appointment_type: string;
    appointment_date: string;
    appointment_time: string;
    duration?: number;
    status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'pending';
    notes?: string;
    created_at: string;
    updated_at: string;
    patient?: {
        name: string;
    };
    doctor?: {
        name: string;
    };
}

export const useAppointments = () => {
    const appointments = ref<Appointment[]>([]);
    const loading = ref(true);
    const { toast } = useToast();
    const authStore = useAuthStore();

    const fetchAppointments = async () => {
        try {
            loading.value = true;
            // Simplified query - we'll expand this when the tables exist
            const mockAppointments: Appointment[] = [
                {
                    id: '1',
                    patient_id: '1',
                    doctor_id: authStore.profile?.id || '1',
                    appointment_type: 'Consulta Geral',
                    appointment_date: '2025-09-26',
                    appointment_time: '14:00',
                    duration: 60,
                    status: 'scheduled',
                    notes: 'Consulta de rotina',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    patient: {
                        name: 'João Silva',
                    },
                    doctor: {
                        name: 'Dr. Ana Costa',
                    },
                },
                {
                    id: '2',
                    patient_id: '2',
                    doctor_id: authStore.profile?.id || '1',
                    appointment_type: 'Consulta Especializada',
                    appointment_date: '2025-09-27',
                    appointment_time: '10:30',
                    duration: 90,
                    status: 'confirmed',
                    notes: 'Acompanhamento especializado',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    patient: {
                        name: 'Maria Santos',
                    },
                    doctor: {
                        name: 'Dr. Ana Costa',
                    },
                },
            ];

            appointments.value = mockAppointments;
        } catch (error: any) {
            toast({
                title: 'Erro ao carregar agendamentos',
                description: error.message,
                type: 'error',
            });
        } finally {
            loading.value = false;
        }
    };

    const addAppointment = async (
        appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patient' | 'doctor'>
    ) => {
        try {
            if (!authStore.profile?.id) {
                throw new Error('Usuário não autenticado');
            }

            // Mock implementation - in a real app this would use Supabase
            const newAppointment: Appointment = {
                ...appointmentData,
                id: Date.now().toString(),
                doctor_id: authStore.profile.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                patient: { name: 'Novo Paciente' },
                doctor: { name: authStore.profile.name || 'Dr.' },
            };

            appointments.value.push(newAppointment);

            toast({
                title: 'Agendamento criado',
                description: 'O agendamento foi criado com sucesso!',
                type: 'success',
            });

            return newAppointment;
        } catch (error: any) {
            toast({
                title: 'Erro ao criar agendamento',
                description: error.message,
                type: 'error',
            });
            throw error;
        }
    };

    const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
        try {
            const index = appointments.value.findIndex((appointment) => appointment.id === id);
            if (index !== -1) {
                appointments.value[index] = {
                    ...appointments.value[index],
                    ...updates,
                    updated_at: new Date().toISOString(),
                };
            }

            toast({
                title: 'Agendamento atualizado',
                description: 'O agendamento foi atualizado com sucesso!',
                type: 'success',
            });
        } catch (error: any) {
            toast({
                title: 'Erro ao atualizar agendamento',
                description: error.message,
                type: 'error',
            });
            throw error;
        }
    };

    const deleteAppointment = async (id: string) => {
        try {
            appointments.value = appointments.value.filter((appointment) => appointment.id !== id);

            toast({
                title: 'Agendamento cancelado',
                description: 'O agendamento foi cancelado com sucesso!',
                type: 'success',
            });
        } catch (error: any) {
            toast({
                title: 'Erro ao cancelar agendamento',
                description: error.message,
                type: 'error',
            });
            throw error;
        }
    };

    // Computed properties for filtered appointments
    const scheduledAppointments = computed(() =>
        appointments.value.filter(
            (appointment) => appointment.status === 'scheduled' || appointment.status === 'confirmed'
        )
    );

    return {
        appointments: computed(() => appointments.value),
        scheduledAppointments,
        loading: computed(() => loading.value),
        fetchAppointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        refetch: fetchAppointments,
    };
};
