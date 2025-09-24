<template>
    <div class="space-y-6">
        <h1 class="text-2xl font-bold text-gray-900">Agenda</h1>
        <div class="bg-white shadow rounded-lg p-6 text-center">
            <Calendar class="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p class="text-gray-600">Componente de calendário será implementado aqui.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Calendar } from 'lucide-vue-next';
</script>
