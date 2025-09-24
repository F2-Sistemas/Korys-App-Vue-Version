<template>
    <div class="relative">
        <button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full" @click="isOpen = !isOpen">
            <Bell class="w-5 h-5" />
            <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
            >
                {{ unreadCount }}
            </span>
        </button>

        <div
            v-if="isOpen"
            class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border max-h-96 overflow-y-auto"
        >
            <div class="px-4 py-2 text-sm font-medium text-gray-900 border-b">Notificações</div>

            <div v-if="notifications.length === 0" class="px-4 py-3 text-sm text-gray-500">Nenhuma notificação</div>

            <div
                v-for="notification in notifications"
                :key="notification.id"
                class="px-4 py-3 border-b hover:bg-gray-50"
            >
                <div class="text-sm font-medium text-gray-900">
                    {{ notification.title }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                    {{ notification.message }}
                </div>
                <div class="text-xs text-gray-400 mt-1">
                    {{ formatDate(notification.created_at) }}
                </div>
            </div>

            <div class="px-4 py-2 text-center border-t">
                <button class="text-sm text-primary hover:text-primary/80">Ver todas</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Bell } from 'lucide-vue-next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
    id: string;
    title: string;
    message: string;
    created_at: string;
    read: boolean;
}

const isOpen = ref(false);
const notifications = ref<Notification[]>([]);

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length);

const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
};

onMounted(() => {
    // Load notifications - replace with actual data fetching
    notifications.value = [];
});
</script>
