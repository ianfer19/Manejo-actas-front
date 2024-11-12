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

const verActa = (id) => {
  router.push({ name: 'acta-detalle', params: { id } })
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
            <button @click="verActa(acta.NUM_ACTAS)" class="text-blue-600">Ver</button>
            <button @click="editarActa(acta.NUM_ACTAS)" class="text-yellow-600 ml-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Editar
            </button>
            <button @click="eliminarActa(acta.NUM_ACTAS)" class="text-red-600 ml-4">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
