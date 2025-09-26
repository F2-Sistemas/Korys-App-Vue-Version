import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/integrations/supabase/client';
import type { Patient, PatientCreate, PatientUpdate, PatientFilters, PatientStats } from '@/types/patient';
import { useNotificationStore } from '@/stores/notifications';

export const usePatientsStore = defineStore('patients', () => {
    const notifications = useNotificationStore();

    // State
    const patients = ref<Patient[]>([]);
    const loading = ref(false);
    const currentPatient = ref<Patient | null>(null);

    // Getters
    const patientCount = computed((): PatientStats => {
        const total = patients.value.length;
        const active = patients.value.filter((p) => p.status === 'active').length;
        const inactive = patients.value.filter((p) => p.status === 'inactive').length;
        const pending = patients.value.filter((p) => p.status === 'pending').length;

        return { total, active, inactive, pending };
    });

    const filteredPatients = computed(() => {
        return (filters: PatientFilters) => {
            let filtered = patients.value;

            // Search filter
            if (filters.search) {
                const query = filters.search.toLowerCase();
                filtered = filtered.filter(
                    (patient) =>
                        patient.name.toLowerCase().includes(query) ||
                        patient.email?.toLowerCase().includes(query) ||
                        patient.phone?.includes(query)
                );
            }

            // Status filter
            if (filters.status && filters.status.length > 0 && !filters.status.includes('all')) {
                filtered = filtered.filter((patient) => filters.status!.includes(patient.status));
            }

            // Assigned doctor filter
            if (filters.assigned_doctor_id) {
                filtered = filtered.filter((patient) => patient.assigned_doctor_id === filters.assigned_doctor_id);
            }

            return filtered;
        };
    });

    // Actions
    const fetchPatients = async () => {
        try {
            loading.value = true;

            const { data, error } = await supabase
                .from('patients')
                .select(
                    `
          *,
          assigned_doctor:profiles!assigned_doctor_id(name)
        `
                )
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Calculate last interaction for each patient
            const patientsWithLastInteraction = (data || []).map((patient) => {
                const dates = [patient.updated_at, patient.created_at, patient.last_visit].filter(Boolean);

                const lastInteraction =
                    dates.length > 0 ? new Date(Math.max(...dates.map((d) => new Date(d).getTime()))) : null;

                return {
                    ...patient,
                    last_interaction: lastInteraction?.toISOString() || null,
                };
            });

            patients.value = patientsWithLastInteraction;
        } catch (error: any) {
            notifications.addNotification({
                type: 'error',
                title: 'Erro ao carregar pacientes',
                message: error.message || 'Ocorreu um erro inesperado',
            });
        } finally {
            loading.value = false;
        }
    };

    const createPatient = async (patientData: PatientCreate): Promise<Patient | null> => {
        try {
            loading.value = true;

            const { data, error } = await supabase
                .from('patients')
                .insert([
                    {
                        ...patientData,
                        status: patientData.status || 'active',
                    },
                ])
                .select(
                    `
          *,
          assigned_doctor:profiles!assigned_doctor_id(name)
        `
                )
                .single();

            if (error) throw error;

            const newPatient = {
                ...data,
                last_interaction: new Date().toISOString(),
            };

            patients.value.unshift(newPatient);

            notifications.addNotification({
                type: 'success',
                title: 'Paciente adicionado',
                message: 'O paciente foi adicionado com sucesso!',
            });

            return newPatient;
        } catch (error: any) {
            notifications.addNotification({
                type: 'error',
                title: 'Erro ao adicionar paciente',
                message: error.message || 'Ocorreu um erro inesperado',
            });
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updatePatient = async (id: string, updates: PatientUpdate): Promise<boolean> => {
        try {
            loading.value = true;

            const { data, error } = await supabase
                .from('patients')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)
                .select(
                    `
          *,
          assigned_doctor:profiles!assigned_doctor_id(name)
        `
                )
                .single();

            if (error) throw error;

            // Update local state
            const index = patients.value.findIndex((p) => p.id === id);
            if (index !== -1) {
                patients.value[index] = {
                    ...data,
                    last_interaction: new Date().toISOString(),
                };
            }

            notifications.addNotification({
                type: 'success',
                title: 'Paciente atualizado',
                message: 'As informações do paciente foram atualizadas!',
            });

            return true;
        } catch (error: any) {
            notifications.addNotification({
                type: 'error',
                title: 'Erro ao atualizar paciente',
                message: error.message || 'Ocorreu um erro inesperado',
            });
            return false;
        } finally {
            loading.value = false;
        }
    };

    const deletePatient = async (id: string): Promise<boolean> => {
        try {
            loading.value = true;

            const { error } = await supabase.from('patients').delete().eq('id', id);

            if (error) throw error;

            // Remove from local state
            const index = patients.value.findIndex((p) => p.id === id);
            if (index !== -1) {
                patients.value.splice(index, 1);
            }

            notifications.addNotification({
                type: 'success',
                title: 'Paciente removido',
                message: 'O paciente foi removido com sucesso!',
            });

            return true;
        } catch (error: any) {
            notifications.addNotification({
                type: 'error',
                title: 'Erro ao remover paciente',
                message: error.message || 'Ocorreu um erro inesperado',
            });
            return false;
        } finally {
            loading.value = false;
        }
    };

    const getPatientById = async (id: string): Promise<Patient | null> => {
        try {
            // Check if patient is already in store
            const existing = patients.value.find((p) => p.id === id);
            if (existing) {
                currentPatient.value = existing;
                return existing;
            }

            // Fetch from API if not in store
            const { data, error } = await supabase
                .from('patients')
                .select(
                    `
          *,
          assigned_doctor:profiles!assigned_doctor_id(name)
        `
                )
                .eq('id', id)
                .single();

            if (error) throw error;

            const patient = {
                ...data,
                last_interaction: data.last_interaction || new Date().toISOString(),
            };

            currentPatient.value = patient;
            return patient;
        } catch (error: any) {
            notifications.addNotification({
                type: 'error',
                title: 'Erro ao carregar paciente',
                message: error.message || 'Paciente não encontrado',
            });
            return null;
        }
    };

    const calculateAge = (birthDate: string): number => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    const clearCurrentPatient = () => {
        currentPatient.value = null;
    };

    return {
        // State
        patients,
        loading,
        currentPatient,

        // Getters
        patientCount,
        filteredPatients,

        // Actions
        fetchPatients,
        createPatient,
        updatePatient,
        deletePatient,
        getPatientById,
        calculateAge,
        clearCurrentPatient,
    };
});
