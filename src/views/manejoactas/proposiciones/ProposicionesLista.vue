<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'
const router = useRouter()

const proposiciones = ref([])

// Función para obtener el token JWT desde el almacenamiento local
function obtenerToken() {
  return localStorage.getItem('token') // O la fuente donde almacenes el token
}

// Función para obtener las proposiciones con autenticación
const obtenerProposiciones = async () => {
  try {
    const token = obtenerToken() // Obtener el token JWT

    const response = await axios.get(
      'http://localhost/manejo_actas/index.php?accion=proposicion_obtener_proposiciones',
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token JWT a las cabeceras
        }
      }
    )

    proposiciones.value = response.data
  } catch (error) {
    console.error('Error al obtener proposiciones:', error)
  }
}

onMounted(() => {
  obtenerProposiciones()
})

const verProposicion = (id) => {
  router.push({ name: 'proposiciones-detalle', params: { id } })
}

const editarProposicion = (id) => {
  router.push({ name: 'proposiciones-editar', params: { id } })
}

const eliminarProposicion = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta proposición?')) {
    // Lógica para eliminar la proposición (puedes implementar esto más adelante)
    alert(`Proposición con ID ${id} eliminada`)
  }
}
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <!-- Breadcrumb -->
        <BreadCrumb modulo="Proposiciones" accion="Lista" />
        <div
          class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000"
        >
          <router-link to="/proposiciones-crear">Crear Proposiciones</router-link>
        </div>

        <div class="overflow-x-auto">
          <h2 class="text-4xl mb-4">Lista de Proposiciones</h2>
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-blue-100">
              <tr>
                <th class="border-gray-300 p-2">ID</th>
                <th class="border-gray-300 p-2">Descripción</th>
                <th class="border-gray-300 p-2">Decisión</th>
                <th class="border-gray-300 p-2">ID Miembro</th>
                <th class="border-gray-300 p-2">ID Sesión</th>
                <th class="border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="proposicion in proposiciones"
                :key="proposicion.ID_PROPOSICIONES"
                class="border-b"
              >
                <td class="border-gray-300 p-2">{{ proposicion.ID_PROPOSICIONES }}</td>
                <td class="border-gray-300 p-2">{{ proposicion.DESCRIPCION }}</td>
                <td class="border-gray-300 p-2">{{ proposicion.DESICION }}</td>
                <td class="border-gray-300 p-2">{{ proposicion.MIEMBRO_IDMIEMBRO }}</td>
                <td class="border-gray-300 p-2">{{ proposicion.SESION_IDSESION }}</td>
                <td class="border-gray-300 p-2">
                  <button
                    @click="editarProposicion(proposicion.ID_PROPOSICIONES)"
                    class="text-yellow-600 ml-4"
                  >
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>
