import { computed, ref } from 'vue';

import { useToast } from '@/composables/useToast';
import { supabase } from '@/integrations/supabase/client';
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
    const loading = ref(false);
    const { toast } = useToast();
    const authStore = useAuthStore();

    const fetchAppointments = async (startDate?: string, endDate?: string) => {
        console.log('fetchAppointments called with:', { startDate, endDate });
        console.log('Current URL:', window?.location?.href);
        console.log('User agent:', navigator?.userAgent);

        try {
            loading.value = true;

            // Check if Supabase client is properly configured
            console.log('Supabase client configured:', {
                hasSupabase: !!supabase,
                supabaseUrl: supabase?.supabaseUrl,
            });

            // Try real Supabase query first
            let query = supabase.from('patient_appointments').select(`
                    *,
                    patient:patients!patient_id(name),
                    doctor:profiles!doctor_id(name)
                `);

            console.log('Query built, applying filters...');

            // Apply date range filter if provided (for calendar optimization)
            if (startDate && endDate) {
                query = query.gte('appointment_date', startDate).lte('appointment_date', endDate);
                console.log('Date filters applied:', { startDate, endDate });
            }

            // Order by appointment date
            query = query.order('appointment_date', { ascending: true });

            console.log('Executing Supabase query...');
            console.time('supabase_query');

            const { data, error } = await query;

            console.timeEnd('supabase_query');
            console.log('Query completed with:', {
                hasData: !!data,
                dataLength: data?.length,
                hasError: !!error,
                errorCode: error?.code,
                errorMessage: error?.message,
                errorDetails: error?.details,
                errorHint: error?.hint,
            });

            if (error) {
                console.warn('Database query error details:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    fullError: error,
                });

                // Fallback to mock data if tables don't exist
                appointments.value = createMockAppointments();
                toast({
                    title: 'Aviso',
                    description: `Usando dados demonstrativos. Erro: ${error.message}`,
                    type: 'warning',
                });
                return;
            }

            console.log('Real data retrieved from Supabase:', {
                dataType: typeof data,
                isArray: Array.isArray(data),
                length: data?.length,
                firstItem: data?.[0],
                data: data,
            });

            appointments.value = data || [];

            // Show success message only if we have real data
            if (data && data.length > 0) {
                toast({
                    title: 'Sucesso',
                    description: `${data.length} agendamento(s) carregado(s) do Supabase.`,
                    type: 'success',
                });
            } else {
                console.log('No appointments found in database');
                toast({
                    title: 'Informação',
                    description: 'Nenhum agendamento encontrado no período.',
                    type: 'info',
                });
            }
        } catch (error: any) {
            console.error('Error in fetchAppointments:', {
                errorType: typeof error,
                errorName: error?.name,
                errorMessage: error?.message,
                errorStack: error?.stack,
                fullError: error,
            });

            // Fallback to mock data on any error
            appointments.value = createMockAppointments();
            toast({
                title: 'Aviso',
                description: `Usando dados demonstrativos. Erro: ${error?.message || 'Erro desconhecido'}`,
                type: 'warning',
            });
        } finally {
            loading.value = false;
            console.log('fetchAppointments finished, appointments count:', appointments.value.length);
        }
    };

    const createMockAppointments = (): Appointment[] => [
        {
            id: '1',
            patient_id: '1',
            doctor_id: '1',
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
            doctor_id: '1',
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
        },
    ];

    const addAppointment = async (
        appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patient' | 'doctor'>
    ) => {
        try {
            if (!authStore.profile?.id) {
                throw new Error('Usuário não autenticado');
            }

            const appointmentWithDoctor = {
                ...appointmentData,
                doctor_id: authStore.profile.id,
            };

            console.log('Creating appointment:', appointmentWithDoctor);

            const { data, error } = await supabase
                .from('patient_appointments')
                .insert([appointmentWithDoctor])
                .select(
                    `
                    *,
                    patient:patients!patient_id(name),
                    doctor:profiles!doctor_id(name)
                `
                )
                .single();

            if (error) {
                console.error('Error creating appointment:', error);
                throw new Error(`Erro ao criar agendamento: ${error.message}`);
            }

            console.log('Appointment created:', data);

            // Refresh appointments list
            await fetchAppointments();

            toast({
                title: 'Agendamento criado',
                description: 'O agendamento foi criado com sucesso!',
                type: 'success',
            });

            return data;
        } catch (error: any) {
            console.error('Error in addAppointment:', error);
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
            console.log('Updating appointment:', id, updates);

            const { data, error } = await supabase
                .from('patient_appointments')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select(
                    `
                    *,
                    patient:patients!patient_id(name),
                    doctor:profiles!doctor_id(name)
                `
                )
                .single();

            if (error) {
                console.error('Error updating appointment:', error);
                throw new Error(`Erro ao atualizar agendamento: ${error.message}`);
            }

            console.log('Appointment updated:', data);

            // Update local state
            const index = appointments.value.findIndex((appointment) => appointment.id === id);
            if (index !== -1) {
                appointments.value[index] = data;
            }

            toast({
                title: 'Agendamento atualizado',
                description: 'O agendamento foi atualizado com sucesso!',
                type: 'success',
            });

            return data;
        } catch (error: any) {
            console.error('Error in updateAppointment:', error);
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
            console.log('Deleting appointment:', id);

            const { error } = await supabase.from('patient_appointments').delete().eq('id', id);

            if (error) {
                console.error('Error deleting appointment:', error);
                throw new Error(`Erro ao cancelar agendamento: ${error.message}`);
            }

            console.log('Appointment deleted:', id);

            // Remove from local state
            appointments.value = appointments.value.filter((appointment) => appointment.id !== id);

            toast({
                title: 'Agendamento cancelado',
                description: 'O agendamento foi cancelado com sucesso!',
                type: 'success',
            });
        } catch (error: any) {
            console.error('Error in deleteAppointment:', error);
            toast({
                title: 'Erro ao cancelar agendamento',
                description: error.message,
                type: 'error',
            });
            throw error;
        }
    };

    // Setup realtime subscription for live updates
    const setupRealtimeSubscription = () => {
        console.log('Setting up realtime subscription...');

        const channel = supabase
            .channel('patient_appointments_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'patient_appointments',
                },
                (payload) => {
                    console.log('Realtime update received:', payload);

                    // Refresh appointments when any change occurs
                    fetchAppointments();
                }
            )
            .subscribe((status) => {
                console.log('Realtime subscription status:', status);
            });

        return channel;
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
