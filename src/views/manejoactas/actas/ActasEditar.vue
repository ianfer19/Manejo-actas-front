<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const acta = ref({}) // Contendrá los datos del acta
const errorMessage = ref('') // Variable para almacenar el mensaje de error
const isViewer = ref(false) // Variable para verificar si el rol es "viewer" o "user"

// Función para obtener el token JWT desde el almacenamiento local
function obtenerToken() {
  return localStorage.getItem('token')
}

// Obtener el ID del usuario desde el token
const getUserInfo = async () => {
  const token = obtenerToken()
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

// Obtener los datos del usuario desde la API
const fetchUser = async (id) => {
  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=user_obtener_usuario_por_id&id=${id}`
    )
    if (response.ok) {
      const data = await response.json()
      // Verificar si el rol es "viewer" o "user"
      if (data.role === 'viewer' || data.role === 'user') {
        isViewer.value = true
      }
    } else {
      console.error('No se pudo obtener la información del usuario.')
    }
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error)
  }
}

// Función para cargar los datos del acta
const loadActa = async () => {
  const numActa = route.params.id
  console.log(numActa)
  errorMessage.value = '' // Reinicia el mensaje de error
  try {
    const token = obtenerToken()

    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=acta_obtener_acta_por_numero&numActa=${numActa}`,
      {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Error al obtener el acta')
    }
    const data = await response.json()
    acta.value = data // Asigna los datos obtenidos al objeto `acta`
  } catch (error) {
    console.error('Error al cargar el acta:', error)
    errorMessage.value = error.message // Almacena el mensaje de error
  }
}

// Función para actualizar el acta
const actualizarActa = async () => {
  if (isViewer.value) {
    alert('No tienes permisos para editar esta acta.')
    return
  }

  const num = acta.value.NUM_ACTAS
  try {
    const token = obtenerToken()

    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=acta_actualizar_acta',
      {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numActa: acta.value.NUM_ACTAS,
          estado: acta.value.ESTADO,
          sesionId: acta.value.SESION_IDSESION
        })
      }
    )

    const data = await response.json()
    router.push({ name: 'actas-lista' })
  } catch (error) {
    console.error('Error al actualizar el acta:', error)
    alert('Error al actualizar el acta')
  }
}

// Carga los datos del acta al montar el componente
onMounted(() => {
  getUserInfo() // Obtiene la información del usuario y verifica el rol
  loadActa() // Carga los datos del acta
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Actas" accion="Editar" />

        <h2 class="text-4xl font-bold mb-6">Editar Acta</h2>

        <!-- Mostrar mensaje de error si existe -->
        <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>

        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label for="numActa" class="block mb-2 text-sm font-medium text-gray-700"
              >Número de Acta</label
            >
            <input
              type="text"
              id="numActa"
              v-model="acta.NUM_ACTAS"
              class="input-field"
              placeholder="Número de Acta"
              readonly
            />
          </div>

          <!-- Estado con select condicional -->
          <div>
            <label for="estado" class="block mb-2 text-sm font-medium text-gray-700">Estado</label>
            <template v-if="acta.ESTADO !== 'FIRMADA'">
              <select
                id="estado"
                v-model="acta.ESTADO"
                class="input-field"
                required
                :disabled="isViewer"
              >
                <option value="NO FIRMADA">NO FIRMADA</option>
                <option value="FIRMADA">FIRMADA</option>
              </select>
            </template>
            <template v-else>
              <input
                type="text"
                id="estado"
                v-model="acta.ESTADO"
                class="input-field"
                placeholder="Estado"
                readonly
              />
            </template>
          </div>

          <div>
            <label for="sesionId" class="block mb-2 text-sm font-medium text-gray-700"
              >ID de Sesión</label
            >
            <input
              type="number"
              id="sesionId"
              v-model="acta.SESION_IDSESION"
              class="input-field"
              placeholder="ID de sesión"
              :disabled="isViewer"
            />
          </div>
        </div>

        <button
          @click="actualizarActa"
          class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          :disabled="isViewer"
        >
          Actualizar Acta
        </button>
      </main>
    </div>
  </div>
</template>

<style>
.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #333;
  background-color: #f9f9f9;
  outline: none;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #3182ce;
  background-color: #fff;
}
</style>
