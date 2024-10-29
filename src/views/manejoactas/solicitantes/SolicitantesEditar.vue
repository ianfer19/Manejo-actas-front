<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BreadCrumb from '../../../components/BreadCrumb.vue'

const route = useRoute()
const solicitante = ref({})

// Implementar la lógica para cargar el solicitante por ID y actualizarlo
const loadSolicitante = () => {
  const id = route.params.id
  // Cargar el solicitante desde la base de datos usando el id
}

// Llamar a loadSolicitante al montar el componente
loadSolicitante()

const updateSolicitante = () => {
  // Implementar la lógica para actualizar el solicitante en la base de datos
}
</script>

<template>
  <BreadCrumb modulo="Solicitantes" accion="Editar" />

  <h2 class="text-2xl font-bold">Editar Solicitante</h2>
  <div>
    <label for="nombre">Nombre</label>
    <input type="text" v-model="solicitante.NOMBRE" />
  </div>
  <div>
    <label for="tipo">Tipo de Solicitante</label>
    <input type="text" v-model="solicitante.TIPODESOLICITANTE" />
  </div>
  <div>
    <label for="email">Email</label>
    <input type="email" v-model="solicitante.EMAIL" />
  </div>
  <div>
    <label for="celular">Celular</label>
    <input type="text" v-model="solicitante.CELULAR" />
  </div>
  <button @click="updateSolicitante" class="boton-1">Guardar Cambios</button>
</template>
