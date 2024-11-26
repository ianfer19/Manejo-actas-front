<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'
const router = useRouter()

const proposiciones = ref([])
const searchQuery = ref('')
const searchField = ref('ID_PROPOSICIONES')

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

// Función para filtrar las proposiciones por el campo seleccionado
const filteredProposiciones = computed(() => {
  return proposiciones.value.filter((proposicion) =>
    proposicion[searchField.value]
      .toString()
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <!-- Breadcrumb -->
        <BreadCrumb modulo="Proposiciones" accion="Lista" />

        <!-- Formulario de búsqueda -->
        <div class="mb-4 flex items-center gap-4">
          <select v-model="searchField" class="border p-2 rounded">
            <option value="ID_PROPOSICIONES">ID</option>
            <option value="DESCRIPCION">Descripción</option>
            <option value="DESICION">Decisión</option>
            <option value="MIEMBRO_IDMIEMBRO">ID Miembro</option>
            <option value="SESION_IDSESION">ID Sesión</option>
          </select>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar..."
            class="border p-2 rounded w-64"
          />
        </div>

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
                v-for="proposicion in filteredProposiciones"
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

<style scoped>
/* Estilos para el formulario de búsqueda */
input,
select {
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 4px;
}

select {
  width: 150px;
}

input {
  width: 250px;
}

button {
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}
</style>
