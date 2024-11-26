<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const router = useRouter()

const actas = ref([]) // Almacena las actas obtenidas de la API

// Filtros
const filtroSesion = ref('') // Filtrar por ID de sesión
const filtroEstado = ref('') // Filtrar por estado (firmada/no firmada)

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

// Propiedad computada para las actas filtradas
const actasFiltradas = computed(() => {
  return actas.value.filter((acta) => {
    const coincideSesion = filtroSesion.value
      ? acta.SESION_IDSESION.toString().includes(filtroSesion.value)
      : true
    const coincideEstado = filtroEstado.value
      ? acta.ESTADO.toLowerCase() === filtroEstado.value.toLowerCase()
      : true
    return coincideSesion && coincideEstado
  })
})

// Navegación a editar acta
const editarActa = (id) => {
  if (!isViewerOrUser.value) {
    router.push({ name: 'acta-editar', params: { id } })
  } else {
    alert('No tienes permisos para editar esta acta.')
  }
}

// Navegación a detalles de acta
const verActa = (id) => {
  router.push({ name: 'acta-detalle', params: { id } })
}

// Función para eliminar acta
const eliminarActa = (numActa) => {
  if (!isViewerOrUser.value && confirm('¿Estás seguro de que deseas eliminar esta acta?')) {
    // Lógica para eliminar la acta (puedes implementar esto más adelante)
    alert(`Acta con Número ${numActa} eliminada`)
  } else {
    alert('No tienes permisos para realizar esta acción.')
  }
}

// Función para obtener actas desde la API
const obtenerActas = async () => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=acta_obtener_actas',
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      actas.value = data
    } else {
      console.error('Error al obtener actas.')
    }
  } catch (error) {
    console.error('Error al conectar con la API:', error)
  }
}

// Cargar actas al montar el componente
onMounted(async () => {
  await getUserRole() // Esperar que se termine de obtener el rol
  obtenerActas() // Luego cargar las actas
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <!-- Breadcrumb -->
        <BreadCrumb modulo="Actas" accion="Lista" />

        <h2 class="text-4xl mb-4">Listado de Actas</h2>

        <!-- Filtros -->
        <div class="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="sesion" class="block mb-2 text-sm font-medium">Filtrar por ID Sesión</label>
            <input
              id="sesion"
              type="text"
              v-model="filtroSesion"
              class="input-field"
              placeholder="Ingrese ID Sesión"
            />
          </div>
          <div>
            <label for="estado" class="block mb-2 text-sm font-medium">Filtrar por Estado</label>
            <select id="estado" v-model="filtroEstado" class="input-field">
              <option value="">Todos</option>
              <option value="firmada">Firmada</option>
              <option value="no firmada">No Firmada</option>
            </select>
          </div>
        </div>

        <!-- Tabla de actas -->
        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-blue-100">
                <th class="border px-4 py-2">Número</th>
                <th class="border px-4 py-2">ID Sesión</th>
                <th class="border px-4 py-2">Estado</th>
                <th class="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="acta in actasFiltradas" :key="acta.NUM_ACTAS">
                <td class="border px-4 py-2">{{ acta.NUM_ACTAS }}</td>
                <td class="border px-4 py-2">{{ acta.SESION_IDSESION }}</td>
                <td class="border px-4 py-2">{{ acta.ESTADO }}</td>
                <td class="border px-4 py-2 space-x-2">
                  <button @click="verActa(acta.NUM_ACTAS)" class="text-blue-600">
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
                  <button
                    v-if="!isViewerOrUser"
                    @click="editarActa(acta.NUM_ACTAS)"
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
              <tr v-if="!actasFiltradas.length">
                <td colspan="4" class="border px-4 py-2 text-center">No se encontraron actas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #3182ce;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  text-align: left;
  padding: 8px;
}

table thead {
  background-color: #f4f4f4;
}
</style>
