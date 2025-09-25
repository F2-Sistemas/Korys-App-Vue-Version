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
                <Button @click="openAddPatientDialog">
                    <UserPlus class="mr-2 h-4 w-4" />
                    Novo Paciente
                </Button>
            </div>
        </div>

        <!-- Filters and Search -->
        <Card>
            <CardContent class="p-6">
                <div class="flex flex-col gap-4 md:flex-row md:items-center">
                    <div class="flex-1">
                        <Input
                            v-model="searchQuery"
                            placeholder="Buscar pacientes por nome, CPF ou email..."
                            class="max-w-sm"
                        />
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
                <CardDescription>Total de {{ filteredPatients.length }} pacientes encontrados</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[250px]">Nome</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Data de Nascimento</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead class="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="patient in filteredPatients" :key="patient.id">
                            <TableCell class="font-medium">
                                <div class="flex items-center space-x-3">
                                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-patient/10">
                                        <User class="h-4 w-4 text-patient" />
                                    </div>
                                    <div>
                                        <div class="font-medium">{{ patient.name }}</div>
                                        <div class="text-sm text-muted-foreground">{{ patient.age }} anos</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{{ patient.cpf }}</TableCell>
                            <TableCell>{{ patient.email }}</TableCell>
                            <TableCell>{{ patient.phone }}</TableCell>
                            <TableCell>{{ formatDate(patient.birthDate) }}</TableCell>
                            <TableCell>
                                <Badge :variant="getStatusVariant(patient.status)">
                                    {{ patient.status }}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon" @click="viewPatient(patient)">
                                        <Eye class="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" @click="editPatient(patient)">
                                        <Edit class="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        @click="deletePatient(patient)"
                                        class="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 class="h-4 w-4" />
                                    </Button>
                                </div>
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
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { UserPlus, Download, User, Eye, Edit, Trash2, Users, UserCheck, UserX, Clock } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

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

// Data and state
const searchQuery = ref('');

interface Patient {
    id: string;
    name: string;
    cpf: string;
    email: string;
    phone: string;
    birthDate: string;
    age: number;
    status: 'Ativo' | 'Inativo' | 'Pendente';
}

const patients = ref<Patient[]>([
    {
        id: '1',
        name: 'João Silva Santos',
        cpf: '123.456.789-10',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-9999',
        birthDate: '1985-03-15',
        age: 38,
        status: 'Ativo',
    },
    {
        id: '2',
        name: 'Maria Santos Oliveira',
        cpf: '987.654.321-00',
        email: 'maria.santos@email.com',
        phone: '(11) 88888-8888',
        birthDate: '1990-07-22',
        age: 33,
        status: 'Ativo',
    },
    {
        id: '3',
        name: 'Pedro Costa Lima',
        cpf: '456.789.123-45',
        email: 'pedro.costa@email.com',
        phone: '(11) 77777-7777',
        birthDate: '1978-11-08',
        age: 45,
        status: 'Inativo',
    },
    {
        id: '4',
        name: 'Ana Paula Silva',
        cpf: '789.123.456-78',
        email: 'ana.paula@email.com',
        phone: '(11) 66666-6666',
        birthDate: '1995-01-30',
        age: 28,
        status: 'Pendente',
    },
]);

const statusFilters = ref([
    { label: 'Todos', value: 'all', active: true },
    { label: 'Ativos', value: 'Ativo', active: false },
    { label: 'Inativos', value: 'Inativo', active: false },
    { label: 'Pendentes', value: 'Pendente', active: false },
]);

// Computed properties
const filteredPatients = computed(() => {
    let filtered = patients.value;

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
            (patient) =>
                patient.name.toLowerCase().includes(query) ||
                patient.cpf.includes(query) ||
                patient.email.toLowerCase().includes(query)
        );
    }

    // Filter by status
    const activeStatusFilters = statusFilters.value.filter((filter) => filter.active);
    if (activeStatusFilters.length > 0 && !activeStatusFilters.some((filter) => filter.value === 'all')) {
        filtered = filtered.filter((patient) => activeStatusFilters.some((filter) => filter.value === patient.status));
    }

    return filtered;
});

const patientStats = computed(() => [
    {
        label: 'Total de Pacientes',
        value: patients.value.length.toString(),
        icon: Users,
        bgColor: 'bg-patient/10',
        iconColor: 'text-patient',
    },
    {
        label: 'Pacientes Ativos',
        value: patients.value.filter((p) => p.status === 'Ativo').length.toString(),
        icon: UserCheck,
        bgColor: 'bg-success/10',
        iconColor: 'text-success',
    },
    {
        label: 'Pacientes Inativos',
        value: patients.value.filter((p) => p.status === 'Inativo').length.toString(),
        icon: UserX,
        bgColor: 'bg-destructive/10',
        iconColor: 'text-destructive',
    },
    {
        label: 'Pendentes',
        value: patients.value.filter((p) => p.status === 'Pendente').length.toString(),
        icon: Clock,
        bgColor: 'bg-warning/10',
        iconColor: 'text-warning',
    },
]);

// Methods
const toggleStatusFilter = (value: string) => {
    const filter = statusFilters.value.find((f) => f.value === value);
    if (filter) {
        // If clicking 'Todos', activate it and deactivate others
        if (value === 'all') {
            statusFilters.value.forEach((f) => {
                f.active = f.value === 'all';
            });
        } else {
            // Deactivate 'Todos' when selecting specific status
            const allFilter = statusFilters.value.find((f) => f.value === 'all');
            if (allFilter) allFilter.active = false;

            filter.active = !filter.active;

            // If no specific filters are active, activate 'Todos'
            const hasActiveFilters = statusFilters.value.some((f) => f.value !== 'all' && f.active);
            if (!hasActiveFilters && allFilter) {
                allFilter.active = true;
            }
        }
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
};

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Ativo':
            return 'success';
        case 'Inativo':
            return 'destructive';
        case 'Pendente':
            return 'warning';
        default:
            return 'outline';
    }
};

// Dialog and action methods
const openAddPatientDialog = () => {
    console.log('Opening add patient dialog');
    // TODO: Implement dialog
};

const viewPatient = (patient: Patient) => {
    console.log('Viewing patient:', patient);
    // TODO: Navigate to patient details page
};

const editPatient = (patient: Patient) => {
    console.log('Editing patient:', patient);
    // TODO: Open edit patient dialog
};

const deletePatient = (patient: Patient) => {
    console.log('Deleting patient:', patient);
    // TODO: Show confirmation dialog and delete patient
};
</script>
