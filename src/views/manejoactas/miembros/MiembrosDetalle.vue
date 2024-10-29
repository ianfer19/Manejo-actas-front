<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
let miembro = ref({})

// Implementar la lógica para cargar el miembro por ID
const loadMiembro = () => {
  const id = route.params.id
  // Cargar el miembro desde la base de datos usando el id
}

// Llamar a loadMiembro al montar el componente
loadMiembro()

miembro.value = {
  IDMIEMBRO: 1,
  NOMBRE: 'Juan Perez',
  CARGO: 'Gerente'
}
</script>

<template>
  <BreadCrumb modulo="Miembros" accion="Detalle" />

  <h2 class="text-2xl font-bold">Detalles del Miembro</h2>
  <p><strong>ID:</strong> {{ miembro.IDMIEMBRO }}</p>
  <p><strong>Nombre:</strong> {{ miembro.NOMBRE }}</p>
  <p><strong>Cargo:</strong> {{ miembro.CARGO }}</p>
</template>
