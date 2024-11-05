<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'
import { ref } from 'vue'

const nombre = ref('')
const tipoDeSolicitante = ref('')
const email = ref('')
const celular = ref('')

// Método para agregar solicitante
const agregarSolicitante = async () => {
  try {
    const response = await fetch('http://tu-api.com/crear_solicitante', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombre.value,
        tipoDeSolicitante: tipoDeSolicitante.value,
        email: email.value,
        celular: celular.value
      })
    })

    const result = await response.json()

    if (response.ok) {
      alert(`Solicitante ${nombre.value} agregado exitosamente`)
    } else {
      alert(`Error al agregar solicitante: ${result.message}`)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Hubo un problema al agregar el solicitante. Intenta de nuevo.')
  }
}
</script>

<template>
  <BreadCrumb modulo="Solicitantes" accion="Crear" />

  <h2 class="text-4xl font-bold text-blue-700">Nuevo Solicitante</h2>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
      <input
        type="text"
        id="nombre"
        v-model="nombre"
        class="input-field"
        placeholder="Ingrese el nombre del solicitante"
      />
    </div>
    <div>
      <label for="tipo" class="block mb-2 text-sm font-medium text-gray-900"
        >Tipo de Solicitante</label
      >
      <input
        type="text"
        id="tipo"
        v-model="tipoDeSolicitante"
        class="input-field"
        placeholder="Tipo de solicitante"
      />
    </div>
    <div>
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
      <input
        type="email"
        id="email"
        v-model="email"
        class="input-field"
        placeholder="Ingrese el email"
      />
    </div>
    <div>
      <label for="celular" class="block mb-2 text-sm font-medium text-gray-900">Celular</label>
      <input
        type="text"
        id="celular"
        v-model="celular"
        class="input-field"
        placeholder="Ingrese el celular"
      />
    </div>
  </div>

  <button @click="agregarSolicitante" class="boton-1">Agregar Solicitante</button>
</template>
