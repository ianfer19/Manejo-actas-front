<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const router = useRouter()

const solicitudes = ref([])

const verSolicitud = (id) => {
  router.push({ name: 'solicitud-detalle', params: { id } })
}

const editarSolicitud = (id) => {
  router.push({ name: 'solicitud-editar', params: { id } })
}

const eliminarSolicitud = async (id) => {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta solicitud?')
  if (confirmDelete) {
    try {
      const response = await axios.delete(
        'http://localhost/manejo_actas/index.php?accion=eliminar_solicitud',
        {
          data: {
            idSolicitud: id
          }
        }
      )
      alert(response.data.message) // Muestra el mensaje de respuesta del servidor

      // Actualiza la lista de solicitudes después de eliminar
      solicitudes.value = solicitudes.value.filter((solicitud) => solicitud.IDSOLICITUD !== id)
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error)
      alert('Ocurrió un error al eliminar la solicitud.')
    }
  }
}

// Obtener las solicitudes cuando el componente se monta
onMounted(async () => {
  try {
    const response = await axios.get(
      'http://localhost/manejo_actas/index.php?accion=obtener_solicitudes'
    )
    solicitudes.value = response.data
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error)
  }
})
</script>

<template>
  <BreadCrumb modulo="Actas" accion="Lista" />
  <div class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000">
    <router-link to="/solicitud-crear">Crear Solicitud</router-link>
  </div>
  <div class="overflow-x-auto">
    <h2 class="text-4xl mb-4">Lista de Solicitudes</h2>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-blue-100">
        <tr>
          <th class="border-gray-300 p-2">ID</th>
          <th class="border-gray-300 p-2">Dependencia</th>
          <th class="border-gray-300 p-2">Asunto</th>
          <th class="border-gray-300 p-2">Decisión</th>
          <th class="border-gray-300 p-2">Fecha de Solicitud</th>
          <th class="border-gray-300 p-2">ID del Solicitante</th>
          <th class="border-gray-300 p-2">ID de Sesión</th>
          <th class="border-gray-300 p-2">ID de Descripción</th>
          <th class="border-gray-300 p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="solicitud in solicitudes" :key="solicitud.IDSOLICITUD" class="border-b">
          <td class="border-gray-300 p-2">{{ solicitud.IDSOLICITUD }}</td>
          <td class="border-gray-300 p-2">{{ solicitud.DEPENDENCIA }}</td>
          <td class="border-gray-300 p-2">{{ solicitud.ASUNTO }}</td>
          <td class="border-gray-300 p-2">{{ solicitud.DESICION }}</td>
          <td class="border-gray-300 p-2">{{ solicitud.FECHADESOLICITUD }}</td>
          <td class="border-gray-300 p-2">{{ solicitud.SOLICITANTE_IDSOLICITANTE }}</td>
          <td class="border-gray-300 p-2">{{ solicitud.SESION_IDSESION }}</td>
          <td class="border-gray-300 p-2">{{ solicitud.DESCRIPCION_IDDESCRIPCION }}</td>
          <td class="border-gray-300 p-2">
            <button @click="verSolicitud(solicitud.IDSOLICITUD)" class="text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="{1.5}"
                stroke="currentColor"
                className="size-6"
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
            <button @click="eliminarSolicitud(solicitud.IDSOLICITUD)" class="text-red-600">
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
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-11 .562c.34-.059.68-.114 1.022-.165m0 0a48.108 48.108 0 0 1 3.478-.397m5.044 0h-4.52m0 0L10.5 3.75a2.25 2.25 0 0 1 3 0l1.028 1.28Zm-4.52 0h4.52"
                />
              </svg>
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.size-6 {
  width: 24px;
  height: 24px;
}
</style>
