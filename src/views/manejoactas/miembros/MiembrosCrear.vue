<script setup>
import { ref } from 'vue'
import axios from 'axios'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const nombre = ref('')
const cargo = ref('')

const agregarMiembro = async () => {
  try {
    const response = await axios.post(
      'http://localhost/manejo_actas/index.php?accion=crear_miembro',
      {
        nombre: nombre.value,
        cargo: cargo.value
      }
    )
    alert(response.data.message)
  } catch (error) {
    console.error('Error al agregar miembro:', error)
    alert('Error al agregar miembro. Intente nuevamente.')
  }
}
</script>

<template>
  <BreadCrumb modulo="Miembros" accion="Crear" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <div class="flex items-center">
      <h2 class="mb-1 text-4xl font-bold text-blue-700">Nuevo Miembro</h2>
    </div>
  </div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Nombre</label
      >
      <input
        v-model="nombre"
        type="text"
        id="nombre"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Ingrese el nombre del miembro"
      />
    </div>
    <div>
      <label for="cargo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Cargo</label
      >
      <input
        v-model="cargo"
        type="text"
        id="cargo"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Cargo del miembro"
      />
    </div>
  </div>

  <button @click="agregarMiembro" class="boton-1">Agregar Miembro</button>
</template>
