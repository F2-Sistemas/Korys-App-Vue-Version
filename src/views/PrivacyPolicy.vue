<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto bg-white shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
                <div class="prose max-w-none">
                    <h2>1. Coleta de Informações</h2>
                    <p>
                        Coletamos apenas as informações necessárias para o funcionamento adequado do sistema de
                        gerenciamento de saúde, incluindo dados de pacientes e informações médicas.
                    </p>
                    <h2>2. Uso das Informações</h2>
                    <p>
                        As informações coletadas são utilizadas exclusivamente para o gerenciamento de registros
                        médicos.
                    </p>
                </div>
                <div class="mt-8">
                    <router-link to="/login" class="text-primary hover:text-primary/80 font-medium">
                        ← Voltar ao login
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// Privacy Policy component
</script>
