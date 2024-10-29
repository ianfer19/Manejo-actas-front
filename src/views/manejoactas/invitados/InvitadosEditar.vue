<script setup>
import BreadCrumb from '../../../components/BreadCrumb.vue'

const invitado = {
  id: 1,
  nombre: 'Juan Perez',
  dependencia: 'Recursos Humanos',
  cargo: 'Gerente'
}

function actualizarInvitado() {
  console.log('Invitado actualizado')
}
</script>

<template>
  <BreadCrumb modulo="Invitados" accion="Editar" />

  <div class="grid grid-cols-2 my-6 text-gray-700">
    <div class="flex items-center">
      <h2 class="mb-1 text-4xl font-bold text-blue-700">Editar Invitado</h2>
    </div>
  </div>

  <div class="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label for="nombre" class="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
      <input v-model="invitado.nombre" type="text" id="nombre" class="input-field" />
    </div>
    <div>
      <label for="dependencia" class="block mb-2 text-sm font-medium text-gray-900"
        >Dependencia</label
      >
      <input v-model="invitado.dependencia" type="text" id="dependencia" class="input-field" />
    </div>
    <div>
      <label for="cargo" class="block mb-2 text-sm font-medium text-gray-900">Cargo</label>
      <input v-model="invitado.cargo" type="text" id="cargo" class="input-field" />
    </div>
  </div>

  <button @click="actualizarInvitado" class="boton-1">Actualizar Invitado</button>
</template>
