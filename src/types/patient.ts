export interface Patient {
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
    assigned_doctor?: {
        name: string;
    };
}

export interface PatientCreate {
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
    responsible_name?: string;
    responsible_phone?: string;
    status: 'active' | 'inactive' | 'pending';
}

export interface PatientUpdate {
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
    responsible_name?: string;
    responsible_phone?: string;
    status?: 'active' | 'inactive' | 'pending';
}

export interface PatientFilters {
    search?: string;
    status?: string[];
    assigned_doctor_id?: string;
}

export interface PatientStats {
    total: number;
    active: number;
    inactive: number;
    pending: number;
}
