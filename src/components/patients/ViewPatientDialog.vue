<template>
    <div>
        <slot @click="openDialog">
            <Button variant="outline" size="icon" @click="openDialog">
                <Eye class="h-4 w-4" />
            </Button>
        </slot>

        <Dialog :open="isOpen" @update:open="onOpenChange" class="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <div class="flex items-start justify-between">
                    <div>
                        <DialogTitle class="text-xl md:text-2xl">Prontuário do Paciente</DialogTitle>
                        <DialogDescription>Informações completas de {{ patient?.name }}</DialogDescription>
                    </div>
                    <div class="flex gap-2">
                        <EditPatientDialog :patient="patient" @patient-updated="handlePatientUpdated">
                            <Button variant="outline" size="icon" title="Editar Paciente">
                                <Edit class="h-4 w-4" />
                            </Button>
                        </EditPatientDialog>
                    </div>
                </div>
            </DialogHeader>

            <div class="space-y-6">
                <!-- Dados Pessoais -->
                <div class="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <User class="h-5 w-5" />
                                Informações Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h3 class="text-xl font-semibold">{{ patient?.name }}</h3>
                                <Badge :variant="getStatusVariant(patient?.status)">
                                    {{ getStatusLabel(patient?.status) }}
                                </Badge>
                            </div>

                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="font-medium text-muted-foreground">Idade:</span>
                                    <p>{{ calculateAge(patient?.birth_date) }} anos</p>
                                </div>
                                <div>
                                    <span class="font-medium text-muted-foreground">Gênero:</span>
                                    <p>{{ getGenderLabel(patient?.gender) }}</p>
                                </div>
                                <div>
                                    <span class="font-medium text-muted-foreground">Data de Nascimento:</span>
                                    <p>{{ formatDate(patient?.birth_date) }}</p>
                                </div>
                                <div>
                                    <span class="font-medium text-muted-foreground">Estado Civil:</span>
                                    <p>{{ patient?.marital_status || 'N/A' }}</p>
                                </div>
                            </div>

                            <div v-if="patient?.responsible_name" class="pt-4 border-t">
                                <h4 class="font-medium mb-2">Responsável</h4>
                                <div class="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span class="font-medium text-muted-foreground">Nome:</span>
                                        <p>{{ patient.responsible_name }}</p>
                                    </div>
                                    <div>
                                        <span class="font-medium text-muted-foreground">Telefone:</span>
                                        <p>{{ patient.responsible_phone || 'N/A' }}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Informações Médicas -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <Stethoscope class="h-5 w-5" />
                                Informações Médicas
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span class="font-medium text-muted-foreground">Altura:</span>
                                    <p>{{ patient?.height ? `${patient.height}m` : 'N/A' }}</p>
                                </div>
                                <div>
                                    <span class="font-medium text-muted-foreground">Peso:</span>
                                    <p>{{ patient?.weight ? `${patient.weight}kg` : 'N/A' }}</p>
                                </div>
                                <div>
                                    <span class="font-medium text-muted-foreground">Tipo Sanguíneo:</span>
                                    <p>{{ patient?.blood_group || 'N/A' }}</p>
                                </div>
                            </div>

                            <div>
                                <span class="font-medium text-muted-foreground text-sm">Médico Responsável:</span>
                                <p>{{ patient?.assigned_doctor?.name || 'N/A' }}</p>
                            </div>

                            <div v-if="patient?.comorbidities && patient.comorbidities.length > 0">
                                <span class="font-medium text-muted-foreground text-sm">Comorbidades:</span>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    <Badge
                                        v-for="(comorbidity, idx) in patient.comorbidities"
                                        :key="idx"
                                        variant="outline"
                                        class="text-xs"
                                    >
                                        {{ comorbidity }}
                                    </Badge>
                                </div>
                            </div>

                            <div v-if="patient?.allergies && patient.allergies.length > 0">
                                <span class="font-medium text-muted-foreground text-sm">Alergias:</span>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    <Badge
                                        v-for="(allergy, idx) in patient.allergies"
                                        :key="idx"
                                        variant="destructive"
                                        class="text-xs"
                                    >
                                        {{ allergy }}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Contato -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <Phone class="h-5 w-5" />
                                Informações de Contato
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="font-medium text-muted-foreground">Telefone:</span>
                                    <p class="break-words">{{ patient?.phone || 'N/A' }}</p>
                                </div>
                                <div>
                                    <span class="font-medium text-muted-foreground">Email:</span>
                                    <p class="text-xs break-words">{{ patient?.email || 'N/A' }}</p>
                                </div>
                            </div>
                            <div>
                                <span class="font-medium text-muted-foreground text-sm">Endereço:</span>
                                <p class="text-sm break-words">{{ patient?.address || 'N/A' }}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Histórico -->
                    <Card>
                        <CardHeader>
                            <CardTitle class="flex items-center gap-2">
                                <Clock class="h-5 w-5" />
                                Histórico
                            </CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="font-medium text-muted-foreground">Data de Cadastro:</span>
                                    <p>{{ formatDateTime(patient?.created_at) }}</p>
                                </div>
                                <div>
                                    <span class="font-medium text-muted-foreground">Última Atualização:</span>
                                    <p>{{ formatDateTime(patient?.updated_at) }}</p>
                                </div>
                                <div>
                                    <span class="font-medium text-muted-foreground">Última Interação:</span>
                                    <p>
                                        {{
                                            patient?.last_interaction
                                                ? formatDateTime(patient.last_interaction)
                                                : 'Nenhuma interação registrada'
                                        }}
                                    </p>
                                </div>
                                <div>
                                    <span class="font-medium text-muted-foreground">Última Visita:</span>
                                    <p>
                                        {{
                                            patient?.last_visit
                                                ? formatDateTime(patient.last_visit)
                                                : 'Nenhuma visita registrada'
                                        }}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Resumo de Atividades -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent class="pt-6">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"
                                    >
                                        <Pill class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold">0</p>
                                        <p class="text-sm text-muted-foreground">Prescrições</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent class="pt-6">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
                                    >
                                        <FileText class="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold">0</p>
                                        <p class="text-sm text-muted-foreground">Exames</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent class="pt-6">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center"
                                    >
                                        <Calendar class="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold">0</p>
                                        <p class="text-sm text-muted-foreground">Consultas</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent class="pt-6">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
                                    >
                                        <Activity class="h-6 w-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <p class="text-2xl font-bold">0</p>
                                        <p class="text-sm text-muted-foreground">Sinais Vitais</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Eye, Edit, User, Stethoscope, Phone, Clock, Pill, FileText, Calendar, Activity } from 'lucide-vue-next';
