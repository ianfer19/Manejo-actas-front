<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const router = useRouter()
const sesiones = ref([])
const searchQuery = ref('')
const searchField = ref('IDSESION')

// Obtener el token del almacenamiento local
const token = localStorage.getItem('token')

// Variable para almacenar si el usuario tiene uno de los roles restringidos
const isViewerOrUser = ref(false)

// Función para obtener el token del localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Función para obtener sesiones desde el API
const obtenerSesiones = async () => {
  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=sesion_obtener_sesiones',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token aquí
        }
      }
    )
    if (response.ok) {
      sesiones.value = await response.json()
    } else {
      console.error('Error al obtener las sesiones')
    }
  } catch (error) {
    console.error('Error de conexión:', error)
  }
}

// Función para obtener el rol del usuario y verificar si es "viewer" o "user"
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

// Llamar a obtenerSesiones cuando el componente se monte
onMounted(() => {
  obtenerSesiones()
  getUserRole() // Verificar el rol del usuario al montar el componente
})

const verSesion = (id) => {
  router.push({ name: 'sesion-detalle', params: { id } })
}

const editarSesion = (id) => {
  router.push({ name: 'sesion-editar', params: { id } })
}

const eliminarSesion = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta sesión?')) {
    // Lógica para eliminar la sesión (puedes implementar esto más adelante)
    alert(`Sesión con ID ${id} eliminada`)
  }
}

// Función para filtrar las sesiones por el campo seleccionado
const filteredSesiones = computed(() => {
  return sesiones.value.filter((sesion) =>
    sesion[searchField.value].toString().toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <!-- Breadcrumb -->
        <BreadCrumb modulo="Sesion" accion="Lista" />

        <!-- Formulario de búsqueda -->
        <div class="mb-4 flex items-center gap-4">
          <select v-model="searchField" class="border p-2 rounded">
            <option value="IDSESION">ID</option>
            <option value="LUGAR">Lugar</option>
            <option value="PRESIDENTE">Presidente</option>
            <option value="SECRETARIO">Secretario</option>
          </select>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar..."
            class="border p-2 rounded w-64"
          />
        </div>

        <!-- Botón de crear sesión solo visible si no es "viewer" ni "user" -->
        <div
          v-if="!isViewerOrUser"
          class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000"
        >
          <router-link to="/sesion-crear">Crear Sesion</router-link>
        </div>

        <div class="overflow-x-auto">
          <h2 class="text-4xl mb-4">Lista de Sesiones</h2>
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-blue-100">
              <tr>
                <th class="border-gray-300 p-2">ID</th>
                <th class="border-gray-300 p-2">Lugar</th>
                <th class="border-gray-300 p-2">Fecha</th>
                <th class="border-gray-300 p-2">Hora Inicio</th>
                <th class="border-gray-300 p-2">Hora Final</th>
                <th class="border-gray-300 p-2">Presidente</th>
                <th class="border-gray-300 p-2">Secretario</th>
                <th class="border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sesion in filteredSesiones" :key="sesion.IDSESION" class="border-b">
                <td class="border-gray-300 p-2">{{ sesion.IDSESION }}</td>
                <td class="border-gray-300 p-2">{{ sesion.LUGAR }}</td>
                <td class="border-gray-300 p-2">{{ sesion.FECHA }}</td>
                <td class="border-gray-300 p-2">{{ sesion.HORAINICIO }}</td>
                <td class="border-gray-300 p-2">{{ sesion.HORAFINAL }}</td>
                <td class="border-gray-300 p-2">{{ sesion.PRESIDENTE }}</td>
                <td class="border-gray-300 p-2">{{ sesion.SECRETARIO }}</td>
                <td class="border-gray-300 p-2">
                  <button @click="verSesion(sesion.IDSESION)" class="text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="{1.5}"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                    Ver
                  </button>

                  <!-- Botón de editar solo visible si no es "viewer" ni "user" -->
                  <button
                    v-if="!isViewerOrUser"
                    @click="editarSesion(sesion.IDSESION)"
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
