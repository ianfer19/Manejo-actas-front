<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
const router = useRouter()

const proposicion = ref({
  IDMIEMBRO: null,
  DESCRIPCION: '',
  DESICION: '',
  SESION_IDSESION: null
})

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

// Cargar la proposición por ID
const loadProposicion = async () => {
  const id = route.params.id
  if (!id) {
    alert('ID de proposición no proporcionado')
    return
  }

  try {
    const token = obtenerToken() // Obtener el token JWT
    const response = await axios.get(
      `http://localhost/manejo_actas/index.php?accion=proposicion_obtener_proposicion_por_id&idProposicion=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Incluir el token en la cabecera
        }
      }
    )
    proposicion.value = response.data
  } catch (error) {
    console.error('Error al cargar la proposición:', error)
    alert('Error al cargar la proposición')
  }
}

const updateProposicion = async () => {
  if (isViewer.value) {
    alert('No tienes permisos para editar esta proposición.')
    return
  }

  try {
    const token = obtenerToken() // Obtener el token JWT

    console.log(proposicion.value)

    // Mapear las claves del objeto `proposicion` a las que espera el servidor
    const data = {
      idProposicion: proposicion.value.ID_PROPOSICIONES, // Enviar id en el cuerpo
      descripcion: proposicion.value.DESCRIPCION,
      decision: proposicion.value.DESICION,
      miembroId: proposicion.value.MIEMBRO_IDMIEMBRO,
      sesionId: proposicion.value.SESION_IDSESION
    }

    console.log('DATA', data)

    const response = await axios.put(
      `http://localhost/manejo_actas/index.php?accion=proposicion_actualizar_proposicion`, // El id ya no está en la URL
      data, // Enviar los datos en el cuerpo
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Incluir el token en la cabecera
        }
      }
    )

    if (response.status === 200) {
      alert('Proposición actualizada correctamente')
      router.push({ name: 'proposiciones-lista' }) // Redirige a la lista de proposiciones
    } else {
      alert('Error al actualizar la proposición')
    }
  } catch (error) {
    console.error('Error al actualizar la proposición:', error)
    alert('Hubo un error al actualizar la proposición')
  }
}

// Cargar la proposición al montar el componente
onMounted(() => {
  getUserInfo() // Obtiene la información del usuario y verifica el rol
  loadProposicion() // Carga la proposición
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Proposiciones" accion="Editar" />

        <h2 class="text-2xl font-bold mb-4">Editar Proposición</h2>

        <div v-if="mensaje" class="mb-4 text-red-600">{{ mensaje }}</div>

        <div class="grid gap-4 mb-4">
          <div>
            <label for="descripcion" class="block mb-2 text-sm font-medium text-gray-900"
              >Descripción</label
            >
            <textarea
              v-model="proposicion.DESCRIPCION"
              :disabled="isViewer"
              class="input-field"
            ></textarea>
          </div>

          <div>
            <label for="decision" class="block mb-1 text-sm font-medium text-gray-700"
              >Decisión</label
            >
            <input
              v-model="proposicion.DESICION"
              type="text"
              id="decision"
              :disabled="isViewer"
              class="input-field"
              placeholder="Ingrese la decisión"
            />
          </div>

          <div>
            <label for="miembroId" class="block mb-1 text-sm font-medium text-gray-700"
              >ID Miembro</label
            >
            <input
              v-model="proposicion.MIEMBRO_IDMIEMBRO"
              type="number"
              id="miembroId"
              :disabled="isViewer"
              class="input-field"
              placeholder="Ingrese el ID del miembro"
            />
          </div>

          <div>
            <label for="sesionId" class="block mb-1 text-sm font-medium text-gray-700"
              >ID Sesión</label
            >
            <input
              v-model="proposicion.SESION_IDSESION"
              type="number"
              id="sesionId"
              :disabled="isViewer"
              class="input-field"
              placeholder="Ingrese el ID de la sesión"
            />
          </div>
        </div>

        <button @click="updateProposicion" :disabled="isViewer" class="boton-1">
          Guardar Cambios
        </button>
      </main>
    </div>
  </div>
</template>

<style>
/* Estilo para los campos de entrada (input) */
.input-field {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  width: 100%;
  font-size: 1rem;
  background-color: #fff;
}

/* Estilo para el botón */
.boton-1 {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.boton-1:hover {
  background-color: #45a049;
}

/* Estilo para las etiquetas de los campos */
label {
  font-size: 0.875rem;
  font-weight: medium;
  color: #4a4a4a;
  display: block;
  margin-bottom: 0.5rem;
}

/* Estilo para los mensajes de error */
.text-red-600 {
  color: #dc2626;
}

/* Estilo de la estructura flex */
.flex {
  display: flex;
}

.flex-grow {
  flex-grow: 1;
}

/* Estilo para la estructura de la cuadrícula */
.grid {
  display: grid;
  gap: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.font-bold {
  font-weight: 700;
}

.text-sm {
  font-size: 0.875rem;
}

.font-medium {
  font-weight: 500;
}
</style>
