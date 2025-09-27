<template>
    <div>
        <slot @click="openDialog">
            <Button @click="openDialog">
                <Plus class="h-4 w-4 mr-2" />
                Novo Paciente
            </Button>
        </slot>

        <Dialog :open="isOpen" @update:open="onOpenChange" class="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Adicionar Novo Paciente</DialogTitle>
                <DialogDescription>Preencha as informações do paciente abaixo.</DialogDescription>
            </DialogHeader>

            <form @submit.prevent="onSubmit" class="space-y-6">
                <!-- Informações Pessoais -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold">Informações Pessoais</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="name">Nome Completo *</Label>
                            <Input id="name" v-model="formData.name" placeholder="Digite o nome completo" required />
                        </div>
                        <div class="space-y-2">
                            <Label for="birthDate">Data de Nascimento *</Label>
                            <Input id="birthDate" v-model="formData.birth_date" type="date" required />
                        </div>
                        <div class="space-y-2">
                            <Label for="gender">Gênero</Label>
                            <Select v-model="formData.gender">
                                <option value="">Selecionar gênero</option>
                                <option value="male">Masculino</option>
                                <option value="female">Feminino</option>
                                <option value="other">Outro</option>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label for="maritalStatus">Estado Civil</Label>
                            <Select v-model="formData.marital_status">
                                <option value="">Selecionar estado civil</option>
                                <option value="Solteiro(a)">Solteiro(a)</option>
                                <option value="Casado(a)">Casado(a)</option>
                                <option value="Divorciado(a)">Divorciado(a)</option>
                                <option value="Viúvo(a)">Viúvo(a)</option>
                            </Select>
                        </div>
                    </div>
                </div>

                <!-- Informações Físicas -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold">Informações Físicas</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="space-y-2">
                            <Label for="height">Altura (m)</Label>
                            <Input
                                id="height"
                                v-model.number="formData.height"
                                type="number"
                                step="0.01"
                                placeholder="1.70"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="weight">Peso (kg)</Label>
                            <Input
                                id="weight"
                                v-model.number="formData.weight"
                                type="number"
                                step="0.1"
                                placeholder="70.5"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="bloodGroup">Tipo Sanguíneo</Label>
                            <Select v-model="formData.blood_group">
                                <option value="">Selecionar tipo</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </Select>
                        </div>
                    </div>
                </div>

                <!-- Contato -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold">Contato</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="phone">Telefone *</Label>
                            <Input id="phone" v-model="formData.phone" placeholder="(11) 99999-9999" required />
                        </div>
                        <div class="space-y-2">
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="formData.email" type="email" placeholder="paciente@email.com" />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label for="address">Endereço</Label>
                        <Textarea
                            id="address"
                            v-model="formData.address"
                            placeholder="Rua, número, bairro, cidade - estado"
                            rows="2"
                        />
                    </div>
                </div>

                <!-- Informações Médicas -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold">Informações Médicas</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="comorbidities">Comorbidades</Label>
                            <Textarea
                                id="comorbidities"
                                v-model="comorbiditiesText"
                                placeholder="Separar por vírgula: Hipertensão, Diabetes..."
                                rows="3"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="allergies">Alergias</Label>
                            <Textarea
                                id="allergies"
                                v-model="allergiesText"
                                placeholder="Separar por vírgula: Penicilina, Látex..."
                                rows="3"
                            />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label for="assignedDoctor">Médico Responsável</Label>
                        <Select v-model="formData.assigned_doctor_id">
                            <option value="">Selecionar médico</option>
                            <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                                {{ doctor.name }}
                            </option>
                        </Select>
                    </div>
                </div>

                <!-- Responsável -->
                <div class="space-y-4">
                    <h3 class="text-lg font-semibold">Responsável pelo Paciente</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="responsibleName">Nome do Responsável</Label>
                            <Input
                                id="responsibleName"
                                v-model="formData.responsible_name"
                                placeholder="Nome do responsável"
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="responsiblePhone">Telefone do Responsável</Label>
                            <Input
                                id="responsiblePhone"
                                v-model="formData.responsible_phone"
                                placeholder="(11) 99999-9999"
                            />
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-4 pt-6">
                    <Button type="button" variant="outline" @click="closeDialog">Cancelar</Button>
                    <Button type="submit" :disabled="loading">
                        <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
                        Adicionar Paciente
                    </Button>
                </div>
            </form>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { Plus, Loader2 } from 'lucide-vue-next';
import type { PatientCreate } from '@/types/patient';
import { usePatientsStore } from '@/stores/patients';

// UI Components
import Button from '@/components/ui/Button.vue';
import Dialog from '@/components/ui/Dialog.vue';
import DialogDescription from '@/components/ui/DialogDescription.vue';
import DialogHeader from '@/components/ui/DialogHeader.vue';
import DialogTitle from '@/components/ui/DialogTitle.vue';
import Input from '@/components/ui/Input.vue';
import Label from '@/components/ui/Label.vue';
import Select from '@/components/ui/Select.vue';
import Textarea from '@/components/ui/Textarea.vue';

// Props and Emits
interface Props {
    open?: boolean;
}

interface Emits {
    (e: 'update:open', value: boolean): void;
    (e: 'patientCreated', patient: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Store
const patientsStore = usePatientsStore();

// State
const isOpen = ref(props.open || false);
const loading = ref(false);

// Mock doctors data - in real app, this would come from a store
const doctors = ref([
    { id: '1', name: 'Dr. João Silva' },
    { id: '2', name: 'Dra. Maria Santos' },
    { id: '3', name: 'Dr. Pedro Costa' },
]);

// Form data
const formData = reactive<PatientCreate>({
    name: '',
    birth_date: '',
    gender: 'male',
    height: undefined,
    weight: undefined,
    blood_group: '',
    marital_status: '',
    phone: '',
    email: '',
    address: '',
    comorbidities: [],
    allergies: [],
    assigned_doctor_id: '',
    responsible_name: '',
    responsible_phone: '',
    status: 'active',
});

// Text fields for arrays
const comorbiditiesText = ref('');
const allergiesText = ref('');

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
const resetForm = () => {
    Object.assign(formData, {
        name: '',
        birth_date: '',
        gender: 'male',
        height: undefined,
        weight: undefined,
        blood_group: '',
        marital_status: '',
        phone: '',
        email: '',
        address: '',
        comorbidities: [],
        allergies: [],
        assigned_doctor_id: '',
        responsible_name: '',
        responsible_phone: '',
        status: 'active',
    });
    comorbiditiesText.value = '';
    allergiesText.value = '';
};

const closeDialog = () => {
    isOpen.value = false;
    resetForm();
};

const onSubmit = async () => {
    try {
        loading.value = true;

        // Process comorbidities and allergies
        const processedData = {
            ...formData,
            comorbidities: comorbiditiesText.value
                ? comorbiditiesText.value
                      .split(',')
                      .map((c) => c.trim())
                      .filter(Boolean)
                : [],
            allergies: allergiesText.value
                ? allergiesText.value
                      .split(',')
                      .map((a) => a.trim())
                      .filter(Boolean)
                : [],
        };

        // Remove empty strings and undefined values
        Object.keys(processedData).forEach((key) => {
            const value = processedData[key as keyof PatientCreate];
            if (value === '' || value === undefined) {
                delete processedData[key as keyof PatientCreate];
            }
        });

        const newPatient = await patientsStore.createPatient(processedData);

        if (newPatient) {
            emit('patientCreated', newPatient);
            closeDialog();
        }
    } catch (error) {
        console.error('Error creating patient:', error);
    } finally {
        loading.value = false;
    }
};
</script>
