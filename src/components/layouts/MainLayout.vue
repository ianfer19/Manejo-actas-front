<template>
  <div>
    <HeaderPage />
    <div class="flex">
      <SideBar />
      <main class="flex-grow">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import HeaderPage from '../HeaderPage.vue' // Ruta correcta si HeaderPage está en components/
import SideBar from '../SideBar.vue' // Ruta correcta si SideBar está en components/
</script>
