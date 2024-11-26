<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nombre = ref('')
const cargo = ref('')

// Variable para verificar si el rol es "viewer"
const isViewer = ref(false)

// Obtener el token del almacenamiento local (o la fuente correspondiente)
function obtenerToken() {
  return localStorage.getItem('token') // Ajusta según dónde guardes el token
}

// Función para obtener el ID del usuario desde el token
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

// Función para agregar un miembro
const agregarMiembro = async () => {
  try {
    // Obtener el token del almacenamiento local o la fuente correspondiente
    const token = obtenerToken()

    // Realizar la solicitud con el token incluido en los encabezados
    const response = await axios.post(
      'http://localhost/manejo_actas/index.php?accion=miembro_crear_miembro',
      {
        nombre: nombre.value,
        cargo: cargo.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}` // Incluye el token en el encabezado
        }
      }
    )
    router.push({ name: 'miembros-lista' })
  } catch (error) {
    console.error('Error al agregar miembro:', error)
    alert('Error al agregar miembro. Intente nuevamente.')
  }
}

// Verificar el rol del usuario al montar el componente
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Miembros" accion="Crear" />

        <div class="grid grid-cols-2 my-6 text-gray-700">
          <div class="flex items-center">
            <h2 class="mb-1 text-4xl font-bold text-blue-700">Nuevo Miembro</h2>
          </div>
        </div>

        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Nombre</label
            >
            <input
              v-model="nombre"
              type="text"
              id="nombre"
              class="input-field"
              placeholder="Ingrese el nombre del miembro"
              :disabled="isViewer"
            />
          </div>
          <div>
            <label for="cargo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Cargo</label
            >
            <input
              v-model="cargo"
              type="text"
              id="cargo"
              class="input-field"
              placeholder="Cargo del miembro"
              :disabled="isViewer"
            />
          </div>
        </div>

        <!-- El botón solo se muestra si no es un "viewer" ni "user" -->
        <button @click="agregarMiembro" class="boton-1" v-if="!isViewer">Agregar Miembro</button>
      </main>
    </div>
  </div>
</template>
