<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-3xl font-bold tracking-tight">Pacientes</h1>
                <p class="text-muted-foreground">Gerencie os pacientes cadastrados no sistema</p>
            </div>
            <div class="flex gap-2">
                <Button variant="outline" size="sm">
                    <Download class="mr-2 h-4 w-4" />
                    Exportar
                </Button>
                <AddPatientDialog @patient-created="handlePatientCreated">
                    <Button>
                        <UserPlus class="mr-2 h-4 w-4" />
                        Novo Paciente
                    </Button>
                </AddPatientDialog>
            </div>
        </div>

        <!-- Filters and Search -->
        <Card>
            <CardContent class="p-6">
                <div class="flex flex-col gap-4 md:flex-row md:items-center">
                    <div class="flex-1">
                        <div class="relative">
                            <Search
                                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                            />
                            <Input
                                v-model="filters.search"
                                placeholder="Buscar pacientes por nome ou email..."
                                class="pl-10 max-w-sm"
                            />
                        </div>
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

        <!-- Patients Table -->
        <Card>
            <CardHeader>
                <CardTitle>Lista de Pacientes</CardTitle>
                <CardDescription>Total de {{ displayedPatients.length }} pacientes encontrados</CardDescription>
            </CardHeader>
            <CardContent>
                <div v-if="patientsStore.loading" class="flex items-center justify-center h-64">
                    <Loader2 class="h-8 w-8 animate-spin" />
                </div>
                <Table v-else>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[250px]">Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Data de Nascimento</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead class="w-[120px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="patient in displayedPatients" :key="patient.id">
                            <TableCell class="font-medium">
                                <div class="flex items-center space-x-3">
                                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <User class="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <div class="font-medium">{{ patient.name }}</div>
                                        <div class="text-sm text-muted-foreground">
                                            {{ patientsStore.calculateAge(patient.birth_date) }} anos
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{{ patient.email || 'N/A' }}</TableCell>
                            <TableCell>{{ patient.phone || 'N/A' }}</TableCell>
                            <TableCell>{{ formatDate(patient.birth_date) }}</TableCell>
                            <TableCell>
                                <Badge :variant="getStatusVariant(patient.status)">
                                    {{ getStatusLabel(patient.status) }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center space-x-2">
                                    <ViewPatientDialog :patient="patient" @patient-updated="handlePatientUpdated">
                                        <Button variant="ghost" size="icon" title="Visualizar">
                                            <Eye class="h-4 w-4" />
                                        </Button>
                                    </ViewPatientDialog>
                                    <EditPatientDialog :patient="patient" @patient-updated="handlePatientUpdated">
                                        <Button variant="ghost" size="icon" title="Editar">
                                            <Edit class="h-4 w-4" />
                                        </Button>
                                    </EditPatientDialog>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        @click="confirmDeletePatient(patient)"
                                        class="text-destructive hover:text-destructive"
                                        title="Excluir"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                        <TableRow v-if="displayedPatients.length === 0">
                            <TableCell :colspan="6" class="text-center py-8 text-muted-foreground">
                                Nenhum paciente encontrado
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <!-- Statistics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card v-for="stat in patientStats" :key="stat.label">
                <CardContent class="p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">{{ stat.label }}</p>
                            <p class="text-2xl font-bold">{{ stat.value }}</p>
                        </div>
                        <div :class="cn('p-2 rounded-lg', stat.bgColor)">
                            <component :is="stat.icon" :class="cn('h-4 w-4', stat.iconColor)" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Delete Confirmation Dialog -->
        <Dialog v-model:open="deleteDialogOpen">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o paciente {{ patientToDelete?.name }}? Esta ação não pode ser
                        desfeita.
                    </DialogDescription>
                </DialogHeader>
                <div class="flex justify-end gap-4 pt-6">
                    <Button variant="outline" @click="deleteDialogOpen = false">Cancelar</Button>
                    <Button variant="destructive" @click="deletePatient" :disabled="patientsStore.loading">
                        <Loader2 v-if="patientsStore.loading" class="h-4 w-4 mr-2 animate-spin" />
                        Excluir Paciente
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import {
    UserPlus,
    Download,
    User,
    Eye,
    Edit,
    Trash2,
    Users,
    UserCheck,
    UserX,
    Clock,
    Search,
    Loader2,
} from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import type { Patient, PatientFilters } from '@/types/patient';
import { usePatientsStore } from '@/stores/patients';

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
import Dialog from '@/components/ui/Dialog.vue';
import DialogContent from '@/components/ui/DialogContent.vue';
import DialogDescription from '@/components/ui/DialogDescription.vue';
import DialogHeader from '@/components/ui/DialogHeader.vue';
import DialogTitle from '@/components/ui/DialogTitle.vue';

// Import patient components
import AddPatientDialog from '@/components/patients/AddPatientDialog.vue';
import EditPatientDialog from '@/components/patients/EditPatientDialog.vue';
import ViewPatientDialog from '@/components/patients/ViewPatientDialog.vue';

// Store
const patientsStore = usePatientsStore();

// State
const filters = reactive<PatientFilters>({
    search: '',
    status: ['all'],
});

const deleteDialogOpen = ref(false);
const patientToDelete = ref<Patient | null>(null);

const statusFilters = ref([
    { label: 'Todos', value: 'all', active: true },
    { label: 'Ativos', value: 'active', active: false },
    { label: 'Inativos', value: 'inactive', active: false },
    { label: 'Pendentes', value: 'pending', active: false },
]);

// Computed properties
const displayedPatients = computed(() => {
    return patientsStore.filteredPatients(filters);
});

const patientStats = computed(() => {
    const stats = patientsStore.patientCount;
    return [
        {
            label: 'Total de Pacientes',
            value: stats.total.toString(),
            icon: Users,
            bgColor: 'bg-primary/10',
            iconColor: 'text-primary',
        },
        {
            label: 'Pacientes Ativos',
            value: stats.active.toString(),
            icon: UserCheck,
            bgColor: 'bg-success/10',
            iconColor: 'text-success',
        },
        {
            label: 'Pacientes Inativos',
            value: stats.inactive.toString(),
            icon: UserX,
            bgColor: 'bg-destructive/10',
            iconColor: 'text-destructive',
        },
        {
            label: 'Pendentes',
            value: stats.pending.toString(),
            icon: Clock,
            bgColor: 'bg-warning/10',
            iconColor: 'text-warning',
        },
    ];
});

// Methods
const toggleStatusFilter = (value: string) => {
    const filter = statusFilters.value.find((f) => f.value === value);
    if (filter) {
        // If clicking 'Todos', activate it and deactivate others
        if (value === 'all') {
            statusFilters.value.forEach((f) => {
                f.active = f.value === 'all';
            });
            filters.status = ['all'];
        } else {
            // Deactivate 'Todos' when selecting specific status
            const allFilter = statusFilters.value.find((f) => f.value === 'all');
            if (allFilter) allFilter.active = false;

            filter.active = !filter.active;

            // Update filters
            const activeStatuses = statusFilters.value.filter((f) => f.value !== 'all' && f.active).map((f) => f.value);

            // If no specific filters are active, activate 'Todos'
            if (activeStatuses.length === 0) {
                if (allFilter) allFilter.active = true;
                filters.status = ['all'];
            } else {
                filters.status = activeStatuses;
            }
        }
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
};

const getStatusVariant = (status: string) => {
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

const getStatusLabel = (status: string) => {
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

// Event handlers
const handlePatientCreated = (patient: Patient) => {
    console.log('Patient created:', patient);
    // Store will handle updating the list
};

const handlePatientUpdated = (patient: Patient) => {
    console.log('Patient updated:', patient);
    // Store will handle updating the list
};

const confirmDeletePatient = (patient: Patient) => {
    patientToDelete.value = patient;
    deleteDialogOpen.value = true;
};

const deletePatient = async () => {
    if (patientToDelete.value) {
        const success = await patientsStore.deletePatient(patientToDelete.value.id);
        if (success) {
            deleteDialogOpen.value = false;
            patientToDelete.value = null;
        }
    }
};

// Lifecycle
onMounted(() => {
    patientsStore.fetchPatients();
});
</script>
