<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Consultas</h1>
            <button class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md">
                <CalendarPlus class="w-4 h-4 inline mr-2" />
                Agendar Consulta
            </button>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
            <p class="text-gray-600">Sistema de consultas será implementado aqui.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { CalendarPlus } from 'lucide-vue-next';
</script>
