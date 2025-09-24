<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <img class="mx-auto h-12 w-auto" src="@/assets/korys-health-logo.png" alt="Korys Health" />
                <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Definir nova senha</h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handlePasswordUpdate">
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Nova senha</label>
                    <input
                        id="password"
                        v-model="password"
                        type="password"
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Digite sua nova senha"
                    />
                </div>
                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmar senha</label>
                    <input
                        id="confirmPassword"
                        v-model="confirmPassword"
                        type="password"
                        required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Confirme sua nova senha"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                        <Loader2 v-if="loading" class="w-4 h-4 animate-spin mr-2" />
                        Atualizar senha
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Loader2 } from 'lucide-vue-next';

const router = useRouter();
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

const handlePasswordUpdate = async () => {
    if (password.value !== confirmPassword.value) {
        console.error('Passwords do not match');
        return;
    }

    loading.value = true;
    console.log('Password updated');
    setTimeout(() => {
        loading.value = false;
        router.push('/login');
    }, 1000);
};
</script>
