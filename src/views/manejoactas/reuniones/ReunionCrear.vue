<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const fecha = ref('')
const contenido = ref('')
const coordinadorId = ref('')

// Función para agregar la reunión
const addReunion = async () => {
  try {
    const response = await fetch('http://localhost/backPhp/index.php?accion=crear_reunion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fecha: fecha.value,
        contenido: contenido.value,
        coordinador_id: coordinadorId.value
      })
    })

    if (!response.ok) {
      throw new Error('Error al crear la reunión')
    }

    const data = await response.json()
    alert(data.message) // Mensaje de éxito
    router.push({ name: 'reuniones-lista' }) // Redirigir a la lista de reuniones
  } catch (error) {
    console.error(error)
    alert('Error al crear la reunión')
  }
}
</script>

<template>
  <BreadCrumb modulo="Reuniones" accion="Crear" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <h2 class="mb-1 text-4xl font-bold text-blue-700">Nueva Reunión</h2>
  </div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="fecha" class="block mb-2 text-sm font-medium text-gray-900">Fecha</label>
      <input
        type="datetime-local"
        id="fecha"
        v-model="fecha"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        placeholder="Ingrese la fecha"
      />
    </div>
    <div>
      <label for="contenido" class="block mb-2 text-sm font-medium text-gray-900">Contenido</label>
      <input
        type="text"
        id="contenido"
        v-model="contenido"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        placeholder="Ingrese el contenido"
      />
    </div>
    <div>
      <label for="coordinadorId" class="block mb-2 text-sm font-medium text-gray-900"
        >ID Coordinador</label
      >
      <input
        type="number"
        id="coordinadorId"
        v-model="coordinadorId"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        placeholder="Ingrese el ID del coordinador"
      />
    </div>
  </div>

  <button @click="addReunion" class="boton-1">Agregar Reunión</button>

  <button @click="$router.push({ name: 'reuniones-lista' })" class="boton-1">
    Volver a la Lista
  </button>
</template>
