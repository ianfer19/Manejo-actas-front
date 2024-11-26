<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tarea = ref({
  DESCRIPCION: '',
  SESION_IDSESION: '',
  FECHA_ENTREGA: '',
  FECHA_VERIFICACION: ''
})

const crearTarea = async () => {
  const token = localStorage.getItem('token') // Obtener el token de autenticación desde localStorage o cualquier fuente

  if (!token) {
    alert('No se encontró un token de autenticación. Por favor, inicie sesión nuevamente.')
    return router.push({ name: 'login' }) // Redirigir al inicio de sesión si no hay token
  }

  const tareaData = {
    DESCRIPCION: tarea.value.DESCRIPCION,
    SESION_IDSESION: tarea.value.SESION_IDSESION,
    FECHA_ENTREGA: tarea.value.FECHA_ENTREGA,
    FECHA_VERIFICACION: tarea.value.FECHA_VERIFICACION
  }

  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=tarea_crear_tarea',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Incluir el token en los encabezados
        },
        body: JSON.stringify(tareaData)
      }
    )

    const result = await response.json()

    if (response.ok) {
      alert(result.message)
      router.push({ name: 'tareas-lista' }) // Redirigir a la lista de tareas
    } else {
      alert(`Error: ${result.message}`)
    }
  } catch (error) {
    console.error('Error al enviar la solicitud:', error)
    alert('Hubo un problema al crear la tarea.')
  }
}
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <BreadCrumb modulo="Tareas" accion="Crear" />

        <h2 class="text-4xl font-bold">Crear Tarea</h2>

        <div class="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label for="descripcion" class="block mb-2 text-sm font-medium text-gray-900"
              >Descripción</label
            >
            <input type="text" id="descripcion" v-model="tarea.DESCRIPCION" class="input-field" />
          </div>
          <div>
            <label for="sesion" class="block mb-2 text-sm font-medium text-gray-900"
              >ID de Sesión</label
            >
            <input type="number" id="sesion" v-model="tarea.SESION_IDSESION" class="input-field" />
          </div>
          <div>
            <label for="fechaEntrega" class="block mb-2 text-sm font-medium text-gray-900"
              >Fecha de Entrega</label
            >
            <input
              type="date"
              id="fechaEntrega"
              v-model="tarea.FECHA_ENTREGA"
              class="input-field"
            />
          </div>
          <div>
            <label for="fechaVerificacion" class="block mb-2 text-sm font-medium text-gray-900"
              >Fecha de Verificación</label
            >
            <input
              type="date"
              id="fechaVerificacion"
              v-model="tarea.FECHA_VERIFICACION"
              class="input-field"
            />
          </div>
        </div>

        <button @click="crearTarea" class="boton-1">Crear Tarea</button>
      </main>
    </div>
  </div>
</template>
