<script setup>
import { ref } from 'vue'
import BreadCrumb from '../../../components/BreadCrumb.vue'
import axios from 'axios' // Asegúrate de tener axios instalado y configurado
import { useRouter } from 'vue-router'
const router = useRouter()

// Variables reactivas para los datos del invitado
const nombre = ref('')
const dependencia = ref('')
const cargo = ref('')

// Función para crear invitado
async function crearInvitado() {
  // Objeto con los datos del invitado
  const nuevoInvitado = {
    nombre: nombre.value,
    dependencia: dependencia.value,
    cargo: cargo.value
  }

  try {
    // Enviar datos al backend
    const response = await axios.post(
      'http://localhost/manejo_actas/index.php?accion=crear_invitado',
      nuevoInvitado
    )
    console.log(response.data) // Ver respuesta del backend
    router.push({ name: 'invitados-lista' })
  } catch (error) {
    console.error('Error al crear el invitado:', error)
  }
}
</script>

<template>
  <BreadCrumb modulo="Invitados" accion="Crear" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <div class="flex items-center">
      <h2 class="mb-1 text-4xl font-bold text-blue-700">Nuevo Invitado</h2>
    </div>
  </div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
      <input
        v-model="nombre"
        type="text"
        id="nombre"
        class="input-field"
        placeholder="Ingrese el nombre del invitado"
      />
    </div>
    <div>
      <label for="dependencia" class="block mb-2 text-sm font-medium text-gray-900"
        >Dependencia</label
      >
      <input
        v-model="dependencia"
        type="text"
        id="dependencia"
        class="input-field"
        placeholder="Dependencia del invitado"
      />
    </div>
    <div>
      <label for="cargo" class="block mb-2 text-sm font-medium text-gray-900">Cargo</label>
      <input
        v-model="cargo"
        type="text"
        id="cargo"
        class="input-field"
        placeholder="Cargo del invitado"
      />
    </div>
  </div>

  <button @click="crearInvitado" class="boton-1">Agregar Invitado</button>
</template>
