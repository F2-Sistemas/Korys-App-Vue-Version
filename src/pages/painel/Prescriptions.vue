<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-3xl font-bold tracking-tight">Prescrições</h1>
                <p class="text-muted-foreground">
                    Gerencie prescrições médicas e medicamentos
                </p>
            </div>
            <Button @click="openAddPrescriptionDialog">
                <Plus class="mr-2 h-4 w-4" />
                Nova Prescrição
            </Button>
        </div>

        <!-- Prescriptions Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardContent class="p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Prescrições Ativas</p>
                            <p class="text-2xl font-bold">12</p>
                        </div>
                        <div class="p-2 rounded-lg bg-prescription/10">
                            <Pill class="h-4 w-4 text-prescription" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Pendentes</p>
                            <p class="text-2xl font-bold">3</p>
                        </div>
                        <div class="p-2 rounded-lg bg-warning/10">
                            <Clock class="h-4 w-4 text-warning" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent class="p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Este Mês</p>
                            <p class="text-2xl font-bold">28</p>
                        </div>
                        <div class="p-2 rounded-lg bg-success/10">
                            <CheckCircle class="h-4 w-4 text-success" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Recent Prescriptions -->
        <Card>
            <CardHeader>
                <CardTitle>Prescrições Recentes</CardTitle>
                <CardDescription>
                    Últimas prescrições emitidas no sistema
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    <div v-for="prescription in recentPrescriptions" :key="prescription.id"
                         class="flex items-center justify-between p-4 border rounded-lg">
                        <div class="flex items-center space-x-4">
                            <div class="p-2 rounded-lg bg-prescription/10">
                                <Pill class="h-4 w-4 text-prescription" />
                            </div>
                            <div>
                                <p class="font-medium">{{ prescription.medication }}</p>
                                <p class="text-sm text-muted-foreground">
                                    {{ prescription.patient }} • {{ prescription.doctor }}
                                </p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-medium">{{ prescription.date }}</p>
                            <Badge :variant="prescription.statusVariant" class="mt-1">
                                {{ prescription.status }}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Plus, Pill, Clock, CheckCircle } from 'lucide-vue-next';

// Import UI components
import Card from '@/components/ui/Card.vue';
import CardContent from '@/components/ui/CardContent.vue';
import CardDescription from '@/components/ui/CardDescription.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';

const recentPrescriptions = ref([
    {
        id: '1',
        medication: 'Losartana 50mg',
        patient: 'João Silva Santos',
        doctor: 'Dr. Carlos Medeiros',
        date: '25/01/2024',
        status: 'Ativa',
        statusVariant: 'success',
    },
    {
        id: '2',
        medication: 'Omeprazol 20mg',
        patient: 'Maria Santos',
        doctor: 'Dra. Ana Costa',
        date: '24/01/2024',
        status: 'Pendente',
        statusVariant: 'warning',
    },
    {
        id: '3',
        medication: 'Atorvastatina 20mg',
        patient: 'Pedro Costa',
        doctor: 'Dr. Roberto Silva',
        date: '23/01/2024',
        status: 'Ativa',
        statusVariant: 'success',
    },
]);

const openAddPrescriptionDialog = () => {
    console.log('Opening add prescription dialog');
};
</script>
