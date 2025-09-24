<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Pacientes</h1>
            <button class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md">
                <UserPlus class="w-4 h-4 inline mr-2" />
                Novo Paciente
            </button>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
            <p class="text-gray-600">Lista de pacientes será implementada aqui.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next';
</script>
