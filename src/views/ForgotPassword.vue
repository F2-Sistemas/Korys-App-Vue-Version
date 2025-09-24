<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <img class="mx-auto h-12 w-auto" src="@/assets/korys-health-logo.png" alt="Korys Health" />
                <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Recuperar senha</h2>
                <p class="mt-2 text-sm text-gray-600">Digite seu email para receber instruções de recuperação</p>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleResetPassword">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="seu@email.com"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                        <Loader2 v-if="loading" class="w-4 h-4 animate-spin mr-2" />
                        Enviar instruções
                    </button>
                </div>
                <div class="text-center">
                    <router-link to="/login" class="font-medium text-primary hover:text-primary/80">
                        Voltar ao login
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Loader2 } from 'lucide-vue-next';

const email = ref('');
const loading = ref(false);

const handleResetPassword = async () => {
    loading.value = true;
    console.log('Password reset for:', email.value);
    setTimeout(() => {
        loading.value = false;
    }, 1000);
};
</script>
