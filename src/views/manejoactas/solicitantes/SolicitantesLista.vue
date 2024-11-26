<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'
const router = useRouter()

// Estado para almacenar los solicitantes
const solicitantes = ref([])
// Filtros
const filtroId = ref('')
const filtroNombre = ref('')
const filtroTipo = ref('')

// Variable para almacenar si el usuario tiene un rol restringido
const isViewerOrUser = ref(false)

// Obtener el token desde localStorage
const token = localStorage.getItem('token')

// Función para obtener el token del localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Función para obtener el rol del usuario
const getUserRole = async () => {
  const token = getToken()
  if (token) {
    try {
      const tokenParts = token.split('.')
      if (tokenParts.length === 3) {
        const decodedPayload = atob(tokenParts[1])
        const decodedData = JSON.parse(decodedPayload)
        const userId = decodedData.userId
        await fetchUser(userId)
      } else {
        console.error('Token JWT no tiene el formato esperado.')
      }
    } catch (error) {
      console.error('Error al decodificar el token', error)
    }
  }
}

// Obtener los datos del usuario desde la API para verificar el rol
const fetchUser = async (id) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=user_obtener_usuario_por_id&id=${id}`
    )
    if (response.ok) {
      const data = await response.json()
      // Verificar si el rol es "viewer" o "user"
      if (data.role === 'viewer' || data.role === 'user') {
        isViewerOrUser.value = true
      }
    } else {
      console.error('No se pudo obtener la información del usuario.')
    }
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error)
  }
}

// Función para obtener los solicitantes desde la API
const obtenerSolicitantes = async () => {
  try {
    const response = await axios.get(
      'http://localhost/manejo_actas/index.php?accion=solicitante_obtener_solicitantes',
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token aquí
        }
      }
    )
    solicitantes.value = response.data
  } catch (error) {
    console.error('Error al obtener los solicitantes:', error)
  }
}

// Cargar los solicitantes y verificar el rol cuando el componente se monte
onMounted(() => {
  obtenerSolicitantes()
  getUserRole()
})

// Filtrado computado para los solicitantes
const solicitantesFiltrados = computed(() => {
  return solicitantes.value.filter((solicitante) => {
    const idValido = filtroId.value
      ? solicitante.IDSOLICITANTE.toString().includes(filtroId.value)
      : true
    const nombreValido = filtroNombre.value
      ? solicitante.NOMBRE.toLowerCase().includes(filtroNombre.value.toLowerCase())
      : true
    const tipoValido = filtroTipo.value
      ? solicitante.TIPODESOLICITANTE.toLowerCase().includes(filtroTipo.value.toLowerCase())
      : true

    return idValido && nombreValido && tipoValido
  })
})

const verSolicitante = (id) => {
  router.push({ name: 'solicitantes-detalle', params: { id } })
}

const editarSolicitante = (id) => {
  if (!isViewerOrUser.value) {
    router.push({ name: 'solicitantes-editar', params: { id } })
  }
}

const eliminarSolicitante = async (id) => {
  if (!isViewerOrUser.value && confirm('¿Estás seguro de que deseas eliminar este solicitante?')) {
    try {
      await axios.delete(
        `http://localhost/manejo_actas/index.php?accion=solicitante_eliminar&idSolicitante=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}` // Agregar el token aquí
          }
        }
      )
      alert(`Solicitante con ID ${id} eliminado`)
      obtenerSolicitantes() // Recargar la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar el solicitante:', error)
      alert('Ocurrió un error al intentar eliminar el solicitante.')
    }
  } else {
    alert('No tienes permisos para realizar esta acción.')
  }
}
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <!-- Breadcrumb -->
        <BreadCrumb modulo="Solicitante" accion="Lista" />
        <div class="mb-4">
          <!-- Filtros -->
          <label for="id" class="mr-2">ID:</label>
          <input
            v-model="filtroId"
            type="text"
            id="id"
            class="border p-2"
            placeholder="Filtrar por ID"
          />

          <label for="nombre" class="ml-4 mr-2">Nombre:</label>
          <input
            v-model="filtroNombre"
            type="text"
            id="nombre"
            class="border p-2"
            placeholder="Filtrar por Nombre"
          />

          <label for="tipo" class="ml-4 mr-2">Tipo de Solicitante:</label>
          <input
            v-model="filtroTipo"
            type="text"
            id="tipo"
            class="border p-2"
            placeholder="Filtrar por Tipo de Solicitante"
          />
        </div>

        <div
          v-if="!isViewerOrUser"
          class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000"
        >
          <router-link to="/solicitantes-crear">Crear Solicitante</router-link>
        </div>

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
              <tr
                v-for="solicitante in solicitantesFiltrados"
                :key="solicitante.IDSOLICITANTE"
                class="border-b"
              >
                <td class="border-gray-300 p-2">{{ solicitante.IDSOLICITANTE }}</td>
                <td class="border-gray-300 p-2">{{ solicitante.NOMBRE }}</td>
                <td class="border-gray-300 p-2">{{ solicitante.TIPODESOLICITANTE }}</td>
                <td class="border-gray-300 p-2">{{ solicitante.EMAIL }}</td>
                <td class="border-gray-300 p-2">{{ solicitante.CELULAR }}</td>
                <td class="border-gray-300 p-2">
                  <button
                    @click="editarSolicitante(solicitante.IDSOLICITANTE)"
                    class="text-yellow-600 ml-4"
                    v-if="!isViewerOrUser"
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
