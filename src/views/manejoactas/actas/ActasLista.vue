<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const router = useRouter()

const actas = ref([]) // Almacena las actas obtenidas de la API

// Filtros
const filtroSesion = ref('') // Filtrar por ID de sesión
const filtroEstado = ref('') // Filtrar por estado (firmada/no firmada)

// Propiedad computada para las actas filtradas
const actasFiltradas = computed(() => {
  return actas.value.filter((acta) => {
    const coincideSesion = filtroSesion.value
      ? acta.SESION_IDSESION.toString().includes(filtroSesion.value)
      : true
    const coincideEstado = filtroEstado.value
      ? acta.ESTADO.toLowerCase() === filtroEstado.value.toLowerCase()
      : true
    return coincideSesion && coincideEstado
  })
})

// Navegación a editar acta
const editarActa = (id) => {
  router.push({ name: 'acta-editar', params: { id } })
}

// Navegación a detalles de acta
const verActa = (id) => {
  router.push({ name: 'acta-detalle', params: { id } })
}

// Función para obtener actas desde la API
const obtenerActas = async () => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(
      'http://localhost/manejo_actas/index.php?accion=acta_obtener_actas',
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      actas.value = data
    } else {
      console.error('Error al obtener actas.')
    }
  } catch (error) {
    console.error('Error al conectar con la API:', error)
  }
}

// Función para eliminar acta
const eliminarActa = (numActa) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta acta?')) {
    alert(`Acta con Número ${numActa} eliminada`) // Implementa la funcionalidad real aquí
  }
}

// Cargar actas al montar el componente
onMounted(() => {
  obtenerActas()
})
</script>

<template>
  <div class="flex">
    <div class="flex-grow">
      <main class="p-6">
        <!-- Breadcrumb -->
        <BreadCrumb modulo="Actas" accion="Lista" />

        <h2 class="text-4xl font-bold mb-6">Listado de Actas</h2>

        <!-- Filtros -->
        <div class="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="sesion" class="block mb-2 text-sm font-medium">Filtrar por ID Sesión</label>
            <input
              id="sesion"
              type="text"
              v-model="filtroSesion"
              class="input-field"
              placeholder="Ingrese ID Sesión"
            />
          </div>
          <div>
            <label for="estado" class="block mb-2 text-sm font-medium">Filtrar por Estado</label>
            <select id="estado" v-model="filtroEstado" class="input-field">
              <option value="">Todos</option>
              <option value="firmada">Firmada</option>
              <option value="no firmada">No Firmada</option>
            </select>
          </div>
        </div>

        <!-- Tabla de actas -->
        <div class="overflow-x-auto">
          <table class="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr class="bg-blue-100">
                <th class="border px-4 py-2">Número</th>
                <th class="border px-4 py-2">ID Sesión</th>
                <th class="border px-4 py-2">Estado</th>
                <th class="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="acta in actasFiltradas" :key="acta.NUM_ACTAS">
                <td class="border px-4 py-2">{{ acta.NUM_ACTAS }}</td>
                <td class="border px-4 py-2">{{ acta.SESION_IDSESION }}</td>
                <td class="border px-4 py-2">{{ acta.ESTADO }}</td>
                <td class="border px-4 py-2 space-x-2">
                  <button @click="verActa(acta.NUM_ACTAS)" class="text-blue-600">Ver</button>
                  <button @click="editarActa(acta.NUM_ACTAS)" class="text-yellow-600 ml-4">
                    Editar
                  </button>
                </td>
              </tr>
              <tr v-if="!actasFiltradas.length">
                <td colspan="4" class="border px-4 py-2 text-center">No se encontraron actas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: #f9f9f9;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #3182ce;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  text-align: left;
  padding: 8px;
}

table thead {
  background-color: #f4f4f4;
}
</style>
