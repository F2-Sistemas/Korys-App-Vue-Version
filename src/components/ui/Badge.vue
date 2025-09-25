<template>
    <div :class="cn(badgeVariants({ variant }), $attrs.class)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
                secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
                outline: 'text-foreground',
                success: 'border-transparent bg-success text-success-foreground shadow hover:bg-success/80',
                warning: 'border-transparent bg-warning text-warning-foreground shadow hover:bg-warning/80',
                patient: 'border-transparent bg-patient text-primary-foreground shadow hover:bg-patient/80',
                appointment: 'border-transparent bg-appointment text-accent-foreground shadow hover:bg-appointment/80',
                prescription: 'border-transparent bg-prescription text-success-foreground shadow hover:bg-prescription/80',
                exam: 'border-transparent bg-exam text-warning-foreground shadow hover:bg-exam/80',
                financial: 'border-transparent bg-financial text-primary-foreground shadow hover:bg-financial/80',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

interface Props extends /* @vue-ignore */ VariantProps<typeof badgeVariants> {}

const props = defineProps<Props>();
</script>
