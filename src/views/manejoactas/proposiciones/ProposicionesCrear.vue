<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'
import axios from 'axios'

const router = useRouter()
const descripcion = ref('')
const decision = ref('')
const miembroId = ref('')
const sesionId = ref('')
const isViewer = ref(false) // Variable para verificar si el rol es "viewer"

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
      // Verificar si el rol es "viewer"
      if (data.role === 'viewer') {
        isViewer.value = true
      }
    } else {
      console.error('No se pudo obtener la información del usuario.')
    }
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error)
  }
}

// Función para agregar una nueva proposición
const addProposicion = async () => {
  if (isViewer.value) {
    alert('No tienes permisos para agregar una proposición.')
    return
  }

  const token = obtenerToken()
  if (!token) {
    alert('Sesión expirada. Por favor, inicie sesión nuevamente.')
    return router.push({ name: 'login' })
  }

  try {
    const response = await axios.post(
      'http://localhost/manejo_actas/index.php?accion=proposicion_crear_proposicion',
      {
        idProposicion: Date.now(),
        descripcion: descripcion.value,
        decision: decision.value,
        miembroId: miembroId.value,
        sesionId: sesionId.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    alert('Agregada correctamente')
    router.push({ name: 'proposiciones-lista' })
  } catch (error) {
    console.error('Error al agregar la proposición:', error)
    alert('Error al agregar la proposición. Por favor, intente nuevamente.')
  }
}

// Obtener la información del usuario al montar el componente
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Proposiciones" accion="Crear" />

        <div class="grid grid-cols-2 my-6 text-gray-700">
          <h2 class="mb-1 text-4xl font-bold text-blue-700">Nueva Proposición</h2>
        </div>

        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label for="descripcion" class="block mb-2 text-sm font-medium text-gray-900"
              >Descripción</label
            >
            <input
              type="text"
              id="descripcion"
              v-model="descripcion"
              :disabled="isViewer"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="Ingrese la descripción"
            />
          </div>
          <div>
            <label for="decision" class="block mb-2 text-sm font-medium text-gray-900"
              >Decisión</label
            >
            <input
              type="text"
              id="decision"
              v-model="decision"
              :disabled="isViewer"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="Ingrese la decisión"
            />
          </div>
          <div>
            <label for="miembroId" class="block mb-2 text-sm font-medium text-gray-900"
              >ID Miembro</label
            >
            <input
              type="number"
              id="miembroId"
              v-model="miembroId"
              :disabled="isViewer"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="Ingrese el ID del miembro"
            />
          </div>
          <div>
            <label for="sesionId" class="block mb-2 text-sm font-medium text-gray-900"
              >ID Sesión</label
            >
            <input
              type="number"
              id="sesionId"
              v-model="sesionId"
              :disabled="isViewer"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="Ingrese el ID de la sesión"
            />
          </div>
        </div>

        <button @click="addProposicion" :disabled="isViewer" class="boton-1">
          Agregar Proposición
        </button>
      </main>
    </div>
  </div>
</template>
