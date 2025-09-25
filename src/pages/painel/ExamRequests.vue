<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Solicitações de Exames</h1>
            <button class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md">
                <Plus class="w-4 h-4 inline mr-2" />
                Nova Solicitação
            </button>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
            <p class="text-gray-600">Sistema de exames será implementado aqui.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
</script>
