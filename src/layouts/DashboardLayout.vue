<template>
    <AppLayout currentPage="" :user="null" :profile="null">
        <transition>
            <router-view></router-view>
        </transition>
    </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue';
</script>
