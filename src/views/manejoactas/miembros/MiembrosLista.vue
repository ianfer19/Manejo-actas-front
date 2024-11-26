<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const miembros = ref([]) // Usamos ref para la lista de miembros
const router = useRouter()

// Variable para almacenar si el usuario tiene uno de los roles restringidos
const isViewerOrUser = ref(false)

// Función para obtener el token del localStorage
const getToken = () => {
  return localStorage.getItem('token')
}

// Función para cargar los miembros
async function cargarMiembros() {
  try {
    const token = getToken() // Obtener el token
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=miembro_obtener_miembros',
      {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    )
    if (!response.ok) throw new Error('Error al cargar miembros')

    const data = await response.json() // Obtenemos el texto de la respuesta
    miembros.value = JSON.parse(data) // Convertimos la cadena JSON en un objeto
  } catch (error) {
    console.error('Error:', error)
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

// Ver miembro
const verMiembro = (id) => {
  router.push({ name: 'miembros-detalle', params: { id } })
}

// Editar miembro
const editarMiembro = (id) => {
  router.push({ name: 'miembros-editar', params: { id } })
}

// Eliminar miembro
const eliminarMiembro = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este miembro?')) {
    try {
      const response = await fetch(
        'http://localhost/manejo_actas/index.php?accion=miembro_eliminar_miembro&idMiembro',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ idMiembro: id }) // Asegúrate de que la clave coincida con lo que el backend espera
        }
      )

      const result = await response.json()

      if (result.success) {
        // Eliminar el miembro del listado (suponiendo que 'miembros' es el arreglo que contiene los miembros)
        miembros.value = miembros.value.filter((miembro) => miembro.IDMIEMBRO !== id)
        alert(`Miembro con ID ${id} eliminado con éxito.`)
      } else {
        alert(result.message || 'No se pudo eliminar el miembro.')
      }
    } catch (error) {
      console.error('Error eliminando el miembro:', error)
      alert('Hubo un error al eliminar el miembro. Intenta nuevamente.')
    }
  }
}

onMounted(() => {
  cargarMiembros()
  getUserRole() // Verificar el rol del usuario al montar el componente
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Miembros" accion="Listar" />

        <!-- Botón de crear miembro solo visible si no es "viewer" ni "user" -->
        <div
          v-if="!isViewerOrUser"
          class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000"
        >
          <router-link to="/miembros-crear">Crear Miembro</router-link>
        </div>

        <div class="overflow-x-auto">
          <h2 class="text-4xl mb-4">Lista de Miembros</h2>
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-blue-100">
              <tr>
                <th class="border-gray-300 p-2">ID</th>
                <th class="border-gray-300 p-2">Nombre</th>
                <th class="border-gray-300 p-2">Cargo</th>
                <th class="border-gray-300 p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="miembro in miembros" :key="miembro.IDMIEMBRO" class="border-b">
                <td class="border-gray-300 p-2">{{ miembro.IDMIEMBRO }}</td>
                <td class="border-gray-300 p-2">{{ miembro.NOMBRE }}</td>
                <td class="border-gray-300 p-2">{{ miembro.CARGO }}</td>
                <td class="border-gray-300 p-2">
                  <!-- Botón de editar solo visible si no es "viewer" ni "user" -->
                  <button
                    v-if="!isViewerOrUser"
                    @click="editarMiembro(miembro.IDMIEMBRO)"
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
