<template>
    <div :class="cn('', $attrs.class as string)">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
</script>
