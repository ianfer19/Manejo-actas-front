<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tareas = ref([])
const token = localStorage.getItem('token')

// Filtros
const filtroDescripcion = ref('')

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

// Función para cargar las tareas desde el servidor
const loadTareas = async () => {
  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=tarea_obtener_tareas',
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token al encabezado
        }
      }
    )
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    tareas.value = data // Asegúrate de que el servidor devuelva un arreglo con las tareas
  } catch (error) {
    console.error('Error al cargar las tareas:', error.message)
    alert('No se pudieron cargar las tareas. Intenta nuevamente.')
  }
}

// Filtrar las tareas basadas en la descripción
const tareasFiltradas = computed(() => {
  return tareas.value.filter((tarea) => {
    const descripcionValida = filtroDescripcion.value
      ? tarea.DESCRIPCION.toLowerCase().includes(filtroDescripcion.value.toLowerCase())
      : true

    return descripcionValida
  })
})

const verTarea = (id) => {
  router.push({ name: 'tareas-detalle', params: { id } })
}

const editarTarea = (id) => {
  if (!isViewerOrUser.value) {
    router.push({ name: 'tareas-editar', params: { id } })
  } else {
    alert('No tienes permisos para editar esta tarea.')
  }
}

const eliminarTarea = (id) => {
  if (!isViewerOrUser.value && confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
    // Lógica para eliminar la tarea (puedes implementar esto más adelante)
    alert(`Tarea con ID ${id} eliminada`)
  } else {
    alert('No tienes permisos para realizar esta acción.')
  }
}

// Cargar tareas y verificar el rol cuando el componente se monta
onMounted(async () => {
  await getUserRole() // Esperar que se termine de obtener el rol
  loadTareas() // Luego cargar las tareas
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Tareas" accion="Lista" />
        <div class="mb-4">
          <!-- Filtros -->
          <label for="descripcion" class="mr-2">Descripción:</label>
          <input
            v-model="filtroDescripcion"
            type="text"
            id="descripcion"
            class="border p-2"
            placeholder="Filtrar por Descripción"
          />
        </div>

        <div
          v-if="!isViewerOrUser"
          class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000"
        >
          <router-link to="/tareas-crear">Crear Tarea</router-link>
        </div>
        <h2 class="text-4xl mb-4">Lista de Tareas</h2>
        <table class="table-auto w-full text-left">
          <thead>
            <tr class="bg-blue-100">
              <th>ID</th>
              <th>Descripción</th>
              <th>ID Sesión</th>
              <th>Fecha Entrega</th>
              <th>Fecha Verificación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tarea in tareasFiltradas" :key="tarea.ID_TAREAS">
              <td>{{ tarea.ID_TAREAS }}</td>
              <td>{{ tarea.DESCRIPCION }}</td>
              <td>{{ tarea.SESION_IDSESION }}</td>
              <td>{{ tarea.FECHA_ENTREGA }}</td>
              <td>{{ tarea.FECHA_VERIFICACION }}</td>
              <td>
                <button
                  v-if="!isViewerOrUser"
                  @click="editarTarea(tarea.ID_TAREAS)"
                  class="text-yellow-600"
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
