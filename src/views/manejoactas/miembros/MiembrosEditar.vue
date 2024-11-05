<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const router = useRouter()
const route = useRoute()

// Información del miembro
const miembro = ref({
  IDMIEMBRO: null,
  NOMBRE: '',
  CARGO: ''
})

// Mensajes de estado
const mensaje = ref('')

// Función para obtener el miembro desde la API
const loadMiembro = async () => {
  const id = route.params.id
  if (!id) {
    mensaje.value = 'No se proporcionó un ID de miembro.'
    return
  }

  try {
    const response = await fetch(
      `http://localhost/manejo_actas/index.php?accion=obtener_miembro_por_id&idMiembro=${id}`
    )
    const data = await response.json() // Obtenemos el texto de la respuesta
    miembro.value = JSON.parse(data) // Convertimos la cadena JSON en un objeto
  } catch (error) {
    console.error('Error loading member:', error)
    mensaje.value = 'Error al cargar los datos del miembro. Intente nuevamente.'
  }
}

// Función para actualizar el miembro en el servidor
const updateMiembro = async () => {
  try {
    const response = await axios.put(
      'http://localhost/manejo_actas/index.php?accion=actualizar_miembro',
      {
        idMiembro: miembro.value.IDMIEMBRO,
        nombre: miembro.value.NOMBRE,
        cargo: miembro.value.CARGO
      }
    )
    router.push({ name: 'miembros-lista' })
    if (response.ok) {
      // Redirige a la lista de miembros
    }
  } catch (error) {
    console.error('Error updating member:', error)
    mensaje.value = 'Error al actualizar el miembro. Intente nuevamente.'
  }
}

// Cargar datos del miembro al montar el componente
onMounted(loadMiembro)
</script>

<template>
  <BreadCrumb modulo="Miembros" accion="Editar" />

  <h2 class="text-2xl font-bold mb-4">Editar Miembro</h2>

  <div v-if="mensaje" class="mb-4 text-red-600">{{ mensaje }}</div>

  <div class="grid gap-4 mb-6">
    <div>
      <label for="nombre" class="block mb-1 text-sm font-medium text-gray-700">Nombre</label>
      <input
        v-model="miembro.NOMBRE"
        type="text"
        id="nombre"
        class="input-field"
        placeholder="Ingrese el nombre"
      />
    </div>

    <div>
      <label for="cargo" class="block mb-1 text-sm font-medium text-gray-700">Cargo</label>
      <input
        v-model="miembro.CARGO"
        type="text"
        id="cargo"
        class="input-field"
        placeholder="Ingrese el cargo"
      />
    </div>
  </div>

  <button @click="updateMiembro" class="boton-1">Guardar Cambios</button>
</template>

<style>
.input-field {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  width: 100%;
}
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
</style>
