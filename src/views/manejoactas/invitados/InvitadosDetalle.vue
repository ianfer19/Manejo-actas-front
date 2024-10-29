<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'

const invitado = {
  id: 1,
  nombre: 'Juan Perez',
  dependencia: 'Recursos Humanos',
  cargo: 'Gerente'
}
</script>

<template>
  <BreadCrumb modulo="Invitados" accion="Detalles" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <div class="flex items-center">
      <h2 class="mb-1 text-4xl font-bold text-blue-700">Detalles del Invitado</h2>
    </div>
  </div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
      <p>{{ invitado.nombre }}</p>
    </div>
    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900">Dependencia</label>
      <p>{{ invitado.dependencia }}</p>
    </div>
    <div>
      <label class="block mb-2 text-sm font-medium text-gray-900">Cargo</label>
      <p>{{ invitado.cargo }}</p>
    </div>
  </div>
</template>
