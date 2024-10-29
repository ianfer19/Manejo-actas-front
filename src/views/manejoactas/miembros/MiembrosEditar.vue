<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
const miembro = ref({})

// Implementar la lógica para cargar el miembro por ID y actualizarlo
const loadMiembro = () => {
  const id = route.params.id
  // Cargar el miembro desde la base de datos usando el id
}

// Llamar a loadMiembro al montar el componente
loadMiembro()

const updateMiembro = () => {
  // Implementar la lógica para actualizar el miembro en la base de datos
}
</script>

<template>
  <BreadCrumb modulo="Miembros" accion="Editar" />

  <h2 class="text-2xl font-bold">Editar Miembro</h2>
  <div>
    <label for="nombre">Nombre </label>
    <input type="text" v-model="miembro.NOMBRE" class="bg-green-200" />
  </div>
  <br />
  <div>
    <label for="cargo">Cargo </label>
    <input type="text" v-model="miembro.CARGO" class="bg-green-200" />
  </div>
  <br />
  <button @click="updateMiembro" class="boton-1">Guardar Cambios</button>
</template>
