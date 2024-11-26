<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const solicitudes = ref([])

// Filtros
const filtroDependencia = ref('')
const filtroAsunto = ref('')
const token = localStorage.getItem('token')

// Variable para almacenar si el usuario tiene un rol restringido
const isViewerOrUser = ref(false)

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

// Función para cargar las solicitudes desde la URL
const loadSolicitudes = async () => {
  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=solicitud_obtener_solicitudes',
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token al encabezado
        }
      }
    )
    if (response.ok) {
      const data = await response.json()
      solicitudes.value = data // Asume que los datos devueltos son un arreglo de solicitudes
    } else {
      alert('Error al cargar las solicitudes')
    }
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error)
    alert('Hubo un problema al cargar las solicitudes')
  }
}

// Filtrar las solicitudes basadas en dependencia y asunto
const solicitudesFiltradas = computed(() => {
  return solicitudes.value.filter((solicitud) => {
    const dependenciaValida = filtroDependencia.value
      ? solicitud.DEPENDENCIA.toLowerCase().includes(filtroDependencia.value.toLowerCase())
      : true

    const asuntoValido = filtroAsunto.value
      ? solicitud.ASUNTO.toLowerCase().includes(filtroAsunto.value.toLowerCase())
      : true

    return dependenciaValida && asuntoValido
  })
})

// Navegar a otras acciones
const verSolicitud = (id) => {
  router.push({ name: 'solicitudes-detalle', params: { id } })
}

const editarSolicitud = (id) => {
  if (!isViewerOrUser.value) {
    router.push({ name: 'solicitud-editar', params: { id } })
  }
}

const eliminarSolicitud = (id) => {
  if (!isViewerOrUser.value && confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
    // Lógica para eliminar la solicitud (puedes implementar esto más adelante)
    alert(`Solicitud con ID ${id} eliminada`)
  } else {
    alert('No tienes permisos para realizar esta acción.')
  }
}

onMounted(async () => {
  await getUserRole() // Esperar que se termine de obtener el rol
  loadSolicitudes() // Luego cargar las solicitudes
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Solicitudes" accion="Lista" />

        <!-- Filtros -->
        <div class="mb-4">
          <label for="dependencia" class="mr-2">Dependencia:</label>
          <input
            v-model="filtroDependencia"
            type="text"
            id="dependencia"
            class="border p-2"
            placeholder="Filtrar por Dependencia"
          />

          <label style="margin-left: 20px" for="asunto" class="mr-2">Asunto:</label>
          <input
            v-model="filtroAsunto"
            type="text"
            id="asunto"
            class="border p-2"
            placeholder="Filtrar por Asunto"
          />
        </div>

        <!-- Mostrar botón de Crear solicitud solo si el usuario no tiene rol restringido -->
        <div
          v-if="!isViewerOrUser"
          class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000"
        >
          <router-link to="/solicitud-crear">Crear Solicitud</router-link>
        </div>

        <!-- Lista -->
        <h2 class="text-4xl mb-4">Lista de Solicitudes</h2>
        <table class="table-auto w-full text-left">
          <thead>
            <tr class="bg-blue-100">
              <th>ID</th>
              <th>Dependencia</th>
              <th>Asunto</th>
              <th>Fecha de Solicitud</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="solicitud in solicitudesFiltradas" :key="solicitud.IDSOLICITUD">
              <td>{{ solicitud.IDSOLICITUD }}</td>
              <td>{{ solicitud.DEPENDENCIA }}</td>
              <td>{{ solicitud.ASUNTO }}</td>
              <td>{{ solicitud.FECHADESOLICITUD }}</td>
              <td>
                <button
                  v-if="!isViewerOrUser"
                  @click="editarSolicitud(solicitud.IDSOLICITUD)"
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
      </main>
    </div>
  </div>
</template>

<style scoped>
.table-auto {
  width: 100%;
  border-collapse: collapse;
}

.table-auto th,
.table-auto td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table-auto th {
  background-color: #f9f9f9;
  font-weight: bold;
}
</style>
