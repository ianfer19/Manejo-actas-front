<script setup>
import { ref, onMounted } from 'vue'
import BreadCrumb from '../../../components/BreadCrumb.vue'
import axios from 'axios' // Asegúrate de tener axios instalado y configurado
import { useRouter } from 'vue-router'

const router = useRouter()

// Variables reactivas para los datos del invitado
const nombre = ref('')
const dependencia = ref('')
const cargo = ref('')
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

// Función para crear un invitado
async function crearInvitado() {
  if (isViewer.value) {
    alert('No tienes permisos para crear un invitado.')
    return
  }

  // Objeto con los datos del invitado
  const nuevoInvitado = {
    nombre: nombre.value,
    dependencia: dependencia.value,
    cargo: cargo.value
  }

  try {
    // Obtener el token del almacenamiento local (o desde donde lo tengas guardado)
    const token = localStorage.getItem('token') // Asegúrate de usar la clave correcta

    // Enviar datos al backend con el token en los encabezados
    const response = await axios.post(
      'http://localhost/manejo_actas/index.php?accion=invitado_crear_invitado',
      nuevoInvitado,
      {
        headers: {
          Authorization: `Bearer ${token}` // Encabezado con el token
        }
      }
    )
    console.log(response.data) // Ver respuesta del backend
    router.push({ name: 'invitados-lista' })
  } catch (error) {
    console.error('Error al crear el invitado:', error)
  }
}

// Obtiene la información del usuario al montar el componente
onMounted(() => {
  getUserInfo() // Obtiene la información del usuario y verifica el rol
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Invitados" accion="Crear" />

        <div class="grid grid-cols-2 my-6 text-gray-700">
          <div class="flex items-center">
            <h2 class="mb-1 text-4xl font-bold text-blue-700">Nuevo Invitado</h2>
          </div>
        </div>

        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
            <input
              v-model="nombre"
              type="text"
              id="nombre"
              class="input-field"
              placeholder="Ingrese el nombre del invitado"
              :disabled="isViewer"
            />
          </div>
          <div>
            <label for="dependencia" class="block mb-2 text-sm font-medium text-gray-900"
              >Dependencia</label
            >
            <input
              v-model="dependencia"
              type="text"
              id="dependencia"
              class="input-field"
              placeholder="Dependencia del invitado"
              :disabled="isViewer"
            />
          </div>
          <div>
            <label for="cargo" class="block mb-2 text-sm font-medium text-gray-900">Cargo</label>
            <input
              v-model="cargo"
              type="text"
              id="cargo"
              class="input-field"
              placeholder="Cargo del invitado"
              :disabled="isViewer"
            />
          </div>
        </div>

        <button @click="crearInvitado" class="boton-1" v-if="!isViewer">Agregar Invitado</button>
      </main>
    </div>
  </div>
</template>
