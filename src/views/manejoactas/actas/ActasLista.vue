<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sesiones = ref([])

// Función para obtener sesiones desde el API
const obtenerSesiones = async () => {
  try {
    const response = await fetch('http://localhost/manejo_actas/index.php?accion=obtener_sesiones')
    if (response.ok) {
      sesiones.value = await response.json()
    } else {
      console.error('Error al obtener las sesiones')
    }
  } catch (error) {
    console.error('Error de conexión:', error)
  }
}

// Llamar a obtenerSesiones cuando el componente se monte
onMounted(() => {
  obtenerSesiones()
})

const verSesion = (id) => {}

const editarSesion = (id) => {}

const eliminarSesion = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta sesión?')) {
    // Lógica para eliminar la sesión (puedes implementar esto más adelante)
    alert(`Sesión con ID ${id} eliminada`)
  }
}
</script>

<template>
  <div class="overflow-x-auto">
    <h2 class="text-4xl mb-4">Lista actas</h2>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-blue-100">
        <tr>
          <th class="border-gray-300 p-2">ID</th>
          <th class="border-gray-300 p-2">Lugar</th>
          <th class="border-gray-300 p-2">Fecha</th>
          <th class="border-gray-300 p-2">Hora Inicio</th>
          <th class="border-gray-300 p-2">Hora Final</th>
          <th class="border-gray-300 p-2">Presidente</th>
          <th class="border-gray-300 p-2">Secretario</th>
          <th class="border-gray-300 p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sesion in sesiones" :key="sesion.IDSESION" class="border-b">
          <td class="border-gray-300 p-2">{{ sesion.IDSESION }}</td>
          <td class="border-gray-300 p-2">{{ sesion.LUGAR }}</td>
          <td class="border-gray-300 p-2">{{ sesion.FECHA }}</td>
          <td class="border-gray-300 p-2">{{ sesion.HORAINICIO }}</td>
          <td class="border-gray-300 p-2">{{ sesion.HORAFINAL }}</td>
          <td class="border-gray-300 p-2">{{ sesion.PRESIDENTE }}</td>
          <td class="border-gray-300 p-2">{{ sesion.SECRETARIO }}</td>
          <td class="border-gray-300 p-2">
            <button @click="verSesion(sesion.IDSESION)" class="text-blue-600">Ver</button>
            <button @click="editarSesion(sesion.IDSESION)" class="text-yellow-600 ml-4">
              Editar
            </button>
            <button @click="eliminarSesion(sesion.IDSESION)" class="text-red-600 ml-4">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
