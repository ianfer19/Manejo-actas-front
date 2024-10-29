<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'
import axios from 'axios'

const router = useRouter()
const descripcion = ref('')
const decision = ref('')
const miembroId = ref('')
const sesionId = ref('')

const addProposicion = async () => {
  try {
    const response = await axios.post(
      'http://localhost/manejo_actas/index.php?accion=crear_proposicion',
      {
        idProposicion: Date.now(), // Generar un ID único, por ejemplo usando la fecha actual
        descripcion: descripcion.value,
        decision: decision.value,
        miembroId: miembroId.value,
        sesionId: sesionId.value
      }
    )
    alert('Agregada correctamente')
    router.push({ name: 'proposiciones-lista' })
  } catch (error) {
    console.error('Error al agregar la proposición:', error)
  }
}
</script>

<template>
  <BreadCrumb modulo="Proposiciones" accion="Crear" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <h2 class="mb-1 text-4xl font-bold text-blue-700">Nueva Proposición</h2>
  </div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="descripcion" class="block mb-2 text-sm font-medium text-gray-900"
        >Descripción</label
      >
      <input
        type="text"
        id="descripcion"
        v-model="descripcion"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        placeholder="Ingrese la descripción"
      />
    </div>
    <div>
      <label for="decision" class="block mb-2 text-sm font-medium text-gray-900">Decisión</label>
      <input
        type="text"
        id="decision"
        v-model="decision"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        placeholder="Ingrese la decisión"
      />
    </div>
    <div>
      <label for="miembroId" class="block mb-2 text-sm font-medium text-gray-900">ID Miembro</label>
      <input
        type="number"
        id="miembroId"
        v-model="miembroId"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        placeholder="Ingrese el ID del miembro"
      />
    </div>
    <div>
      <label for="sesionId" class="block mb-2 text-sm font-medium text-gray-900">ID Sesión</label>
      <input
        type="number"
        id="sesionId"
        v-model="sesionId"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        placeholder="Ingrese el ID de la sesión"
      />
    </div>
  </div>

  <button @click="addProposicion" class="boton-1">Agregar Proposición</button>
</template>
