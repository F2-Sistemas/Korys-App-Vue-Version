<template>
    <div class="flex min-h-screen">
        <aside class="w-64 bg-gray-200 p-4">Sidebar</aside>
        <main class="flex-1 p-6">
            <transition>
                <router-view></router-view>
            </transition>
        </main>
    </div>
</template>