import type { Patient } from '@/types/patient';
import { usePatientsStore } from '@/stores/patients';

// UI Components
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import Dialog from '@/components/ui/Dialog.vue';
import DialogDescription from '@/components/ui/DialogDescription.vue';
import DialogHeader from '@/components/ui/DialogHeader.vue';
import DialogTitle from '@/components/ui/DialogTitle.vue';

// Import other components
import EditPatientDialog from './EditPatientDialog.vue';

// Props and Emits
interface Props {
    patient: Patient;
    open?: boolean;
}

interface Emits {
    (e: 'update:open', value: boolean): void;
    (e: 'patientUpdated', patient: Patient): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Store
const patientsStore = usePatientsStore();

// State
const isOpen = ref(props.open || false);

// Watch for prop changes
watch(
    () => props.open,
    (newValue) => {
        isOpen.value = newValue || false;
    }
);

const openDialog = () => {
    isOpen.value = true;
};

const onOpenChange = (newValue: boolean) => {
    isOpen.value = newValue;
    emit('update:open', newValue);
};

// Methods
const calculateAge = (birthDate?: string): number => {
    if (!birthDate) return 0;
    return patientsStore.calculateAge(birthDate);
};

const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
};

const formatDateTime = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getStatusVariant = (status?: string) => {
    switch (status) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'destructive';
        case 'pending':
            return 'warning';
        default:
            return 'outline';
    }
};

const getStatusLabel = (status?: string) => {
    switch (status) {
        case 'active':
            return 'Ativo';
        case 'inactive':
            return 'Inativo';
        case 'pending':
            return 'Pendente';
        default:
            return status;
    }
};

const getGenderLabel = (gender?: string) => {
    switch (gender) {
        case 'male':
            return 'Masculino';
        case 'female':
            return 'Feminino';
        case 'other':
            return 'Outro';
        default:
            return 'N/A';
    }
};

const handlePatientUpdated = (updatedPatient: Patient) => {
    emit('patientUpdated', updatedPatient);
};
</script>
