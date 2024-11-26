<template>
  <div class="layout-container">
    <!-- Mostrar HeaderPage y SideBar solo si el usuario está autenticado -->
    <HeaderPage v-if="isAuthenticated" />
    <div class="flex">
      <SideBar v-if="isAuthenticated" />
      <main class="flex-grow">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import HeaderPage from './components/HeaderPage.vue'
import SideBar from './components/SideBar.vue'

// Definir el estado de autenticación
const isAuthenticated = ref(false)

// Función para comprobar si el usuario está autenticado
const checkAuthentication = () => {
  isAuthenticated.value = !!localStorage.getItem('token') // Verifica si el token está presente en localStorage
}

// Verificar el estado de autenticación al montar el componente
onMounted(() => {
  checkAuthentication()

  // Monitorear el token cada 2 segundos
  const interval = setInterval(() => {
    checkAuthentication()
  }, 50)

  // Limpiar el intervalo cuando el componente se desmonte
  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Asegura que el contenedor principal ocupe toda la altura de la ventana */
}

.flex {
  display: flex;
  flex: 1; /* Asegura que el contenedor de Sidebar y contenido ocupe todo el espacio disponible */
}

SideBar {
  flex: 0 0 auto; /* Sidebar tiene un tamaño fijo */
  min-width: 250px; /* Ajusta el tamaño mínimo del Sidebar */
  background-color: #f4f4f4; /* Estilo para el Sidebar */
  height: 100vh; /* Asegura que el Sidebar ocupe toda la altura de la pantalla */
}

main {
  flex: 1; /* El contenido principal ocupará el espacio restante */
  padding: 20px;
  overflow-y: auto; /* Permite el desplazamiento si el contenido excede el área */
  background-color: #fff; /* Fondo blanco para el contenido */
}
</style>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Hace que el contenedor principal ocupe toda la altura de la ventana */
}

.flex {
  display: flex;
  flex: 1; /* Hace que el contenedor de la barra lateral y el contenido ocupe el espacio restante */
}

SideBar {
  flex: 0 0 auto; /* Sidebar mantiene su tamaño fijo */
  min-width: 250px; /* O ajusta según el tamaño del sidebar */
  background-color: #f4f4f4; /* Estilo para el sidebar */
}

main {
  flex: 1; /* El contenido principal ocupará el espacio restante */
  padding: 20px;
  overflow-y: auto;
}
</style>
