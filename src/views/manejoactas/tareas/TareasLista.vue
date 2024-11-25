<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tareas = ref([])
const token = localStorage.getItem('token')
// Filtros
const filtroDescripcion = ref('')

// Función para cargar las tareas desde el servidor
const loadTareas = async () => {
  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=tarea_obtener_tareas',
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token al encabezado
        }
      }
    )
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    tareas.value = data // Asegúrate de que el servidor devuelva un arreglo con las tareas
  } catch (error) {
    console.error('Error al cargar las tareas:', error.message)
    alert('No se pudieron cargar las tareas. Intenta nuevamente.')
  }
}

// Filtrar las tareas basadas en la descripción
const tareasFiltradas = computed(() => {
  return tareas.value.filter((tarea) => {
    const descripcionValida = filtroDescripcion.value
      ? tarea.DESCRIPCION.toLowerCase().includes(filtroDescripcion.value.toLowerCase())
      : true

    return descripcionValida
  })
})

const verTarea = (id) => {
  router.push({ name: 'tareas-detalle', params: { id } })
}

const editarTarea = (id) => {
  router.push({ name: 'tareas-editar', params: { id } })
}

const eliminarTarea = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta solicitud?')) {
    // Lógica para eliminar la solicitud (puedes implementar esto más adelante)
    alert(`Solicitud con ID ${id} eliminada`)
  }
}

onMounted(loadTareas)
</script>

<template>
  <BreadCrumb modulo="Tareas" accion="Lista" />
  <div class="mb-4">
    <!-- Filtros -->
    <label for="descripcion" class="mr-2">Descripción:</label>
    <input
      v-model="filtroDescripcion"
      type="text"
      id="descripcion"
      class="border p-2"
      placeholder="Filtrar por Descripción"
    />
  </div>

  <div class="bg-blue-500 mb-2 w-48 ml-3 rounded-lg hover:bg-blue-400 p-1 pl-3 text-gray-1000">
    <router-link to="/tareas-crear">Crear Tarea</router-link>
  </div>
  <h2 class="text-2xl font-bold">Lista de Tareas</h2>
  <table class="table-auto w-full text-left">
    <thead>
      <tr class="bg-blue-100">
        <th>ID</th>
        <th>Descripción</th>
        <th>ID Sesión</th>
        <th>Fecha Entrega</th>
        <th>Fecha Verificación</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="tarea in tareasFiltradas" :key="tarea.ID_TAREAS">
        <td>{{ tarea.ID_TAREAS }}</td>
        <td>{{ tarea.DESCRIPCION }}</td>
        <td>{{ tarea.SESION_IDSESION }}</td>
        <td>{{ tarea.FECHA_ENTREGA }}</td>
        <td>{{ tarea.FECHA_VERIFICACION }}</td>
        <td>
          <button @click="editarTarea(tarea.ID_TAREAS)" class="text-yellow-600">
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
</template>
