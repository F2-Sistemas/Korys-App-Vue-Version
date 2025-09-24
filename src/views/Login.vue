<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <img class="mx-auto h-12 w-auto" src="@/assets/korys-health-logo.png" alt="Korys Health" />
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Entre na sua conta</h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="email-address" class="sr-only">Email</label>
                        <input
                            id="email-address"
                            v-model="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Endereço de email"
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Senha</label>
                        <input
                            id="password"
                            v-model="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                            placeholder="Senha"
                        />
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="text-sm">
                        <router-link to="/forgot-password" class="font-medium text-primary hover:text-primary/80">
                            Esqueceu sua senha?
                        </router-link>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                        <Loader2 v-if="loading" class="w-4 h-4 animate-spin mr-2" />
                        Entrar
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
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
    if (!email.value || !password.value) return;

    loading.value = true;

    try {
        const { error } = await authStore.signIn(email.value, password.value);

        if (error) {
            console.error('Login error:', error.message);
            // Handle error (show toast, etc.)
        } else {
            router.push('/');
        }
    } finally {
        loading.value = false;
    }
};

// Initialize auth store
authStore.initialize();
</script>
