<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
const router = useRouter()
const reunion = ref({})
const citaciones = ref([])

// Función para cargar la reunión y sus citaciones por ID
const loadReunion = async () => {
  const id = route.params.id
  try {
    const response = await fetch(
      `http://localhost/backPhp/index.php?accion=obtener_reunion_por_id&id=${id}`
    )
    if (!response.ok) throw new Error('Error al cargar la reunión')
    const data = await response.json()
    reunion.value = {
      id: data.id,
      fecha: data.fecha,
      contenido: data.contenido,
      estado: data.estado,
      coordinador_id: data.coordinador_id
    }
    citaciones.value = data.citaciones
  } catch (error) {
    console.error(error)
    alert('Error al cargar los datos de la reunión')
  }
}

const editarReunion = (id) => {
  router.push({ name: 'reuniones-editar', params: { id } })
}

// Cargar la reunión al montar el componente
onMounted(loadReunion)
</script>

<template>
  <BreadCrumb modulo="Reuniones" accion="Detalle" />

  <h2 class="text-2xl font-bold">Detalle de la Reunión</h2>

  <!-- Detalles de la reunión -->
  <div class="mb-4">
    <p><strong>ID:</strong> {{ reunion.id }}</p>
    <p><strong>Fecha:</strong> {{ reunion.fecha }}</p>
    <p><strong>Contenido:</strong> {{ reunion.contenido }}</p>
    <p><strong>Coordinador ID:</strong> {{ reunion.coordinador_id }}</p>
    <p>
      <strong>Estado:</strong>
      <span
        :class="{
          'text-green-600': reunion.estado === 'confirmada',
          'text-red-600': reunion.estado === 'cancelada',
          'text-yellow-600': reunion.estado === 'propuesta'
        }"
      >
        {{ reunion.estado }}
      </span>
    </p>
    <button @click="editarReunion(reunion.id)" class="text-green-600 ml-4">
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
  </div>

  <button @click="$router.push({ name: 'reuniones-lista' })" class="boton-1">
    Volver a la Lista
  </button>

  <!-- Lista de citaciones -->
  <h3 class="text-xl font-semibold mt-6">Citaciones</h3>
  <div v-for="citacion in citaciones" :key="citacion.id" class="border-b py-2">
    <p><strong>Nombre:</strong> {{ citacion.nombre }}</p>
    <p><strong>Correo:</strong> {{ citacion.correo }}</p>
    <p>
      <strong>Estado:</strong>
      <span
        :class="{
          'text-green-600': citacion.estado === 'confirmada',
          'text-red-600': citacion.estado === 'rechazada',
          'text-yellow-600': citacion.estado === 'pendiente'
        }"
      >
        {{ citacion.estado }}
      </span>
    </p>
  </div>
</template>

<style scoped>
.boton-1 {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.boton-2 {
  background-color: #2196f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.boton-1:hover,
.boton-2:hover {
  opacity: 0.9;
}
.text-green-600 {
  color: #28a745;
}
.text-red-600 {
  color: #dc3545;
}
.text-yellow-600 {
  color: #ffc107;
}
</style>
