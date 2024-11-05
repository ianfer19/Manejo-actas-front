<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const miembros = ref([]) // Usamos ref para la lista de miembros
const router = useRouter()

async function cargarMiembros() {
  try {
    const response = await fetch('http://localhost/manejo_actas/index.php?accion=obtener_miembros')
    if (!response.ok) throw new Error('Error al cargar miembros')

    const data = await response.json() // Obtenemos el texto de la respuesta
    miembros.value = JSON.parse(data) // Convertimos la cadena JSON en un objeto
  } catch (error) {
    console.error('Error:', error)
  }
}

const verMiembro = (id) => {
  router.push({ name: 'miembros-detalle', params: { id } })
}

const editarMiembro = (id) => {
  router.push({ name: 'miembros-editar', params: { id } })
}

const eliminarMiembro = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este miembro?')) {
    try {
      const response = await fetch(
        'http://localhost/manejo_actas/index.php?accion=eliminar_miembro&idMiembro',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ idMiembro: id }) // Asegúrate de que la clave coincida con lo que el backend espera
        }
      )

      const result = await response.json()

      if (result.success) {
        // Eliminar el miembro del listado (suponiendo que 'miembros' es el arreglo que contiene los miembros)
        miembros.value = miembros.value.filter((miembro) => miembro.IDMIEMBRO !== id)
        alert(`Miembro con ID ${id} eliminado con éxito.`)
      } else {
        alert(result.message || 'No se pudo eliminar el miembro.')
      }
    } catch (error) {
      console.error('Error eliminando el miembro:', error)
      alert('Hubo un error al eliminar el miembro. Intenta nuevamente.')
    }
  }
}

onMounted(() => {
  cargarMiembros()
})
</script>

<template>
  <BreadCrumb modulo="Miembros" accion="Listar" />

  <div class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000">
    <router-link to="/miembros-crear">Crear Miembro</router-link>
  </div>

  <div class="overflow-x-auto">
    <h2 class="text-4xl mb-4">Lista de Miembros</h2>
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-blue-100">
        <tr>
          <th class="border-gray-300 p-2">ID</th>
          <th class="border-gray-300 p-2">Nombre</th>
          <th class="border-gray-300 p-2">Cargo</th>
          <th class="border-gray-300 p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="miembro in miembros" :key="miembro.IDMIEMBRO" class="border-b">
          <td class="border-gray-300 p-2">{{ miembro.IDMIEMBRO }}</td>
          <td class="border-gray-300 p-2">{{ miembro.NOMBRE }}</td>
          <td class="border-gray-300 p-2">{{ miembro.CARGO }}</td>
          <td class="border-gray-300 p-2">
            <button @click="verMiembro(miembro.IDMIEMBRO)" class="text-blue-600">
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
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              Ver
            </button>
            <button @click="editarMiembro(miembro.IDMIEMBRO)" class="text-yellow-600 ml-4">
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
            <button @click="eliminarMiembro(miembro.IDMIEMBRO)" class="text-red-600 ml-4">
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
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
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
