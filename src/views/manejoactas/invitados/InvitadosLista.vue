<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const invitados = ref([]) // Usamos ref para la lista de invitados
const router = useRouter()

// Filtros
const filtroId = ref('')
const filtroNombre = ref('')

// Función para obtener el token del localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Función para cargar los invitados
async function cargarInvitados() {
  try {
    const token = getToken() // Obtener el token
    console.log(token)
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=invitado_obtener_invitados',
      {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    )
    if (!response.ok) throw new Error('Error al cargar invitados')
    invitados.value = await response.json()
  } catch (error) {
    console.error('Error:', error)
  }
}

// Filtro computado para los invitados
const invitadosFiltrados = computed(() => {
  return invitados.value.filter((invitado) => {
    const idValido = filtroId.value
      ? invitado.IDINVITADOS.toString().includes(filtroId.value)
      : true
    const nombreValido = filtroNombre.value
      ? invitado.NOMBRE.toLowerCase().includes(filtroNombre.value.toLowerCase())
      : true

    return idValido && nombreValido
  })
})

function verInvitado(id) {
  router.push({ name: 'invitados-detalle', params: { id } })
}

function editarInvitado(id) {
  router.push({ name: 'invitados-editar', params: { id } })
}

async function eliminarInvitado(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este invitado?')) {
    try {
      const token = getToken() // Obtener el token
      const response = await fetch('/ruta/api/invitados.php?action=eliminar_invitado', {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
      const result = await response.json()
      if (result.success) {
        invitados.value = invitados.value.filter((invitado) => invitado.id !== id)
        alert(`Invitado con ID ${id} eliminado`)
      } else {
        alert(result.error || 'No se pudo eliminar el invitado')
      }
    } catch (error) {
      console.error('Error eliminando el invitado:', error)
    }
  }
}

onMounted(() => {
  cargarInvitados()
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Invitados" accion="Listar" />
        <div
          class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000"
        >
          <router-link to="/invitados-crear">Crear Invitado</router-link>
        </div>
        <div class="grid grid-cols-2 my-6 text-gray-700">
          <div class="flex items-center">
            <h2 class="text-4xl mb-4">Lista de Invitados</h2>
          </div>
        </div>

        <!-- Filtros -->
        <div class="flex space-x-4 mb-6">
          <div>
            <label for="filtroId" class="block">Filtrar por ID</label>
            <input
              v-model="filtroId"
              type="text"
              id="filtroId"
              class="border p-2"
              placeholder="ID del invitado"
            />
          </div>
          <div>
            <label for="filtroNombre" class="block">Filtrar por Nombre</label>
            <input
              v-model="filtroNombre"
              type="text"
              id="filtroNombre"
              class="border p-2"
              placeholder="Nombre del invitado"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-blue-100">
              <tr>
                <th scope="col" class="px-6 py-3">Nombre</th>
                <th scope="col" class="px-6 py-3">Dependencia</th>
                <th scope="col" class="px-6 py-3">Cargo</th>
                <th scope="col" class="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="invitado in invitadosFiltrados"
                :key="invitado.IDINVITADOS"
                class="bg-white border-b"
              >
                <td class="px-6 py-4">{{ invitado.NOMBRE }}</td>
                <td class="px-6 py-4">{{ invitado.DEPENDENCIA }}</td>
                <td class="px-6 py-4">{{ invitado.CARGO }}</td>
                <td class="px-6 py-4">
                  <button
                    @click="editarInvitado(invitado.IDINVITADOS)"
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
