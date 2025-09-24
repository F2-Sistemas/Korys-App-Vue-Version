<template>
    <div class="relative">
        <button
            class="flex items-center p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
            @click="isOpen = !isOpen"
        >
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User class="w-4 h-4 text-white" />
            </div>
        </button>

        <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
            <div class="px-4 py-2 text-sm text-gray-700 border-b">
                <div class="font-medium">{{ profile?.name || user?.email }}</div>
                <div class="text-gray-500">{{ user?.email }}</div>
            </div>

            <button
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="handleProfileClick"
            >
                <User class="w-4 h-4 inline mr-2" />
                Perfil
            </button>

            <button
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="handleHelpClick"
            >
                <HelpCircle class="w-4 h-4 inline mr-2" />
                Ajuda
            </button>

            <button
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="handleFeedbackClick"
            >
                <MessageSquare class="w-4 h-4 inline mr-2" />
                Feedback
            </button>

            <div class="border-t mt-1">
                <button
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    @click="handleLogout"
                >
                    <LogOut class="w-4 h-4 inline mr-2" />
                    Sair
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { User } from '@supabase/supabase-js';
import { User as UserIcon, LogOut, HelpCircle, MessageSquare } from 'lucide-vue-next';

interface Props {
    user: User | null;
    profile: any;
}

interface Emits {
    logout: [];
    'navigate-to-profile': [];
    'navigate-to-help': [];
    'navigate-to-feedback': [];
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const isOpen = ref(false);

const handleLogout = () => {
    isOpen.value = false;
    emit('logout');
};

const handleProfileClick = () => {
    isOpen.value = false;
    emit('navigate-to-profile');
};

const handleHelpClick = () => {
    isOpen.value = false;
    emit('navigate-to-help');
};

const handleFeedbackClick = () => {
    isOpen.value = false;
    emit('navigate-to-feedback');
};

const closeDropdown = (event: MouseEvent) => {
    if (!(event.target as Element).closest('.relative')) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown);
});
</script>
