<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const router = useRouter()

// Estado para almacenar los solicitantes
const solicitantes = ref([])

// Estado para el filtro (campo y valor)
const filtro = ref({
  campo: '', // Campo seleccionado para filtrar
  valor: '' // Valor del filtro
})

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
  const campo = filtro.value.campo
  const valor = filtro.value.valor.toLowerCase()

  if (!campo || !valor) return solicitantes.value

  return solicitantes.value.filter((solicitante) =>
    solicitante[campo]?.toString().toLowerCase().includes(valor)
  )
})

// Funciones para acciones de los solicitantes
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

        <!-- Filtro -->
        <div class="mb-4 flex items-center gap-4">
          <label for="campo" class="mr-2">Filtrar por:</label>
          <select v-model="filtro.campo" id="campo" class="border p-2">
            <option value="">Seleccionar campo</option>
            <option value="IDSOLICITANTE">ID</option>
            <option value="NOMBRE">Nombre</option>
            <option value="TIPODESOLICITANTE">Tipo de Solicitante</option>
          </select>

          <label for="valor" class="ml-4 mr-2">Valor:</label>
          <input
            v-model="filtro.valor"
            type="text"
            id="valor"
            class="border p-2"
            placeholder="Ingrese valor para filtrar"
          />
        </div>

        <!-- Lista de Solicitantes -->
        <div class="overflow-x-auto">
          <h2 class="text-4xl mb-4">Lista de Solicitantes</h2>
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-blue-100">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo de Solicitante</th>
                <th>Email</th>
                <th>Celular</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="solicitante in solicitantesFiltrados" :key="solicitante.IDSOLICITANTE">
                <td>{{ solicitante.IDSOLICITANTE }}</td>
                <td>{{ solicitante.NOMBRE }}</td>
                <td>{{ solicitante.TIPODESOLICITANTE }}</td>
                <td>{{ solicitante.EMAIL }}</td>
                <td>{{ solicitante.CELULAR }}</td>
                <td>
                  <button
                    v-if="!isViewerOrUser"
                    @click="editarSolicitante(solicitante.IDSOLICITANTE)"
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
