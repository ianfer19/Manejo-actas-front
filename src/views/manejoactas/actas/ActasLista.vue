<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const router = useRouter()

const actas = ref([])

const editarActa = (id) => {
  router.push({ name: 'acta-editar', params: { id } })
}
// Función para obtener las actas desde la API
const obtenerActas = async () => {
  try {
    const response = await fetch('http://localhost/manejo_actas/index.php?accion=obtener_actas')
    if (response.ok) {
      const data = await response.json()
      actas.value = data // Asigna los datos obtenidos
    } else {
      console.error('Error al obtener las actas')
    }
  } catch (error) {
    console.error('Error de conexión:', error)
  }
}

// Llamar a obtenerActas cuando el componente se monte
onMounted(() => {
  obtenerActas()
})

const eliminarActa = (numActa) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta acta?')) {
    // Lógica para eliminar el acta (puedes implementar esto más adelante)
    alert(`Acta con Número ${numActa} eliminada`)
  }
}
</script>

<template>
  <div class="overflow-x-auto">
    <h2 class="text-4xl mb-4">Lista de Actas</h2>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-blue-100">
        <tr>
          <th class="border-gray-300 p-2">Número Acta</th>
          <th class="border-gray-300 p-2">Estado</th>
          <th class="border-gray-300 p-2">ID Sesión</th>
          <th class="border-gray-300 p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="acta in actas" :key="acta.NUM_ACTAS" class="border-b">
          <td class="border-gray-300 p-2">{{ acta.NUM_ACTAS }}</td>
          <td class="border-gray-300 p-2">{{ acta.ESTADO }}</td>
          <td class="border-gray-300 p-2">{{ acta.SESION_IDSESION }}</td>
          <td class="border-gray-300 p-2">
            <button @click="editarActa(acta.NUM_ACTAS)" class="text-blue-600">Ver</button>
            <button @click="eliminarActa(acta.NUM_ACTAS)" class="text-red-600 ml-4">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
