<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado para almacenar los solicitantes
const solicitantes = ref([])

// Función para obtener los solicitantes desde la API
const obtenerSolicitantes = async () => {
  try {
    const response = await axios.get(
      'http://localhost/manejo_actas/index.php?accion=obtener_solicitantes'
    ) // Cambia esta URL por la de tu API
    solicitantes.value = response.data
  } catch (error) {
    console.error('Error al obtener los solicitantes:', error)
  }
}

// Cargar los solicitantes cuando el componente se monte
onMounted(() => {
  obtenerSolicitantes()
})

const verSolicitante = (id) => {
  router.push({ name: 'solicitantes-detalle', params: { id } })
}

const editarSolicitante = (id) => {
  router.push({ name: 'solicitantes-editar', params: { id } })
}

const eliminarSolicitante = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este solicitante?')) {
    // Lógica para eliminar el solicitante (puedes implementar esto más adelante)
    alert(`Solicitante con ID ${id} eliminado`)
  }
}
</script>

<template>
  <div class="overflow-x-auto">
    <h2 class="text-4xl mb-4">Lista de Solicitantes</h2>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-blue-100">
        <tr>
          <th class="border-gray-300 p-2">ID</th>
          <th class="border-gray-300 p-2">Nombre</th>
          <th class="border-gray-300 p-2">Tipo de Solicitante</th>
          <th class="border-gray-300 p-2">Email</th>
          <th class="border-gray-300 p-2">Celular</th>
          <th class="border-gray-300 p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="solicitante in solicitantes" :key="solicitante.IDSOLICITANTE" class="border-b">
          <td class="border-gray-300 p-2">{{ solicitante.IDSOLICITANTE }}</td>
          <td class="border-gray-300 p-2">{{ solicitante.NOMBRE }}</td>
          <td class="border-gray-300 p-2">{{ solicitante.TIPODESOLICITANTE }}</td>
          <td class="border-gray-300 p-2">{{ solicitante.EMAIL }}</td>
          <td class="border-gray-300 p-2">{{ solicitante.CELULAR }}</td>
          <td class="border-gray-300 p-2">
            <button @click="verSolicitante(solicitante.IDSOLICITANTE)" class="text-blue-600">
              Ver
            </button>
            <button
              @click="editarSolicitante(solicitante.IDSOLICITANTE)"
              class="text-yellow-600 ml-4"
            >
              Editar
            </button>
            <button
              @click="eliminarSolicitante(solicitante.IDSOLICITANTE)"
              class="text-red-600 ml-4"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
