import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import App from './App.vue';
import router from './router';
import './index.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(VueQueryPlugin, {
    queryClientConfig: {
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes
                retry: 1,
            },
        },
    },
});
app.use(Vue3Toastify, {
    autoClose: 3000,
    position: 'top-right',
    theme: 'auto',
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
} as ToastContainerOptions);
app.use(router);

// Initialize auth store to check for existing session
import { useAuthStore } from './stores/auth';
const authStore = useAuthStore();
authStore.initialize();

app.mount('#app');
