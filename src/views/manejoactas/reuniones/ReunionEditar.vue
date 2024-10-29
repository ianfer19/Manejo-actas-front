<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
const router = useRouter()
const reunion = ref({
  id: '',
  fecha: '',
  contenido: '',
  estado: '',
  coordinador_id: ''
})
const citaciones = ref([])

// Función para cargar la reunión y sus citaciones por ID
const loadReunion = async () => {
  const id = route.params.id
  try {
    const response = await fetch(
      `http://localhost/backPhp/index.php?accion=obtener_reunion_por_id&id=${id}`
    )
    console.log(response)
    if (!response.ok) throw new Error('Error al cargar la reunión')
    console.log(response.json)
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

// Función para guardar los cambios de la reunión
const saveChanges = async () => {
  try {
    const response = await fetch('http://localhost/backPhp/index.php?accion=actualizar_reunion', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: reunion.value.id,
        fecha: reunion.value.fecha,
        contenido: reunion.value.contenido,
        estado: reunion.value.estado
      })
    })

    const data = await response.json()
    alert(data.message)
  } catch (error) {
    console.error(error)
    alert('Error al guardar los cambios de la reunión')
  }
}

const invitarMiembros = async () => {
  try {
    const response = await fetch(`http://localhost/backPhp/index.php?accion=citar_todos_miembros`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reunion_id: reunion.value.id
      })
    })

    const textResponse = await response.text() // Obtener la respuesta como texto

    try {
      const data = JSON.parse(textResponse) // Intentar parsear el texto como JSON
      alert(data.message || 'Todos los miembros han sido invitados')
    } catch (jsonError) {
      console.error('Error al parsear la respuesta JSON:', jsonError)
      alert('La respuesta del servidor no es un JSON válido: ' + textResponse)
    }

    loadReunion() // Recargar los datos de la reunión después de invitar
  } catch (error) {
    console.error(error)
    alert('Error al invitar a los miembros')
  }
}

// Cargar la reunión al montar el componente
onMounted(loadReunion)
</script>

<template>
  <BreadCrumb modulo="Reuniones" accion="Detalle" />

  <h2 class="text-2xl font-bold">Detalle de la Reunión</h2>

  <!-- Detalles de la reunión con inputs para edición -->
  <div class="mb-4">
    <label><strong>ID:</strong></label>
    <input type="text" v-model="reunion.id" readonly class="input-field" />

    <label><strong>Fecha:</strong></label>
    <input type="date" v-model="reunion.fecha" class="input-field" />

    <label><strong>Contenido:</strong></label>
    <input type="text" v-model="reunion.contenido" class="input-field" />

    <label><strong>Coordinador ID:</strong></label>
    <input type="number" v-model="reunion.coordinador_id" class="input-field" readonly />

    <label><strong>Estado:</strong></label>
    <select
      v-model="reunion.estado"
      class="input-field"
      :class="{
        'text-green-600': reunion.estado === 'confirmada',
        'text-red-600': reunion.estado === 'cancelada',
        'text-yellow-600': reunion.estado === 'propuesta'
      }"
    >
      <option value="confirmada">Confirmada</option>
      <option value="cancelada">Cancelada</option>
      <option value="propuesta">Propuesta</option>
    </select>
  </div>

  <button @click="saveChanges()" class="boton-1">Guardar</button>

  <!-- Botón para invitar a nuevos miembros -->
  <button @click="invitarMiembros()" class="boton-2 mt-4">Invitar a todos los miembros</button>

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
.input-field {
  display: block;
  margin: 0.5rem 0;
  padding: 0.5rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

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
