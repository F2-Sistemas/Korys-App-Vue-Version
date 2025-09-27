export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    email: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    email: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    email?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [];
            };
            patients: {
                Row: {
                    id: string;
                    name: string;
                    birth_date: string;
                    gender: 'male' | 'female' | 'other';
                    height?: number;
                    weight?: number;
                    blood_group?: string;
                    marital_status?: string;
                    phone?: string;
                    email?: string;
                    address?: string;
                    comorbidities?: string[];
                    allergies?: string[];
                    assigned_doctor_id?: string;
                    owner_doctor_id?: string;
                    responsible_name?: string;
                    responsible_phone?: string;
                    status: 'active' | 'inactive' | 'pending';
                    last_visit?: string;
                    last_interaction?: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    birth_date: string;
                    gender: 'male' | 'female' | 'other';
                    height?: number;
                    weight?: number;
                    blood_group?: string;
                    marital_status?: string;
                    phone?: string;
                    email?: string;
                    address?: string;
                    comorbidities?: string[];
                    allergies?: string[];
                    assigned_doctor_id?: string;
                    owner_doctor_id?: string;
                    responsible_name?: string;
                    responsible_phone?: string;
                    status?: 'active' | 'inactive' | 'pending';
                    last_visit?: string;
                    last_interaction?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    birth_date?: string;
                    gender?: 'male' | 'female' | 'other';
                    height?: number;
                    weight?: number;
                    blood_group?: string;
                    marital_status?: string;
                    phone?: string;
                    email?: string;
                    address?: string;
                    comorbidities?: string[];
                    allergies?: string[];
                    assigned_doctor_id?: string;
                    owner_doctor_id?: string;
                    responsible_name?: string;
                    responsible_phone?: string;
                    status?: 'active' | 'inactive' | 'pending';
                    last_visit?: string;
                    last_interaction?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'patients_assigned_doctor_id_fkey';
                        columns: ['assigned_doctor_id'];
                        isOneToOne: false;
                        referencedRelation: 'profiles';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'patients_owner_doctor_id_fkey';
                        columns: ['owner_doctor_id'];
                        isOneToOne: false;
                        referencedRelation: 'profiles';
                        referencedColumns: ['id'];
                    },
                ];
            };
            patient_appointments: {
                Row: {
                    id: string;
                    patient_id: string;
                    doctor_id?: string;
                    appointment_type: string;
                    appointment_date: string;
                    appointment_time: string;
                    duration?: number;
                    status: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    notes?: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    patient_id: string;
                    doctor_id?: string;
                    appointment_type: string;
                    appointment_date: string;
                    appointment_time: string;
                    duration?: number;
                    status?: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    notes?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    patient_id?: string;
                    doctor_id?: string;
                    appointment_type?: string;
                    appointment_date?: string;
                    appointment_time?: string;
                    duration?: number;
                    status?: 'pending' | 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
                    notes?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: 'patient_appointments_patient_id_fkey';
                        columns: ['patient_id'];
                        isOneToOne: false;
                        referencedRelation: 'patients';
                        referencedColumns: ['id'];
                    },
                    {
                        foreignKeyName: 'patient_appointments_doctor_id_fkey';
                        columns: ['doctor_id'];
                        isOneToOne: false;
                        referencedRelation: 'profiles';
                        referencedColumns: ['id'];
                    },
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
