<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sesiones = ref([])

// Obtener el token del almacenamiento local
const token = localStorage.getItem('token')

// Función para obtener sesiones desde el API
const obtenerSesiones = async () => {
  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=sesion_obtener_sesiones',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token aquí
        }
      }
    )
    if (response.ok) {
      sesiones.value = await response.json()
    } else {
      console.error('Error al obtener las sesiones')
    }
  } catch (error) {
    console.error('Error de conexión:', error)
  }
}

// Llamar a obtenerSesiones cuando el componente se monte
onMounted(() => {
  obtenerSesiones()
})

const verSesion = (id) => {
  router.push({ name: 'sesion-detalle', params: { id } })
}

const editarSesion = (id) => {
  router.push({ name: 'sesion-editar', params: { id } })
}

const eliminarSesion = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta sesión?')) {
    // Lógica para eliminar la sesión (puedes implementar esto más adelante)
    alert(`Sesión con ID ${id} eliminada`)
  }
}
</script>

<template>
  <div class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000">
    <router-link to="/sesion-crear">Crear Sesion</router-link>
  </div>
  <div class="overflow-x-auto">
    <h2 class="text-4xl mb-4">Lista de Sesiones</h2>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-blue-100">
        <tr>
          <th class="border-gray-300 p-2">ID</th>
          <th class="border-gray-300 p-2">Lugar</th>
          <th class="border-gray-300 p-2">Fecha</th>
          <th class="border-gray-300 p-2">Hora Inicio</th>
          <th class="border-gray-300 p-2">Hora Final</th>
          <th class="border-gray-300 p-2">Presidente</th>
          <th class="border-gray-300 p-2">Secretario</th>
          <th class="border-gray-300 p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sesion in sesiones" :key="sesion.IDSESION" class="border-b">
          <td class="border-gray-300 p-2">{{ sesion.IDSESION }}</td>
          <td class="border-gray-300 p-2">{{ sesion.LUGAR }}</td>
          <td class="border-gray-300 p-2">{{ sesion.FECHA }}</td>
          <td class="border-gray-300 p-2">{{ sesion.HORAINICIO }}</td>
          <td class="border-gray-300 p-2">{{ sesion.HORAFINAL }}</td>
          <td class="border-gray-300 p-2">{{ sesion.PRESIDENTE }}</td>
          <td class="border-gray-300 p-2">{{ sesion.SECRETARIO }}</td>
          <td class="border-gray-300 p-2">
            <button @click="verSesion(sesion.IDSESION)" class="text-blue-600">
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
            <button @click="editarSesion(sesion.IDSESION)" class="text-yellow-600 ml-4">
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
      </tbody>
    </table>
  </div>
</template>
