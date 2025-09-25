<template>
    <Teleport to="body">
        <Transition name="dialog">
            <div
                v-if="open"
                class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
                role="dialog"
                aria-modal="true"
                @click="onOverlayClick"
            >
                <Transition name="backdrop">
                    <div
                        v-if="open"
                        class="fixed inset-0 bg-black/50 transition-opacity"
                        @click="onOverlayClick"
                    />
                </Transition>

                <Transition name="content">
                    <div
                        v-if="open"
                        :class="cn(
                            'relative bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
                            'w-full max-w-lg mx-4',
                            $attrs.class
                        )"
                        @click.stop
                    >
                        <slot />
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { cn } from '@/lib/utils';

interface Props {
    open: boolean;
}

interface Emits {
    'update:open': [value: boolean];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const onOverlayClick = () => {
    emit('update:open', false);
};

// Handle body scroll lock
watch(
    () => props.open,
    (isOpen) => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
);
</script>

<style scoped>
/* Dialog transitions */
.dialog-enter-active,
.dialog-leave-active {
    transition: all 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
}

/* Backdrop transitions */
.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}

/* Content transitions */
.content-enter-active,
.content-leave-active {
    transition: all 0.3s ease;
}

.content-enter-from,
.content-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
}
</style>