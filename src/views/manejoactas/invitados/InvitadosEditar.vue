<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Invitados" accion="Editar" />

        <div class="grid grid-cols-2 my-6 text-gray-700">
          <div class="flex items-center">
            <h2 class="mb-1 text-4xl font-bold text-blue-700">Editar Invitado</h2>
          </div>
        </div>

        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
            <input
              v-model="invitado.NOMBRE"
              type="text"
              id="nombre"
              class="input-field"
              :disabled="isViewer"
            />
          </div>
          <div>
            <label for="dependencia" class="block mb-2 text-sm font-medium text-gray-900"
              >Dependencia</label
            >
            <input
              v-model="invitado.DEPENDENCIA"
              type="text"
              id="dependencia"
              class="input-field"
              :disabled="isViewer"
            />
          </div>
          <div>
            <label for="cargo" class="block mb-2 text-sm font-medium text-gray-900">Cargo</label>
            <input
              v-model="invitado.CARGO"
              type="text"
              id="cargo"
              class="input-field"
              :disabled="isViewer"
            />
          </div>
        </div>

        <!-- El botón solo se muestra si no es un "viewer" ni "user" -->
        <button v-if="!isViewer" @click="actualizarInvitado" class="boton-1">
          Actualizar Invitado
        </button>
      </main>
    </div>
  </div>
</template>

<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Información del invitado
const invitado = ref({
  ID: null,
  NOMBRE: '',
  DEPENDENCIA: '',
  CARGO: ''
})

// Variable para verificar si el rol es "viewer"
const isViewer = ref(false)

// Obtener el token del almacenamiento local (o desde donde lo almacenes)
function obtenerToken() {
  return localStorage.getItem('token') // Cambia esto según cómo guardes el token
}

// Función para obtener el invitado desde la API
async function obtenerInvitado(id) {
  try {
    const token = obtenerToken() // Obtener el token JWT

    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=invitado_obtener_invitado_por_id&id=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Agregar el token en el encabezado
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      invitado.value = data // Asignar los datos del invitado
      console.log(data)
    } else {
      console.error('Error al obtener los datos del invitado')
      alert('Hubo un error al cargar la información del invitado')
    }
  } catch (error) {
    console.error('Error en la solicitud de obtención de invitado:', error)
    alert('Hubo un error en la solicitud')
  }
}

// Función para actualizar el invitado en el servidor
async function actualizarInvitado() {
  try {
    const token = obtenerToken() // Obtener el token JWT

    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=invitado_actualizar_invitado&id=${invitado.value.ID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Agregar el token en el encabezado
        },
        body: JSON.stringify(invitado.value)
      }
    )

    if (response.ok) {
      console.log('Invitado actualizado correctamente')
      alert('Invitado actualizado correctamente')
      router.push({ name: 'invitados-lista' }) // Redirige a la lista de invitados
    } else {
      const errorData = await response.json()
      console.error('Error al actualizar el invitado:', errorData)
      alert('Hubo un error al actualizar el invitado')
    }
  } catch (error) {
    console.error('Error en la solicitud de actualización:', error)
    alert('Hubo un error en la solicitud')
  }
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

// Cargar datos del invitado al montar el componente
onMounted(() => {
  const id = route.params.id // Obtén el ID del invitado de los parámetros de la ruta
  if (id) {
    obtenerInvitado(id)
  } else {
    alert('No se proporcionó un ID de invitado')
    router.push({ name: 'invitados-listar' }) // Redirige si no hay ID
  }
  getUserInfo() // Verifica el rol del usuario
})
</script>
