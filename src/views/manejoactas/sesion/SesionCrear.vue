<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const lugar = ref('')
const fecha = ref('')
const horaInicio = ref('')
const horaFinal = ref('')
const presidente = ref('')
const secretario = ref('')

const crearSesion = async () => {
  const data = {
    idSesion: null, // Si no tienes un ID definido, puedes usar null o manejarlo en el servidor.
    lugar: lugar.value,
    fecha: fecha.value,
    horaInicio: horaInicio.value,
    horaFinal: horaFinal.value,
    presidente: presidente.value,
    secretario: secretario.value
  }

  try {
    const response = await fetch('http://localhost/manejo_actas/index.php?accion=crear_sesion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (response.ok) {
      alert(`Sesión creada: ${result.message}`)
      router.push({ name: 'sesion-lista' })
    } else {
      alert(`Error: ${result.message}`)
    }
  } catch (error) {
    console.error('Error al crear sesión:', error)
    alert('Ocurrió un error al crear la sesión.')
  }
}
</script>

<template>
  <BreadCrumb modulo="Sesiones" accion="Crear" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <h2 class="mb-1 text-4xl font-bold text-blue-700">Nueva Sesión</h2>
  </div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="lugar" class="block mb-2 text-sm font-medium text-gray-900">Lugar</label>
      <input
        v-model="lugar"
        type="text"
        id="lugar"
        placeholder="Lugar de la sesión"
        class="input-class"
      />
    </div>
    <div>
      <label for="fecha" class="block mb-2 text-sm font-medium text-gray-900">Fecha</label>
      <input v-model="fecha" type="date" id="fecha" class="input-class" />
    </div>
    <div>
      <label for="horaInicio" class="block mb-2 text-sm font-medium text-gray-900"
        >Hora Inicio</label
      >
      <input v-model="horaInicio" type="time" id="horaInicio" class="input-class" />
    </div>
    <div>
      <label for="horaFinal" class="block mb-2 text-sm font-medium text-gray-900">Hora Final</label>
      <input v-model="horaFinal" type="time" id="horaFinal" class="input-class" />
    </div>
    <div>
      <label for="presidente" class="block mb-2 text-sm font-medium text-gray-900"
        >Presidente</label
      >
      <input
        v-model="presidente"
        type="text"
        id="presidente"
        placeholder="Nombre del presidente"
        class="input-class"
      />
    </div>
    <div>
      <label for="secretario" class="block mb-2 text-sm font-medium text-gray-900"
        >Secretario</label
      >
      <input
        v-model="secretario"
        type="text"
        id="secretario"
        placeholder="Nombre del secretario"
        class="input-class"
      />
    </div>
  </div>

  <button @click="crearSesion" class="boton-1">Agregar Sesión</button>
</template>

<style scoped>
.input-class {
  background-color: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem;
  width: 100%;
}
</style>
