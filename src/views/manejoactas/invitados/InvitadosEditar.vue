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

// Obtener el token del almacenamiento local (o desde donde lo almacenes)
function obtenerToken() {
  return localStorage.getItem('token') // Cambia esto según cómo guardes el token
}

// Función para obtener el invitado desde la API
async function obtenerInvitado(id) {
  try {
    const token = obtenerToken() // Obtener el token JWT

    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=invitado_obtener_invitado&id=${id}`,
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

// Cargar datos del invitado al montar el componente
onMounted(() => {
  const id = route.params.id // Obtén el ID del invitado de los parámetros de la ruta
  if (id) {
    obtenerInvitado(id)
  } else {
    alert('No se proporcionó un ID de invitado')
    router.push({ name: 'invitados-listar' }) // Redirige si no hay ID
  }
})
</script>

<template>
  <BreadCrumb modulo="Invitados" accion="Editar" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <div class="flex items-center">
      <h2 class="mb-1 text-4xl font-bold text-blue-700">Editar Invitado</h2>
    </div>
  </div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
      <input v-model="invitado.NOMBRE" type="text" id="nombre" class="input-field" />
    </div>
    <div>
      <label for="dependencia" class="block mb-2 text-sm font-medium text-gray-900"
        >Dependencia</label
      >
      <input v-model="invitado.DEPENDENCIA" type="text" id="dependencia" class="input-field" />
    </div>
    <div>
      <label for="cargo" class="block mb-2 text-sm font-medium text-gray-900">Cargo</label>
      <input v-model="invitado.CARGO" type="text" id="cargo" class="input-field" />
    </div>
  </div>

  <button @click="actualizarInvitado" class="boton-1">Actualizar Invitado</button>
</template>
