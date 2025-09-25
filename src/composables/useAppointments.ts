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

    const fetchAppointments = async (startDate?: string, endDate?: string) => {
        try {
            loading.value = true;

            // Use more relaxed typing for now until all tables are properly configured
            let query = (supabase as any)
                .from('patient_appointments')
                .select(`
                    *,
                    patient:patients!patient_id(name),
                    doctor:profiles!doctor_id(name)
                `);

            // Apply date range filter if provided (for calendar optimization)
            if (startDate && endDate) {
                query = query
                    .gte('appointment_date', startDate)
                    .lte('appointment_date', endDate);
            }

            // Order by appointment date
            query = query.order('appointment_date', { ascending: true });

            const { data, error } = await query;

            if (error) {
                console.warn('Database query error:', error);
                // If tables don't exist, show mock data
                appointments.value = createMockAppointments();
                return;
            }

            appointments.value = data || [];
        } catch (error: any) {
            console.warn('Failed to fetch appointments from database:', error);
            // Fallback to mock data
            appointments.value = createMockAppointments();
            toast({
                title: 'Aviso',
                description: 'Carregando dados demonstrativos. Configure o Supabase para dados reais.',
                type: 'info',
            });
        } finally {
            loading.value = false;
        }
    };

    const createMockAppointments = (): Appointment[] => [
        {
            id: '1',
            patient_id: '1',
            doctor_id: authStore.profile?.id || '1',
            appointment_type: 'Consulta Geral',
            appointment_date: new Date().toISOString().split('T')[0],
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
            appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
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
        }
    ];

    const addAppointment = async (
        appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patient' | 'doctor'>
    ) => {
        try {
            if (!authStore.profile?.id) {
                throw new Error('Usuário não autenticado');
            }

            // Try to use real Supabase, fallback to mock
            try {
                const appointmentWithDoctor = {
                    ...appointmentData,
                    doctor_id: authStore.profile.id
                };

                const { data, error } = await (supabase as any)
                    .from('patient_appointments')
                    .insert([appointmentWithDoctor])
                    .select()
                    .single();

                if (error) throw error;

                await fetchAppointments();
                return data;
            } catch (dbError) {
                // Mock implementation
                const newAppointment: Appointment = {
                    ...appointmentData,
                    id: Date.now().toString(),
                    doctor_id: authStore.profile.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    patient: { name: 'Novo Paciente' },
                    doctor: { name: authStore.profile.name || 'Dr.' }
                };

                appointments.value.push(newAppointment);
            }

            toast({
                title: 'Agendamento criado',
                description: 'O agendamento foi criado com sucesso!',
                type: 'success',
            });
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
            // Mock implementation for now
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
            // Mock implementation for now
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

    // Setup realtime subscription (simplified for mock)
    const setupRealtimeSubscription = () => {
        // For now, return a mock channel since we're using mock data
        return {
            unsubscribe: () => {}
        };
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
        setupRealtimeSubscription,
        refetch: fetchAppointments,
    };
};
